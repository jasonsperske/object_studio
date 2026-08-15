import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Shared geometry helpers.
 *
 * World convention used by every object in the library:
 *   +X = run / depth (a staircase ascends toward +X)
 *   +Y = up (floor sits at Y = 0)
 *   +Z = width (models are centred on Z = 0)
 */

/** Axis-aligned box whose min corner sits at (x, y, z). */
export function box(w: number, h: number, d: number, x = 0, y = 0, z = 0): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(Math.max(w, 1e-6), Math.max(h, 1e-6), Math.max(d, 1e-6))
  g.translate(x + w / 2, y + h / 2, z + d / 2)
  return g
}

/** Box centred on Z, min corner at (x, y) in the XY plane. */
export function slab(w: number, h: number, d: number, x = 0, y = 0): THREE.BufferGeometry {
  return box(w, h, d, x, y, -d / 2)
}

/** Vertical cylinder standing on (x, y, z) with the given diameter and height. */
export function post(diameter: number, height: number, x = 0, y = 0, z = 0, segments = 16): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(diameter / 2, diameter / 2, Math.max(height, 1e-6), segments)
  g.translate(x, y + height / 2, z)
  return g
}

/** Cylinder spanning from `a` to `b`, used for sloped handrails. */
export function tube(diameter: number, a: THREE.Vector3, b: THREE.Vector3, segments = 16): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(b, a)
  const len = dir.length()
  const g = new THREE.CylinderGeometry(diameter / 2, diameter / 2, Math.max(len, 1e-6), segments)
  // CylinderGeometry runs along +Y; rotate it onto the a→b axis.
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize(),
  )
  g.applyQuaternion(quat)
  g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
  return g
}

export type EdgeStyle = 'square' | 'chamfer' | 'rounded' | 'bullnose' | 'cove' | 'ogee'

/**
 * Side profile of a tread/shelf board, drawn in the XY plane.
 * The back edge is at x = 0 and the shaped front edge (the nosing) at x = depth.
 */
export function boardProfile(
  depth: number,
  thickness: number,
  style: EdgeStyle,
  edgeSize: number,
): THREE.Shape {
  const s = Math.max(0, Math.min(edgeSize, depth / 2, thickness / 2))
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)

  if (s <= 1e-6 || style === 'square') {
    shape.lineTo(depth, 0)
    shape.lineTo(depth, thickness)
  } else if (style === 'chamfer') {
    shape.lineTo(depth - s, 0)
    shape.lineTo(depth, s)
    shape.lineTo(depth, thickness - s)
    shape.lineTo(depth - s, thickness)
  } else if (style === 'rounded') {
    shape.lineTo(depth - s, 0)
    shape.quadraticCurveTo(depth, 0, depth, s)
    shape.lineTo(depth, thickness - s)
    shape.quadraticCurveTo(depth, thickness, depth - s, thickness)
  } else if (style === 'bullnose') {
    const r = thickness / 2
    shape.lineTo(depth - r, 0)
    shape.absarc(depth - r, r, r, -Math.PI / 2, Math.PI / 2, false)
  } else if (style === 'cove') {
    // Concave scoop taken out of the top front corner.
    shape.lineTo(depth, 0)
    shape.lineTo(depth, thickness - s)
    shape.quadraticCurveTo(depth - s, thickness - s, depth - s, thickness)
  } else {
    // ogee: S-curve down the front face.
    const h = Math.min(s * 2, thickness)
    shape.lineTo(depth, 0)
    shape.lineTo(depth, thickness - h)
    shape.bezierCurveTo(depth, thickness - h / 2, depth - s, thickness - h / 2, depth - s, thickness)
  }

  shape.lineTo(0, thickness)
  shape.closePath()
  return shape
}

/**
 * Extrudes a side profile across `width`, centred on Z, with its back-bottom
 * corner at (x, y).
 *
 * `facing` picks which way the shaped front edge points. Stair treads overhang
 * toward -X, so they use 'back'. The geometry is rotated rather than mirrored,
 * which would invert the winding order.
 */
export function extrudeProfile(
  shape: THREE.Shape,
  width: number,
  x = 0,
  y = 0,
  facing: 'front' | 'back' = 'front',
): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: false,
    curveSegments: 12,
  })
  if (facing === 'back') {
    g.rotateY(Math.PI)
    g.translate(x, y, width / 2)
  } else {
    g.translate(x, y, -width / 2)
  }
  return g
}

/** Normalises a geometry so mixed sources can be merged safely. */
function normalize(g: THREE.BufferGeometry): THREE.BufferGeometry {
  const flat = g.index ? g.toNonIndexed() : g
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', flat.getAttribute('position'))
  if (flat.getAttribute('normal')) out.setAttribute('normal', flat.getAttribute('normal'))
  else {
    out.computeVertexNormals()
  }
  if (flat.getAttribute('uv')) out.setAttribute('uv', flat.getAttribute('uv'))
  return out
}

/** Merges geometries into one buffer, disposing the inputs. */
export function merge(geoms: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const usable = geoms.filter(Boolean)
  if (usable.length === 0) return new THREE.BufferGeometry()
  const normalized = usable.map(normalize)
  const merged = mergeGeometries(normalized, false)
  for (const g of usable) g.dispose()
  return merged ?? new THREE.BufferGeometry()
}

/** Triangle count of a geometry. */
export function triangleCount(g: THREE.BufferGeometry): number {
  const pos = g.getAttribute('position')
  if (!pos) return 0
  return (g.index ? g.index.count : pos.count) / 3
}
