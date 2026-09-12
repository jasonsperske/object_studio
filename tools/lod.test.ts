import { objectUrl, parseLocation } from '../src/lib/router';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import * as THREE from 'three';
import { packGlb } from '../src/lib/glb';
import { compileObject } from '../src/lib/compile';
import { triangleCount } from '../src/lib/geometry';
import { DEFAULT_LOD, normalizeLod, reduceDetail, simplifyGeometry, disposeLodParts } from '../src/lib/lod';
import type { Part } from '../src/types';
const count = (parts: Part[]) => parts.reduce((sum, p) => sum + triangleCount(p.geometry), 0);
const hash = (g: THREE.BufferGeometry) => { const h = createHash('sha256'); for (const name of Object.keys(g.attributes).sort()) {
    h.update(name);
    h.update(Buffer.from(g.attributes[name].array.buffer));
} if (g.index)
    h.update(Buffer.from(g.index.array.buffer)); return h.digest('hex'); };
const build = (id: string) => { const def = compileObject(id, readFileSync(new URL('../objects/' + id + '.js', import.meta.url), 'utf8')); return def.build(Object.fromEntries(def.params.map(p => [p.id, p.default]))); };
test('full detail is the original array and buffers for both strategies', async () => {
    const parts = build('field-radio'), before = parts.map(p => hash(p.geometry));
    for (const strategy of ['geometry', 'textures'] as const) {
        const result = await reduceDetail(parts, { ...DEFAULT_LOD, strategy }, new AbortController().signal);
        assert.equal(result.parts, parts);
        assert.deepEqual(parts.map(p => hash(p.geometry)), before);
    }
    disposeLodParts(parts);
});
test('radio reduction is useful, deterministic and leaves source geometry intact', async () => {
    const parts = build('field-radio'), before = parts.map(p => hash(p.geometry)), options = { ...DEFAULT_LOD, detail: 25 };
    const first = await reduceDetail(parts, options, new AbortController().signal), second = await reduceDetail(parts, options, new AbortController().signal);
    assert.ok(count(first.parts) < count(parts) * .8);
    assert.deepEqual(first.parts.map(p => hash(p.geometry)), second.parts.map(p => hash(p.geometry)));
    assert.deepEqual(parts.map(p => hash(p.geometry)), before);
    const labels = parts.find(p => p.lod?.surface)!;
    assert.equal(first.parts.find(p => p.name === labels.name)!.geometry, labels.geometry);
    disposeLodParts(first.parts, parts);
    disposeLodParts(second.parts, parts);
    disposeLodParts(parts);
});
test('all default objects keep finite geometry, bounds and parts at coarse detail', async () => {
    for (const file of readdirSync(new URL('../objects/', import.meta.url)).filter(f => f.endsWith('.js'))) {
        const parts = build(file.slice(0, -3)), reduced = await reduceDetail(parts, { ...DEFAULT_LOD, detail: 0 }, new AbortController().signal);
        assert.equal(reduced.parts.length, parts.length, file);
        assert.ok(count(reduced.parts) <= count(parts), file);
        for (let i = 0; i < parts.length; i++) {
            const a = parts[i].geometry, b = reduced.parts[i].geometry;
            assert.ok([...b.getAttribute('position').array].every(Number.isFinite), file);
            a.computeBoundingBox();
            b.computeBoundingBox();
            assert.ok(a.boundingBox!.min.distanceTo(b.boundingBox!.min) < .001, file + ' min');
            assert.ok(a.boundingBox!.max.distanceTo(b.boundingBox!.max) < .001, file + ' ' + parts[i].name + ' max');
        }
        disposeLodParts(reduced.parts, parts);
        disposeLodParts(parts);
    }
});
test('open surface boundaries remain fixed', () => {
    const source = new THREE.PlaneGeometry(100, 100, 30, 30), reduced = simplifyGeometry(source, { ...DEFAULT_LOD, detail: 0, tolerance: 3 });
    const pos = reduced.getAttribute('position'), points = new Set(Array.from({ length: pos.count }, (_, i) => [pos.getX(i), pos.getY(i), pos.getZ(i)].join(',')));
    const original = source.getAttribute('position');
    for (let i = 0; i < original.count; i++)
        if (Math.abs(original.getX(i)) === 50 || Math.abs(original.getY(i)) === 50)
            assert.ok(points.has([original.getX(i), original.getY(i), 0].join(',')));
    reduced.dispose();
    source.dispose();
});
test('cancelled jobs do not publish reduced models', async () => {
    const parts = build('field-radio'), controller = new AbortController();
    controller.abort();
    await assert.rejects(reduceDetail(parts, { ...DEFAULT_LOD, detail: 0 }, controller.signal), { name: 'AbortError' });
    disposeLodParts(parts);
});
test('untrusted saved settings are clamped and normalized', () => {
    assert.deepEqual(normalizeLod({ detail: NaN, textureSize: 100000, tolerance: -1 }), { ...DEFAULT_LOD, tolerance: .1 });
    assert.equal(normalizeLod({ detail: 150 }).detail, 100);
});
test('GLB packs geometry and images into aligned embedded buffer views', () => {
    const input = { asset: { version: '2.0' }, buffers: [{ byteLength: 3, uri: 'data:application/octet-stream;base64,AQID' }], bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 3 }], images: [{ uri: 'data:image/png;base64,BAUGBwg=' }] };
    const bytes = packGlb(input), view = new DataView(bytes), size = view.getUint32(12, true);
    assert.equal(view.getUint32(8, true), bytes.byteLength);
    const json = JSON.parse(new TextDecoder().decode(bytes.slice(20, 20 + size)));
    assert.equal(json.images[0].bufferView, 1);
    assert.equal(json.images[0].mimeType, 'image/png');
    assert.equal(json.images[0].uri, undefined);
    assert.equal(json.bufferViews[1].byteOffset, 4);
    assert.equal(json.buffers[0].uri, undefined);
    assert.deepEqual([...new Uint8Array(bytes, 28 + size)], [1, 2, 3, 0, 4, 5, 6, 7, 8, 0, 0, 0]);
    assert.ok(input.images[0].uri);
});

test('share URLs round-trip detail settings and preserve legacy links', () => {
    const lod = { ...DEFAULT_LOD, detail: 40, strategy: 'textures' as const, textureSize: 512 };
    const url = new URL(objectUrl('field-radio', { frequency: 45 }, lod), 'http://localhost');
    Object.defineProperty(globalThis, 'window', { value: { location: url }, configurable: true });
    assert.deepEqual(parseLocation(), { kind: 'object', objectId: 'field-radio', params: { frequency: 45 }, lod });
    const legacy = new URL(objectUrl('field-radio', { frequency: 38 }), 'http://localhost');
    Object.defineProperty(globalThis, 'window', { value: { location: legacy }, configurable: true });
    const parsed = parseLocation();
    assert.ok(parsed.kind === 'object');
    if (parsed.kind === 'object') assert.deepEqual(parsed.lod, DEFAULT_LOD);
    assert.equal(objectUrl('field-radio', null, DEFAULT_LOD), '/field-radio');
});
