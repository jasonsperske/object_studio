// Chair.
//
// Made to sit at the table, and built the same way: the seat is one closed
// outline in the XZ plane, and the moulded edge, the cushion and the seat frame
// are all cross-sections swept around it. The back is a separate matter — it is
// drawn flat, as boards standing in a plane, and then the whole assembly is
// tipped backwards by the rake angle about the back edge of the seat.
//
// The seat depth runs along +X with the back at the rear, its width along +Z,
// per the studio convention, and the floor is at Y = 0. The edge profiles and
// leg profiles are the ones the table uses, so a chair drawn at the same
// fanciness sits with it rather than beside it.
//
// The plan-outline algebra below — miter offsets, the sweep, the flat faces —
// is the same as the table's. Object files are standalone by design: they are
// evaluated on their own with only the studio helpers in scope, so shared
// working like this lives in each file that needs it.

export const meta = {
  order: 6,
  name: 'Chair',
  description:
    'A chair for the table — four seat shapes with the same moulded edges, seven backs from ladder to upholstered, five leg profiles including cabriole, optional arms, and the same fanciness dial.',
}

const COLOR = {
  seat: 0xc79155,
  frame: 0xa87f4d,
  back: 0xb98a54,
  detail: 0xd8ab72,
  rail: 0x9c7a4c,
}

const FABRIC = {
  linen: 0xd6c9ae,
  sage: 0x7c8a6f,
  oxblood: 0x6e2b2b,
  charcoal: 0x43464c,
  teal: 0x2f5f66,
}

export const params = [
  // --- Seat ---------------------------------------------------------------
  {
    id: 'seatShape',
    label: 'Seat shape',
    type: 'select',
    default: 'trapezoid',
    group: 'Seat',
    options: [
      { value: 'square', label: 'Square' },
      { value: 'trapezoid', label: 'Trapezoid — narrower at the back' },
      { value: 'bowfront', label: 'Bow front' },
      { value: 'round', label: 'Round' },
    ],
  },
  { id: 'seatWidth', label: 'Seat width', type: 'number', min: 260, max: 700, step: 5, default: 450, unit: 'mm', group: 'Seat', help: 'Across +Z, at the front.' },
  { id: 'seatDepth', label: 'Seat depth', type: 'number', min: 260, max: 700, step: 5, default: 430, unit: 'mm', group: 'Seat' },
  { id: 'seatHeight', label: 'Seat height', type: 'number', min: 250, max: 800, step: 5, default: 460, unit: 'mm', group: 'Seat', help: 'Floor to the top of the seat. 450 sits at a 750 table.' },
  { id: 'seatThickness', label: 'Seat thickness', type: 'number', min: 12, max: 90, step: 1, default: 34, unit: 'mm', group: 'Seat' },
  { id: 'seatTaper', label: 'Taper to the back', type: 'number', min: 0, max: 200, step: 5, default: 60, unit: 'mm', group: 'Seat', visibleWhen: (p) => ['trapezoid', 'bowfront'].includes(str(p, 'seatShape')) },
  { id: 'cornerRadius', label: 'Corner radius', type: 'number', min: 0, max: 150, step: 1, default: 30, unit: 'mm', group: 'Seat', visibleWhen: (p) => str(p, 'seatShape') !== 'round' },
  {
    id: 'edgeStyle',
    label: 'Edge profile',
    type: 'select',
    default: 'rounded',
    group: 'Seat',
    help: 'The same profiles the table edge and the stair treads use.',
    options: [
      { value: 'square', label: 'Square' },
      { value: 'chamfer', label: 'Chamfer' },
      { value: 'rounded', label: 'Round-over' },
      { value: 'bullnose', label: 'Bullnose' },
      { value: 'cove', label: 'Cove' },
      { value: 'ogee', label: 'Ogee' },
    ],
  },
  { id: 'edgeSize', label: 'Profile size', type: 'number', min: 0, max: 30, step: 0.5, default: 8, unit: 'mm', group: 'Seat', visibleWhen: (p) => !['square', 'bullnose'].includes(str(p, 'edgeStyle')) },

  // --- Back ---------------------------------------------------------------
  {
    id: 'backStyle',
    label: 'Back',
    type: 'select',
    default: 'ladder',
    group: 'Back',
    options: [
      { value: 'open', label: 'Open — posts and a crest only' },
      { value: 'ladder', label: 'Ladder — horizontal slats' },
      { value: 'spindle', label: 'Spindle — vertical sticks' },
      { value: 'splat', label: 'Splat — one shaped centre board' },
      { value: 'cross', label: 'Cross — diagonal rails' },
      { value: 'panel', label: 'Panel — solid board' },
      { value: 'upholstered', label: 'Upholstered panel' },
    ],
  },
  { id: 'backHeight', label: 'Back height', type: 'number', min: 100, max: 900, step: 5, default: 470, unit: 'mm', group: 'Back', help: 'Above the seat.' },
  { id: 'backRake', label: 'Rake', type: 'number', min: 0, max: 22, step: 0.5, default: 8, unit: '°', group: 'Back', help: 'How far the back leans away from vertical.' },
  { id: 'backFill', label: 'Slats or spindles', type: 'int', min: 1, max: 11, step: 1, default: 4, group: 'Back', visibleWhen: (p) => ['ladder', 'spindle'].includes(str(p, 'backStyle')) },
  {
    id: 'crestStyle',
    label: 'Crest rail',
    type: 'select',
    default: 'arched',
    group: 'Back',
    options: [
      { value: 'straight', label: 'Straight' },
      { value: 'arched', label: 'Arched' },
      { value: 'yoke', label: 'Yoke — dipped in the middle' },
    ],
  },

  // --- Legs ---------------------------------------------------------------
  {
    id: 'legProfile',
    label: 'Leg profile',
    type: 'select',
    default: 'tapered',
    group: 'Legs',
    options: [
      { value: 'square', label: 'Square' },
      { value: 'tapered', label: 'Square, tapered' },
      { value: 'round', label: 'Round, tapered' },
      { value: 'turned', label: 'Turned — beads and a vase' },
      { value: 'cabriole', label: 'Cabriole — curved, on a pad foot' },
    ],
  },
  { id: 'legThickness', label: 'Leg thickness', type: 'number', min: 16, max: 90, step: 1, default: 38, unit: 'mm', group: 'Legs' },
  { id: 'legTaper', label: 'Taper to foot', type: 'number', min: 0.3, max: 1, step: 0.01, default: 0.7, group: 'Legs', visibleWhen: (p) => ['tapered', 'round'].includes(str(p, 'legProfile')) },
  { id: 'splay', label: 'Splay', type: 'number', min: 0, max: 18, step: 0.5, default: 4, unit: '°', group: 'Legs', help: 'How far the feet stand outside the seat.' },
  { id: 'rearPost', label: 'Back legs run up into the back', type: 'boolean', default: true, group: 'Legs', help: 'Off puts the back posts on the seat instead, as a Windsor does.' },
  {
    id: 'stretcher',
    label: 'Stretchers',
    type: 'select',
    default: 'h',
    group: 'Legs',
    options: [
      { value: 'none', label: 'None' },
      { value: 'h', label: 'H — side rails and a centre rail' },
      { value: 'box', label: 'Box — a rail on all four sides' },
      { value: 'double', label: 'Double — two rails across the front' },
    ],
  },
  { id: 'stretcherHeight', label: 'Stretcher height', type: 'number', min: 40, max: 400, step: 5, default: 170, unit: 'mm', group: 'Legs', visibleWhen: (p) => str(p, 'stretcher') !== 'none' },

  // --- Arms ---------------------------------------------------------------
  { id: 'arms', label: 'Arms', type: 'boolean', default: false, group: 'Arms' },
  { id: 'armHeight', label: 'Arm height', type: 'number', min: 100, max: 350, step: 5, default: 210, unit: 'mm', group: 'Arms', help: 'Above the seat.', visibleWhen: (p) => bool(p, 'arms') },

  // --- Upholstery & ornament ----------------------------------------------
  {
    id: 'seatPad',
    label: 'Seat',
    type: 'select',
    default: 'none',
    group: 'Upholstery & ornament',
    options: [
      { value: 'none', label: 'Bare board' },
      { value: 'over', label: 'Squab — a cushion laid on top' },
      { value: 'dropIn', label: 'Drop-in — a pad inside a seat frame' },
      { value: 'full', label: 'Fully upholstered over the frame' },
    ],
  },
  { id: 'padThickness', label: 'Pad thickness', type: 'number', min: 10, max: 140, step: 2, default: 46, unit: 'mm', group: 'Upholstery & ornament', visibleWhen: (p) => str(p, 'seatPad') !== 'none' },
  {
    id: 'padColor',
    label: 'Upholstery',
    type: 'select',
    default: 'sage',
    group: 'Upholstery & ornament',
    visibleWhen: (p) => str(p, 'seatPad') !== 'none' || str(p, 'backStyle') === 'upholstered',
    options: [
      { value: 'linen', label: 'Linen' },
      { value: 'sage', label: 'Sage' },
      { value: 'oxblood', label: 'Oxblood' },
      { value: 'charcoal', label: 'Charcoal' },
      { value: 'teal', label: 'Teal' },
    ],
  },
  {
    id: 'fancy',
    label: 'Fanciness',
    type: 'int',
    min: 0,
    max: 5,
    step: 1,
    default: 1,
    group: 'Upholstery & ornament',
    help: '1 beads the seat edge, 2 shapes the back boards and pads the feet, 3 adds corbels and scrolls the arms, 4 turns finials and rings, 5 carves the crest and buttons the upholstery.',
  },
]

