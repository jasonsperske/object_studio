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

/**
 * Merges geometries into one buffer, disposing the inputs.
 *
 * The primitives carry texture coordinates and the swept and triangulated
 * surfaces do not; merging insists on all or none, so any that are missing are
 * filled in rather than letting the merge fail and take the part with it.
 */
export function merge(geoms: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const usable = geoms.filter(Boolean)
  if (usable.length === 0) return new THREE.BufferGeometry()
  const normalized = usable.map(normalize)
  if (normalized.some((g) => g.getAttribute('uv'))) {
    for (const g of normalized) {
      if (g.getAttribute('uv')) continue
      const count = g.getAttribute('position')?.count ?? 0
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(count * 2), 2))
    }
  }
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

/* ===========================================================================
 * Plan outlines
 *
 * An outline is a closed loop of {x, z} in the plan (XZ) plane, wound
 * anticlockwise — the sense of (cos t, sin t). Table tops, seats and anything
 * else with a shaped footprint are described that way, and then the solid is
 * made by sweeping a cross-section around the loop, offsetting it inwards or
 * clipping it into pieces. Every routine below relies on the winding for its
 * face normals, so `ring` enforces it.
 *
 * The outlines the library builds are all convex, and `hull` assumes as much.
 * =========================================================================== */

export interface PlanPoint {
  x: number
  z: number
}

/** A point of a swept cross-section: `inset` inwards from the outline, `y` absolute. */
export interface SectionPoint {
  inset: number
  y: number
}

/** An outline prepared for offsetting — see `plan`. */
export interface Plan {
  /** The cleaned, anticlockwise outline the offsets are measured from. */
  pts: PlanPoint[]
  /** The outline moved inwards by `d`, one point per point of `pts`. */
  offset: (d: number) => PlanPoint[]
  /** Distance from the middle to the nearest edge; the ceiling on an inset. */
  inradius: number
}

/**
 * Points closer together than this are the same point. Anything finer is below
 * the resolution of the objects and only feeds degenerate edges — whose
 * direction is noise — into the normals and offsets below.
 */
const GRAIN = 0.05

/** Cleans an outline: no duplicate points, no repeated end, wound anticlockwise. */
export function ring(points: PlanPoint[]): PlanPoint[] {
  const out: PlanPoint[] = []
  for (const q of points) {
    const prev = out[out.length - 1]
    if (prev && Math.hypot(prev.x - q.x, prev.z - q.z) < GRAIN) continue
    out.push({ x: q.x, z: q.z })
  }
  while (
    out.length > 2 &&
    Math.hypot(out[0].x - out[out.length - 1].x, out[0].z - out[out.length - 1].z) < GRAIN
  ) {
    out.pop()
  }
  let area = 0
  for (let i = 0; i < out.length; i++) {
    const a = out[i]
    const b = out[(i + 1) % out.length]
    area += a.x * b.z - b.x * a.z
  }
  if (area < 0) out.reverse()
  return out
}

/**
 * Convex hull, anticlockwise (Andrew's monotone chain).
 *
 * The outlines here are convex to begin with — the shapes are, and clipping one
 * keeps it that way — so the hull of an outline is the outline. What it is for
 * is repair: an offset can leave a collapsed corner as a knot of points a
 * fraction of a millimetre out of order, and one backwards edge is enough to
 * point an inward normal outwards.
 */
export function hull(points: PlanPoint[]): PlanPoint[] {
  const pts = points.slice().sort((a, b) => a.x - b.x || a.z - b.z)
  if (pts.length < 3) return ring(points)
  const cross = (o: PlanPoint, a: PlanPoint, b: PlanPoint) =>
    (a.x - o.x) * (b.z - o.z) - (a.z - o.z) * (b.x - o.x)
  const half = (source: PlanPoint[]) => {
    const out: PlanPoint[] = []
    for (const q of source) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop()
      out.push(q)
    }
    out.pop()
    return out
  }
  const chain = half(pts).concat(half(pts.slice().reverse()))
  return chain.length >= 3 ? ring(chain) : ring(points)
}

/**
 * Replaces each corner of a polygon with an arc tangent to both of its edges.
 * Corners that barely turn — points along an already-sampled curve — are left
 * alone, so this is safe to run over a mixed outline.
 */
