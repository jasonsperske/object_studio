import * as THREE from 'three';
import { triangleCount } from './geometry';
import type { Part } from '../types';
export interface LodOptions {
    detail: number;
    strategy: 'geometry' | 'textures';
    tolerance: number;
    preserveEdges: boolean;
    textureSize: number;
}
export const DEFAULT_LOD: LodOptions = { detail: 100, strategy: 'geometry', tolerance: 1, preserveEdges: true, textureSize: 1024 };
export function normalizeLod(input?: Partial<LodOptions> | null): LodOptions {
    const finite = (n: unknown, fallback: number) => typeof n === 'number' && Number.isFinite(n) ? n : fallback;
    return {
        detail: Math.max(0, Math.min(100, finite(input?.detail, 100))),
        strategy: input?.strategy === 'textures' ? 'textures' : 'geometry',
        tolerance: Math.max(.1, Math.min(3, finite(input?.tolerance, 1))),
        preserveEdges: input?.preserveEdges !== false,
        textureSize: [256, 512, 1024, 2048].includes(input?.textureSize ?? 0) ? input!.textureSize! : 1024,
    };
}
/** Spatial clustering with shared positions across shading seams. Open edges and
 * axis extrema stay fixed. Disconnected pieces never cluster together, and a
 * component that would vanish is restored. Source buffers are never mutated. */
export function simplifyGeometry(source: THREE.BufferGeometry, options: LodOptions): THREE.BufferGeometry {
    if (options.detail >= 100 || triangleCount(source) < 24 || source.morphAttributes.position?.length || source.getAttribute('skinIndex'))
        return source;
    // UVs on textured inputs require an atlas-aware simplifier; leave them intact.
    const pos = source.getAttribute('position'), normal = source.getAttribute('normal');
    if (!pos || !normal)
        return source;
    source.computeBoundingBox();
    const bounds = source.boundingBox!, size = bounds.getSize(new THREE.Vector3());
    const cell = size.length() * options.tolerance / 100 * Math.pow(1 - options.detail / 100, 1.5);
    if (cell < 1e-9)
        return source;
    const index = source.index, count = index?.count ?? pos.count;
    const vertex = (i: number) => index ? index.getX(i) : i;
    const ids = new Int32Array(pos.count), welded: number[][] = [], byPosition = new Map<string, number>();
    for (let i = 0; i < pos.count; i++) {
        const p = [pos.getX(i), pos.getY(i), pos.getZ(i)];
        const key = p.join(',');
        let id = byPosition.get(key);
        if (id === undefined) {
            id = welded.length;
            byPosition.set(key, id);
            welded.push(p);
        }
        ids[i] = id;
    }
    const parent = welded.map((_, i) => i);
    const root = (a: number): number => { while (parent[a] !== a) {
        parent[a] = parent[parent[a]];
        a = parent[a];
    } return a; };
    const join = (a: number, b: number) => { a = root(a); b = root(b); if (a !== b)
        parent[b] = a; };
    const edges = new Map<string, number>();
    for (let i = 0; i < count; i += 3) {
        const a = ids[vertex(i)], b = ids[vertex(i + 1)], c = ids[vertex(i + 2)];
        join(a, b);
        join(a, c);
        for (const [u, v] of [[a, b], [b, c], [c, a]]) {
            const k = u < v ? u + ',' + v : v + ',' + u;
            edges.set(k, (edges.get(k) ?? 0) + 1);
        }
    }
    const fixed = new Set<number>();
    for (const [edge, n] of edges)
        if (n === 1)
            for (const id of edge.split(','))
                fixed.add(Number(id));
    // Keep six extremal vertices per component, preserving small components/bounds.
    const extrema = new Map<number, number[]>();
    welded.forEach((p, i) => {
        const r = root(i), ex = extrema.get(r);
        if (!ex) {
            extrema.set(r, [i, i, i, i, i, i]);
            return;
        }
        for (let axis = 0; axis < 3; axis++) {
            if (p[axis] < welded[ex[axis * 2]][axis])
                ex[axis * 2] = i;
            if (p[axis] > welded[ex[axis * 2 + 1]][axis])
                ex[axis * 2 + 1] = i;
        }
    });
    for (const ex of extrema.values())
        ex.forEach(i => fixed.add(i));
    const cells = new Map<string, number>(), clusters: number[][] = [], clusterIds = new Int32Array(welded.length);
    welded.forEach((p, i) => {
        const key = fixed.has(i) ? 'v' + i : root(i) + ':' + p.map(v => Math.floor(v / cell)).join(',');
        let id = cells.get(key);
        if (id === undefined) {
            id = clusters.length;
            cells.set(key, id);
            clusters.push([0, 0, 0, 0]);
        }
        clusterIds[i] = id;
        const c = clusters[id];
        for (let a = 0; a < 3; a++)
            c[a] += p[a];
        c[3]++;
    });
    clusters.forEach(c => { for (let a = 0; a < 3; a++)
        c[a] /= c[3]; });
    const faces: number[][] = [], surviving = new Set<number>();
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), ab = new THREE.Vector3(), ac = new THREE.Vector3();
    for (let i = 0; i < count; i += 3) {
        const vs = [vertex(i), vertex(i + 1), vertex(i + 2)], cs = vs.map(v => clusterIds[ids[v]]);
        if (new Set(cs).size < 3)
            continue;
        a.fromArray(clusters[cs[0]]);
        b.fromArray(clusters[cs[1]]);
        c.fromArray(clusters[cs[2]]);
        if (ab.subVectors(b, a).cross(ac.subVectors(c, a)).lengthSq() < 1e-18)
            continue;
        faces.push(vs);
        surviving.add(root(ids[vs[0]]));
    }
    const output: number[] = [], normals: number[] = [], colors: number[] = [], uvs: number[] = [];
    const color = source.getAttribute('color'), uv = source.getAttribute('uv');
    const emit = (vs: number[], original = false) => { for (const v of vs) {
        output.push(...(original ? welded[ids[v]] : clusters[clusterIds[ids[v]]]).slice(0, 3));
        normals.push(normal.getX(v), normal.getY(v), normal.getZ(v));
        if (color)
            colors.push(color.getX(v), color.getY(v), color.getZ(v));
        if (uv)
            uvs.push(uv.getX(v), uv.getY(v));
    } };
    faces.forEach(vs => emit(vs));
    for (let i = 0; i < count; i += 3)
        if (!surviving.has(root(ids[vertex(i)])))
            emit([vertex(i), vertex(i + 1), vertex(i + 2)], true);
    if (output.length / 9 >= triangleCount(source))
        return source;
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(output, 3));
    result.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    if (color)
        result.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    if (uv)
        result.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    // Original normals preserve the generator's hard/smooth shading. Flat mode
    // instead recomputes each surviving triangle's normal for a faceted finish.
    if (!options.preserveEdges)
        result.computeVertexNormals();
    result.computeBoundingBox();
    if (result.boundingBox!.min.distanceTo(bounds.min) > 1e-5 || result.boundingBox!.max.distanceTo(bounds.max) > 1e-5) {
        result.dispose();
        return source;
    }
    return result;
}
/** Only explicitly annotated, front-facing, coplanar triangles are baked.
 * Separate depth layers avoid moving lettering through the panel behind it. */
