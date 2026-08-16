// Table.
//
// Every shape the table can take — rectangular, round, oval, racetrack,
// hexagonal — is one closed outline in the XZ plane, wound anticlockwise. The
// rest of the object is that outline worked on: a cross-section swept around it
// gives the moulded edge and the apron, offsetting it inwards gives the inlay
// band and the leg positions, and clipping it into slices gives the leaves and
// the breadboard ends. One outline, so an ogee edge runs around a round top and
// an arched apron follows an oval without either knowing what shape it is on.
//
// The top's length runs along +X and its width along +Z, per the studio
// convention, with the floor at Y = 0.

export const meta = {
  order: 5,
  name: 'Table',
  description:
    'A table from a plan outline — six tops, moulded or banded edges, extension and drop leaves, six leg arrangements, and an ornament level that runs from plain board to turned and moulded.',
}

// Gap left between the sections of a split top, so seams read in the preview
// and survive as separate shells on the way out.
const SEAM = 2

const COLOR = {
  top: 0xc79155,
  leaf: 0xbe8749,
  breadboard: 0xb8834a,
  band: 0x6b4a2a,
  apron: 0xb98a54,
  leg: 0xa87f4d,
  stretcher: 0x9c7a4c,
  moulding: 0xd8ab72,
}

export const params = [
  // --- Top ----------------------------------------------------------------
  {
    id: 'shape',
    label: 'Shape',
    type: 'select',
    default: 'rect',
    group: 'Top',
    options: [
      { value: 'rect', label: 'Rectangular' },
      { value: 'square', label: 'Square' },
      { value: 'round', label: 'Round' },
      { value: 'oval', label: 'Oval' },
      { value: 'racetrack', label: 'Racetrack — straight sides, round ends' },
      { value: 'hex', label: 'Hexagonal' },
      { value: 'octagon', label: 'Octagonal' },
    ],
  },
  { id: 'length', label: 'Length', type: 'number', min: 400, max: 3600, step: 10, default: 1600, unit: 'mm', group: 'Top', help: 'Along +X. The diameter or width across for the shapes with no separate width.' },
  { id: 'width', label: 'Width', type: 'number', min: 300, max: 1600, step: 10, default: 900, unit: 'mm', group: 'Top', visibleWhen: (p) => ['rect', 'oval', 'racetrack'].includes(str(p, 'shape')) },
  { id: 'height', label: 'Height', type: 'number', min: 300, max: 1150, step: 5, default: 750, unit: 'mm', group: 'Top', help: 'Floor to top surface. 450 coffee, 750 dining, 900 counter, 1050 bar.' },
  { id: 'thickness', label: 'Top thickness', type: 'number', min: 10, max: 100, step: 1, default: 28, unit: 'mm', group: 'Top' },
  { id: 'cornerRadius', label: 'Corner radius', type: 'number', min: 0, max: 400, step: 5, default: 25, unit: 'mm', group: 'Top', visibleWhen: (p) => ['rect', 'square'].includes(str(p, 'shape')) },

  // --- Edge & border ------------------------------------------------------
  {
    id: 'edgeStyle',
    label: 'Edge profile',
    type: 'select',
    default: 'rounded',
    group: 'Edge & border',
    help: 'The same profiles the stair treads and shelves use, swept around the outline.',
    options: [
      { value: 'square', label: 'Square' },
      { value: 'chamfer', label: 'Chamfer' },
      { value: 'rounded', label: 'Round-over' },
      { value: 'bullnose', label: 'Bullnose' },
      { value: 'cove', label: 'Cove' },
      { value: 'ogee', label: 'Ogee' },
    ],
  },
  { id: 'edgeSize', label: 'Profile size', type: 'number', min: 0, max: 40, step: 0.5, default: 10, unit: 'mm', group: 'Edge & border', visibleWhen: (p) => !['square', 'bullnose'].includes(str(p, 'edgeStyle')) },
  {
    id: 'border',
    label: 'Border',
    type: 'select',
    default: 'none',
    group: 'Edge & border',
    options: [
      { value: 'none', label: 'None' },
      { value: 'banding', label: 'Banding — contrasting inlay around the field' },
      { value: 'breadboard', label: 'Breadboard ends — cross pieces at each end' },
      { value: 'lip', label: 'Raised lip — a gallery around the top' },
    ],
  },
  { id: 'borderWidth', label: 'Border width', type: 'number', min: 10, max: 250, step: 5, default: 60, unit: 'mm', group: 'Edge & border', visibleWhen: (p) => str(p, 'border') !== 'none' },
  { id: 'lipHeight', label: 'Lip height', type: 'number', min: 3, max: 80, step: 1, default: 16, unit: 'mm', group: 'Edge & border', visibleWhen: (p) => str(p, 'border') === 'lip' },

  // --- Leaves -------------------------------------------------------------
  {
    id: 'leafStyle',
    label: 'Leaves',
    type: 'select',
    default: 'none',
    group: 'Leaves',
    help: 'Extension leaves drop into the middle and make the table longer; drop leaves are cut from the width and hinge down.',
    options: [
      { value: 'none', label: 'One-piece top' },
      { value: 'extension', label: 'Extension leaves — inserted at the centre' },
      { value: 'drop', label: 'Drop leaves — hinged along the sides' },
    ],
  },
  { id: 'leafCount', label: 'Leaf count', type: 'int', min: 1, max: 3, step: 1, default: 1, group: 'Leaves', visibleWhen: (p) => str(p, 'leafStyle') === 'extension' },
  { id: 'leafWidth', label: 'Leaf width', type: 'number', min: 80, max: 700, step: 10, default: 300, unit: 'mm', group: 'Leaves', visibleWhen: (p) => str(p, 'leafStyle') !== 'none', help: 'Along the length for extension leaves, across it for drop leaves.' },
  {
    id: 'leafState',
    label: 'Leaves',
    type: 'select',
    default: 'open',
    group: 'Leaves',
    visibleWhen: (p) => str(p, 'leafStyle') !== 'none',
    options: [
      { value: 'open', label: 'In use — extended / raised' },
      { value: 'closed', label: 'Stowed — removed / hanging' },
    ],
  },

  // --- Legs ---------------------------------------------------------------
  {
    id: 'legArrangement',
    label: 'Arrangement',
    type: 'select',
    default: 'corner',
    group: 'Legs',
    options: [
      { value: 'corner', label: 'Four legs — at the corners' },
      { value: 'splayed', label: 'Four legs — splayed out' },
      { value: 'hairpin', label: 'Hairpin — bent rod pairs' },
      { value: 'trestle', label: 'Trestle — end frames and a stretcher' },
      { value: 'pedestal', label: 'Pedestal — one centre column' },
      { value: 'twin', label: 'Twin pedestal' },
    ],
  },
  {
    id: 'legProfile',
    label: 'Leg profile',
    type: 'select',
    default: 'tapered',
    group: 'Legs',
    visibleWhen: (p) => str(p, 'legArrangement') !== 'hairpin',
    options: [
      { value: 'square', label: 'Square' },
      { value: 'tapered', label: 'Square, tapered' },
      { value: 'round', label: 'Round, tapered' },
      { value: 'turned', label: 'Turned — beads and a vase' },
      { value: 'fluted', label: 'Reeded — round with raised ribs' },
    ],
  },
  { id: 'legThickness', label: 'Leg thickness', type: 'number', min: 15, max: 200, step: 1, default: 70, unit: 'mm', group: 'Legs' },
  { id: 'legInset', label: 'Inset from edge', type: 'number', min: 0, max: 500, step: 5, default: 45, unit: 'mm', group: 'Legs', visibleWhen: (p) => ['corner', 'splayed', 'hairpin', 'trestle'].includes(str(p, 'legArrangement')) },
  { id: 'legTaper', label: 'Taper to foot', type: 'number', min: 0.25, max: 1, step: 0.01, default: 0.62, group: 'Legs', help: 'Thickness left at the floor.', visibleWhen: (p) => ['tapered', 'round', 'fluted'].includes(str(p, 'legProfile')) && str(p, 'legArrangement') !== 'hairpin' },
  { id: 'splay', label: 'Splay angle', type: 'number', min: 0, max: 30, step: 0.5, default: 12, unit: '°', group: 'Legs', visibleWhen: (p) => ['splayed', 'hairpin'].includes(str(p, 'legArrangement')) },
  {
    id: 'stretcher',
    label: 'Stretchers',
    type: 'select',
    default: 'none',
    group: 'Legs',
    visibleWhen: (p) => ['corner', 'splayed'].includes(str(p, 'legArrangement')),
    options: [
      { value: 'none', label: 'None' },
      { value: 'h', label: 'H — side rails and a centre rail' },
      { value: 'box', label: 'Box — a rail on all four sides' },
      { value: 'x', label: 'X — corner to corner' },
    ],
  },
  { id: 'stretcherHeight', label: 'Stretcher height', type: 'number', min: 40, max: 700, step: 5, default: 200, unit: 'mm', group: 'Legs', visibleWhen: (p) => ['corner', 'splayed'].includes(str(p, 'legArrangement')) && str(p, 'stretcher') !== 'none' },

  // --- Apron & ornament ---------------------------------------------------
  { id: 'apron', label: 'Apron', type: 'boolean', default: true, group: 'Apron & ornament', help: 'The rail running under the top between the legs.' },
  { id: 'apronDepth', label: 'Apron depth', type: 'number', min: 30, max: 300, step: 5, default: 90, unit: 'mm', group: 'Apron & ornament', visibleWhen: (p) => bool(p, 'apron') },
  { id: 'apronInset', label: 'Apron inset', type: 'number', min: 0, max: 200, step: 5, default: 25, unit: 'mm', group: 'Apron & ornament', visibleWhen: (p) => bool(p, 'apron') },
  { id: 'apronThickness', label: 'Apron thickness', type: 'number', min: 10, max: 80, step: 1, default: 24, unit: 'mm', group: 'Apron & ornament', visibleWhen: (p) => bool(p, 'apron') },
  {
    id: 'fancy',
    label: 'Fanciness',
    type: 'int',
    min: 0,
    max: 5,
    step: 1,
    default: 1,
    group: 'Apron & ornament',
    help: '1 beads the apron, 2 arches it and pads the feet, 3 adds a moulding under the top, 4 corbels the legs, 5 collars the turnings and doubles the mouldings.',
  },
]

