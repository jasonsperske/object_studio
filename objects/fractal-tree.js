// Fractal tree.
//
// A recursive branching system: every limb spawns a ring of children, each
// shorter, thinner and angled away from its parent. Which tree you get is
// mostly a matter of how strongly the leader keeps going (apical dominance),
// how wide the side branches sit, and what hangs off the ends.
//
// Randomness is seeded, so a given seed always rebuilds the same tree.

export const meta = {
  order: 4,
  name: 'Fractal tree',
  description:
    'A seeded recursive tree — branch count, angle, taper and droop shape the habit, with leaf and fruit or blossom models on the outer growth.',
}

// Runaway recursion is easy to ask for: 5 branches over 7 levels is 78,000
// limbs. These caps keep a careless slider from locking the tab up.
const MAX_LIMBS = 3000
const MAX_LEAVES = 6000
const MAX_FRUIT = 800

const FOLIAGE = {
  green: 0x4f7a3a,
  deep: 0x2f5a2c,
  olive: 0x6f7f3c,
  blue: 0x4c6b5c,
  autumn: 0xc2761f,
  copper: 0x8f3f1c,
}

const FRUIT_COLOR = {
  red: 0xb32222,
  gold: 0xd9a326,
  purple: 0x5b2a68,
  white: 0xf0ece0,
  pink: 0xe79bb4,
  brown: 0x6b4a2a,
}

