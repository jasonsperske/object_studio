// Spiral staircase.
//
// Shows a different tack on the ledge profile: instead of extruding a drawn
// side profile, the wedge tread is bevelled by the extruder so the shaping
// wraps the whole outline, curved outer edge included.

export const meta = {
  order: 2,
  name: 'Spiral staircase',
  description:
    'Wedge treads winding around a central column, with an optional helical handrail. The ledge profile wraps the full tread outline.',
}

const rad = (deg) => (deg * Math.PI) / 180

export const params = [
  { id: 'outerRadius', label: 'Outer radius', type: 'number', min: 300, max: 2000, step: 10, default: 750, unit: 'mm', group: 'Flight' },
  { id: 'totalRise', label: 'Floor-to-floor rise', type: 'number', min: 300, max: 5000, step: 10, default: 2700, unit: 'mm', group: 'Flight' },
  { id: 'steps', label: 'Number of steps', type: 'int', min: 3, max: 40, step: 1, default: 14, group: 'Flight' },
  { id: 'sweep', label: 'Total rotation', type: 'number', min: 90, max: 1080, step: 5, default: 360, unit: '°', group: 'Flight' },
  {
    id: 'direction',
    label: 'Direction',
    type: 'select',
    options: [
      { value: 'cw', label: 'Clockwise up' },
      { value: 'ccw', label: 'Counter-clockwise up' },
    ],
    default: 'cw',
    group: 'Flight',
  },

  { id: 'treadThickness', label: 'Tread thickness', type: 'number', min: 10, max: 120, step: 1, default: 45, unit: 'mm', group: 'Tread & nosing' },
  { id: 'treadInset', label: 'Inset from column', type: 'number', min: 0, max: 300, step: 1, default: 10, unit: 'mm', group: 'Tread & nosing' },
  { id: 'treadGap', label: 'Gap between treads', type: 'number', min: 0, max: 10, step: 0.25, default: 1.5, unit: '°', group: 'Tread & nosing' },
  {
    id: 'edgeStyle',
    label: 'Ledge profile',
    type: 'select',
    options: [
      { value: 'square', label: 'Square' },
      { value: 'chamfer', label: 'Chamfer' },
      { value: 'rounded', label: 'Round-over' },
    ],
    default: 'rounded',
    group: 'Tread & nosing',
  },
  {
    id: 'edgeSize',
    label: 'Profile size',
    type: 'number',
    min: 0,
    max: 25,
    step: 0.5,
    default: 6,
    unit: 'mm',
    group: 'Tread & nosing',
    visibleWhen: (p) => str(p, 'edgeStyle') !== 'square',
  },

  { id: 'columnDiameter', label: 'Column diameter', type: 'number', min: 0, max: 400, step: 5, default: 120, unit: 'mm', group: 'Column' },

  { id: 'handrail', label: 'Handrail', type: 'boolean', default: true, group: 'Handrail' },
  { id: 'railHeight', label: 'Rail height', type: 'number', min: 600, max: 1200, step: 5, default: 950, unit: 'mm', group: 'Handrail', visibleWhen: (p) => bool(p, 'handrail') },
  { id: 'railDiameter', label: 'Rail diameter', type: 'number', min: 20, max: 90, step: 1, default: 45, unit: 'mm', group: 'Handrail', visibleWhen: (p) => bool(p, 'handrail') },
  { id: 'railInset', label: 'Rail inset', type: 'number', min: 0, max: 300, step: 5, default: 60, unit: 'mm', group: 'Handrail', visibleWhen: (p) => bool(p, 'handrail') },
  { id: 'balusters', label: 'Balusters', type: 'boolean', default: true, group: 'Handrail', visibleWhen: (p) => bool(p, 'handrail') },
  { id: 'balusterDiameter', label: 'Baluster diameter', type: 'number', min: 8, max: 60, step: 1, default: 20, unit: 'mm', group: 'Handrail', visibleWhen: (p) => bool(p, 'handrail') && bool(p, 'balusters') },
]

/** One wedge-shaped tread, bevelled around its whole outline. */
function sectorTread(innerR, outerR, startAngle, sweep, thickness, edgeStyle, edgeSize) {
  const bevelSegments = edgeStyle === 'chamfer' ? 1 : edgeStyle === 'square' ? 0 : 3
  const s = bevelSegments === 0 ? 0 : Math.min(edgeSize, thickness / 2 - 0.5, (outerR - innerR) / 4)

  // Draw counter-clockwise regardless of which way the stair winds.
  const a0 = sweep < 0 ? startAngle + sweep : startAngle
  const a1 = sweep < 0 ? startAngle : startAngle + sweep

  const shape = new THREE.Shape()
  shape.absarc(0, 0, outerR, a0, a1, false)
  shape.absarc(0, 0, Math.max(innerR, 1), a1, a0, true)
  shape.closePath()

  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(thickness - 2 * s, 0.1),
    curveSegments: 20,
    bevelEnabled: s > 0,
    bevelThickness: s,
    bevelSize: s,
    bevelSegments,
  })
  // Shape is drawn in XY; stand it up so thickness runs along +Y.
  g.rotateX(-Math.PI / 2)
  g.translate(0, s, 0)
  return g
}