// ---------------------------------------------------------------------------
// Plan outlines
//
// An outline is an array of {x, z}, closed implicitly and wound anticlockwise
// in the XZ plane (the sense of (cos t, sin t)). Every routine below relies on
// that winding for its face normals, so `ring` enforces it.
// ---------------------------------------------------------------------------

// Points closer together than this are the same point. Anything finer is
// beneath the resolution of the object and only feeds degenerate edges — whose
// direction is noise — into the normals and offsets below.
const GRAIN = 0.05

function ring(points) {
  const out = []
  for (const q of points) {
    const prev = out[out.length - 1]
    if (prev && Math.hypot(prev.x - q.x, prev.z - q.z) < GRAIN) continue
    out.push({ x: q.x, z: q.z })
  }
  while (out.length > 2 && Math.hypot(out[0].x - out[out.length - 1].x, out[0].z - out[out.length - 1].z) < GRAIN) {
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

/** Rectangle with rounded corners; radius 0 gives square corners. */
function roundedRect(length, width, radius) {
  const L = length / 2
  const W = width / 2
  const r = Math.max(0, Math.min(radius, L - 1, W - 1))
  if (r < 1e-3) {
    return ring([
      { x: L, z: -W }, { x: L, z: W }, { x: -L, z: W }, { x: -L, z: -W },
    ])
  }
  const steps = Math.max(3, Math.round((r / 12) + 3))
  const pts = []
  const corners = [
    { cx: L - r, cz: W - r, from: 0 },
    { cx: -L + r, cz: W - r, from: Math.PI / 2 },
    { cx: -L + r, cz: -W + r, from: Math.PI },
    { cx: L - r, cz: -W + r, from: Math.PI * 1.5 },
  ]
  for (const c of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = c.from + (Math.PI / 2) * (i / steps)
      pts.push({ x: c.cx + r * Math.cos(a), z: c.cz + r * Math.sin(a) })
    }
  }
  return ring(pts)
}

function ellipse(length, width, steps = 84) {
  const pts = []
  for (let i = 0; i < steps; i++) {
    const a = (Math.PI * 2 * i) / steps
    pts.push({ x: (length / 2) * Math.cos(a), z: (width / 2) * Math.sin(a) })
  }
  return ring(pts)
}

/** Regular polygon of `sides`, sized so the top is `length` across the X axis. */
function polygon(sides, length, offset) {
  const r = length / 2 / Math.cos(offset)
  const pts = []
  for (let i = 0; i < sides; i++) {
    const a = offset + (Math.PI * 2 * i) / sides
    pts.push({ x: r * Math.cos(a), z: r * Math.sin(a) })
  }
  return ring(pts)
}

function planOutline(shape, length, width, radius) {
  if (shape === 'round') return ellipse(length, length)
  if (shape === 'oval') return ellipse(length, width)
  if (shape === 'racetrack') return roundedRect(length, width, width / 2)
  if (shape === 'hex') return polygon(6, length, 0)
  if (shape === 'octagon') return polygon(8, length, Math.PI / 8)
  if (shape === 'square') return roundedRect(length, length, radius)
  return roundedRect(length, width, radius)
}

// ---------------------------------------------------------------------------
// Working on an outline: miter offsets, clipping, arc length
// ---------------------------------------------------------------------------

/**
 * Per-vertex miter vectors. Offsetting a vertex by `d * miter` moves both of
 * its edges inwards by exactly `d`, which is what keeps a swept profile an even
 * width around a corner.
 */
function miters(pts) {
  const n = pts.length
  const edge = []
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
    if (dot < -0.9) return { x: b.x, z: b.z } // fold back on itself; don't spike
    const s = 1 + dot
    return { x: (a.x + b.x) / s, z: (a.z + b.z) / s }
  })
}