// ---------------------------------------------------------------------------
// Plan outlines
//
// An outline is an array of {x, z}, closed implicitly and wound anticlockwise
// in the XZ plane (the sense of (cos t, sin t)). Everything below relies on
// that winding for its face normals, so `ring` enforces it.
// ---------------------------------------------------------------------------

// Points closer together than this are the same point; anything finer only
// feeds degenerate edges, whose direction is noise, into the normals below.
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

/** Convex hull, anticlockwise — used to repair an offset that has knotted. */
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
  const chain = half(pts).concat(half(pts.slice().reverse()))
  return chain.length >= 3 ? ring(chain) : ring(points)
}

/** Replaces each corner of a polygon with an arc tangent to both of its edges. */
function roundCorners(pts, radius, steps = 5) {
  if (radius < 0.5) return ring(pts)
  const n = pts.length
  const out = []
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
    // A corner that barely turns — a point along a sampled curve — is left be.
    if (!(angle > 0.08 && angle < Math.PI - 0.08)) {
      out.push(q)
      continue
    }
    const half = Math.tan(angle / 2)
    const cut = Math.min(radius / half, la * 0.5, lb * 0.5)
    const r = cut * half
    if (r < 0.5) {
      out.push(q)
      continue
    }
    const bisector = { x: a.x + b.x, z: a.z + b.z }
    const lb2 = Math.hypot(bisector.x, bisector.z) || 1
    const centre = {
      x: q.x + (bisector.x / lb2) * (r / Math.sin(angle / 2)),
      z: q.z + (bisector.z / lb2) * (r / Math.sin(angle / 2)),
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

/**
 * The seat in plan. The front edge is at -X and the back at +X, so a trapezoid
 * narrows toward the back and a bow front bulges toward the sitter.
 */
function seatOutline(shape, depth, width, taper, radius) {
  const d = depth / 2
  const w = width / 2
  if (shape === 'round') {
    const pts = []
    for (let i = 0; i < 64; i++) {
      const a = (Math.PI * 2 * i) / 64
      pts.push({ x: d * Math.cos(a), z: w * Math.sin(a) })
    }
    return ring(pts)
  }
  const back = Math.max(w - (shape === 'square' ? 0 : taper / 2), w * 0.25)
  const pts = [{ x: d, z: -back }, { x: d, z: back }]
  if (shape === 'bowfront') {
    // The front edge swept forward on an arc through its ends and its middle.
    // It bulges up to the stated depth rather than beyond it, so the number on
    // the slider is still the depth of the seat.
    const bow = depth * 0.1
    const steps = 12
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      pts.push({ x: -d + bow * (1 - Math.sin(Math.PI * t)), z: w * (1 - 2 * t) })
    }
  } else {
    pts.push({ x: -d, z: w }, { x: -d, z: -w })
  }
  return roundCorners(ring(pts), radius)
}

// ---------------------------------------------------------------------------
// Working on an outline
// ---------------------------------------------------------------------------

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
    if (dot < -0.9) return { x: b.x, z: b.z }
    const s = 1 + dot
    return { x: (a.x + b.x) / s, z: (a.z + b.z) / s }
  })
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
 * and cached against it. A plain miter offset turns itself inside out wherever
 * a corner is rounded tighter than the inset, so every offset point is then
 * pushed back inside the half-plane of any edge it has crossed.
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

