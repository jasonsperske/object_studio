// Rock.
//
// A stone is a radius: for every direction out of its middle there is a
// distance to its surface, and that one function is the whole object. Freshly
// broken, that function is the intersection of a handful of flat fracture
// planes, which is what makes new rock angular. Tumble it in a river and the
// corners go first, so erosion here pulls the surface toward a smooth blob and
// takes the fine detail off with it.
//
// Everything else follows from being able to ask for that radius in any
// direction. The cross-section where it is split is the same function sampled
// round a circle. A geode is a second, smaller surface facing inwards. Moss is
// the triangles that face the sky, lifted a millimetre off it.
//
// It is built about its middle and set down on Y = 0 at the end, so it sits on
// whatever it is standing on. Sizes are in millimetres, so a pebble is 40 and a
// boulder is 1200.

export const meta = {
  order: 14,
  name: 'Rock',
  description:
    'A stone from pebble to boulder — fracture planes worn down by erosion, sedimentary bedding, an optional geode split open on its crystals, and moss on whatever faces the sky.',
}

// Density in kg/m³, and how angular the stuff breaks.
const STONE = {
  granite: { label: 'Granite', colour: 0x9a948c, cut: 0xa8a29a, density: 2700, facets: 11, grain: 0.9 },
  basalt: { label: 'Basalt', colour: 0x4c4e52, cut: 0x5a5c60, density: 3000, facets: 8, grain: 0.7 },
  sandstone: { label: 'Sandstone', colour: 0xc0a075, cut: 0xcdb089, density: 2300, facets: 14, grain: 1.3 },
  limestone: { label: 'Limestone', colour: 0xc6c3b6, cut: 0xd3d1c6, density: 2600, facets: 13, grain: 1.1 },
  flint: { label: 'Flint', colour: 0x5c626b, cut: 0x6d7481, density: 2600, facets: 7, grain: 0.5 },
  slate: { label: 'Slate', colour: 0x585e66, cut: 0x646b74, density: 2800, facets: 16, grain: 0.6 },
}

const CRYSTAL = {
  amethyst: 0x8d6cb4,
  quartz: 0xd6d6e2,
  citrine: 0xd9a94a,
  rose: 0xd7a0a6,
  smoky: 0x6d6259,
  emerald: 0x3f8f6a,
}

const MOSS = { moss: 0x5b7a37, lichen: 0x9fae83, rust: 0xa5763f, grey: 0x93a08f }

// The Wentworth scale, which is what geologists actually call these.
const WENTWORTH = [
  { under: 4, label: 'granule' },
  { under: 64, label: 'pebble' },
  { under: 256, label: 'cobble' },
  { under: Infinity, label: 'boulder' },
]