/**
 * Convex hull, anticlockwise (Andrew's monotone chain).
 *
 * Every outline in this object is convex — the shapes are, and clipping one
 * keeps it that way — so the hull of an outline is the outline. What it is here
 * for is repair: an offset can leave a collapsed corner as a knot of points a
 * fraction of a millimetre out of order, and one backwards edge is enough to
 * put an inward normal outward.
 */
function hull(points) {
  const pts = points.slice().sort((a, b) => a.x - b.x || a.z - b.z)
  if (pts.length < 3) return ring(points)
  const cross = (o, a, b) => (a.x - o.x) * (b.z - o.z) - (a.z - o.z) * (b.x - o.x)
  const half = (source) => {
    const out = []
    for (const q of source) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop()
      out.push(q)
    }
    out.pop()
    return out
  }
  const lower = half(pts)
  const upper = half(pts.slice().reverse())
  const chain = lower.concat(upper)
  return chain.length >= 3 ? ring(chain) : ring(points)
}

/** Inward line equations, one per edge: a point is inside while n·q ≥ c. */
function edgeLines(pts) {
  const lines = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const dx = b.x - a.x
    const dz = b.z - a.z
    const len = Math.hypot(dx, dz)
    if (len < 1e-6) continue
    const nx = -dz / len
    const nz = dx / len
    lines.push({ nx, nz, c: nx * a.x + nz * a.z })
  }
  return lines
}

/**
 * An outline gets worked on inset by inset, so the offsets are prepared once
 * and cached against it.
 *
 * A plain miter offset turns itself inside out wherever a corner is rounded
 * tighter than the inset — the little arc reappears bulging the wrong way — so
 * every offset point is then pushed back inside the half-plane of any edge it
 * has crossed. The points of a collapsed arc all end up together at the corner,
 * which is what an eroded outline should look like. Offsets outwards (a bead
 * standing proud) need none of that and skip it.
 */