export function roundCorners(points: PlanPoint[], radius: number, steps = 5): PlanPoint[] {
  if (radius < 0.5) return ring(points)
  const pts = ring(points)
  const n = pts.length
  const out: PlanPoint[] = []
  for (let i = 0; i < n; i++) {
    const q = pts[i]
    const prev = pts[(i - 1 + n) % n]
    const next = pts[(i + 1) % n]
    const a = { x: prev.x - q.x, z: prev.z - q.z }
    const b = { x: next.x - q.x, z: next.z - q.z }
    const la = Math.hypot(a.x, a.z)
    const lb = Math.hypot(b.x, b.z)
    if (la < GRAIN || lb < GRAIN) {
      out.push(q)
      continue
    }
    a.x /= la
    a.z /= la
    b.x /= lb
    b.z /= lb
    const angle = Math.acos(Math.max(-1, Math.min(1, a.x * b.x + a.z * b.z)))
    if (!(angle > 0.08 && angle < Math.PI - 0.08)) {
      out.push(q)
      continue
    }
    const halfAngle = Math.tan(angle / 2)
    const cut = Math.min(radius / halfAngle, la * 0.5, lb * 0.5)
    const r = cut * halfAngle
    if (r < 0.5) {
      out.push(q)
      continue
    }
    const bisector = { x: a.x + b.x, z: a.z + b.z }
    const lBisector = Math.hypot(bisector.x, bisector.z) || 1
    const reach = r / Math.sin(angle / 2)
    const centre = {
      x: q.x + (bisector.x / lBisector) * reach,
      z: q.z + (bisector.z / lBisector) * reach,
    }
    const from = Math.atan2(q.z + a.z * cut - centre.z, q.x + a.x * cut - centre.x)
    const to = Math.atan2(q.z + b.z * cut - centre.z, q.x + b.x * cut - centre.x)
    let sweepBy = to - from
    while (sweepBy > Math.PI) sweepBy -= Math.PI * 2
    while (sweepBy < -Math.PI) sweepBy += Math.PI * 2
    for (let k = 0; k <= steps; k++) {
      const t = from + sweepBy * (k / steps)
      out.push({ x: centre.x + r * Math.cos(t), z: centre.z + r * Math.sin(t) })
    }
  }
  return ring(out)
}

/** Per-vertex miter vectors: offsetting a vertex by `d * miter` moves both of
 *  its edges inwards by exactly `d`, which is what keeps a swept profile an
 *  even width around a corner. */
function miters(pts: PlanPoint[]): PlanPoint[] {
  const n = pts.length
  const edge: PlanPoint[] = []
  for (let i = 0; i < n; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % n]
    const dx = b.x - a.x
    const dz = b.z - a.z
    const len = Math.hypot(dx, dz) || 1
    // Inward normal of an anticlockwise ring.
    edge.push({ x: -dz / len, z: dx / len })
  }
  return pts.map((_, i) => {
    const a = edge[(i - 1 + n) % n]
    const b = edge[i]
    const dot = a.x * b.x + a.z * b.z
    if (dot < -0.9) return { x: b.x, z: b.z } // folds back on itself; don't spike
    const s = 1 + dot
    return { x: (a.x + b.x) / s, z: (a.z + b.z) / s }
  })
}

/** Inward line equations, one per edge: a point is inside while n·q ≥ c. */
function edgeLines(pts: PlanPoint[]) {
  const lines: { nx: number; nz: number; c: number }[] = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const dx = b.x - a.x
    const dz = b.z - a.z
    // Anything shorter than the grain is a collapsed corner rather than an
    // edge, and its direction is noise. Taking its word for which way is inside
    // would put every test point outside.
    const len = Math.hypot(dx, dz)
    if (len < GRAIN) continue
    const nx = -dz / len
    const nz = dx / len
    lines.push({ nx, nz, c: nx * a.x + nz * a.z })
  }
  return lines
}

/**
 * Prepares an outline to be worked on inset by inset, caching each offset it is
 * asked for. Every offset keeps one point per point of the outline, so a swept
 * cross-section can step in and out without losing its correspondence.
 *
 * A plain miter offset turns itself inside out wherever a corner is rounded
 * tighter than the inset — the little arc reappears bulging the wrong way — so
 * every offset point is then pushed back inside the half-plane of any edge it
 * has crossed. The points of a collapsed arc all end up together at the corner,
 * which is what an eroded outline should look like. Offsets outwards (a bead
 * standing proud of a face) need none of that and skip it.
 */
export function plan(outline: PlanPoint[] | Plan): Plan {
  if ('offset' in outline) return outline
  const pts = hull(outline)
  const m = miters(pts)
  const lines = edgeLines(pts)
  let cx = 0
  let cz = 0
  for (const q of pts) {
    cx += q.x / pts.length
    cz += q.z / pts.length
  }
  let inradius = Infinity
  for (const l of lines) inradius = Math.min(inradius, l.nx * cx + l.nz * cz - l.c)
  inradius = Math.max(inradius, 0)
  const cache = new Map<number, PlanPoint[]>()
  const offset = (d: number): PlanPoint[] => {
    const t = Math.min(d, inradius * 0.92)
    const key = Math.round(t * 64)
    const hit = cache.get(key)
    if (hit) return hit
    const out = pts.map((q, i) => ({ x: q.x + t * m[i].x, z: q.z + t * m[i].z }))
    if (t > 1e-6) {
      for (let pass = 0; pass < 2; pass++) {
        for (const q of out) {
          for (const l of lines) {
            const over = t - (l.nx * q.x + l.nz * q.z - l.c)
            if (over > 1e-6) {
              q.x += over * l.nx
              q.z += over * l.nz
            }
          }
        }
      }
    }
    cache.set(key, out)
    return out
  }
  return { pts, offset, inradius }
}