export const params = [
  // --- Stone --------------------------------------------------------------
  { id: 'size', label: 'Size', type: 'number', min: 15, max: 3000, step: 5, default: 320, unit: 'mm', group: 'Stone', help: 'Longest axis. Under 64 is a pebble, over 256 a boulder.' },
  {
    id: 'stone',
    label: 'Stone',
    type: 'select',
    default: 'granite',
    group: 'Stone',
    help: 'Colour, density, and how the stuff breaks — flint into few sharp faces, sandstone into many blunt ones.',
    options: [
      { value: 'granite', label: 'Granite' },
      { value: 'basalt', label: 'Basalt' },
      { value: 'sandstone', label: 'Sandstone' },
      { value: 'limestone', label: 'Limestone' },
      { value: 'flint', label: 'Flint' },
      { value: 'slate', label: 'Slate' },
    ],
  },
  { id: 'seed', label: 'Seed', type: 'int', min: 1, max: 9999, step: 1, default: 7, group: 'Stone', help: 'Same seed, same stone.' },
  { id: 'detail', label: 'Detail', type: 'int', min: 1, max: 12, step: 1, default: 6, group: 'Stone', help: 'How finely each face of the icosahedron it starts from is divided: 20 × (detail + 1)² faces, so six is 980 and twelve is 3,380.' },
  { id: 'flatness', label: 'Flatness', type: 'number', min: 0.25, max: 1, step: 0.01, default: 0.72, group: 'Stone', help: 'How squat it is. Few stones are round.' },
  { id: 'elongation', label: 'Elongation', type: 'number', min: 0.5, max: 1.6, step: 0.01, default: 1.15, group: 'Stone', help: 'Stretched along one axis.' },

  // --- Erosion ------------------------------------------------------------
  { id: 'erosion', label: 'Erosion', type: 'number', min: 0, max: 1, step: 0.01, default: 0.35, group: 'Erosion', help: 'None is freshly fractured, all corners and flats. Full is river-tumbled: the corners go first and the fine detail with them.' },
  { id: 'lumpiness', label: 'Lumpiness', type: 'number', min: 0, max: 1, step: 0.01, default: 0.4, group: 'Erosion', help: 'The slow swell of the surface.' },
  { id: 'pitting', label: 'Pitting', type: 'number', min: 0, max: 1, step: 0.01, default: 0.35, group: 'Erosion', help: 'Fine roughness. Erosion wears this off first.' },
  { id: 'bedding', label: 'Bedding', type: 'number', min: 0, max: 1, step: 0.01, default: 0, group: 'Erosion', help: 'Sedimentary layers, cut as ledges around the stone.' },
  { id: 'beds', label: 'Beds', type: 'int', min: 2, max: 14, step: 1, default: 6, group: 'Erosion', visibleWhen: (p) => num(p, 'bedding') > 0 },

  // --- Inside -------------------------------------------------------------
  { id: 'crack', label: 'Cracked open', type: 'number', min: 0, max: 1, step: 0.01, default: 0, group: 'Inside', help: 'Splits it in two and opens the halves like a book. Nothing inside is built while it is shut.' },
  { id: 'geode', label: 'Geode', type: 'boolean', default: false, group: 'Inside', help: 'A hollow lined with crystals. You only find out by breaking it.' },
  { id: 'cavity', label: 'Cavity', type: 'number', min: 0.15, max: 0.75, step: 0.01, default: 0.45, group: 'Inside', help: 'How much of the stone is hollow.', visibleWhen: (p) => bool(p, 'geode') },
  { id: 'crystalSize', label: 'Crystal size', type: 'number', min: 0.02, max: 0.3, step: 0.005, default: 0.1, group: 'Inside', help: 'As a share of the cavity.', visibleWhen: (p) => bool(p, 'geode') },
  { id: 'crystals', label: 'Crystal density', type: 'number', min: 0, max: 1, step: 0.01, default: 0.6, group: 'Inside', visibleWhen: (p) => bool(p, 'geode') },
  {
    id: 'crystalColour',
    label: 'Crystal',
    type: 'select',
    default: 'amethyst',
    group: 'Inside',
    visibleWhen: (p) => bool(p, 'geode'),
    options: [
      { value: 'amethyst', label: 'Amethyst' },
      { value: 'quartz', label: 'Quartz' },
      { value: 'citrine', label: 'Citrine' },
      { value: 'rose', label: 'Rose quartz' },
      { value: 'smoky', label: 'Smoky quartz' },
      { value: 'emerald', label: 'Green' },
    ],
  },
  { id: 'banding', label: 'Banded lining', type: 'boolean', default: true, group: 'Inside', help: 'The agate rings between the shell and the hollow, which is how a geode fills in.', visibleWhen: (p) => bool(p, 'geode') },

  // --- Moss ---------------------------------------------------------------
  { id: 'moss', label: 'Moss', type: 'number', min: 0, max: 1, step: 0.01, default: 0.3, group: 'Moss', help: 'How much of the stone it has taken. It only grows on what faces the sky.' },
  { id: 'mossReach', label: 'Down the sides', type: 'number', min: 0, max: 1, step: 0.01, default: 0.35, group: 'Moss', help: 'How far past the top it creeps.', visibleWhen: (p) => num(p, 'moss') > 0 },
  { id: 'mossDepth', label: 'Thickness', type: 'number', min: 0.5, max: 12, step: 0.5, default: 3, unit: 'mm', group: 'Moss', visibleWhen: (p) => num(p, 'moss') > 0 },
  {
    id: 'mossColour',
    label: 'Growth',
    type: 'select',
    default: 'moss',
    group: 'Moss',
    visibleWhen: (p) => num(p, 'moss') > 0,
    options: [
      { value: 'moss', label: 'Moss — green' },
      { value: 'lichen', label: 'Lichen — pale' },
      { value: 'rust', label: 'Lichen — rust' },
      { value: 'grey', label: 'Lichen — grey' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Noise
//
// Value noise on an integer lattice, hashed from the seed. Deterministic in the
// direction asked for, which is what lets neighbouring triangles agree about
// where the surface is without sharing any state.
// ---------------------------------------------------------------------------

function hash(x, y, z, seed) {
  let h = x * 374761393 + y * 668265263 + z * 2147483647 + seed * 1442695040
  h = (h ^ (h >>> 13)) * 1274126177
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

function smooth(t) {
  return t * t * (3 - 2 * t)
}

function noise3(x, y, z, seed) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = smooth(x - ix)
  const fy = smooth(y - iy)
  const fz = smooth(z - iz)
  let value = 0
  for (let dz = 0; dz < 2; dz++) {
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const weight =
          (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy) * (dz ? fz : 1 - fz)
        value += weight * hash(ix + dx, iy + dy, iz + dz, seed)
      }
    }
  }
  return value * 2 - 1
}

function fbm(x, y, z, seed, octaves, frequency) {
  let sum = 0
  let amplitude = 1
  let total = 0
  let f = frequency
  for (let i = 0; i < octaves; i++) {
    sum += amplitude * noise3(x * f, y * f, z * f, seed + i * 131)
    total += amplitude
    amplitude *= 0.5
    f *= 2.07
  }
  return sum / (total || 1)
}

// ---------------------------------------------------------------------------
// The surface
// ---------------------------------------------------------------------------

/**
 * The radius of the stone in a given direction.
 *
 * Freshly broken rock is the intersection of the planes it broke along, so the
 * distance out to the surface is the nearest of them. Erosion mixes that toward
 * a plain sphere — corners first, since a corner is where a plane is nearest —
 * and damps the fine noise, because tumbling polishes before it reshapes.
 */
function surface(p) {
  const seed = Math.round(num(p, 'seed'))
  const stone = STONE[str(p, 'stone')] ?? STONE.granite
  const erosion = num(p, 'erosion')
  const lumpiness = num(p, 'lumpiness')
  const pitting = num(p, 'pitting')
  const bedding = num(p, 'bedding')
  const beds = Math.round(num(p, 'beds'))

  // The fracture planes. Fewer and closer in makes a sharper, blockier stone.
  const facets = Math.max(4, Math.round(stone.facets * (1 - erosion * 0.45)))
  const planes = []
  for (let i = 0; i < facets; i++) {
    // Spread over the sphere by the golden angle, then jittered.
    const t = (i + 0.5) / facets
    const phi = Math.acos(1 - 2 * t)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const jitter = hash(i, 1, 1, seed) * 0.5
    planes.push({
      nx: Math.sin(phi) * Math.cos(theta + jitter),
      ny: Math.cos(phi),
      nz: Math.sin(phi) * Math.sin(theta + jitter),
      c: 0.72 + hash(i, 2, 3, seed) * 0.34,
    })
  }

  return (x, y, z) => {
    let flat = Infinity
    for (const plane of planes) {
      const dot = x * plane.nx + y * plane.ny + z * plane.nz
      if (dot > 1e-3) flat = Math.min(flat, plane.c / dot)
    }
    if (!Number.isFinite(flat)) flat = 1
    // Toward a sphere as it wears; the sharpest corners give way first.
    let r = flat + (1 - flat) * Math.pow(erosion, 0.75)
    r *= 1 + lumpiness * 0.28 * fbm(x, y, z, seed, 3, 1.6 * stone.grain)
    r *= 1 + pitting * 0.09 * (1 - erosion * 0.85) * fbm(x, y, z, seed + 77, 3, 7 * stone.grain)
    if (bedding > 0) {
      // Layers cut as ledges around the stone, level however it is stretched.
      const step = Math.sin(y * beds * 1.6) * 0.5 + 0.5
      r *= 1 + bedding * 0.1 * (Math.round(step * 3) / 3 - 0.5)
    }
    return r
  }
}

/** A sphere of triangles, each vertex pushed out to the surface. */
function shell(radiusAt, detail, inward) {
  const source = new THREE.IcosahedronGeometry(1, detail)
  const from = source.getAttribute('position').array
  const position = new Float32Array(from.length)
  for (let i = 0; i < from.length; i += 3) {
    const len = Math.hypot(from[i], from[i + 1], from[i + 2]) || 1
    const x = from[i] / len
    const y = from[i + 1] / len
    const z = from[i + 2] / len
    const r = radiusAt(x, y, z)
    position[i] = x * r
    position[i + 1] = y * r
    position[i + 2] = z * r
  }
  source.dispose()
  if (inward) {
    // Turn it inside out: a cavity is a surface you see the back of.
    for (let i = 0; i < position.length; i += 9) {
      for (let k = 0; k < 3; k++) {
        const swap = position[i + k]
        position[i + k] = position[i + 6 + k]
        position[i + 6 + k] = swap
      }
    }
  }
  return position
}

function geometryFrom(position) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
  g.computeVertexNormals()
  return g
}

// ---------------------------------------------------------------------------
// Splitting
// ---------------------------------------------------------------------------

/**
 * Cuts a triangle soup by the plane z = 0, keeping one side. The cut edges land
 * exactly on the plane and are handed back as the rim, which is what the cut
 * face is then built from — so the face and the shell share their boundary
 * rather than each having their own idea of it.
 */
function splitAt(position, keep) {
  const out = []
  const rim = []
  const push = (a, b, c) => out.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2])
  for (let i = 0; i < position.length; i += 9) {
    const tri = []
    for (let k = 0; k < 3; k++) {
      tri.push([position[i + k * 3], position[i + k * 3 + 1], position[i + k * 3 + 2]])
    }
    const side = tri.map((v) => v[2] * keep)
    const polygon = []
    for (let k = 0; k < 3; k++) {
      const a = tri[k]
      const b = tri[(k + 1) % 3]
      const da = side[k]
      const db = side[(k + 1) % 3]
      if (da >= 0) polygon.push(a)
      if ((da >= 0) !== (db >= 0)) {
        const t = da / (da - db)
        const cut = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0]
        polygon.push(cut)
        rim.push(cut)
      }
    }
    for (let k = 1; k + 1 < polygon.length; k++) push(polygon[0], polygon[k], polygon[k + 1])
  }
  return { position: out, rim }
}

