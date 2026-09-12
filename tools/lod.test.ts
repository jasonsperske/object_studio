import { objectUrl, parseLocation } from '../src/lib/router';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import * as THREE from 'three';
import { packGlb } from '../src/lib/glb';
import { compileObject } from '../src/lib/compile';
import { triangleCount, roundedHousing, roundedRect, loftRings } from '../src/lib/geometry';
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

test('AT desktop presets build finite meshes and closed cases omit circuitry', () => {
    const def = compileObject('at-desktop', readFileSync(new URL('../objects/at-desktop.js', import.meta.url), 'utf8'));
    const defaults = Object.fromEntries(def.params.map(p => [p.id, p.default]));
    for (const preset of def.presets ?? []) {
        const p = { ...defaults, ...preset.params, display: 'none', keyboard: false };
        const closed = def.build({ ...p, cutaway: false });
        const opened = def.build({ ...p, cutaway: true });
        assert.equal(triangleCount(closed.find(p => p.name === 'case')!.geometry), 12);
        assert.ok(!closed.some(p => p.name === 'boards' || p.name.startsWith('motherboard-') || p.name.startsWith('card-')));
        assert.ok(count(closed) < count(opened));
        for (const part of opened) assert.ok([...part.geometry.getAttribute('position').array].every(Number.isFinite));
        assert.equal(opened.find(p => p.name === 'motherboard-traces')?.lod?.surface, 'y');
        for (const part of opened.filter(p => p.lod)) {
            const normal = part.geometry.getAttribute('normal');
            const axis = part.lod!.surface;
            for (let i = 0; i < normal.count; i++) assert.ok((axis === 'x' ? normal.getX(i) : axis === 'y' ? normal.getY(i) : normal.getZ(i)) > .99, part.name);
        }
        disposeLodParts(closed); disposeLodParts(opened);
    }
});

test('monitor size extremes retain recessed glass and an outward-facing closed back', () => {
    const def = compileObject('at-desktop', readFileSync(new URL('../objects/at-desktop.js', import.meta.url), 'utf8'));
    const defaults = Object.fromEntries(def.params.map(p => [p.id, p.default]));
    for (const size of [9, 12, 16]) {
        const parts = def.build({ ...defaults, monitorSize: size, keyboard: false });
        const diagonal = size * 25.4, width = diagonal * .8, height = diagonal * .6;
        const front = 441 / 2 - 26, depth = Math.max(300, width * .95);
        const centerY = 162.7 + 24 + (height + 56) / 2;
        const shell = new THREE.Mesh(parts.find(p => p.name === 'case')!.geometry, new THREE.MeshBasicMaterial());
        const screen = new THREE.Mesh(parts.find(p => p.name === 'screen')!.geometry, new THREE.MeshBasicMaterial());
        const rearRay = new THREE.Raycaster(new THREE.Vector3(0, centerY, front - depth - 100), new THREE.Vector3(0, 0, 1));
        const backHits = rearRay.intersectObject(shell);
        assert.ok(backHits.length, 'Missing or reversed rear cap at ' + size);
        assert.ok(Math.abs(backHits[0].point.z - (front - depth)) < .001);
        const frontRay = new THREE.Raycaster(new THREE.Vector3(0, centerY, front + 100), new THREE.Vector3(0, 0, -1));
        const glassHits = frontRay.intersectObject(screen);
        assert.ok(glassHits.length, 'Missing screen at ' + size);
        assert.ok(Math.abs(glassHits[0].point.z - (front - 9)) < .001);
        for (const part of parts) for (const attribute of ['position', 'normal'])
            assert.ok([...part.geometry.getAttribute(attribute).array].every(Number.isFinite));
        shell.material.dispose(); screen.material.dispose(); disposeLodParts(parts);
    }
});

test('rounded display and speaker generators support presets and corner extremes', () => {
    for (const id of ['multimedia-pc', 'gaming-tower', 'all-in-one', 'flat-panel-television', 'crt-television', 'integrated-micro', 'notebook']) {
        const def = compileObject(id, readFileSync(new URL('../objects/' + id + '.js', import.meta.url), 'utf8'));
        const defaults = Object.fromEntries(def.params.map(p => [p.id, p.default]));
        const radius = def.params.find(p => p.id === 'radius');
        const variants = [{}, ...(def.presets ?? []).map(p => p.params)];
        if (radius && radius.type === 'number') variants.push({ radius: radius.min }, { radius: radius.max });
        for (const variant of variants) {
            const parts = def.build({ ...defaults, ...variant });
            assert.ok(parts.length, id);
            for (const part of parts) {
                assert.ok(triangleCount(part.geometry) > 0, id + ': ' + part.name);
                for (const attribute of ['position', 'normal']) assert.ok([...part.geometry.getAttribute(attribute).array].every(Number.isFinite), id + ': ' + part.name);
            }
            disposeLodParts(parts);
        }
    }
});