/**
 * Cuts a convex outline against a half-plane (Sutherland–Hodgman). `keep` is
 * which side of `limit` survives. Returns null if nothing does — which is how
 * a slice that falls outside the shape reports itself.
 */
export function clip(
  pts: PlanPoint[],
  axis: 'x' | 'z',
  limit: number,
  keep: 'min' | 'max',
): PlanPoint[] | null {
  const inside = (q: PlanPoint) => (keep === 'min' ? q[axis] <= limit : q[axis] >= limit)
  const out: PlanPoint[] = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const ain = inside(a)
    const bin = inside(b)
    if (ain) out.push(a)
    if (ain !== bin) {
      const t = (limit - a[axis]) / (b[axis] - a[axis])
      out.push({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t })
    }
  }
  return out.length >= 3 ? ring(out) : null
}

/** The point of an outline furthest in a direction — a corner of a rectangle,
 *  the 45° of a circle. Handy for standing a leg under one. */
export function supportPoint(pts: PlanPoint[], dx: number, dz: number): PlanPoint {
  let best = pts[0]
  let bestValue = -Infinity
  for (const q of pts) {
    const v = q.x * dx + q.z * dz
    if (v > bestValue) {
      bestValue = v
      best = q
    }
  }
  return best
}

/**
 * Whether a point sits inside a convex outline.
 *
 * Repaired first, because the obvious thing to hand one is an offset, and an
 * offset keeps a point per point of the outline rather than a tidy ring — where
 * a corner has collapsed, its knot of points can be locally out of order, and
 * one backwards edge would report every point as outside.
 */
export function contains(pts: PlanPoint[], x: number, z: number): boolean {
  for (const l of edgeLines(hull(pts))) {
    if (l.nx * x + l.nz * z - l.c < 0) return false
  }
  return true
}

/** Length once round an outline. */
export function perimeter(pts: PlanPoint[]): number {
  let total = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    total += Math.hypot(b.x - a.x, b.z - a.z)
  }
  return total
}

/* ===========================================================================
 * Surfaces over an outline
 * =========================================================================== */

/**
 * A flat horizontal face over a set of contours — the first is the outer one,
 * any others are holes. Triangle winding is worked out from the signed area
 * rather than trusted, so the caller only has to say which way it should look.
 */
export function face(
  contours: PlanPoint[][],
  y: number,
  up: boolean,
): THREE.BufferGeometry | null {
  const outer = contours[0]
  const holes = contours.slice(1)
  if (!outer || outer.length < 3) return null
  const toV2 = (q: PlanPoint) => new THREE.Vector2(q.x, q.z)
  const faces = THREE.ShapeUtils.triangulateShape(outer.map(toV2), holes.map((h) => h.map(toV2)))
  const all = outer.concat(...holes)
  const position: number[] = []
  for (const f of faces) {
    const a = all[f[0]]
    const b = all[f[1]]
    const c = all[f[2]]
    if (!a || !b || !c) continue
    // Positive area is anticlockwise in XZ, which faces down in world space.
    const area = (b.x - a.x) * (c.z - a.z) - (c.x - a.x) * (b.z - a.z)
    const tri = area > 0 === up ? [c, b, a] : [a, b, c]
    for (const q of tri) position.push(q.x, y, q.z)
  }
  if (!position.length) return null
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
  g.computeVertexNormals()
  return g
}

/**
 * Sweeps a cross-section around an outline: the moulded edge of a table top,
 * the apron under it, a bead, the frame of a chair seat.
 *
 * The section is a list of {inset, y}, walked from the top down — that
 * direction is what puts its normals on the outside. Passing a function instead
 * of a list gives a section per vertex, which is how an apron arches between
 * its legs; every one of them must be the same length.
 *
 * `closed` wraps the last section point back to the first, giving a solid ring
 * that needs no caps. Left open, the two ends each want a `face`.
 */