/** Rim points in the order they go round the middle. */
function sortRim(rim) {
  const seen = new Map()
  for (const point of rim) {
    const angle = Math.atan2(point[1], point[0])
    // Points arrive twice, once from each triangle that made them.
    const key = `${Math.round(point[0] * 2000)},${Math.round(point[1] * 2000)}`
    if (!seen.has(key)) seen.set(key, { angle, radius: Math.hypot(point[0], point[1]), point })
  }
  return [...seen.values()].sort((a, b) => a.angle - b.angle)
}

/** Where a ray out from the middle at this angle crosses the rim. */
function sampleRim(rim, angle) {
  const n = rim.length
  let i = 0
  // The rim is sorted, so walk to the segment this angle falls in.
  while (i < n - 1 && rim[i + 1].angle <= angle) i++
  const a = rim[i].point
  const b = rim[(i + 1) % n].point
  const dx = Math.cos(angle)
  const dz = Math.sin(angle)
  const ex = b[0] - a[0]
  const ez = b[1] - a[1]
  const denom = dx * ez - dz * ex
  if (Math.abs(denom) < 1e-9) return [a[0], a[1]]
  const t = (a[0] * ez - a[1] * ex) / denom
  return [dx * t, dz * t]
}

/**
 * The cut face: the flat ring of stone between the outside of the half and
 * whatever hollow is in the way, or the whole disc when there is none.
 *
 * Both rims are sampled at every angle either of them has a point at, so the
 * outer edge of the face passes exactly through the points where the shell was
 * cut and the two cannot part company. Splitting it into bands gives the agate
 * rings a geode fills in with.
 */