export const params = [
  // --- Trunk & branches ---------------------------------------------------
  { id: 'height', label: 'Trunk length', type: 'number', min: 200, max: 6000, step: 20, default: 1400, unit: 'mm', group: 'Trunk & branches', help: 'Length of the first limb; the tree ends up taller than this.' },
  { id: 'thickness', label: 'Branch thickness', type: 'number', min: 8, max: 500, step: 2, default: 110, unit: 'mm', group: 'Trunk & branches', help: 'Diameter at the base of the trunk.' },
  { id: 'taper', label: 'Taper', type: 'number', min: 0.4, max: 0.95, step: 0.01, default: 0.72, group: 'Trunk & branches', help: 'Thickness kept at each split.' },
  { id: 'levels', label: 'Levels', type: 'int', min: 1, max: 8, step: 1, default: 5, group: 'Trunk & branches', help: 'Depth of recursion.' },
  { id: 'branches', label: 'Branch frequency', type: 'int', min: 1, max: 5, step: 1, default: 3, group: 'Trunk & branches', help: 'Side branches at each split.' },
  { id: 'branchAngle', label: 'Branch angle', type: 'number', min: 5, max: 85, step: 1, default: 38, unit: '°', group: 'Trunk & branches' },
  { id: 'lengthRatio', label: 'Length ratio', type: 'number', min: 0.4, max: 0.95, step: 0.01, default: 0.74, group: 'Trunk & branches', help: 'Length kept at each split.' },
  { id: 'apical', label: 'Apical dominance', type: 'number', min: 0, max: 1, step: 0.05, default: 0.3, group: 'Trunk & branches', help: 'How strongly a leader carries straight on. High makes a conifer, low a spreading crown.' },
  { id: 'twist', label: 'Twist per level', type: 'number', min: 0, max: 180, step: 0.5, default: 137.5, unit: '°', group: 'Trunk & branches', help: 'Rotation between successive whorls. 137.5° is the golden angle.' },
  { id: 'droop', label: 'Droop', type: 'number', min: -50, max: 50, step: 1, default: 0, unit: '°', group: 'Trunk & branches', help: 'Positive weeps down, negative sweeps up.' },
  { id: 'irregularity', label: 'Irregularity', type: 'number', min: 0, max: 1, step: 0.05, default: 0.3, group: 'Trunk & branches' },
  { id: 'seed', label: 'Seed', type: 'int', min: 1, max: 9999, step: 1, default: 7, group: 'Trunk & branches', help: 'Same seed, same tree.' },

  // --- Foliage ------------------------------------------------------------
  {
    id: 'leafModel',
    label: 'Leaf model',
    type: 'select',
    default: 'blade',
    group: 'Foliage',
    options: [
      { value: 'none', label: 'Bare' },
      { value: 'blade', label: 'Blade — simple pointed leaf' },
      { value: 'lobed', label: 'Lobed — oak' },
      { value: 'round', label: 'Round — poplar' },
      { value: 'heart', label: 'Heart — lime, birch' },
      { value: 'needle', label: 'Needle — conifer' },
    ],
  },
  { id: 'leafSize', label: 'Leaf size', type: 'number', min: 5, max: 400, step: 1, default: 90, unit: 'mm', group: 'Foliage', visibleWhen: (p) => str(p, 'leafModel') !== 'none' },
  { id: 'leafDensity', label: 'Leaf frequency', type: 'number', min: 0, max: 100, step: 1, default: 70, unit: '%', group: 'Foliage', visibleWhen: (p) => str(p, 'leafModel') !== 'none' },
  { id: 'leafLevels', label: 'Leafy levels', type: 'int', min: 1, max: 4, step: 1, default: 2, group: 'Foliage', help: 'How many of the outermost levels carry leaves.', visibleWhen: (p) => str(p, 'leafModel') !== 'none' },
  {
    id: 'foliageColor',
    label: 'Foliage colour',
    type: 'select',
    default: 'green',
    group: 'Foliage',
    visibleWhen: (p) => str(p, 'leafModel') !== 'none',
    options: [
      { value: 'green', label: 'Green' },
      { value: 'deep', label: 'Deep green' },
      { value: 'olive', label: 'Olive' },
      { value: 'blue', label: 'Blue-green' },
      { value: 'autumn', label: 'Autumn amber' },
      { value: 'copper', label: 'Copper' },
    ],
  },

  // --- Fruit & flowers ----------------------------------------------------
  {
    id: 'fruitModel',
    label: 'Fruit / flower model',
    type: 'select',
    default: 'none',
    group: 'Fruit & flowers',
    options: [
      { value: 'none', label: 'None' },
      { value: 'berry', label: 'Berry' },
      { value: 'apple', label: 'Apple — round fruit' },
      { value: 'acorn', label: 'Acorn' },
      { value: 'cone', label: 'Cone' },
      { value: 'blossom', label: 'Blossom' },
    ],
  },
  { id: 'fruitSize', label: 'Fruit size', type: 'number', min: 4, max: 250, step: 1, default: 55, unit: 'mm', group: 'Fruit & flowers', visibleWhen: (p) => str(p, 'fruitModel') !== 'none' },
  { id: 'fruitFrequency', label: 'Fruit frequency', type: 'number', min: 0, max: 100, step: 1, default: 30, unit: '%', group: 'Fruit & flowers', visibleWhen: (p) => str(p, 'fruitModel') !== 'none' },
  {
    id: 'fruitColor',
    label: 'Fruit colour',
    type: 'select',
    default: 'red',
    group: 'Fruit & flowers',
    visibleWhen: (p) => str(p, 'fruitModel') !== 'none',
    options: [
      { value: 'red', label: 'Red' },
      { value: 'gold', label: 'Gold' },
      { value: 'purple', label: 'Purple' },
      { value: 'white', label: 'White' },
      { value: 'pink', label: 'Pink' },
      { value: 'brown', label: 'Brown' },
    ],
  },
]

