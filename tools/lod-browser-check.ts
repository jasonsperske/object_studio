import { compileObject } from '../src/lib/compile';
import { DEFAULT_LOD, bakeSurface, reduceDetail } from '../src/lib/lod';
import { StudioScene } from '../src/lib/studioScene';
import { triangleCount } from '../src/lib/geometry';
import { exportModel } from '../src/lib/exporters';
import * as THREE from 'three';
import source from '../objects/field-radio.js?raw';
import desktopSource from '../objects/at-desktop.js?raw';
const status = document.querySelector('#status')!;
const assert = (condition: unknown, message: string) => { if (!condition)
    throw new Error(message); };
const count = (parts: ReturnType<ReturnType<typeof compileObject>['build']>) => parts.reduce((n, p) => n + triangleCount(p.geometry), 0);
async function run() {
    const def = compileObject('field-radio', source), original = def.build(Object.fromEntries(def.params.map(p => [p.id, p.default])));
    const reduced = await reduceDetail(original, { ...DEFAULT_LOD, detail: 25, strategy: 'textures' }, new AbortController().signal);
    assert(reduced.bakedParts > 0, 'No labels baked');
    assert(count(reduced.parts) < count(reduced.meshParts), 'Textures did not save polygons');
    for (const part of reduced.parts.filter(p => p.map)) {
        const canvas = part.map!.image as HTMLCanvasElement, data = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
        let opaque = 0, clear = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 127)
                opaque++;
            if (data[i] === 0)
                clear++;
        }
        assert(opaque > 0 && clear > opaque, 'Texture alpha mask is empty or opaque');
    }
    // An annulus checks that holes remain transparent after triangle rasterization.
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 10, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, 4, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const ring = bakeSurface({ name: 'Ring', geometry: new THREE.ShapeGeometry(shape, 24), lod: { surface: 'z' } }, 256)!;
    const ringCanvas = ring[0].map!.image as HTMLCanvasElement;
    assert(ringCanvas.getContext('2d')!.getImageData(128, 128, 1, 1).data[3] === 0, 'Glyph hole filled');
    const desktop = compileObject('at-desktop', desktopSource);
    const desktopParams = Object.fromEntries(desktop.params.map(p => [p.id, p.default]));
    const desktopParts = desktop.build({ ...desktopParams, board: 'pc', slots: 5, cards: 2, cutaway: true, display: 'none', keyboard: false });
    for (const part of desktopParts.filter(p => p.lod)) {
        const baked = bakeSurface(part, 256);
        assert(baked?.length, part.name + ' failed to bake');
        assert(count(baked!) < triangleCount(part.geometry), part.name + ' did not reduce');
        const axis = part.lod!.surface;
        const component = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
        part.geometry.computeBoundingBox();
        for (const layer of baked!) {
            layer.geometry.computeBoundingBox();
            assert(Math.abs(layer.geometry.boundingBox!.min.getComponent(component) - part.geometry.boundingBox!.min.getComponent(component)) < .001, part.name + ' moved off surface');
            const normal = layer.geometry.getAttribute('normal');
            assert(normal.getComponent(0, component) > .99, part.name + ' normal reversed');
        }
    }
    status.textContent = 'Checking glTF export…';
    const gltf = await exportModel(reduced.parts, 'gltf', 'mm', {}), json = JSON.parse(await gltf.blob.text());
    assert(json.images?.length > 0 && json.images.every((image: {
        uri: string;
    }) => image.uri.startsWith('data:')), 'glTF textures are not embedded');
    assert(json.materials.some((material: {
        alphaMode: string;
    }) => material.alphaMode === 'BLEND'), 'glTF transparency missing');
    status.textContent = 'Checking GLB export…';
    const glb = await exportModel(reduced.parts, 'glb', 'mm', {}), bytes = await glb.blob.arrayBuffer(), header = new DataView(bytes);
    assert(header.getUint32(0, true) === 0x46546c67, 'Invalid GLB header');
    const glbJson = JSON.parse(new TextDecoder().decode(bytes.slice(20, 20 + header.getUint32(12, true))));
    assert(glbJson.images?.every((image: {
        bufferView: number;
    }) => typeof image.bufferView === 'number'), 'GLB textures not embedded');
    status.textContent = 'Checking STL fallback…';
    const stl = await exportModel(reduced.meshParts, 'stl', 'mm', {}), stlBytes = await stl.blob.arrayBuffer();
    assert(new DataView(stlBytes).getUint32(80, true) === count(reduced.meshParts), 'STL geometry fallback count mismatch');
    for (const [id, parts] of [['full', original], ['reduced', reduced.parts]] as const) {
        const scene = new StudioScene(document.getElementById(id)!);
        scene.setParts(parts);
        scene.setDisplay({ edges: false, grid: false, wireframe: false, shadows: true });
        scene.setView('front');
        scene.fit();
        document.getElementById(id + '-count')!.textContent = count(parts).toLocaleString() + ' triangles';
    }
    status.textContent = 'PASS: desktop X/Y/Z circuit baking and plane placement; texture alpha and glyph holes; embedded glTF/GLB maps; STL geometry fallback.\n' + reduced.bakedParts + ' label part baked; ' + Math.round((1 - count(reduced.parts) / count(original)) * 100) + '% fewer triangles.';
}
run().catch(error => { status.textContent = 'FAIL: ' + error.message; console.error(error); });