test('rounded housings stay watertight with smooth outward walls and square or small corners', () => {
    for (const radius of [0, 1, 24]) for (const inset of [0, 45]) {
        const g = roundedHousing(180, 240, 120, radius, inset);
        const pos = g.getAttribute('position'), index = g.index;
        const at = (i: number) => index ? index.getX(i) : i;
        const key = (i: number) => [pos.getX(i), pos.getY(i), pos.getZ(i)].map(x => x.toFixed(4)).join(',');
        const edges = new Map<string, number>();
        for (let i = 0; i < (index?.count ?? pos.count); i += 3) {
            const vertices = [at(i), at(i + 1), at(i + 2)];
            const points = vertices.map(v => new THREE.Vector3().fromBufferAttribute(pos, v));
            assert.ok(points[1].sub(points[0]).cross(points[2].sub(points[0])).lengthSq() > 1e-16);
            for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) {
                const edge = [key(vertices[a]), key(vertices[b])].sort().join('|');
                edges.set(edge, (edges.get(edge) ?? 0) + 1);
            }
        }
        assert.ok([...edges.values()].every(n => n === 2), 'Open or overlapping seam: ' + radius + '/' + inset);
        const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial());
        for (const [origin, direction, y] of [[new THREE.Vector3(0, 200, 0), new THREE.Vector3(0, -1, 0), 120], [new THREE.Vector3(0, -50, 0), new THREE.Vector3(0, 1, 0), 0]] as const) {
            const hits = new THREE.Raycaster(origin, direction).intersectObject(mesh);
            assert.ok(hits.length); assert.ok(Math.abs(hits[0].point.y - y) < 1e-5);
        }
        mesh.material.dispose(); g.dispose();
    }
    assert.throws(() => loftRings([{ pts: roundedRect(30, 40, 5), y: 10 }, { pts: roundedRect(20, 30, 2, 4), y: 0 }]), /matching/);
});

test('integrated micro keeps keys inside the deck and tilted glass behind the fascia', () => {
    const def = compileObject('integrated-micro', readFileSync(new URL('../objects/integrated-micro.js', import.meta.url), 'utf8'));
    const defaults = Object.fromEntries(def.params.map(p => [p.id, p.default]));
    for (const tube of [5, 12, 15]) for (const tilt of [0, 16]) for (const drivePlace of ['beside', 'below']) {
        const p = { ...defaults, tube, tilt, drivePlace, margin: 20, radius: 70, storage: 'floppy', keyboard: 'shelf', keyColumns: 20, keyPitch: 20, keypad: true };
        const parts = def.build(p);
        const bounds = (name: string) => { const g = parts.find(part => part.name === name)!.geometry; g.computeBoundingBox(); return g.boundingBox!; };
        const shell = bounds('case'), keys = bounds('keys'), screen = bounds('screen');
        assert.ok(keys.min.x > shell.min.x && keys.max.x < shell.max.x, 'Keys overhang deck');
        assert.ok(screen.min.y > keys.max.y, 'Screen intersects keyboard');
        assert.ok(Math.abs(shell.min.y) < 1e-4, 'Case lifted off desk');
        assert.equal(parts.filter(p => p.name.startsWith('drive-slot-')).length, 2);
        assert.ok(parts.some(p => p.name === 'enter-key'));
        const pitch = 20, shelfDepth = 5 * pitch + 36;
        const tubeDepth = tube * 25.4 * .78;
        const frame = Math.max(24, Math.sin(tilt * Math.PI / 180) * tube * 25.4 * .6 + 18);
        const depth = tubeDepth + 20 + 30 + shelfDepth + frame;
        const fasciaFront = depth / 2 - shelfDepth;
        assert.ok(screen.max.z < fasciaFront, 'Glass pokes through front rim');
        assert.ok(!parts.some(p => p.name === 'screen-content'), 'Screen must stay blank');
        for (const part of parts) assert.ok([...part.geometry.getAttribute('position').array].every(Number.isFinite));
        disposeLodParts(parts);
    }
    const off = def.build({ ...defaults, screenOn: false, keyboard: 'none', storage: 'none' });
    assert.ok(!off.some(p => ['screen-content', 'enter-key', 'keys', 'nameplate'].includes(p.name) || p.name.startsWith('drive-slot-')));
    disposeLodParts(off);
});