/** Whether a point sits inside a convex outline — every one here is convex. */
function contains(pts, x, z) {
  for (const l of edgeLines(pts)) {
    if (l.nx * x + l.nz * z - l.c < 0) return false
  }
  return true
}

/** The point of the outline furthest in a direction. */
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

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

/** A flat horizontal face over a set of contours; the first is the outer one. */
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
 * absolute. `closed` wraps the last section point back to the first, giving a
 * solid ring that needs no caps; left open, the ends want a `face` each.
 */
function sweep(outline, section, closed) {
  const planned = asPlan(outline)
  const n = planned.pts.length
  const at = (i, s) => {
    const q = planned.offset(s.inset)[i]
    return { x: q.x, y: s.y, z: q.z }
  }
  const position = []
  const push = (a, b, c) => position.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
  const k = section.length
  const last = closed ? k : k - 1
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    for (let s = 0; s < last; s++) {
      const t = (s + 1) % k
      const a = at(i, section[s])
      const b = at(j, section[s])
      const c = at(j, section[t])
      const d = at(i, section[t])
      if (Math.hypot(a.x - d.x, a.y - d.y, a.z - d.z) < 1e-6) continue
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

/** A circular cross-section — a bead run around an edge. */
function beadSection(inset, y, radius, steps = 10) {
  const section = []
  for (let i = 0; i < steps; i++) {
    const a = (Math.PI * 2 * i) / steps
    section.push({ inset: inset + radius * Math.cos(a), y: y + radius * Math.sin(a) })
  }
  return section
}

/**
 * The edge treatment, taken from the shared board profile and re-read as insets
 * from the outline: the section from the top face round the edge to the bottom
 * one, plus the depth the flat faces are held back by.
 */
function edgeSection(style, thickness, size, limit) {
  const depth = Math.min(Math.max(thickness, size * 2, 0.5), Math.max(limit, 1))
  const raw = boardProfile(depth, thickness, style, size).extractPoints(16).shape
  const section = []
  for (const q of raw) {
    const s = { inset: Math.max(0, depth - q.x), y: q.y }
    const prev = section[section.length - 1]
    if (prev && Math.abs(prev.inset - s.inset) < 1e-6 && Math.abs(prev.y - s.y) < 1e-6) continue
    section.push(s)
  }
  const first = section[0]
  const end = section[section.length - 1]
  // The profile comes back as a closed loop; dropping the point that closes it
  // leaves an open run, which the sweep wants to walk from the top down.
  if (section.length > 2 && Math.abs(first.inset - end.inset) < 1e-6 && Math.abs(first.y - end.y) < 1e-6) {
    section.pop()
  }
  if (section.length < 2) return { depth, section: [{ inset: depth, y: thickness }, { inset: depth, y: 0 }] }
  if (section[0].y < section[section.length - 1].y) section.reverse()
  return { depth, section }
}

/** A board: the edge profile swept round the outline, with a face top and bottom. */
function board(outline, y0, thickness, style, size) {
  const planned = asPlan(outline)
  const { depth, section } = edgeSection(style, thickness, size, planned.inradius * 0.75)
  const raised = section.map((s) => ({ inset: s.inset, y: s.y + y0 }))
  const inner = hull(planned.offset(depth))
  return merge(
    [
      sweep(planned, raised, false),
      face([inner], y0 + thickness, true),
      face([inner], y0, false),
    ].filter(Boolean),
  )
}

/** A frame under the seat: a closed section swept round, so it needs no caps. */
function frameRing(outline, yTop, depth, width) {
  return sweep(
    outline,
    [
      { inset: 0, y: yTop },
      { inset: 0, y: yTop - depth },
      { inset: width, y: yTop - depth },
      { inset: width, y: yTop },
    ],
    true,
  )
}

// ---------------------------------------------------------------------------
// Members
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

// Radius factors up a turned member, foot to top: pad foot, a ring above it,
// the vase under the seat, and a bead where the square block would start.
const TURNING = [
  [0.00, 0.00], [0.00, 0.74], [0.03, 0.80], [0.06, 0.70],
  [0.10, 0.52], [0.13, 0.62], [0.16, 0.56],
  [0.38, 0.60], [0.54, 0.78], [0.64, 0.90], [0.70, 0.82],
  [0.75, 0.58], [0.79, 0.70], [0.82, 0.66],
  [0.88, 0.62], [0.92, 0.68], [0.94, 0.60],
  [1.00, 0.60], [1.00, 0.00],
]

function turned(height, size, x, z, rings) {
  const points = TURNING.map(([f, r]) => new THREE.Vector2(Math.max(r * size * 0.5, 1e-3), f * height))
  const g = new THREE.LatheGeometry(points, 20)
  g.translate(x, 0, z)
  if (!rings) return g
  const collar = new THREE.TorusGeometry(size * 0.42, size * 0.08, 8, 20)
  collar.rotateX(Math.PI / 2)
  collar.translate(x, height * 0.6, z)
  return merge([g, collar])
}

// A cabriole leg in section, floor to seat: how far the leg stands out from
// the corner, and how thick it is there. It is heavy at the knee just under the
// seat, drawn in and slender at the ankle, and flares back out onto a pad foot.
const CABRIOLE = [
  [0.00, 0.55, 0.55],
  [0.10, 0.10, 0.44],
  [0.32, -0.06, 0.56],
  [0.58, 0.48, 0.80],
  [0.78, 1.00, 0.98],
  [1.00, 0.42, 1.00],
]

/**
 * A cabriole leg, swept along a curve through those control points and built as
 * a chain of tapered links, with a ball at each joint so the links do not gap
 * on the outside of a bend.
 */
function cabriole(height, size, x, z, outX, outZ) {
  const links = []
  // The chain starts on top of the pad, so that the first link — cut off square
  // to a leaning axis — cannot dip through the floor.
  const padHeight = size * 0.22
  const reach = Math.min(size * 1.3, height * 0.11)
  const control = CABRIOLE.map(([t, out]) =>
    new THREE.Vector3(
      x + outX * out * reach,
      padHeight + (height - padHeight) * t,
      z + outZ * out * reach,
    ),
  )
  const curve = new THREE.CatmullRomCurve3(control)
  const samples = 14
  // Thickness reads off the same control points, by height rather than by curve
  // length, which is close enough over a leg this short.
  const diameter = (t) => {
    for (let i = 1; i < CABRIOLE.length; i++) {
      if (t <= CABRIOLE[i][0] || i === CABRIOLE.length - 1) {
        const [t0, , d0] = CABRIOLE[i - 1]
        const [t1, , d1] = CABRIOLE[i]
        const f = Math.max(0, Math.min(1, (t - t0) / (t1 - t0 || 1)))
        return size * (d0 + (d1 - d0) * f)
      }
    }
    return size
  }
  let previous = curve.getPoint(0)
  for (let i = 1; i <= samples; i++) {
    const t = i / samples
    const point = curve.getPoint(t)
    links.push(strut(previous, point, diameter((i - 1) / samples), diameter(t), 12))
    if (i > 1) {
      const joint = new THREE.SphereGeometry(diameter((i - 1) / samples) / 2, 10, 6)
      joint.translate(previous.x, previous.y, previous.z)
      links.push(joint)
    }
    previous = point
  }
  const foot = control[0]
  links.push(post(size * 1.2, padHeight * 1.1, foot.x, 0, foot.z, 16))
  return merge(links)
}

/** One leg standing at (x, z), from the floor up to `height`. */
function legGeometry(profile, height, size, x, z, taper, fancy, outX, outZ) {
  const foot = size * taper
  const base = new THREE.Vector3(x, 0, z)
  const tip = new THREE.Vector3(x, height, z)
  if (profile === 'turned') return turned(height, size, x, z, fancy >= 4)
  if (profile === 'cabriole') return cabriole(height, size, x, z, outX, outZ)
  if (profile === 'square') return strut(base, tip, size * Math.SQRT2, size * Math.SQRT2, 4, Math.PI / 4)
  if (profile === 'tapered') return strut(base, tip, foot * Math.SQRT2, size * Math.SQRT2, 4, Math.PI / 4)
  return strut(base, tip, foot, size, 16)
}

/**
 * A board standing in the plane of the back: drawn in (across, up) and given
 * its thickness along X. Shapes are mirrored across Z on the way in, which
 * matters to nothing here — every one of them is symmetrical.
 */
function plate(shape, thickness, x, curveSegments = 10) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments })
  g.rotateY(Math.PI / 2)
  g.translate(x, 0, 0)
  return g
}