// Presets ship with the object: they are part of what a fractal tree is, and
// only list the properties that differ from the defaults above.
export const presets = [
  {
    name: 'Pine tree',
    params: {
      height: 1800, thickness: 160, taper: 0.82, branches: 4, branchAngle: 74,
      lengthRatio: 0.5, apical: 0.98, twist: 90, droop: 22, irregularity: 0.22, seed: 21,
      leafModel: 'needle', leafSize: 210, leafDensity: 100, foliageColor: 'deep',
      fruitModel: 'cone', fruitSize: 110, fruitFrequency: 22, fruitColor: 'brown'
    },
  },
  {
    name: 'Oak tree',
    params: {
      height: 1500, thickness: 300, taper: 0.7, branchAngle: 46, lengthRatio: 0.76,
      apical: 0.12, droop: -4, irregularity: 0.5, seed: 4, leafModel: 'lobed',
      leafSize: 150, leafDensity: 85, fruitModel: 'acorn', fruitSize: 60,
      fruitFrequency: 25, fruitColor: 'brown'
    },
  },
  {
    name: 'Silver birch',
    params: {
      height: 1900, thickness: 90, taper: 0.76, branches: 2, branchAngle: 32,
      lengthRatio: 0.78, apical: 0.65, droop: 20, irregularity: 0.35, seed: 12,
      leafModel: 'heart', leafSize: 80, leafDensity: 80, foliageColor: 'olive',
      fruitFrequency: 0, fruitColor: 'gold'
    },
  },
  {
    name: 'Apple tree',
    params: {
      height: 900, thickness: 160, taper: 0.68, branchAngle: 52, apical: 0.1, droop: 10,
      irregularity: 0.5, seed: 33, leafSize: 95, leafDensity: 80, fruitModel: 'apple',
      fruitSize: 75, fruitFrequency: 35
    },
  },
  {
    name: 'Cherry blossom',
    params: {
      height: 1200, thickness: 180, taper: 0.7, branchAngle: 48, lengthRatio: 0.76,
      apical: 0.18, droop: 16, irregularity: 0.4, seed: 58, leafSize: 65, leafDensity: 30,
      foliageColor: 'olive', fruitModel: 'blossom', fruitSize: 70, fruitFrequency: 90,
      fruitColor: 'pink'
    },
  },
  {
    name: 'Weeping willow',
    params: {
      height: 1700, thickness: 200, taper: 0.74, branchAngle: 42, lengthRatio: 0.82,
      apical: 0.4, droop: 45, irregularity: 0.4, seed: 77, leafSize: 120, leafDensity: 90,
      leafLevels: 3, foliageColor: 'olive', fruitFrequency: 0, fruitColor: 'gold'
    },
  },
]

// --- helpers ---------------------------------------------------------------

/** Small, fast, seedable PRNG — the tree must rebuild identically every time. */
function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Tapered cylinder from a to b. */
function limb(a, b, radiusBottom, radiusTop, segments) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const length = Math.max(dir.length(), 0.1)
  const g = new THREE.CylinderGeometry(
    Math.max(radiusTop, 0.2),
    Math.max(radiusBottom, 0.2),
    length,
    segments,
  )
  g.applyQuaternion(
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
  )
  g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
  return g
}

/**
 * One leaf, lying in the XZ plane with its stalk at the origin and its tip
 * along +Y, so an instance only has to be rotated onto the branch.
 */
function leafPrototype(model, size) {
  if (model === 'needle') {
    // A fascicle, not a single needle: one 2" needle is sub-pixel on a whole
    // tree, so conifer foliage is modelled as the tuft it reads as.
    const g = new THREE.ConeGeometry(size * 0.22, size, 5)
    g.translate(0, size / 2, 0)
    return g
  }

  const w = size * 0.5
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  if (model === 'round') {
    shape.absarc(0, size / 2, size / 2, -Math.PI / 2, Math.PI * 1.5, false)
  } else if (model === 'heart') {
    shape.bezierCurveTo(w * 1.6, size * 0.25, w * 1.1, size * 1.05, 0, size * 0.82)
    shape.bezierCurveTo(-w * 1.1, size * 1.05, -w * 1.6, size * 0.25, 0, 0)
  } else if (model === 'lobed') {
    // Three lobes a side, drawn as alternating in-and-out curves. More than
    // that costs triangles across thousands of leaves without reading at all.
    const lobes = 3
    for (const side of [1, -1]) {
      const from = side === 1 ? 0 : 1
      for (let i = 0; i < lobes; i++) {
        const t0 = from === 0 ? i / lobes : 1 - i / lobes
        const t1 = from === 0 ? (i + 1) / lobes : 1 - (i + 1) / lobes
        const out = w * (0.45 + 0.55 * Math.sin(Math.PI * ((t0 + t1) / 2)))
        shape.quadraticCurveTo(side * out, size * ((t0 + t1) / 2), side * w * 0.22, size * t1)
      }
    }
  } else {
    // blade
    shape.quadraticCurveTo(w, size * 0.3, 0, size)
    shape.quadraticCurveTo(-w, size * 0.3, 0, 0)
  }

  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(size * 0.015, 0.3),
    bevelEnabled: false,
    curveSegments: 3,
  })
  // Drawn in XY; lay it flat so its length runs along +Y.
  g.rotateX(Math.PI / 2)
  return g
}