function cutFace(outer, inner, keep, bands) {
  if (outer.length < 3) return []
  const angles = [...new Set([...outer, ...(inner ?? [])].map((entry) => entry.angle))].sort(
    (a, b) => a - b,
  )
  if (angles.length < 3) return []
  const at = (rim, angle) => (rim && rim.length > 2 ? sampleRim(rim, angle) : [0, 0])
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const rings = []
  for (let band = 0; band < bands; band++) {
    const faces = []
    const t0 = band / bands
    const t1 = (band + 1) / bands
    const emit = (a, b, c) => {
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-9) return
      if (Math.hypot(b[0] - c[0], b[1] - c[1]) < 1e-9) return
      if (keep > 0) faces.push(a[0], a[1], 0, b[0], b[1], 0, c[0], c[1], 0)
      else faces.push(a[0], a[1], 0, c[0], c[1], 0, b[0], b[1], 0)
    }
    for (let k = 0; k < angles.length; k++) {
      const a0 = angles[k]
      const a1 = angles[(k + 1) % angles.length]
      const o0 = at(outer, a0)
      const o1 = at(outer, a1)
      const i0 = at(inner, a0)
      const i1 = at(inner, a1)
      const p00 = mix(i0, o0, t0)
      const p10 = mix(i1, o1, t0)
      const p01 = mix(i0, o0, t1)
      const p11 = mix(i1, o1, t1)
      emit(p00, p10, p11)
      emit(p00, p11, p01)
    }
    rings.push(faces)
  }
  return rings
}