function layout(p) {
  const steps = Math.max(2, Math.round(num(p, 'steps')))
  const totalRise = num(p, 'totalRise')
  const totalSweep = rad(num(p, 'sweep')) * (str(p, 'direction') === 'ccw' ? 1 : -1)
  return {
    steps,
    totalRise,
    rise: totalRise / steps,
    totalSweep,
    stepAngle: totalSweep / steps,
    outerR: num(p, 'outerRadius'),
    columnR: num(p, 'columnDiameter') / 2,
  }
}

export function build(p) {
  const L = layout(p)
  const thickness = num(p, 'treadThickness')
  const gap = rad(num(p, 'treadGap'))
  const innerR = L.columnR + num(p, 'treadInset')
  const parts = []

  const treads = []
  for (let i = 1; i <= L.steps; i++) {
    // Shrink each wedge by half the gap at both ends, whichever way it winds.
    const dir = Math.sign(L.stepAngle) || 1
    const start = (i - 1) * L.stepAngle + (dir * gap) / 2
    const sweep = L.stepAngle - dir * gap
    const g = sectorTread(
      innerR,
      L.outerR,
      start,
      sweep,
      thickness,
      str(p, 'edgeStyle'),
      num(p, 'edgeSize'),
    )
    g.translate(0, i * L.rise - thickness, 0)
    treads.push(g)
  }
  parts.push({ name: 'treads', geometry: merge(treads), color: 0xc79155 })

  if (num(p, 'columnDiameter') > 0) {
    parts.push({
      name: 'column',
      geometry: post(num(p, 'columnDiameter'), L.totalRise, 0, 0, 0, 32),
      color: 0x7d8894,
    })
  }

  if (bool(p, 'handrail')) {
    const railDia = num(p, 'railDiameter')
    const railHeight = num(p, 'railHeight')
    const railR = L.outerR - num(p, 'railInset')

    // Sample the helix, then sweep a tube along it.
    const points = []
    const samples = Math.max(24, L.steps * 4)
    for (let i = 0; i <= samples; i++) {
      const t = i / samples
      const a = t * L.totalSweep + L.stepAngle * 0.5
      const y = t * L.totalRise + railHeight
      points.push(new THREE.Vector3(Math.cos(a) * railR, y, Math.sin(a) * railR))
    }
    const curve = new THREE.CatmullRomCurve3(points)
    parts.push({
      name: 'handrail',
      geometry: new THREE.TubeGeometry(curve, samples, railDia / 2, 12, false),
      color: 0x6f7f92,
    })

    if (bool(p, 'balusters')) {
      const balusters = []
      const dia = num(p, 'balusterDiameter')
      for (let i = 1; i <= L.steps; i++) {
        const a = (i - 0.5) * L.stepAngle
        const base = i * L.rise
        const top = ((i - 0.5) / L.steps) * L.totalRise + railHeight - railDia / 2
        if (top > base) {
          balusters.push(post(dia, top - base, Math.cos(a) * railR, base, Math.sin(a) * railR, 12))
        }
      }
      parts.push({ name: 'balusters', geometry: merge(balusters), color: 0x94a5b8 })
    }
  }

  return parts
}

export function metrics(p) {
  const L = layout(p)
  const walkR = L.outerR * 0.66
  const walkGoing = Math.abs(L.stepAngle) * walkR
  const rule = 2 * L.rise + walkGoing
  const riserLevel = L.rise > 241 ? 'error' : L.rise > 196 ? 'warn' : 'ok'
  const goingLevel = walkGoing < 190 ? 'error' : walkGoing < 254 ? 'warn' : 'ok'

  return [
    {
      label: 'Riser height',
      value: formatLength(L.rise),
      level: riserLevel,
      note: riserLevel === 'ok' ? undefined : 'IRC R311.7.10.1 caps spiral risers at 9½" (241 mm).',
    },
    {
      label: 'Going at walk line',
      value: formatLength(walkGoing),
      level: goingLevel,
      note:
        goingLevel === 'ok'
          ? undefined
          : 'Measured 12" in from the outer edge; spiral stairs need 7½" (190 mm) minimum.',
    },
    { label: '2R + G', value: formatLength(rule) },
    { label: 'Overall diameter', value: formatLength(L.outerR * 2) },
    {
      label: 'Rotation',
      value: `${num(p, 'sweep').toFixed(0)}° ${str(p, 'direction') === 'ccw' ? 'counter-clockwise' : 'clockwise'}`,
    },
  ]
}