/** One fruit or flower, sitting just below the origin so it hangs off a tip. */
function fruitPrototype(model, size) {
  const r = size / 2
  if (model === 'cone') {
    const g = new THREE.ConeGeometry(r * 0.7, size * 1.8, 8)
    g.rotateX(Math.PI)
    g.translate(0, -size * 0.9, 0)
    return g
  }
  if (model === 'acorn') {
    const nut = new THREE.SphereGeometry(r, 8, 6)
    nut.scale(1, 1.35, 1)
    nut.translate(0, -r * 1.35, 0)
    const cap = new THREE.CylinderGeometry(r * 1.05, r * 0.75, r * 0.7, 8)
    cap.translate(0, -r * 0.35, 0)
    return merge([nut, cap])
  }
  if (model === 'blossom') {
    const petals = []
    for (let i = 0; i < 5; i++) {
      const petal = new THREE.SphereGeometry(r * 0.55, 6, 5)
      petal.scale(1, 0.35, 1.5)
      const angle = (i / 5) * Math.PI * 2
      petal.translate(Math.cos(angle) * r * 0.75, 0, Math.sin(angle) * r * 0.75)
      petals.push(petal)
    }
    const centre = new THREE.SphereGeometry(r * 0.3, 6, 5)
    petals.push(centre)
    const g = merge(petals)
    g.translate(0, -r * 0.4, 0)
    return g
  }

  // berry / apple
  const g = new THREE.SphereGeometry(r, 8, 6)
  if (model === 'apple') g.scale(1, 0.88, 1)
  g.translate(0, -r * 1.1, 0)
  return g
}