export function sweep(
  outline: PlanPoint[] | Plan,
  section: SectionPoint[] | ((index: number) => SectionPoint[]),
  closed: boolean,
): THREE.BufferGeometry | null {
  const planned = plan(outline)
  const n = planned.pts.length
  const sectionAt = typeof section === 'function' ? section : () => section
  const at = (i: number, s: SectionPoint) => {
    const q = planned.offset(s.inset)[i]
    return { x: q.x, y: s.y, z: q.z }
  }
  const position: number[] = []
  const push = (a: THREE.Vector3Like, b: THREE.Vector3Like, c: THREE.Vector3Like) =>
    position.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const si = sectionAt(i)
    const sj = sectionAt(j)
    const k = Math.min(si.length, sj.length)
    const last = closed ? k : k - 1
    for (let s = 0; s < last; s++) {
      const t = (s + 1) % k
      const a = at(i, si[s])
      const b = at(j, sj[s])
      const c = at(j, sj[t])
      const d = at(i, si[t])
      const step =
        Math.hypot(a.x - d.x, a.y - d.y, a.z - d.z) + Math.hypot(b.x - c.x, b.y - c.y, b.z - c.z)
      if (step < 1e-6) continue
      push(a, b, c)
      push(a, c, d)
    }
  }
  if (!position.length) return null
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
  g.computeVertexNormals()
  return g
}

/** A circular cross-section — a bead run round an edge, or the round of a moulding. */
export function beadSection(inset: number, y: number, radius: number, steps = 10): SectionPoint[] {
  const section: SectionPoint[] = []
  for (let i = 0; i < steps; i++) {
    const a = (Math.PI * 2 * i) / steps
    section.push({ inset: inset + radius * Math.cos(a), y: y + radius * Math.sin(a) })
  }
  return section
}

/**
 * Reads a board profile back as a cross-section to sweep: the run from the top
 * face, round the shaped edge, to the bottom face, measured as insets from the
 * outline. `limit` caps how far in the flat faces are held, for an outline too
 * small to take the whole profile.
 *
 * That is what lets the same six profiles the stair treads use — square through
 * to ogee — run around a round table top or a shaped seat.
 */
export function edgeSection(
  style: EdgeStyle,
  thickness: number,
  size: number,
  limit: number,
  divisions = 20,
): { depth: number; section: SectionPoint[] } {
  const depth = Math.min(Math.max(thickness, size * 2, 0.5), Math.max(limit, 1))
  const raw = boardProfile(depth, thickness, style, size).extractPoints(divisions).shape
  const section: SectionPoint[] = []
  for (const q of raw) {
    const s = { inset: Math.max(0, depth - q.x), y: q.y }
    const prev = section[section.length - 1]
    if (prev && Math.abs(prev.inset - s.inset) < 1e-6 && Math.abs(prev.y - s.y) < 1e-6) continue
    section.push(s)
  }
  const first = section[0]
  const end = section[section.length - 1]
  // The profile comes back as a closed loop starting at its back-bottom corner.
  // Dropping the point that closes it leaves an open run from one back corner
  // to the other, which the sweep wants to walk from the top face down.
  if (
    section.length > 2 &&
    Math.abs(first.inset - end.inset) < 1e-6 &&
    Math.abs(first.y - end.y) < 1e-6
  ) {
    section.pop()
  }
  if (section.length < 2) {
    return { depth, section: [{ inset: depth, y: thickness }, { inset: depth, y: 0 }] }
  }
  if (section[0].y < section[section.length - 1].y) section.reverse()
  return { depth, section }
}

/**
 * A board of any plan shape: the edge profile swept round the outline, with a
 * flat face top and bottom. The faces are triangulated from the repaired
 * outline rather than the raw offset, because a knotted corner triangulates
 * into nonsense.
 */
export function profiledBoard(
  outline: PlanPoint[] | Plan,
  y: number,
  thickness: number,
  style: EdgeStyle,
  size: number,
): THREE.BufferGeometry {
  const planned = plan(outline)
  const { depth, section } = edgeSection(style, thickness, size, planned.inradius * 0.75)
  const raised = section.map((s) => ({ inset: s.inset, y: s.y + y }))
  const inner = hull(planned.offset(depth))
  return merge(
    [sweep(planned, raised, false), face([inner], y + thickness, true), face([inner], y, false)]
      .filter(Boolean) as THREE.BufferGeometry[],
  )
}

/**
 * Cylinder from `base` to `tip`, tapering between two diameters. Four sides and
 * a 45° twist make it a square post; sixteen make it a round one. `tube` is the
 * simpler cousin, for a rail of constant diameter.
 */
export function strut(
  base: THREE.Vector3,
  tip: THREE.Vector3,
  dBase: number,
  dTip: number,
  sides = 16,
  twist = 0,
): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(tip, base)
  const len = dir.length() || 1e-3
  const g = new THREE.CylinderGeometry(Math.max(dTip, 0.2) / 2, Math.max(dBase, 0.2) / 2, len, sides)
  if (twist) g.rotateY(twist)
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize(),
  )
  g.applyQuaternion(q)
  g.translate((base.x + tip.x) / 2, (base.y + tip.y) / 2, (base.z + tip.z) / 2)
  return g
}