/** Tips a piece of the back away from the sitter, about the seat's back edge. */
function rake(geometry, angle, pivotX, pivotY) {
  geometry.translate(-pivotX, -pivotY, 0)
  geometry.rotateZ(-angle)
  geometry.translate(pivotX, pivotY, 0)
  return geometry
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const shape = str(p, 'seatShape')
  const seatWidth = num(p, 'seatWidth')
  const seatDepth = num(p, 'seatDepth')
  const seatHeight = num(p, 'seatHeight')
  const seatThickness = Math.min(num(p, 'seatThickness'), seatHeight - 40)
  const style = str(p, 'edgeStyle')
  const edgeSize = num(p, 'edgeSize')
  const legSize = num(p, 'legThickness')
  const legProfile = str(p, 'legProfile')
  const taper = ['tapered', 'round'].includes(legProfile) ? num(p, 'legTaper') : 1
  const splay = (num(p, 'splay') * Math.PI) / 180
  const backStyle = str(p, 'backStyle')
  const backHeight = num(p, 'backHeight')
  const backRake = (num(p, 'backRake') * Math.PI) / 180
  const crestStyle = str(p, 'crestStyle')
  const pad = str(p, 'seatPad')
  const padThickness = num(p, 'padThickness')
  const fabric = FABRIC[str(p, 'padColor')] ?? FABRIC.sage
  const fancy = Math.round(num(p, 'fancy'))
  const parts = []

  const seat = seatOutline(shape, seatDepth, seatWidth, num(p, 'seatTaper'), num(p, 'cornerRadius'))
  const seatPlan = plan(seat)
  const seatTop = seatHeight
  const seatBottom = seatTop - seatThickness

  // --- The seat ------------------------------------------------------------
  //
  // A bare or squab seat is a solid board. Once there is a pad set into it the
  // board becomes a frame — the same closed section swept round the outline
  // that the table uses for its apron — and the pad drops inside it.
  const framed = pad === 'dropIn' || pad === 'full'
  const railWidth = Math.max(legSize, seatPlan.inradius * 0.3)
  if (framed) {
    const railDepth = Math.max(seatThickness, 55)
    const ringSolid = frameRing(seatPlan, seatTop, railDepth, railWidth)
    if (ringSolid) parts.push({ name: 'seat-frame', geometry: ringSolid, color: COLOR.frame })
  } else {
    parts.push({
      name: 'seat',
      geometry: board(seatPlan, seatBottom, seatThickness, style, edgeSize),
      color: COLOR.seat,
    })
  }

  if (pad !== 'none') {
    // The cushion is a board with a heavy round-over — the same profile code,
    // asked for something soft.
    const inset = pad === 'dropIn' ? railWidth * 0.7 : pad === 'full' ? 0 : railWidth * 0.35
    const cushionPlan = plan(hull(seatPlan.offset(inset)))
    const base = pad === 'over' ? seatTop : seatTop - padThickness * 0.35
    const cushion = board(cushionPlan, base, padThickness, 'rounded', padThickness * 0.45)
    const upholstery = [cushion]
    if (fancy >= 5) {
      // Buttoned, in a grid clipped to the pad.
      const step = Math.max(90, padThickness * 2)
      const top = base + padThickness
      const field = cushionPlan.offset(Math.max(30, padThickness * 0.6))
      for (let x = -seatDepth / 2; x <= seatDepth / 2; x += step) {
        for (let z = -seatWidth / 2; z <= seatWidth / 2; z += step) {
          if (!contains(field, x, z)) continue
          const button = new THREE.SphereGeometry(padThickness * 0.13, 10, 8)
          button.scale(1, 0.5, 1)
          button.translate(x, top - padThickness * 0.06, z)
          upholstery.push(button)
        }
      }
    }
    parts.push({ name: 'seat-pad', geometry: merge(upholstery), color: fabric })
  }

  if (fancy >= 1 && !framed) {
    const bead = sweep(seatPlan, beadSection(seatThickness * 0.3, seatBottom + seatThickness * 0.2, seatThickness * 0.16), true)
    if (bead) parts.push({ name: 'seat-bead', geometry: bead, color: COLOR.detail })
  }

  // --- Legs ----------------------------------------------------------------
  //
  // Four legs on the corner-most points of the seat pulled in by its own
  // thickness, which is the corner of a square seat and the 45° of a round one.
  const legRing = seatPlan.offset(Math.max(12, legSize * 0.35) + legSize / 2)
  const corners = [[-1, 1], [-1, -1], [1, -1], [1, 1]].map(([sx, sz]) => {
    const q = supportPoint(legRing, sx / Math.SQRT2, sz / Math.SQRT2)
    return { x: q.x, z: q.z, front: sx < 0, sz }
  })
  const rearPost = bool(p, 'rearPost')
  const legTop = framed ? seatTop - 12 : seatBottom
  const legs = []
  const feet = []
  const rails = []

  const footOf = (corner, top) => {
    // Splay is measured from the seat outwards, so a leg leans the way its
    // corner points rather than simply outwards from the middle.
    const radial = Math.hypot(corner.x, corner.z) || 1
    const kick = Math.tan(splay) * top
    return {
      x: corner.x + (corner.x / radial) * kick,
      z: corner.z + (corner.z / radial) * kick,
      nx: corner.x / radial,
      nz: corner.z / radial,
    }
  }

  for (const corner of corners) {
    // A back leg that runs up into the back stops at the seat top; the raked
    // post above it is built with the rest of the back.
    const top = !corner.front && rearPost ? seatTop : legTop
    const spread = footOf(corner, top)
    if (legProfile === 'cabriole') {
      legs.push(cabriole(top, legSize, corner.x, corner.z, spread.nx, spread.nz))
    } else if (splay > 1e-3 && legProfile !== 'turned') {
      const square = legProfile === 'square' || legProfile === 'tapered'
      // A leaning leg is cut off square to its own axis, so its foot sits just
      // clear of the floor rather than through it.
      const lift = legSize * taper * (square ? Math.SQRT1_2 : 0.5) * Math.sin(splay)
      legs.push(
        strut(
          new THREE.Vector3(spread.x, lift, spread.z),
          new THREE.Vector3(corner.x, top, corner.z),
          legSize * taper * (square ? Math.SQRT2 : 1),
          legSize * (square ? Math.SQRT2 : 1),
          square ? 4 : 16,
          square ? Math.PI / 4 : 0,
        ),
      )
    } else {
      legs.push(legGeometry(legProfile, top, legSize, corner.x, corner.z, taper, fancy, spread.nx, spread.nz))
    }
    if (fancy >= 2 && legProfile !== 'cabriole' && legProfile !== 'turned') {
      const w = legSize * 1.2
      feet.push(
        legProfile === 'round'
          ? post(w, legSize * 0.15, spread.x, 0, spread.z, 16)
          : box(w, legSize * 0.15, w, spread.x - w / 2, 0, spread.z - w / 2),
      )
    }
  }

  // --- Stretchers ----------------------------------------------------------
  const stretcher = str(p, 'stretcher')
  if (stretcher !== 'none') {
    const y = Math.min(num(p, 'stretcherHeight'), legTop - 40)
    const t = Math.max(12, legSize * 0.55)
    const at = (i) => {
      const corner = corners[i]
      const top = !corner.front && rearPost ? seatTop : legTop
      const spread = footOf(corner, top)
      const f = Math.max(0, 1 - y / Math.max(top, 1))
      return new THREE.Vector3(
        corner.x + (spread.x - corner.x) * f,
        y,
        corner.z + (spread.z - corner.z) * f,
      )
    }
    const rail = (a, b) => strut(a, b, t, t, legProfile === 'turned' ? 12 : 4, legProfile === 'turned' ? 0 : Math.PI / 4)
    // corners run front-left, front-right, back-right, back-left.
    if (stretcher === 'box') {
      for (let i = 0; i < 4; i++) rails.push(rail(at(i), at((i + 1) % 4)))
    } else if (stretcher === 'double') {
      rails.push(rail(at(0), at(1)))
      rails.push(rail(at(2), at(3)))
      rails.push(rail(at(1), at(2)))
      rails.push(rail(at(3), at(0)))
      const front = at(0).lerp(at(1), 0.5)
      const back = at(3).lerp(at(2), 0.5)
      rails.push(rail(front.clone().setY(y + t * 1.6), back.clone().setY(y + t * 1.6)))
    } else {
      rails.push(rail(at(0), at(3)))
      rails.push(rail(at(1), at(2)))
      rails.push(rail(at(0).lerp(at(3), 0.5), at(1).lerp(at(2), 0.5)))
    }
    if (fancy >= 4) {
      for (const corner of [at(0).lerp(at(3), 0.5), at(1).lerp(at(2), 0.5)]) {
        const collar = new THREE.TorusGeometry(t * 0.75, t * 0.22, 8, 16)
        collar.rotateY(Math.PI / 2)
        collar.rotateX(Math.PI / 2)
        collar.translate(corner.x, corner.y, corner.z)
        rails.push(collar)
      }
    }
  }

  // --- The back ------------------------------------------------------------
  //
  // Built upright against the back edge of the seat and then tipped as a whole,
  // so nothing below has to know about the rake.
  const rear = corners.filter((c) => !c.front)
  const postSize = legSize * 0.92
  const postZ = Math.max(...rear.map((c) => Math.abs(c.z)))
  const postX = rear.length ? (rear[0].x + rear[1].x) / 2 : seatDepth / 2
  const crestBottom = seatTop + backHeight - Math.max(60, backHeight * 0.13)
  const backTop = seatTop + backHeight
  const inner = postZ - postSize / 2
  const backPieces = []

  for (const sz of [1, -1]) {
    const z = sz * postZ
    const top = new THREE.Vector3(postX, backTop, z)
    const base = new THREE.Vector3(postX, rearPost ? seatTop - 1 : seatBottom + postSize * 0.2, z)
    if (legProfile === 'turned' && rearPost) {
      const column = turned(backTop - base.y, postSize, postX, z, fancy >= 4)
      column.translate(0, base.y, 0)
      backPieces.push(column)
    } else {
      backPieces.push(strut(base, top, postSize * 1.05, postSize * 0.92, legProfile === 'round' || legProfile === 'turned' ? 16 : 4, legProfile === 'round' || legProfile === 'turned' ? 0 : Math.PI / 4))
    }
    if (fancy >= 4) {
      // A turned finial capping each post.
      const finial = new THREE.LatheGeometry(
        [[0, 0], [0.55, 0.05], [0.42, 0.2], [0.6, 0.45], [0.3, 0.7], [0.16, 0.85], [0, 1]].map(
          ([r, f]) => new THREE.Vector2(Math.max(r * postSize, 1e-3), f * postSize * 1.3),
        ),
        14,
      )
      finial.translate(postX, backTop, z)
      backPieces.push(finial)
    }
  }

  // The crest rail, drawn as a board standing across the top of the posts.
  const crest = new THREE.Shape()
  const crestDepth = backTop - crestBottom
  {
    const half = postZ + postSize / 2
    crest.moveTo(-half, crestBottom)
    crest.lineTo(half, crestBottom)
    crest.lineTo(half, backTop)
    if (crestStyle === 'arched') {
      crest.quadraticCurveTo(0, backTop + crestDepth * 0.55, -half, backTop)
    } else if (crestStyle === 'yoke') {
      crest.bezierCurveTo(half * 0.45, backTop + crestDepth * 0.5, half * 0.2, backTop - crestDepth * 0.5, 0, backTop - crestDepth * 0.35)
      crest.bezierCurveTo(-half * 0.2, backTop - crestDepth * 0.5, -half * 0.45, backTop + crestDepth * 0.5, -half, backTop)
    } else {
      crest.lineTo(-half, backTop)
    }
    crest.closePath()
  }
  backPieces.push(plate(crest, postSize * 0.85, postX - postSize * 0.42))
  if (fancy >= 5) {
    // A carved cap laid over the crest.
    const capShape = new THREE.Shape()
    const half = postZ * 0.55
    capShape.moveTo(-half, crestBottom + crestDepth * 0.35)
    capShape.quadraticCurveTo(0, crestBottom + crestDepth * 0.1, half, crestBottom + crestDepth * 0.35)
    capShape.quadraticCurveTo(0, backTop + crestDepth * 0.25, -half, crestBottom + crestDepth * 0.35)
    backPieces.push(plate(capShape, postSize * 0.5, postX - postSize * 0.92))
  }

  const fillBottom = seatTop + Math.max(40, backHeight * 0.12)
  const fill = Math.max(1, Math.round(num(p, 'backFill')))
  if (backStyle === 'ladder') {
    const slatThickness = Math.max(10, postSize * 0.42)
    const gap = (crestBottom - fillBottom) / fill
    const slatHeight = Math.min(gap * 0.62, Math.max(40, backHeight * 0.13))
    for (let i = 0; i < fill; i++) {
      const y = fillBottom + gap * (i + 0.5) - slatHeight / 2
      const s = new THREE.Shape()
      s.moveTo(-inner, y)
      s.lineTo(inner, y)
      if (fancy >= 2) {
        // Shaped slats: a shallow arch along the top edge.
        s.lineTo(inner, y + slatHeight * 0.7)
        s.quadraticCurveTo(0, y + slatHeight * 1.5, -inner, y + slatHeight * 0.7)
      } else {
        s.lineTo(inner, y + slatHeight)
        s.lineTo(-inner, y + slatHeight)
      }
      s.closePath()
      backPieces.push(plate(s, slatThickness, postX - slatThickness / 2))
    }
  } else if (backStyle === 'spindle') {
    const rail = new THREE.Shape()
    const railHeight = Math.max(30, postSize)
    rail.moveTo(-inner, fillBottom)
    rail.lineTo(inner, fillBottom)
    rail.lineTo(inner, fillBottom + railHeight)
    rail.lineTo(-inner, fillBottom + railHeight)
    rail.closePath()
    backPieces.push(plate(rail, postSize * 0.7, postX - postSize * 0.35))
    const stickTop = crestBottom + crestDepth * 0.2
    const dia = Math.max(9, postSize * 0.45)
    for (let i = 0; i < fill; i++) {
      const z = fill === 1 ? 0 : -inner * 0.82 + (inner * 1.64 * i) / (fill - 1)
      const base = fillBottom + railHeight * 0.6
      if (legProfile === 'turned' || fancy >= 2) {
        const stick = turned(stickTop - base, dia * 1.5, postX, z, false)
        stick.translate(0, base, 0)
        backPieces.push(stick)
      } else {
        backPieces.push(post(dia, stickTop - base, postX, base, z, 12))
      }
    }
  } else if (backStyle === 'splat') {
    // One board up the middle, waisted like a vase.
    const w = inner * 0.5
    const s = new THREE.Shape()
    s.moveTo(-w, fillBottom)
    s.lineTo(w, fillBottom)
    s.bezierCurveTo(w * 1.15, fillBottom + (crestBottom - fillBottom) * 0.35, w * 0.35, fillBottom + (crestBottom - fillBottom) * 0.55, w * 0.75, crestBottom)
    s.lineTo(-w * 0.75, crestBottom)
    s.bezierCurveTo(-w * 0.35, fillBottom + (crestBottom - fillBottom) * 0.55, -w * 1.15, fillBottom + (crestBottom - fillBottom) * 0.35, -w, fillBottom)
    s.closePath()
    backPieces.push(plate(s, Math.max(12, postSize * 0.5), postX - postSize * 0.25))
    const shoe = new THREE.Shape()
    shoe.moveTo(-w * 1.35, fillBottom - Math.max(24, postSize * 0.7))
    shoe.lineTo(w * 1.35, fillBottom - Math.max(24, postSize * 0.7))
    shoe.lineTo(w * 1.15, fillBottom + 6)
    shoe.lineTo(-w * 1.15, fillBottom + 6)
    shoe.closePath()
    backPieces.push(plate(shoe, postSize * 0.8, postX - postSize * 0.4))
  } else if (backStyle === 'cross') {
    const t = Math.max(12, postSize * 0.5)
    for (const sz of [1, -1]) {
      backPieces.push(
        strut(
          new THREE.Vector3(postX, fillBottom, sz * inner),
          new THREE.Vector3(postX, crestBottom, -sz * inner),
          t,
          t,
          4,
          Math.PI / 4,
        ),
      )
    }
    if (fancy >= 3) {
      const boss = new THREE.SphereGeometry(t * 1.1, 12, 10)
      boss.scale(0.5, 1, 1)
      boss.translate(postX, (fillBottom + crestBottom) / 2, 0)
      backPieces.push(boss)
    }
  } else if (backStyle === 'panel' || backStyle === 'upholstered') {
    const s = new THREE.Shape()
    const w = inner
    s.moveTo(-w, fillBottom)
    s.lineTo(w, fillBottom)
    if (fancy >= 2) {
      s.lineTo(w, crestBottom - (crestBottom - fillBottom) * 0.1)
      s.quadraticCurveTo(0, crestBottom + (crestBottom - fillBottom) * 0.08, -w, crestBottom - (crestBottom - fillBottom) * 0.1)
    } else {
      s.lineTo(w, crestBottom)
      s.lineTo(-w, crestBottom)
    }
    s.closePath()
    const thickness = backStyle === 'upholstered' ? Math.max(45, postSize * 1.3) : Math.max(14, postSize * 0.55)
    const panel = plate(s, thickness, postX - thickness * (backStyle === 'upholstered' ? 0.85 : 0.5))
    if (backStyle === 'upholstered') {
      const raked = rake(panel, backRake, postX, seatTop)
      parts.push({ name: 'back-panel', geometry: raked, color: fabric })
    } else {
      backPieces.push(panel)
    }
  }

  for (const piece of backPieces) rake(piece, backRake, postX, seatTop)
  if (backPieces.length) parts.push({ name: 'back', geometry: merge(backPieces), color: COLOR.back })

  // --- Arms ----------------------------------------------------------------
  if (bool(p, 'arms')) {
    const armY = seatTop + num(p, 'armHeight')
    const armDia = Math.max(16, legSize * 0.75)
    const arm = []
    for (const sz of [1, -1]) {
      const z = sz * (postZ - postSize * 0.15)
      // The rear end rides up the raked post, so it has to lean with it.
      const lean = (armY - seatTop) * Math.sin(backRake)
      const rear = new THREE.Vector3(postX + lean, armY, z)
      const frontX = supportPoint(legRing, -1, 0).x + legSize * 0.6
      const front = new THREE.Vector3(frontX, armY, z * 0.94)
      arm.push(strut(rear, front, armDia, armDia * 0.9, 12))
      // The support beneath the front of the arm.
      const foot = new THREE.Vector3(front.x + legSize * 0.15, seatTop - 4, front.z)
      arm.push(strut(foot, front.clone().setY(armY - armDia * 0.4), armDia * 0.85, armDia * 0.6, 12))
      if (fancy >= 3) {
        // Scrolled over at the front.
        const scroll = new THREE.TorusGeometry(armDia * 0.62, armDia * 0.42, 10, 18, Math.PI * 1.5)
        scroll.rotateY(Math.PI / 2)
        scroll.translate(front.x - armDia * 0.2, armY - armDia * 0.2, front.z)
        arm.push(scroll)
      }
    }
    parts.push({ name: 'arms', geometry: merge(arm), color: COLOR.frame })
  }

  // --- Corbels where the legs meet the seat ---------------------------------
  if (fancy >= 3) {
    const brackets = []
    const r = Math.max(legSize * 0.9, 34)
    const t = legSize * 0.4
    const bracket = () => {
      const s = new THREE.Shape()
      s.moveTo(0, 0)
      s.lineTo(r, 0)
      s.quadraticCurveTo(0, 0, 0, -r)
      s.closePath()
      const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 8 })
      g.translate(0, 0, -t / 2)
      return g
    }
    for (const corner of corners) {
      const sx = corner.front ? -1 : 1
      const sz = Math.sign(corner.z) || 1
      const alongX = bracket()
      if (sx > 0) alongX.rotateY(Math.PI)
      alongX.translate(corner.x - sx * legSize * 0.5, legTop, corner.z + sz * (legSize * 0.5 - t / 2))
      brackets.push(alongX)

      const alongZ = bracket()
      alongZ.rotateY(sz > 0 ? Math.PI / 2 : -Math.PI / 2)
      alongZ.translate(corner.x + sx * (legSize * 0.5 - t / 2), legTop, corner.z - sz * legSize * 0.5)
      brackets.push(alongZ)
    }
    parts.push({ name: 'corbels', geometry: merge(brackets), color: COLOR.frame })
  }

  if (legs.length) parts.push({ name: 'legs', geometry: merge(legs), color: COLOR.frame })
  if (feet.length) parts.push({ name: 'feet', geometry: merge(feet), color: COLOR.frame })
  if (rails.length) parts.push({ name: 'stretchers', geometry: merge(rails), color: COLOR.rail })

  return parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
}