/** Grows the tree once and hands back everything both build and metrics need. */
function grow(p) {
  const rng = mulberry32(Math.round(num(p, 'seed')))
  const levels = Math.round(num(p, 'levels'))
  const branches = Math.round(num(p, 'branches'))
  const leafLevels = Math.round(num(p, 'leafLevels'))
  const wobble = num(p, 'irregularity')
  const angle = (num(p, 'branchAngle') * Math.PI) / 180
  const twist = (num(p, 'twist') * Math.PI) / 180
  const droop = (num(p, 'droop') * Math.PI) / 180
  const apical = num(p, 'apical')
  const lengthRatio = num(p, 'lengthRatio')
  const taper = num(p, 'taper')

  const limbs = []
  /** Where foliage may hang: position, direction, and how far out it is. */
  const sites = []
  let capped = false

  // Random unit vector perpendicular to `axis`, for spreading children around it.
  const perpendicular = (axis) => {
    const helper = Math.abs(axis.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
    return new THREE.Vector3().crossVectors(axis, helper).normalize()
  }

  const jitter = (amount) => 1 + (rng() - 0.5) * 2 * amount * wobble

  function branch(origin, direction, length, radius, depth) {
    if (limbs.length >= MAX_LIMBS) {
      capped = true
      return
    }
    const dir = direction.clone().normalize()
    const end = origin.clone().addScaledVector(dir, length)
    const radiusTop = radius * taper
    limbs.push(limb(origin, end, radius, radiusTop, depth > levels - 2 ? 7 : 5))

    if (depth >= levels - leafLevels) {
      sites.push({ start: origin.clone(), end, dir, tip: depth === levels })
    }
    if (depth >= levels) return

    // The leader carries on nearly straight; side branches ring around it.
    const children = []
    if (apical > 0.05) {
      children.push({
        tilt: angle * (1 - apical) * jitter(0.4),
        azimuth: rng() * Math.PI * 2,
        scale: lengthRatio * (1 + apical * 0.35),
      })
    }
    for (let i = 0; i < branches; i++) {
      children.push({
        tilt: angle * jitter(0.35),
        azimuth: twist * depth + (i / branches) * Math.PI * 2 + rng() * wobble,
        scale: lengthRatio * jitter(0.25),
      })
    }

    for (const child of children) {
      const axis = perpendicular(dir)
      const next = dir
        .clone()
        .applyAxisAngle(axis, child.tilt)
        .applyAxisAngle(dir, child.azimuth)
      // Droop pulls the tip toward (or away from) the ground.
      if (droop !== 0) {
        const horizontal = new THREE.Vector3(next.x, 0, next.z)
        if (horizontal.lengthSq() > 1e-6) {
          next.applyAxisAngle(
            new THREE.Vector3().crossVectors(next, new THREE.Vector3(0, 1, 0)).normalize(),
            droop * (0.4 + 0.6 * (depth / levels)),
          )
        }
      }
      branch(end, next.normalize(), length * child.scale, radiusTop, depth + 1)
    }
  }

  branch(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    num(p, 'height'),
    num(p, 'thickness') / 2,
    1,
  )

  return { limbs, sites, rng, capped }
}

export function build(p) {
  const { limbs, sites, rng } = grow(p)
  const parts = [{ name: 'branches', geometry: merge(limbs), color: 0x6b4f34 }]

  const leafModel = str(p, 'leafModel')
  const fruitModel = str(p, 'fruitModel')
  const leafChance = num(p, 'leafDensity') / 100
  const fruitChance = num(p, 'fruitFrequency') / 100

  // A leaf or fruit is one prototype geometry stamped out under a matrix —
  // rebuilding the outline per instance would be thousands of extrusions.
  const up = new THREE.Vector3(0, 1, 0)
  const matrix = new THREE.Matrix4()
  const quaternion = new THREE.Quaternion()

  if (leafModel !== 'none' && leafChance > 0) {
    const proto = leafPrototype(leafModel, num(p, 'leafSize'))
    const perLimb = leafModel === 'needle' ? 12 : 6
    const leaves = []

    for (const site of sites) {
      // Axis to tilt away from the branch about; degenerate only if the branch
      // happens to point straight up.
      const sideAxis = new THREE.Vector3().crossVectors(site.dir, up)
      if (sideAxis.lengthSq() < 1e-8) sideAxis.set(1, 0, 0)
      sideAxis.normalize()

      for (let i = 0; i < perLimb && leaves.length < MAX_LEAVES; i++) {
        if (rng() > leafChance) continue
        const along = 0.2 + 0.8 * ((i + rng()) / perLimb)
        const at = site.start.clone().lerp(site.end, along)
        // Splay out from the branch, then roll around it.
        const outward = site.dir
          .clone()
          .applyAxisAngle(sideAxis, Math.PI * (0.2 + rng() * 0.35))
          .applyAxisAngle(site.dir, rng() * Math.PI * 2)
          .normalize()
        quaternion.setFromUnitVectors(up, outward)
        const scale = 0.75 + rng() * 0.5
        matrix.compose(at, quaternion, new THREE.Vector3(scale, scale, scale))
        leaves.push(proto.clone().applyMatrix4(matrix))
      }
    }
    proto.dispose()
    if (leaves.length) {
      parts.push({ name: 'leaves', geometry: merge(leaves), color: FOLIAGE[str(p, 'foliageColor')] ?? FOLIAGE.green })
    }
  }

  if (fruitModel !== 'none' && fruitChance > 0) {
    const proto = fruitPrototype(fruitModel, num(p, 'fruitSize'))
    const fruits = []
    for (const site of sites) {
      if (!site.tip) continue
      if (fruits.length >= MAX_FRUIT) break
      if (rng() > fruitChance) continue
      // Blossom faces along the branch; fruit hangs straight down.
      const orientation =
        fruitModel === 'blossom'
          ? quaternion.setFromUnitVectors(up, site.dir.clone().normalize())
          : quaternion.identity()
      matrix.compose(site.end, orientation, new THREE.Vector3(1, 1, 1))
      fruits.push(proto.clone().applyMatrix4(matrix))
    }
    proto.dispose()
    if (fruits.length) {
      parts.push({
        name: fruitModel === 'blossom' ? 'blossom' : 'fruit',
        geometry: merge(fruits),
        color: FRUIT_COLOR[str(p, 'fruitColor')] ?? FRUIT_COLOR.red,
      })
    }
  }

  return parts
}

export function metrics(p) {
  const { limbs, sites, capped } = grow(p)

  // Reach of the crown, measured from the trunk.
  let spread = 0
  let top = 0
  for (const site of sites) {
    spread = Math.max(spread, Math.hypot(site.end.x, site.end.z))
    top = Math.max(top, site.end.y)
  }

  return [
    { label: 'Height', value: formatLength(top) },
    { label: 'Crown spread', value: formatLength(spread * 2) },
    {
      label: 'Limbs',
      value: capped ? `${limbs.length.toLocaleString()} (capped)` : limbs.length.toLocaleString(),
      level: capped ? 'warn' : 'ok',
      note: capped ? 'Growth stopped at the limb cap — lower Levels or Branch frequency.' : undefined,
    },
    { label: 'Foliage sites', value: sites.length.toLocaleString() },
  ]
}