export function bakeSurface(part: Part, resolution: number): Part[] | null {
    const axis = part.lod?.surface;
    if ((axis === 'x' || axis === 'y') && !part.map && typeof document !== 'undefined') {
        const geometry = part.geometry.clone();
        if (axis === 'x') geometry.rotateY(-Math.PI / 2);
        else geometry.rotateX(Math.PI / 2);
        try {
            const baked = bakeSurface({ ...part, geometry, lod: { surface: 'z' } }, resolution);
            for (const layer of baked ?? []) {
                if (axis === 'x') layer.geometry.rotateY(Math.PI / 2);
                else layer.geometry.rotateX(-Math.PI / 2);
            }
            return baked;
        } finally { geometry.dispose(); }
    }
    if (part.lod?.surface !== 'z' || part.map || typeof document === 'undefined')
        return null;
    const pos = part.geometry.getAttribute('position'), index = part.geometry.index;
    if (!pos)
        return null;
    const count = index?.count ?? pos.count, layers = new Map<number, number[]>();
    for (let i = 0; i < count; i += 3) {
        const vs = [0, 1, 2].map(n => index ? index.getX(i + n) : i + n), z = pos.getZ(vs[0]);
        if (vs.some(v => Math.abs(pos.getZ(v) - z) > 1e-4))
            return null;
        const [a, b, c] = vs;
        const area = (pos.getX(b) - pos.getX(a)) * (pos.getY(c) - pos.getY(a)) - (pos.getY(b) - pos.getY(a)) * (pos.getX(c) - pos.getX(a));
        if (area <= 0)
            return null;
        const key = Math.round(z * 10000) / 10000;
        if (!layers.has(key))
            layers.set(key, []);
        layers.get(key)!.push(...vs);
    }
    if (layers.size > 16 || layers.size * 2 >= triangleCount(part.geometry))
        return null;
    const baked: Part[] = [];
    try {
        for (const [z, vs] of layers) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const v of vs) {
                minX = Math.min(minX, pos.getX(v));
                minY = Math.min(minY, pos.getY(v));
                maxX = Math.max(maxX, pos.getX(v));
                maxY = Math.max(maxY, pos.getY(v));
            }
            const width = maxX - minX, height = maxY - minY;
            if (width <= 0 || height <= 0)
                continue;
            const canvas = document.createElement('canvas'), aspect = width / height;
            canvas.width = aspect >= 1 ? resolution : Math.max(16, Math.round(resolution * aspect));
            canvas.height = aspect >= 1 ? Math.max(16, Math.round(resolution / aspect)) : resolution;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                throw new Error('Surface textures need a 2D canvas context.');
            ctx.fillStyle = '#ffffff';
            const x = (v: number) => 2 + (pos.getX(v) - minX) / width * (canvas.width - 4), y = (v: number) => canvas.height - 2 - (pos.getY(v) - minY) / height * (canvas.height - 4);
            // Fill one compound path to prevent transparent antialias seams between
            // adjacent triangles, keeping holes in the triangulated glyphs empty.
            ctx.beginPath();
            for (let i = 0; i < vs.length; i += 3) {
                ctx.moveTo(x(vs[i]), y(vs[i]));
                ctx.lineTo(x(vs[i + 1]), y(vs[i + 1]));
                ctx.lineTo(x(vs[i + 2]), y(vs[i + 2]));
                ctx.closePath();
            }
            ctx.fill();
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            const geometry = new THREE.PlaneGeometry(width * canvas.width / (canvas.width - 4), height * canvas.height / (canvas.height - 4));
            geometry.translate((minX + maxX) / 2, (minY + maxY) / 2, z);
            baked.push({ ...part, name: part.name + ' (surface ' + (baked.length + 1) + ')', geometry, map: texture, lod: undefined });
        }
        return baked;
    }
    catch (err) {
        disposeLodParts(baked);
        throw err;
    }
}
export function disposeLodParts(parts: Part[], originals: Part[] = []) {
    const geometries = new Set(originals.map(p => p.geometry)), maps = new Set(originals.map(p => p.map));
    for (const p of parts) {
        if (!geometries.has(p.geometry))
            p.geometry.dispose();
        if (p.map && !maps.has(p.map))
            p.map.dispose();
    }
}
export interface LodResult {
    parts: Part[];
    meshParts: Part[];
    bakedParts: number;
    textureBytes: number;
}
function yieldToBrowser(): Promise<void> {
    return new Promise(resolve => {
        // MessageChannel yields to input/rendering without background timer clamping.
        const channel = new MessageChannel();
        channel.port1.onmessage = () => { channel.port1.close(); channel.port2.close(); resolve(); };
        channel.port2.postMessage(null);
    });
}
export async function reduceDetail(originals: Part[], options: LodOptions, signal: AbortSignal): Promise<LodResult> {
    if (options.detail >= 100)
        return { parts: originals, meshParts: originals, bakedParts: 0, textureBytes: 0 };
    const parts: Part[] = [], meshParts: Part[] = [];
    let bakedParts = 0, textureBytes = 0;
    try {
        for (const part of originals) {
            await yieldToBrowser();
            signal.throwIfAborted();
            const baked = options.strategy === 'textures' ? bakeSurface(part, options.textureSize) : null;
            if (baked) {
                meshParts.push(part);
                parts.push(...baked);
                bakedParts++;
                for (const p of baked) {
                    const img = p.map!.image as HTMLCanvasElement;
                    textureBytes += Math.ceil(img.width * img.height * 4 * 4 / 3);
                }
            }
            else {
                const reduced = { ...part, geometry: part.lod?.surface || part.map ? part.geometry : simplifyGeometry(part.geometry, options) };
                parts.push(reduced);
                meshParts.push(reduced);
            }
        }
        return { parts, meshParts, bakedParts, textureBytes };
    }
    catch (err) {
        disposeLodParts(parts, originals);
        throw err;
    }
}