export function metrics(p) {
  const seatHeight = num(p, 'seatHeight')
  const backHeight = num(p, 'backHeight')
  const seatDepth = num(p, 'seatDepth')
  const seatWidth = num(p, 'seatWidth')
  const pad = str(p, 'seatPad')
  const padThickness = num(p, 'padThickness')

  // A cushion laid on top raises where you actually sit.
  const sitting = pad === 'over' ? seatHeight + padThickness * 0.55 : seatHeight
  const sitLevel = sitting < 400 || sitting > 500 ? 'warn' : 'ok'

  // The table object measures its knee clearance from the same 750 mm default.
  const clearance = 750 - sitting
  const clearanceLevel = clearance < 250 ? 'error' : clearance < 270 || clearance > 330 ? 'warn' : 'ok'

  const rows = [
    {
      label: 'Seat height',
      value: formatLength(sitting),
      level: sitLevel,
      note: sitLevel === 'ok' ? undefined : 'Dining chairs sit between 430 and 480 mm.',
    },
    {
      label: 'Under a 750 mm table',
      value: formatLength(clearance),
      level: clearanceLevel,
      note:
        clearanceLevel === 'ok'
          ? undefined
          : 'Thighs want 280–300 mm between the seat and the underside of the table.',
    },
    { label: 'Seat', value: `${formatLength(seatDepth)} × ${formatLength(seatWidth)}` },
    { label: 'Overall height', value: formatLength(seatHeight + backHeight) },
  ]

  if (bool(p, 'arms')) {
    const armHeight = num(p, 'armHeight')
    rows.push({
      label: 'Arm above seat',
      value: formatLength(armHeight),
      level: armHeight < 170 || armHeight > 260 ? 'warn' : 'ok',
      note: armHeight < 170 || armHeight > 260 ? 'Elbows rest at about 200–230 mm.' : undefined,
    })
  }

  return rows
}