// ---------------------------------------------------------------------------
// Growth
// ---------------------------------------------------------------------------

/**
 * Moss: the triangles that face the sky, lifted off the stone. Which ones is a
 * matter of how far up they look and what the noise says, so it lands in
 * patches rather than a coat.
 */
function mossFrom(position, coverage, reach, depth, seed) {
  if (coverage <= 0) return []
  const out = []
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const normal = new THREE.Vector3()
  for (let i = 0; i < position.length; i += 9) {
    a.set(position[i], position[i + 1], position[i + 2])
    b.set(position[i + 3], position[i + 4], position[i + 5])
    c.set(position[i + 6], position[i + 7], position[i + 8])
    normal.crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize()
    // Straight up is 1, the equator 0, underneath negative.
    const facing = normal.y
    const limit = 1 - reach * 1.35
    if (facing < limit) continue
    const cx = (a.x + b.x + c.x) / 3
    const cy = (a.y + b.y + c.y) / 3
    const cz = (a.z + b.z + c.z) / 3
    // Spread across the whole nought-to-one range, or the coverage slider only
    // does anything over the last part of its travel.
    const patch = Math.min(1, Math.max(0, fbm(cx, cy, cz, seed + 917, 3, 2.1) * 1.6 + 0.5))
    const chance = coverage * (0.35 + 0.65 * Math.max(0, (facing - limit) / (1 - limit)))
    if (patch > chance) continue
    for (const v of [a, b, c]) {
      out.push(v.x + normal.x * depth, v.y + normal.y * depth, v.z + normal.z * depth)
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const stone = STONE[str(p, 'stone')] ?? STONE.granite
  const seed = Math.round(num(p, 'seed'))
  const detail = Math.round(num(p, 'detail'))
  const crack = num(p, 'crack')
  const geode = bool(p, 'geode')
  const radiusAt = surface(p)

  // --- The stone at unit size ---------------------------------------------
  const outer = shell(radiusAt, detail, false)
  const cracked = crack > 0.005
  // A hollow is only built once there is a way to see into it.
  const hollow = cracked && geode
  const cavityScale = num(p, 'cavity')
  const cavityAt = (x, y, z) =>
    radiusAt(x, y, z) * cavityScale * (1 + 0.16 * fbm(x, y, z, seed + 313, 2, 3.1))
  const cavity = hollow ? shell(cavityAt, Math.min(detail, 8), true) : null

  const scale = { x: num(p, 'elongation'), y: num(p, 'flatness'), z: 1 }

  // Moss grows on the whole stone before anything is done to it, so a split
  // half carries whatever was on that side of it.
  const mossDepthUnit = num(p, 'mossDepth') / Math.max(1, num(p, 'size') / 2)
  const moss = mossFrom(outer, num(p, 'moss'), num(p, 'mossReach'), mossDepthUnit, seed)

  const pieces = []
  if (!cracked) {
    pieces.push({ shell: outer, moss, keep: 0 })
  } else {
    for (const keep of [1, -1]) {
      const half = splitAt(outer, keep)
      const mossHalf = splitAt(moss, keep)
      const rim = sortRim(half.rim)
      const inner = hollow ? splitAt(cavity, keep) : null
      const innerRim = inner ? sortRim(inner.rim) : null
      pieces.push({
        shell: half.position,
        moss: mossHalf.position,
        cavity: inner ? inner.position : null,
        face: cutFace(rim, innerRim, keep, hollow && bool(p, 'banding') ? 5 : 1),
        rim,
        innerRim,
        keep,
      })
    }
  }

  // --- Crystals in the hollow ---------------------------------------------
  if (hollow) {
    const density = num(p, 'crystals')
    const length = num(p, 'crystalSize') * cavityScale
    for (const piece of pieces) {
      const spikes = []
      const source = piece.cavity
      if (!source) continue
      // One chance per face, thinned so that a finely divided hollow does not
      // grow hundreds of crystals inside each other.
      const faces = source.length / 9
      const thin = Math.min(1, 90 / Math.max(1, faces))
      for (let i = 0; i < source.length; i += 9) {
        if (hash(i, 5, 9, seed) > density * thin) continue
        const cx = (source[i] + source[i + 3] + source[i + 6]) / 3
        const cy = (source[i + 1] + source[i + 4] + source[i + 7]) / 3
        const cz = (source[i + 2] + source[i + 5] + source[i + 8]) / 3
        const len = Math.hypot(cx, cy, cz) || 1
        const spread = 0.5 + hash(i, 6, 2, seed) * 0.9
        const base = new THREE.Vector3(cx, cy, cz)
        const tip = base.clone().multiplyScalar(1 - (length * spread) / len)
        // Longer than they are wide, and tapering, the way quartz grows.
        const width = length * spread * (0.18 + hash(i, 7, 4, seed) * 0.26)
        spikes.push(strut(base, tip, width, width * 0.42, 6))
      }
      piece.crystals = spikes
    }
  }

  // --- Place the halves ----------------------------------------------------
  //
  // Opened like a book. Each half tips outward about the line where its own
  // outside meets the ground, which is the one hinge that swings the cut face
  // up without either half passing through the other or through the ground.
  // Tipping about that line also walks it outward, so it is then slid back to
  // leave a hand's gap between the two.
  const built = []
  const measure = (list) => {
    const bounds = new THREE.Box3()
    const point = new THREE.Vector3()
    for (const item of list) {
      const array = item.geometry.getAttribute('position').array
      for (let i = 0; i < array.length; i += 3) {
        bounds.expandByPoint(point.set(array[i], array[i + 1], array[i + 2]))
      }
    }
    return bounds
  }

  const halves = []
  for (const piece of pieces) {
    const geometries = []
    const add = (position, name, colour) => {
      if (!position || !position.length) return
      geometries.push({ name, colour, geometry: geometryFrom(position) })
    }
    add(piece.shell, 'stone', stone.colour)
    add(piece.moss, 'moss', MOSS[str(p, 'mossColour')] ?? MOSS.moss)
    add(piece.cavity, 'lining', stone.cut)
    if (piece.face) {
      piece.face.forEach((band, index) => {
        // Alternate bands, lighter toward the hollow, for the agate look.
        const shade = piece.face.length > 1 ? (index % 2 ? stone.colour : stone.cut) : stone.cut
        add(band, 'cut-face', shade)
      })
    }
    for (const spike of piece.crystals ?? []) {
      geometries.push({
        name: 'crystals',
        colour: CRYSTAL[str(p, 'crystalColour')] ?? CRYSTAL.quartz,
        geometry: spike,
      })
    }
    for (const item of geometries) item.geometry.scale(scale.x, scale.y, scale.z)
    halves.push({ keep: piece.keep, geometries })
  }

  const whole = measure(halves.flatMap((half) => half.geometries))
  const groundY = whole.min.y
  const gap = (whole.max.z - whole.min.z) * 0.04 * crack
  for (const half of halves) {
    if (!half.keep) {
      built.push(...half.geometries)
      continue
    }
    const before = measure(half.geometries)
    const hingeZ = half.keep > 0 ? before.max.z : before.min.z
    const angle = half.keep * crack * (Math.PI / 2)
    for (const item of half.geometries) {
      item.geometry.translate(0, -groundY, -hingeZ)
      item.geometry.rotateX(angle)
      item.geometry.translate(0, groundY, hingeZ)
    }
    const after = measure(half.geometries)
    const slide = half.keep > 0 ? gap / 2 - after.min.z : -gap / 2 - after.max.z
    for (const item of half.geometries) item.geometry.translate(0, 0, slide)
    built.push(...half.geometries)
  }

  // --- Scale to size and set it down --------------------------------------
  const bounds = new THREE.Box3()
  const point = new THREE.Vector3()
  for (const item of built) {
    const array = item.geometry.getAttribute('position').array
    for (let i = 0; i < array.length; i += 3) {
      bounds.expandByPoint(point.set(array[i], array[i + 1], array[i + 2]))
    }
  }
  const span = Math.max(bounds.max.x - bounds.min.x, bounds.max.z - bounds.min.z, 1e-6)
  const factor = num(p, 'size') / span
  for (const item of built) {
    item.geometry.scale(factor, factor, factor)
    item.geometry.translate(0, -bounds.min.y * factor, 0)
    item.geometry.computeVertexNormals()
  }

  // --- Gather ---------------------------------------------------------------
  // Everything of one name and colour becomes one part, so the halves of a
  // split stone export as stone, moss, lining and crystals rather than as
  // sixteen loose pieces.
  const groups = new Map()
  for (const item of built) {
    const key = `${item.name}:${item.colour}`
    if (!groups.has(key)) groups.set(key, { name: item.name, color: item.colour, list: [] })
    groups.get(key).list.push(item.geometry)
  }
  const parts = []
  for (const group of groups.values()) {
    const geometry = merge(group.list)
    if (triangleCount(geometry) > 0) parts.push({ name: group.name, geometry, color: group.color })
  }
  return parts
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export function metrics(p) {
  const stone = STONE[str(p, 'stone')] ?? STONE.granite
  const radiusAt = surface(p)
  const flatness = num(p, 'flatness')
  const elongation = num(p, 'elongation')

  // The volume of a star-shaped body is the integral of r³ over the sphere, so
  // sample it the same way the mesh is built and add it up.
  const samples = 512
  const golden = Math.PI * (1 + Math.sqrt(5))
  let sum = 0
  let longest = 0
  for (let i = 0; i < samples; i++) {
    const t = (i + 0.5) / samples
    const phi = Math.acos(1 - 2 * t)
    const theta = golden * i
    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.cos(phi)
    const z = Math.sin(phi) * Math.sin(theta)
    const r = radiusAt(x, y, z)
    sum += r * r * r
    longest = Math.max(longest, r * Math.hypot(x * elongation, y * flatness, z))
  }
  const unitVolume = ((4 * Math.PI) / 3) * (sum / samples) * elongation * flatness
  const factor = num(p, 'size') / (longest * 2)
  const volume = unitVolume * factor ** 3

  const solid = bool(p, 'geode') ? 1 - Math.pow(num(p, 'cavity'), 3) : 1
  const mass = (volume / 1e9) * stone.density * solid

  const size = num(p, 'size')
  const grade = WENTWORTH.find((entry) => size < entry.under)
  const lift =
    mass < 12
      ? 'one hand'
      : mass < 25
        ? 'two hands'
        : mass < 60
          ? 'two people, and mind your back'
          : mass < 400
            ? 'a sack truck'
            : 'plant'

  const rows = [
    { label: 'Size', value: `${formatLength(size)} — a ${grade.label}`, note: 'Wentworth grades it by its longest axis: pebble under 64 mm, cobble under 256, boulder above.' },
    { label: 'Volume', value: `${(volume / 1e9).toFixed(volume > 1e8 ? 2 : 4)} m³` },
    {
      label: 'Mass',
      value: mass < 1 ? `${(mass * 1000).toFixed(0)} g` : `${mass.toFixed(mass < 20 ? 1 : 0)} kg`,
      note: `${stone.label} at ${stone.density} kg/m³ — ${lift}.`,
      level: mass > 400 ? 'warn' : 'ok',
    },
    {
      label: 'Surface',
      value:
        num(p, 'erosion') < 0.15
          ? 'Freshly fractured'
          : num(p, 'erosion') < 0.45
            ? 'Weathered'
            : num(p, 'erosion') < 0.8
              ? 'Well worn'
              : 'River-tumbled',
    },
  ]

  if (bool(p, 'geode')) {
    const cavityVolume = volume * Math.pow(num(p, 'cavity'), 3)
    rows.push({
      label: 'Hollow',
      value: `${(cavityVolume / 1e9).toFixed(4)} m³, ${(Math.pow(num(p, 'cavity'), 3) * 100).toFixed(0)}% of it`,
      level: num(p, 'crack') > 0.005 ? 'ok' : 'warn',
      note: num(p, 'crack') > 0.005 ? undefined : 'Sealed. Crack it open to see anything of it.',
    })
  }
  if (num(p, 'moss') > 0) {
    rows.push({ label: 'Growth', value: `${(num(p, 'moss') * 100).toFixed(0)}% of what faces the sky` })
  }
  return rows
}

export const presets = [
  {
    name: 'River pebble',
    params: {
      size: 48, stone: 'flint', seed: 12, detail: 3, flatness: 0.55, elongation: 1.3,
      erosion: 0.95, lumpiness: 0.25, pitting: 0.05, bedding: 0, moss: 0,
    },
  },
  {
    name: 'Beach cobble',
    params: {
      size: 140, stone: 'granite', seed: 44, detail: 3, flatness: 0.62, elongation: 1.15,
      erosion: 0.8, lumpiness: 0.35, pitting: 0.15, bedding: 0, moss: 0,
    },
  },
  {
    name: 'Freshly split flint',
    params: {
      size: 120, stone: 'flint', seed: 91, detail: 3, flatness: 0.8, elongation: 1.05,
      erosion: 0.02, lumpiness: 0.15, pitting: 0.1, bedding: 0, moss: 0,
    },
  },
  {
    name: 'Mossy boulder',
    params: {
      size: 1100, stone: 'granite', seed: 3, detail: 4, flatness: 0.72, elongation: 1.2,
      erosion: 0.45, lumpiness: 0.5, pitting: 0.4, bedding: 0,
      moss: 0.75, mossReach: 0.5, mossDepth: 8, mossColour: 'moss',
    },
  },
  {
    name: 'Bedded sandstone block',
    params: {
      size: 700, stone: 'sandstone', seed: 21, detail: 3, flatness: 0.85, elongation: 1.25,
      erosion: 0.2, lumpiness: 0.3, pitting: 0.3, bedding: 0.8, beds: 7,
      moss: 0.2, mossReach: 0.25, mossColour: 'rust',
    },
  },
  {
    name: 'Amethyst geode, cracked',
    params: {
      size: 260, stone: 'limestone', seed: 5, detail: 4, flatness: 0.8, elongation: 1.05,
      erosion: 0.6, lumpiness: 0.3, pitting: 0.2, crack: 1, geode: true, cavity: 0.55,
      crystalSize: 0.12, crystals: 0.7, crystalColour: 'amethyst', banding: true, moss: 0,
    },
  },
  {
    name: 'Geode, just opening',
    params: {
      size: 200, stone: 'limestone', seed: 33, detail: 4, flatness: 0.86, elongation: 1,
      erosion: 0.7, lumpiness: 0.25, pitting: 0.15, crack: 0.28, geode: true, cavity: 0.5,
      crystalSize: 0.1, crystals: 0.55, crystalColour: 'quartz', banding: true, moss: 0.1,
    },
  },
  {
    name: 'Lichened slate',
    params: {
      size: 420, stone: 'slate', seed: 66, detail: 3, flatness: 0.32, elongation: 1.45,
      erosion: 0.25, lumpiness: 0.25, pitting: 0.2, bedding: 0.45, beds: 11,
      moss: 0.4, mossReach: 0.2, mossDepth: 2, mossColour: 'grey',
    },
  },
]