function plan(outline) {
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
  const cache = new Map()
  const offset = (d) => {
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

function asPlan(outline) {
  return outline.offset ? outline : plan(outline)
}

function offsetRing(pts, d) {
  return asPlan(pts).offset(d)
}

/** Half of the smallest span across the outline — the ceiling on any inset. */
function halfSpan(pts) {
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (const q of pts) {
    minX = Math.min(minX, q.x)
    maxX = Math.max(maxX, q.x)
    minZ = Math.min(minZ, q.z)
    maxZ = Math.max(maxZ, q.z)
  }
  return Math.min(maxX - minX, maxZ - minZ) / 2
}

/** Sutherland–Hodgman against a half-plane. The outlines here are all convex. */
function clip(pts, axis, limit, keep) {
  const inside = (q) => (keep === 'min' ? q[axis] <= limit : q[axis] >= limit)
  const out = []
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

/** The point of the outline furthest in a direction — a corner, or the 45° of a circle. */
function supportPoint(pts, dx, dz) {
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

function perimeter(pts) {
  let total = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    total += Math.hypot(b.x - a.x, b.z - a.z)
  }
  return total
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

/**
 * A flat horizontal face over a set of contours — the first is the outer one,
 * any others are holes. Triangle winding is set from the signed area rather
 * than trusted, so the caller only has to say which way it should look.
 */
function face(contours, y, up) {
  const outer = contours[0]
  const holes = contours.slice(1)
  if (!outer || outer.length < 3) return null
  const toV2 = (q) => new THREE.Vector2(q.x, q.z)
  const faces = THREE.ShapeUtils.triangulateShape(outer.map(toV2), holes.map((h) => h.map(toV2)))
  const all = outer.concat(...holes)
  const position = []
  for (const f of faces) {
    const a = all[f[0]]
    const b = all[f[1]]
    const c = all[f[2]]
    if (!a || !b || !c) continue
    // Positive area is anticlockwise in XZ, which faces down in world space.
    const area = (b.x - a.x) * (c.z - a.z) - (c.x - a.x) * (b.z - a.z)
    const tri = area > 0 === Boolean(up) ? [c, b, a] : [a, b, c]
    for (const q of tri) position.push(q.x, y, q.z)
  }
  if (!position.length) return null
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
  g.computeVertexNormals()
  return g
}

/**
 * Sweeps a cross-section around the outline. A section is a list of
 * {inset, y}: `inset` measures inwards from the outline along the miter, `y` is
 * absolute. `sectionAt(i)` may return a different section at each vertex, which
 * is how the apron gets its arch — every section must be the same length.
 *
 * `closed` wraps the last section point back to the first, giving a solid ring
 * that needs no caps. Left open, the two ends want a `face` each.
 */
function sweep(outline, sectionAt, closed) {
  const planned = asPlan(outline)
  const n = planned.pts.length
  const at = (i, s) => {
    const q = planned.offset(s.inset)[i]
    return { x: q.x, y: s.y, z: q.z }
  }
  const position = []
  const push = (a, b, c) => position.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
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
      const step = Math.hypot(a.x - d.x, a.y - d.y, a.z - d.z) + Math.hypot(b.x - c.x, b.y - c.y, b.z - c.z)
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

/** A solid ring: one closed cross-section swept round, so no caps are needed. */
function ringSolid(pts, section) {
  return sweep(pts, () => section, true)
}

/** A circular cross-section — a bead, or the round of a moulding. */
function beadSection(inset, y, radius, steps = 10) {
  const section = []
  for (let i = 0; i < steps; i++) {
    const a = (Math.PI * 2 * i) / steps
    section.push({ inset: inset + radius * Math.cos(a), y: y + radius * Math.sin(a) })
  }
  return section
}

/**
 * The edge treatment, taken from the shared board profile and re-read as
 * insets from the outline. Returns the section from the top face round to the
 * bottom face, plus the depth the flat faces have to be held back by.
 */
function edgeSection(style, thickness, size, limit) {
  const depth = Math.min(Math.max(thickness, size * 2, 0.5), Math.max(limit, 1))
  const profile = boardProfile(depth, thickness, style, size)
  const raw = profile.extractPoints(20).shape
  const section = []
  for (const q of raw) {
    const s = { inset: Math.max(0, depth - q.x), y: q.y }
    const prev = section[section.length - 1]
    if (prev && Math.abs(prev.inset - s.inset) < 1e-6 && Math.abs(prev.y - s.y) < 1e-6) continue
    section.push(s)
  }
  // The profile comes back as a closed loop starting at its back-bottom corner.
  // Dropping the point that closes it leaves an open run from one back corner
  // to the other; the sweep wants that run to start at the top face and finish
  // at the bottom one, which is the direction its normals are derived from.
  const first = section[0]
  const last = section[section.length - 1]
  if (section.length > 2 && Math.abs(first.inset - last.inset) < 1e-6 && Math.abs(first.y - last.y) < 1e-6) {
    section.pop()
  }
  if (section.length < 2) return { depth, section: [{ inset: depth, y: thickness }, { inset: depth, y: 0 }] }
  if (section[0].y < section[section.length - 1].y) section.reverse()
  return { depth, section }
}

// ---------------------------------------------------------------------------
// The top
// ---------------------------------------------------------------------------

/**
 * One slice of the top: the edge profile swept round it, a face top and bottom.
 * With a band, the top face comes back in two pieces — the border ring and the
 * field inside it — so that the inlay can be a part of its own.
 */
function topSlice(outline, y0, thickness, style, size, band) {
  const planned = asPlan(outline)
  const { depth, section } = edgeSection(style, thickness, size, planned.inradius * 0.75)
  const raised = section.map((s) => ({ inset: s.inset, y: s.y + y0 }))
  // The faces are triangulated, so they take the repaired outline rather than
  // the raw offset — a knotted corner triangulates into nonsense.
  const inner = hull(planned.offset(depth))
  const board = [sweep(planned, () => raised, false), face([inner], y0, false)]
  if (band <= 0) {
    board.push(face([inner], y0 + thickness, true))
    return { board: merge(board.filter(Boolean)), band: null }
  }
  const field = hull(planned.offset(depth + band))
  board.push(face([field], y0 + thickness, true))
  const ring = face([inner, field.slice().reverse()], y0 + thickness, true)
  return { board: merge(board.filter(Boolean)), band: ring }
}

/**
 * Cuts the outline into slices across one axis, leaving a seam gap at each
 * joint. Extension leaves and breadboard ends cut along X, drop leaves along Z.
 */
function slice(pts, axis, cuts) {
  const bounds = [-Infinity, ...cuts, Infinity]
  const slices = []
  for (let i = 0; i < bounds.length - 1; i++) {
    let piece = pts
    if (Number.isFinite(bounds[i])) piece = clip(piece, axis, bounds[i] + SEAM / 2, 'max')
    if (piece && Number.isFinite(bounds[i + 1])) piece = clip(piece, axis, bounds[i + 1] - SEAM / 2, 'min')
    if (piece) slices.push(piece)
  }
  return slices
}

/** Swings a drop leaf down about its hinge line, which runs along X at z0. */
function hingeDown(geometry, y0, z0, degrees) {
  const a = (degrees * Math.PI) / 180
  geometry.translate(0, -y0, -z0)
  geometry.rotateX(z0 >= 0 ? a : -a)
  geometry.translate(0, y0, z0)
  return geometry
}

// ---------------------------------------------------------------------------
// Legs
// ---------------------------------------------------------------------------

/** Cylinder from `base` to `tip`; four sides and a 45° twist make it square. */
function strut(base, tip, dBase, dTip, sides, twist = 0) {
  const dir = new THREE.Vector3().subVectors(tip, base)
  const len = dir.length() || 1e-3
  const g = new THREE.CylinderGeometry(Math.max(dTip, 0.2) / 2, Math.max(dBase, 0.2) / 2, len, sides)
  if (twist) g.rotateY(twist)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  g.applyQuaternion(q)
  g.translate((base.x + tip.x) / 2, (base.y + tip.y) / 2, (base.z + tip.z) / 2)
  return g
}

// Radius factors up a turned leg, floor to top: foot pad, a ring above it, the
// vase swelling under the neck, then a bead where the square block starts.
const TURNING = [
  [0.00, 0.00], [0.00, 0.74], [0.025, 0.80], [0.05, 0.72],
  [0.08, 0.54], [0.11, 0.64], [0.135, 0.58],
  [0.34, 0.62], [0.50, 0.78], [0.60, 0.90], [0.66, 0.84],
  [0.71, 0.60], [0.75, 0.72], [0.78, 0.68],
  [0.84, 0.64], [0.88, 0.70], [0.90, 0.62],
  [1.00, 0.62], [1.00, 0.00],
]

function turned(height, size, x, z, collar) {
  const points = TURNING.map(([f, r]) => new THREE.Vector2(Math.max(r * size * 0.5, 1e-3), f * height))
  const g = new THREE.LatheGeometry(points, 24)
  g.translate(x, 0, z)
  if (!collar) return g
  // A collar ring on the vase, for the top of the ornament range.
  const collarRing = new THREE.TorusGeometry(size * 0.44, size * 0.07, 8, 24)
  collarRing.rotateX(Math.PI / 2)
  collarRing.translate(x, height * 0.56, z)
  return merge([g, collarRing])
}

/** One leg standing at (x, z), from the floor up to `height`. */
function legGeometry(profile, height, size, x, z, taper, fancy) {
  const foot = size * taper
  const base = new THREE.Vector3(x, 0, z)
  const tip = new THREE.Vector3(x, height, z)
  if (profile === 'turned') return turned(height, size, x, z, fancy >= 5)
  if (profile === 'square') return strut(base, tip, size * Math.SQRT2, size * Math.SQRT2, 4, Math.PI / 4)
  if (profile === 'tapered') {
    return strut(base, tip, foot * Math.SQRT2, size * Math.SQRT2, 4, Math.PI / 4)
  }
  if (profile === 'fluted') {
    const shaft = strut(base, tip, foot, size, 20)
    const reeds = [shaft]
    const count = 12
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count
      const rTop = size * 0.5
      const rBottom = foot * 0.5
      reeds.push(
        strut(
          new THREE.Vector3(x + Math.cos(a) * rBottom, 0, z + Math.sin(a) * rBottom),
          new THREE.Vector3(x + Math.cos(a) * rTop, height, z + Math.sin(a) * rTop),
          size * 0.13,
          size * 0.13,
          6,
        ),
      )
    }
    return merge(reeds)
  }
  return strut(base, tip, foot, size, 20)
}

/** A pad or bun under a leg, from ornament level 2. */
function footPad(profile, size, x, z, fancy) {
  if (fancy < 2 || profile === 'turned') return null
  const square = profile === 'square' || profile === 'tapered'
  const h = size * 0.16
  const w = size * 1.18
  if (square) return box(w, h, w, x - w / 2, 0, z - w / 2)
  return post(w, h, x, 0, z, 20)
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const shape = str(p, 'shape')
  const height = num(p, 'height')
  const thickness = Math.min(num(p, 'thickness'), height - 20)
  const length = num(p, 'length')
  const width = ['rect', 'oval', 'racetrack'].includes(shape) ? num(p, 'width') : length
  const style = str(p, 'edgeStyle')
  const edgeSize = num(p, 'edgeSize')
  const border = str(p, 'border')
  const borderWidth = num(p, 'borderWidth')
  const leafStyle = str(p, 'leafStyle')
  const leafOpen = str(p, 'leafState') === 'open'
  const leafWidth = num(p, 'leafWidth')
  const leafCount = leafStyle === 'extension' ? Math.round(num(p, 'leafCount')) : 2
  const fancy = Math.round(num(p, 'fancy'))
  const topY = height - thickness
  const parts = []

  const base = planOutline(shape, length, width, num(p, 'cornerRadius'))
  const basePlan = plan(base)
  const bandWidth = border === 'banding' ? Math.min(borderWidth, basePlan.inradius * 0.4) : 0

  // --- The top, and how the leaves cut it up -------------------------------
  //
  // An extension leaf pulls the outline apart at the centre and fills the gap;
  // a drop leaf is cut out of the width and hinges down. Either way the top is
  // a list of slices, each swept with the same edge profile — so the seam of a
  // leaf is finished like the rest of the board, which is what a rule joint
  // looks like anyway.
  const extension = leafStyle === 'extension' && leafOpen ? leafCount * leafWidth : 0
  let outline = base
  if (extension > 0) {
    outline = ring(base.map((q) => ({ x: q.x + Math.sign(q.x || 1) * (extension / 2), z: q.z })))
  }

  let slices
  if (extension > 0) {
    const cuts = []
    for (let i = 0; i <= leafCount; i++) cuts.push(-extension / 2 + i * leafWidth)
    slices = slice(outline, 'x', cuts).map((pts, i) => ({
      pts,
      kind: i === 0 || i === leafCount + 1 ? 'top' : 'leaf',
    }))
  } else if (leafStyle === 'drop') {
    const hinge = Math.max(halfSpan(base) * 0.25, width / 2 - Math.min(leafWidth, width * 0.4))
    slices = slice(base, 'z', [-hinge, hinge]).map((pts, i) => ({
      pts,
      kind: i === 1 ? 'top' : 'leaf',
      hinge: i === 1 ? 0 : i === 0 ? -hinge : hinge,
    }))
  } else if (border === 'breadboard') {
    const end = Math.min(borderWidth, length * 0.2)
    slices = slice(base, 'x', [-length / 2 + end, length / 2 - end]).map((pts, i) => ({
      pts,
      kind: i === 1 ? 'top' : 'breadboard',
    }))
  } else {
    slices = [{ pts: basePlan, kind: 'top' }]
  }

  // --- What the base sits under, and what the mouldings follow -------------
  //
  // Corner and splayed legs travel with the halves of an extending table, so
  // they follow the extended outline; a pedestal or trestle stays put under the
  // centre. Drop leaves hang past their legs and past the apron, so both follow
  // the fixed centre — otherwise a moulding is left ringing thin air where the
  // leaves used to be.
  const arrangement = str(p, 'legArrangement')
  const travels = ['corner', 'splayed', 'hairpin'].includes(arrangement)
  let support = base
  if (extension > 0 && travels) support = outline
  if (leafStyle === 'drop') {
    const centre = slices.find((s) => s.kind === 'top')
    if (centre) support = centre.pts
  }
  const supportPlan = support === base ? basePlan : plan(support)

  const boards = { top: [], leaf: [], breadboard: [] }
  const bands = []
  for (const board of slices) {
    const built = topSlice(board.pts, topY, thickness, style, edgeSize, bandWidth)
    for (const [geometry, into] of [[built.board, boards[board.kind]], [built.band, bands]]) {
      if (!geometry) continue
      const swung =
        board.kind === 'leaf' && leafStyle === 'drop' && !leafOpen
          ? hingeDown(geometry, topY, board.hinge, 87)
          : geometry
      into.push(swung)
    }
  }
  if (boards.top.length) parts.push({ name: 'top', geometry: merge(boards.top), color: COLOR.top })
  if (boards.leaf.length) parts.push({ name: 'leaves', geometry: merge(boards.leaf), color: COLOR.leaf })
  if (boards.breadboard.length) {
    parts.push({ name: 'breadboard-ends', geometry: merge(boards.breadboard), color: COLOR.breadboard })
  }
  if (bands.length) parts.push({ name: 'banding', geometry: merge(bands), color: COLOR.band })

  if (border === 'lip') {
    const lipWidth = Math.min(borderWidth, supportPlan.inradius * 0.6)
    const lipHeight = num(p, 'lipHeight')
    const { depth } = edgeSection(style, thickness, edgeSize, supportPlan.inradius * 0.75)
    const inner = supportPlan.offset(depth)
    // Closed sections run anticlockwise in (inset, y), which is what puts the
    // outside of the ring on the outside.
    const lip = ringSolid(inner, [
      { inset: lipWidth, y: height },
      { inset: lipWidth, y: height + lipHeight },
      { inset: 0, y: height + lipHeight },
      { inset: 0, y: height },
    ])
    if (lip) parts.push({ name: 'lip', geometry: lip, color: COLOR.moulding })
  }

  const legSize = num(p, 'legThickness')
  const legInset = num(p, 'legInset')
  const legProfile = str(p, 'legProfile')
  const taper = ['tapered', 'round', 'fluted'].includes(legProfile) ? num(p, 'legTaper') : 1
  const splay = (num(p, 'splay') * Math.PI) / 180
  const legTop = topY

  // Corner legs sit on the outline pulled in by the inset plus half their own
  // thickness, then pushed to the furthest point in each quadrant — the corner
  // of a rectangle, the 45° of a circle.
  const legRing = supportPlan.offset(legInset + legSize / 2)
  const quadrants = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
  const legPoints = quadrants.map(([sx, sz]) => {
    const q = supportPoint(legRing, sx / Math.SQRT2, sz / Math.SQRT2)
    return { x: q.x, z: q.z }
  })

  const legs = []
  const feet = []
  const rails = []

  if (arrangement === 'corner' || arrangement === 'splayed') {
    for (const q of legPoints) {
      if (arrangement === 'splayed') {
        const radial = Math.hypot(q.x, q.z) || 1
        const kick = Math.tan(splay) * legTop
        const foot = new THREE.Vector3(q.x + (q.x / radial) * kick, 0, q.z + (q.z / radial) * kick)
        const tip = new THREE.Vector3(q.x, legTop, q.z)
        const square = legProfile === 'square' || legProfile === 'tapered'
        legs.push(
          strut(
            foot,
            tip,
            legSize * taper * (square ? Math.SQRT2 : 1),
            legSize * (square ? Math.SQRT2 : 1),
            square ? 4 : 20,
            square ? Math.PI / 4 : 0,
          ),
        )
      } else {
        legs.push(legGeometry(legProfile, legTop, legSize, q.x, q.z, taper, fancy))
        const pad = footPad(legProfile, legSize, q.x, q.z, fancy)
        if (pad) feet.push(pad)
      }
    }
  } else if (arrangement === 'hairpin') {
    const rod = Math.max(10, legSize * 0.22)
    for (const q of legPoints) {
      const radial = Math.hypot(q.x, q.z) || 1
      const kick = Math.tan(Math.max(splay, 0.12)) * legTop
      const nx = q.x / radial
      const nz = q.z / radial
      const plate = box(legSize, 10, legSize, q.x - legSize / 2, legTop - 10, q.z - legSize / 2)
      legs.push(plate)
      for (const spread of [1, -1]) {
        // Two rods per leg, splaying apart across the tangent as they fall.
        // A leaning rod is cut off square, so its foot sits just clear of the
        // floor rather than through it.
        const reach = Math.hypot(kick, kick * 0.45)
        const lean = Math.atan2(reach, legTop)
        const foot = new THREE.Vector3(
          q.x + nx * kick - nz * spread * kick * 0.45,
          (rod / 2) * Math.sin(lean),
          q.z + nz * kick + nx * spread * kick * 0.45,
        )
        legs.push(tube(rod, foot, new THREE.Vector3(q.x, legTop - 8, q.z), 10))
      }
    }
  } else if (arrangement === 'trestle') {
    const endX = Math.max(length / 2 - legInset - legSize, legSize)
    const footLength = Math.min(width, halfSpan(base) * 2) * 0.72
    const beamLength = footLength * 0.85
    for (const sx of [1, -1]) {
      const x = sx * endX
      legs.push(legGeometry(legProfile, legTop - 40, legSize * 1.5, x, 0, taper, fancy))
      // Foot on the floor and a beam under the top, both running across Z.
      feet.push(box(legSize * 1.2, legSize * 0.55, footLength, x - legSize * 0.6, 0, -footLength / 2))
      rails.push(box(legSize * 1.1, 40, beamLength, x - legSize * 0.55, legTop - 40, -beamLength / 2))
    }
    const stretcherY = legTop * 0.42
    rails.push(box(endX * 2, legSize * 0.7, legSize * 0.5, -endX, stretcherY, -legSize * 0.25))
    if (fancy >= 2) {
      for (const sx of [1, -1]) {
        rails.push(box(legSize * 0.4, legSize * 1.1, legSize * 0.7, sx * endX - legSize * 0.2, stretcherY - legSize * 0.2, -legSize * 0.35))
      }
    }
  } else {
    // Pedestal, or a pair of them.
    const columns = arrangement === 'twin' ? [-length * 0.26, length * 0.26] : [0]
    const spread = Math.min(halfSpan(base) * 1.1, (arrangement === 'twin' ? width : Math.min(length, width)) * 0.52)
    const columnSize = legSize * (arrangement === 'twin' ? 1.7 : 2.2)
    const plinth = Math.max(30, legSize * 0.5)
    // Outswept feet rather than a plain plinth once it is dressed up. The arms
    // are square in section, so their axis has to clear the floor by half a
    // diagonal or the corners cut through it — and the column starts at the hub
    // they meet at, rather than running past them to the floor.
    const swept = fancy >= 3
    const arm = legSize * 0.55
    const armY = (arm * Math.SQRT2) / 2 + 2
    const hubY = Math.max(armY + plinth * 0.5, columnSize * 0.42)
    const columnBase = swept ? hubY * 0.7 : plinth * 0.6
    for (const x of columns) {
      legs.push(
        legGeometry(legProfile, legTop - 30 - columnBase, columnSize, x, 0, taper, fancy)
          .translate(0, columnBase, 0),
      )
      if (swept) {
        const armCount = arrangement === 'twin' ? 2 : 4
        for (let i = 0; i < armCount; i++) {
          const a = (Math.PI * 2 * i) / armCount + (arrangement === 'twin' ? Math.PI / 2 : Math.PI / 4)
          const toe = { x: x + Math.cos(a) * spread * 0.9, z: Math.sin(a) * spread * 0.9 }
          feet.push(
            strut(
              new THREE.Vector3(toe.x, armY, toe.z),
              new THREE.Vector3(x, hubY, 0),
              arm,
              columnSize * 0.75,
              4,
              Math.PI / 4,
            ),
          )
          feet.push(post(legSize * 0.75, armY, toe.x, 0, toe.z, 16))
        }
      } else {
        feet.push(post(spread * 1.5, plinth, x, 0, 0, 32))
      }
      // Cleats crossing under the top, carrying it on the column. A twin
      // pedestal sits well off centre, so they are kept inside the top rather
      // than reaching the same distance either way.
      const reachX = Math.max(60, (length / 2 - Math.abs(x)) * 0.85)
      const reachZ = Math.max(60, halfSpan(base) * 0.85)
      const cleat = (w, d) => {
        const cw = Math.min(w, reachX * 2)
        const cd = Math.min(d, reachZ * 2)
        rails.push(box(cw, 30, cd, x - cw / 2, legTop - 30, -cd / 2))
      }
      cleat(columnSize * 2.2, spread * 1.4)
      cleat(spread * 1.2, columnSize * 1.6)
    }
    if (arrangement === 'twin') {
      rails.push(box(columns[1] - columns[0], legSize * 0.8, legSize * 0.6, columns[0], legTop * 0.35, -legSize * 0.3))
    }
  }

  // --- Stretchers between four legs ---------------------------------------
  const stretcher = str(p, 'stretcher')
  if ((arrangement === 'corner' || arrangement === 'splayed') && stretcher !== 'none') {
    const y = Math.min(num(p, 'stretcherHeight'), legTop - 40)
    const t = Math.max(18, legSize * 0.45)
    const at = (i) => {
      const q = legPoints[i]
      if (arrangement !== 'splayed') return new THREE.Vector3(q.x, y, q.z)
      // Follow the leg out as it splays, so the rail meets it.
      const radial = Math.hypot(q.x, q.z) || 1
      const kick = Math.tan(splay) * (legTop - y)
      return new THREE.Vector3(q.x + (q.x / radial) * kick, y, q.z + (q.z / radial) * kick)
    }
    const rail = (a, b) => strut(a, b, t, t, 4, Math.PI / 4)
    if (stretcher === 'box') {
      for (let i = 0; i < 4; i++) rails.push(rail(at(i), at((i + 1) % 4)))
    } else if (stretcher === 'x') {
      rails.push(rail(at(0), at(2)))
      rails.push(rail(at(1), at(3)))
    } else {
      // H: a rail down each side and one across the middle.
      rails.push(rail(at(0), at(1)))
      rails.push(rail(at(2), at(3)))
      const midA = at(0).lerp(at(1), 0.5)
      const midB = at(2).lerp(at(3), 0.5)
      rails.push(rail(midA, midB))
    }
  }

  // --- Apron --------------------------------------------------------------
  //
  // A closed cross-section swept round the support outline, so it needs no
  // caps. From ornament level 2 the bottom edge of that section rises between
  // the legs, which is the arch of a shaped apron — and because it is driven by
  // arc length rather than by sides, it works on a round top too.
  if (bool(p, 'apron') && arrangement !== 'hairpin' && arrangement !== 'trestle') {
    const apronDepth = Math.min(num(p, 'apronDepth'), legTop - 30)
    const apronThickness = num(p, 'apronThickness')
    const apronInset = Math.min(num(p, 'apronInset'), supportPlan.inradius * 0.4)
    const isPedestal = arrangement === 'pedestal' || arrangement === 'twin'
    const outer = supportPlan.offset(apronInset)
    const outerPlan = plan(outer)
    const arch = fancy >= 2 ? Math.min(apronDepth * 0.5, 70) : 0

    // Where the apron has to stay full depth: at the legs, or at the quarters
    // of a pedestal top, which is where a shaped skirt reads best.
    const anchors = []
    const anchorPoints = isPedestal
      ? quadrants.map(([sx, sz]) => supportPoint(outer, sx / Math.SQRT2, sz / Math.SQRT2))
      : legPoints
    const arcs = []
    let run = 0
    for (let i = 0; i < outer.length; i++) {
      arcs.push(run)
      const a = outer[i]
      const b = outer[(i + 1) % outer.length]
      run += Math.hypot(b.x - a.x, b.z - a.z)
    }
    for (const q of anchorPoints) {
      let best = 0
      let bestD = Infinity
      for (let i = 0; i < outer.length; i++) {
        const d = Math.hypot(outer[i].x - q.x, outer[i].z - q.z)
        if (d < bestD) {
          bestD = d
          best = i
        }
      }
      anchors.push(arcs[best])
    }
    anchors.sort((a, b) => a - b)

    const dropAt = (i) => {
      if (!arch || anchors.length < 2) return 0
      const s = arcs[i]
      let lo = anchors[anchors.length - 1] - run
      let hi = anchors[0]
      for (let k = 0; k < anchors.length; k++) {
        if (anchors[k] <= s) {
          lo = anchors[k]
          hi = k + 1 < anchors.length ? anchors[k + 1] : anchors[0] + run
        }
      }
      const span = hi - lo || 1
      const t = Math.min(1, Math.max(0, (s - lo) / span))
      return arch * Math.pow(Math.sin(Math.PI * t), 0.7)
    }

    const yTop = topY
    const sectionAt = (i) => {
      const yBottom = yTop - apronDepth + dropAt(i)
      return [
        { inset: 0, y: yTop },
        { inset: 0, y: yBottom },
        { inset: apronThickness, y: yBottom },
        { inset: apronThickness, y: yTop },
      ]
    }
    const skirt = sweep(outerPlan, sectionAt, true)
    if (skirt) parts.push({ name: 'apron', geometry: skirt, color: COLOR.apron })

    if (fancy >= 1) {
      // A bead run along the bottom edge of the apron.
      const bead = sweep(
        outerPlan,
        (i) => beadSection(apronThickness * 0.2, yTop - apronDepth + dropAt(i) + apronThickness * 0.22, apronThickness * 0.22),
        true,
      )
      if (bead) parts.push({ name: 'apron-bead', geometry: bead, color: COLOR.moulding })
    }
  }

  // --- Mouldings under the top edge ---------------------------------------
  if (fancy >= 3) {
    const { depth } = edgeSection(style, thickness, edgeSize, supportPlan.inradius * 0.75)
    const reveal = Math.max(12, thickness * 0.5)
    const cornice = ringSolid(supportPlan, [
      { inset: depth * 0.15, y: topY },
      { inset: depth * 0.15, y: topY - reveal },
      { inset: reveal * 1.4, y: topY - reveal * 1.5 },
      { inset: reveal * 1.4, y: topY },
    ])
    const mouldings = [cornice]
    if (fancy >= 5) {
      mouldings.push(ringSolid(supportPlan.offset(reveal * 1.4), beadSection(0, topY - reveal * 1.9, reveal * 0.35)))
    }
    const solid = merge(mouldings.filter(Boolean))
    if (triangleCount(solid) > 0) parts.push({ name: 'moulding', geometry: solid, color: COLOR.moulding })
  }

  // --- Corbels at the legs -------------------------------------------------
  //
  // Two brackets per leg, one for each apron run leaving it. They curve down
  // from the underside of the top to the face of the leg and run *inwards*
  // along the apron — a bracket that reached outwards would hang off the edge
  // of the table.
  if (fancy >= 4 && ['corner', 'splayed'].includes(arrangement)) {
    const brackets = []
    const r = Math.max(legSize * 0.8, 40)
    const t = legSize * 0.35
    const bracket = () => {
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.lineTo(r, 0)
      shape.quadraticCurveTo(0, 0, 0, -r)
      shape.closePath()
      const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 8 })
      // Drawn reaching along +X and hanging down; extruded across its thickness.
      g.translate(0, 0, -t / 2)
      return g
    }
    for (const q of legPoints) {
      const sx = Math.sign(q.x) || 1
      const sz = Math.sign(q.z) || 1

      const alongX = bracket()
      if (sx > 0) alongX.rotateY(Math.PI)
      alongX.translate(q.x - sx * legSize * 0.5, topY, q.z + sz * (legSize * 0.5 - t / 2))
      brackets.push(alongX)

      const alongZ = bracket()
      alongZ.rotateY(sz > 0 ? Math.PI / 2 : -Math.PI / 2)
      alongZ.translate(q.x + sx * (legSize * 0.5 - t / 2), topY, q.z - sz * legSize * 0.5)
      brackets.push(alongZ)
    }
    if (brackets.length) parts.push({ name: 'corbels', geometry: merge(brackets), color: COLOR.leg })
  }

  if (legs.length) parts.push({ name: 'legs', geometry: merge(legs), color: COLOR.leg })
  if (feet.length) parts.push({ name: 'feet', geometry: merge(feet), color: COLOR.leg })
  if (rails.length) parts.push({ name: 'rails', geometry: merge(rails), color: COLOR.stretcher })

  return parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
}

export function metrics(p) {
  const shape = str(p, 'shape')
  const length = num(p, 'length')
  const width = ['rect', 'oval', 'racetrack'].includes(shape) ? num(p, 'width') : length
  const height = num(p, 'height')
  const thickness = num(p, 'thickness')
  const leafStyle = str(p, 'leafStyle')
  const open = str(p, 'leafState') === 'open'
  const extension = leafStyle === 'extension' && open ? Math.round(num(p, 'leafCount')) * num(p, 'leafWidth') : 0
  const dropped = leafStyle === 'drop' && !open ? Math.min(num(p, 'leafWidth'), width * 0.4) * 2 : 0

  const base = planOutline(shape, length + extension, width - dropped, num(p, 'cornerRadius'))
  const seats = Math.max(2, Math.floor(perimeter(base) / 620))

  const apron = bool(p, 'apron') && !['hairpin', 'trestle'].includes(str(p, 'legArrangement'))
  const knee = height - thickness - (apron ? num(p, 'apronDepth') : 0)
  const kneeLevel = knee < 580 ? 'error' : knee < 620 ? 'warn' : 'ok'

  const use =
    height < 550 ? 'coffee' : height < 800 ? 'dining or desk' : height < 980 ? 'counter' : 'bar'

  // Area by the shoelace formula, so it follows whatever the outline is.
  let area = 0
  for (let i = 0; i < base.length; i++) {
    const a = base[i]
    const b = base[(i + 1) % base.length]
    area += a.x * b.z - b.x * a.z
  }
  area = Math.abs(area) / 2 / 1e6

  return [
    {
      label: 'Top',
      value: `${formatLength(length + extension)} × ${formatLength(width - dropped)}`,
      note: extension ? 'With the leaves in.' : dropped ? 'With the leaves down.' : undefined,
    },
    { label: 'Top area', value: `${area.toFixed(2)} m²` },
    { label: 'Height', value: `${formatLength(height)} — ${use}` },
    {
      label: 'Knee clearance',
      value: formatLength(knee),
      level: kneeLevel,
      note: kneeLevel === 'ok' ? undefined : 'Under the apron. Chair arms want about 620 mm.',
    },
    { label: 'Places', value: `${seats} at 620 mm each` },
  ]
}

// Named property sets the object ships with. Each lists only what it changes.
export const presets = [
  {
    name: 'Farmhouse dining',
    params: {
      shape: 'rect', length: 2000, width: 950, thickness: 45, cornerRadius: 0,
      edgeStyle: 'chamfer', edgeSize: 6, border: 'breadboard', borderWidth: 110,
      legArrangement: 'corner', legProfile: 'tapered', legThickness: 90, legTaper: 0.7,
      apronDepth: 110, apronInset: 30, fancy: 1,
    },
  },
  {
    name: 'Georgian extending',
    params: {
      shape: 'oval', length: 1700, width: 1050, thickness: 32,
      edgeStyle: 'ogee', edgeSize: 16, border: 'banding', borderWidth: 70,
      leafStyle: 'extension', leafCount: 2, leafWidth: 350, leafState: 'open',
      legArrangement: 'corner', legProfile: 'turned', legThickness: 85, apronDepth: 100, fancy: 5,
    },
  },
  {
    name: 'Round pedestal café',
    params: {
      shape: 'round', length: 800, thickness: 26, height: 740,
      edgeStyle: 'bullnose', border: 'none',
      legArrangement: 'pedestal', legProfile: 'turned', legThickness: 80,
      apron: false, fancy: 3,
    },
  },
  {
    name: 'Pembroke drop-leaf',
    params: {
      shape: 'racetrack', length: 900, width: 1000, thickness: 22, height: 730,
      edgeStyle: 'rounded', edgeSize: 8,
      leafStyle: 'drop', leafWidth: 300, leafState: 'closed',
      legArrangement: 'corner', legProfile: 'turned', legThickness: 55,
      apronDepth: 80, apronInset: 15, fancy: 4,
    },
  },
  {
    name: 'Trestle work table',
    params: {
      shape: 'rect', length: 2200, width: 800, thickness: 50, cornerRadius: 0,
      edgeStyle: 'square', border: 'none',
      legArrangement: 'trestle', legProfile: 'square', legThickness: 100, legInset: 300,
      apron: false, fancy: 0,
    },
  },
  {
    name: 'Hairpin coffee table',
    params: {
      shape: 'racetrack', length: 1100, width: 600, thickness: 20, height: 430,
      edgeStyle: 'rounded', edgeSize: 6, border: 'none',
      legArrangement: 'hairpin', legThickness: 60, legInset: 60, splay: 14,
      apron: false, fancy: 0,
    },
  },
  {
    name: 'Octagonal games table',
    params: {
      shape: 'octagon', length: 1100, thickness: 30, height: 745,
      edgeStyle: 'cove', edgeSize: 14, border: 'lip', borderWidth: 90, lipHeight: 14,
      legArrangement: 'twin', legProfile: 'fluted', legThickness: 70,
      apron: true, apronDepth: 95, fancy: 4,
    },
  },
]