// Named property sets the object ships with. Each lists only what it changes.
export const presets = [
  {
    name: 'Farmhouse ladderback',
    params: {
      seatShape: 'trapezoid', seatWidth: 450, seatDepth: 420, seatHeight: 455, seatThickness: 30,
      edgeStyle: 'chamfer', edgeSize: 5,
      backStyle: 'ladder', backHeight: 520, backFill: 4, crestStyle: 'arched', backRake: 7,
      legProfile: 'tapered', legThickness: 42, stretcher: 'h', fancy: 1,
    },
  },
  {
    name: 'Windsor spindle',
    params: {
      seatShape: 'bowfront', seatWidth: 460, seatDepth: 430, seatHeight: 450, seatThickness: 42,
      seatTaper: 90, edgeStyle: 'bullnose',
      backStyle: 'spindle', backHeight: 560, backFill: 7, crestStyle: 'arched', backRake: 13,
      legProfile: 'turned', legThickness: 44, splay: 13, rearPost: false,
      stretcher: 'h', stretcherHeight: 190, fancy: 2,
    },
  },
  {
    name: 'Georgian splat',
    params: {
      seatShape: 'trapezoid', seatWidth: 480, seatDepth: 440, seatHeight: 470, seatThickness: 26,
      seatTaper: 110, cornerRadius: 45, edgeStyle: 'ogee', edgeSize: 9,
      backStyle: 'splat', backHeight: 540, crestStyle: 'yoke', backRake: 10,
      legProfile: 'cabriole', legThickness: 46, stretcher: 'none',
      seatPad: 'dropIn', padThickness: 55, padColor: 'oxblood', fancy: 4,
    },
  },
  {
    name: 'Carver armchair',
    params: {
      seatShape: 'trapezoid', seatWidth: 520, seatDepth: 460, seatHeight: 460, seatThickness: 32,
      backStyle: 'ladder', backHeight: 560, backFill: 3, crestStyle: 'yoke', backRake: 9,
      legProfile: 'turned', legThickness: 46, stretcher: 'box',
      arms: true, armHeight: 215, fancy: 4,
    },
  },
  {
    name: 'Upholstered dining',
    params: {
      seatShape: 'square', seatWidth: 470, seatDepth: 460, seatHeight: 450, seatThickness: 36,
      cornerRadius: 20, edgeStyle: 'rounded',
      backStyle: 'upholstered', backHeight: 480, crestStyle: 'straight', backRake: 11,
      legProfile: 'square', legThickness: 40, stretcher: 'none',
      seatPad: 'full', padThickness: 70, padColor: 'charcoal', fancy: 2,
    },
  },
  {
    name: 'Modern tapered',
    params: {
      seatShape: 'square', seatWidth: 440, seatDepth: 430, seatHeight: 450, seatThickness: 20,
      cornerRadius: 60, edgeStyle: 'rounded', edgeSize: 6,
      backStyle: 'panel', backHeight: 380, crestStyle: 'straight', backRake: 14,
      legProfile: 'round', legThickness: 30, legTaper: 0.55, splay: 7,
      stretcher: 'none', fancy: 0,
    },
  },
  {
    name: 'Cross-back café',
    params: {
      seatShape: 'round', seatWidth: 420, seatDepth: 420, seatHeight: 455, seatThickness: 24,
      edgeStyle: 'rounded', edgeSize: 8,
      backStyle: 'cross', backHeight: 440, crestStyle: 'straight', backRake: 9,
      legProfile: 'round', legThickness: 34, splay: 9, stretcher: 'box', stretcherHeight: 150,
      fancy: 3,
    },
  },
]
