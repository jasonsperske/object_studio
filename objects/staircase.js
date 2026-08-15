// Straight staircase.
//
// This file is the object definition — edit it and the viewer rebuilds live.
// In scope: THREE, and the studio helpers (box, slab, post, tube, boardProfile,
// extrudeProfile, merge, triangleCount, num, str, bool, formatLength). Also
// `studio`, which holds all of them. Geometry is in millimetres; +X is the run,
// +Y is up, +Z is width centred on zero. formatLength renders a millimetre
// length in whatever unit the reader picked in Settings.

export const meta = {
  order: 1,
  name: 'Straight staircase',
  description:
    'A straight flight with a shaped tread nosing, optional risers, stringers and handrail. Riser height is derived from the floor-to-floor rise and the step count.',
}

const EDGE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'chamfer', label: 'Chamfer' },
  { value: 'rounded', label: 'Round-over' },
  { value: 'bullnose', label: 'Bullnose' },
  { value: 'cove', label: 'Cove' },
  { value: 'ogee', label: 'Ogee' },
]

export const params = [
  {
    id: 'width',
    label: 'Width',
    type: 'number',
    min: 400,
    max: 2400,
    step: 10,
    default: 950,
    unit: 'mm',
    group: 'Flight',
    help: 'Clear width across the treads.',
  },
  {
    id: 'totalRise',
    label: 'Floor-to-floor rise',
    type: 'number',
    min: 300,
    max: 5000,
    step: 10,
    default: 2700,
    unit: 'mm',
    group: 'Flight',
  },
  {
    id: 'steps',
    label: 'Number of steps',
    type: 'int',
    min: 2,
    max: 30,
    step: 1,
    default: 15,
    group: 'Flight',
    help: 'Riser height = rise ÷ steps.',
  },
  {
    id: 'going',
    label: 'Going',
    type: 'number',
    min: 150,
    max: 450,
    step: 5,
    default: 280,
    unit: 'mm',
    group: 'Flight',
    help: 'Horizontal run of one step.',
  },
  {
    id: 'topTread',
    label: 'Tread at top floor',
    type: 'boolean',
    default: false,
    group: 'Flight',
    help: 'Off when the upper floor itself forms the last step.',
  },

  {
    id: 'treadThickness',
    label: 'Tread thickness',
    type: 'number',
    min: 10,
    max: 120,
    step: 1,
    default: 42,
    unit: 'mm',
    group: 'Tread & nosing',
  },
  {
    id: 'nosing',
    label: 'Nosing overhang',
    type: 'number',
    min: 0,
    max: 80,
    step: 1,
    default: 25,
    unit: 'mm',
    group: 'Tread & nosing',
  },
  {
    id: 'edgeStyle',
    label: 'Ledge profile',
    type: 'select',
    options: EDGE_OPTIONS,
    default: 'rounded',
    group: 'Tread & nosing',
  },
  {
    id: 'edgeSize',
    label: 'Profile size',
    type: 'number',
    min: 0,
    max: 40,
    step: 0.5,
    default: 12,
    unit: 'mm',
    group: 'Tread & nosing',
    visibleWhen: (p) => str(p, 'edgeStyle') !== 'square' && str(p, 'edgeStyle') !== 'bullnose',
  },

  { id: 'risers', label: 'Closed risers', type: 'boolean', default: true, group: 'Risers' },
  {
    id: 'riserThickness',
    label: 'Riser thickness',
    type: 'number',
    min: 5,
    max: 80,
    step: 1,
    default: 20,
    unit: 'mm',
    group: 'Risers',
    visibleWhen: (p) => bool(p, 'risers'),
  },

  {
    id: 'stringers',
    label: 'Stringers',
    type: 'select',
    options: [
      { value: 'none', label: 'None' },
      { value: 'cut', label: 'Cut (sawtooth)' },
      { value: 'closed', label: 'Closed (housed)' },
    ],
    default: 'closed',
    group: 'Stringers',
  },
  {
    id: 'stringerThickness',
    label: 'Stringer thickness',
    type: 'number',
    min: 15,
    max: 100,
    step: 1,
    default: 38,
    unit: 'mm',
    group: 'Stringers',
    visibleWhen: (p) => str(p, 'stringers') !== 'none',
  },
  {
    id: 'stringerDepth',
    label: 'Stringer depth',
    type: 'number',
    min: 60,
    max: 500,
    step: 5,
    default: 260,
    unit: 'mm',
    group: 'Stringers',
    visibleWhen: (p) => str(p, 'stringers') !== 'none',
    help: 'Measured vertically below the pitch line.',
  },

  {
    id: 'handrail',
    label: 'Handrail',
    type: 'select',
    options: [
      { value: 'none', label: 'None' },
      { value: 'left', label: 'Left side' },
      { value: 'right', label: 'Right side' },
      { value: 'both', label: 'Both sides' },
    ],
    default: 'right',
    group: 'Handrail',
  },
  {
    id: 'railHeight',
    label: 'Rail height',
    type: 'number',
    min: 600,
    max: 1200,
    step: 5,
    default: 900,
    unit: 'mm',
    group: 'Handrail',
    visibleWhen: (p) => str(p, 'handrail') !== 'none',
    help: 'Vertical distance above the nosing line.',
  },
  {
    id: 'railDiameter',
    label: 'Rail diameter',
    type: 'number',
    min: 20,
    max: 90,
    step: 1,
    default: 48,
    unit: 'mm',
    group: 'Handrail',
    visibleWhen: (p) => str(p, 'handrail') !== 'none',
  },
  {
    id: 'balusters',
    label: 'Balusters',
    type: 'boolean',
    default: true,
    group: 'Handrail',
    visibleWhen: (p) => str(p, 'handrail') !== 'none',
  },
  {
    id: 'balusterDiameter',
    label: 'Baluster diameter',
    type: 'number',
    min: 8,
    max: 60,
    step: 1,
    default: 22,
    unit: 'mm',
    group: 'Handrail',
    visibleWhen: (p) => str(p, 'handrail') !== 'none' && bool(p, 'balusters'),
  },
  {
    id: 'balustersPerStep',
    label: 'Balusters per step',
    type: 'int',
    min: 1,
    max: 3,
    step: 1,
    default: 2,
    group: 'Handrail',
    visibleWhen: (p) => str(p, 'handrail') !== 'none' && bool(p, 'balusters'),
  },
]

/** Derived dimensions every part of the build shares. */
function layout(p) {
  const steps = Math.max(1, Math.round(num(p, 'steps')))
  const totalRise = num(p, 'totalRise')
  const going = num(p, 'going')
  const rise = totalRise / steps
  const treadCount = bool(p, 'topTread') ? steps : steps - 1
  return {
    steps,
    rise,
    going,
    totalRise,
    totalRun: steps * going,
    treadCount: Math.max(treadCount, 1),
    width: num(p, 'width'),
    nosing: num(p, 'nosing'),
    treadThickness: num(p, 'treadThickness'),
  }
}

/**
 * Side-view outline of a stringer, drawn counter-clockwise from its bottom-left
 * corner. A cut stringer's top edge follows the step notches; a closed one runs
 * straight, high enough to hide the tread ends. In both cases the underside is
 * parallel to the flight, `depth` below the top, and squared off where it
 * reaches the floor.
 */
function stringerShape(style, steps, going, rise, depth, treadThickness) {
  const totalRun = steps * going
  const totalRise = steps * rise
  const slope = rise / going

  // Height of the top edge at each end of the flight.
  const above = depth * 0.35
  const topAtStart = style === 'closed' ? rise + above : 0
  const topAtEnd = totalRise + topAtStart
  const bottomAtStart = topAtStart - depth

  const shape = new THREE.Shape()
  shape.moveTo(0, Math.max(bottomAtStart, 0))

  if (style === 'cut') {
    // Notches are cut one tread thickness low so the treads sit on them.
    for (let i = 1; i <= steps; i++) {
      const seat = i * rise - treadThickness
      shape.lineTo((i - 1) * going, seat) // riser face
      shape.lineTo(i * going, seat) // tread seat
    }
  } else {
    shape.lineTo(0, topAtStart)
    shape.lineTo(totalRun, topAtEnd)
  }

  shape.lineTo(totalRun, topAtEnd - depth)
  if (bottomAtStart < 0) {
    const meetsFloorAt = -bottomAtStart / slope
    if (meetsFloorAt < totalRun) shape.lineTo(meetsFloorAt, 0)
    shape.lineTo(0, 0)
  }
  shape.closePath()
  return shape
}

export function build(p) {
  const L = layout(p)
  const style = str(p, 'edgeStyle')
  const edgeSize = num(p, 'edgeSize')
  const parts = []

  // --- Treads -------------------------------------------------------------
  const treads = []
  const treadDepth = L.going + L.nosing
  for (let i = 1; i <= L.treadCount; i++) {
    const shape = boardProfile(treadDepth, L.treadThickness, style, edgeSize)
    treads.push(extrudeProfile(shape, L.width, i * L.going, i * L.rise - L.treadThickness, 'back'))
  }
  parts.push({ name: 'treads', geometry: merge(treads), color: 0xc79155 })

  // --- Risers -------------------------------------------------------------
  if (bool(p, 'risers')) {
    const t = num(p, 'riserThickness')
    const risers = []
    for (let i = 1; i <= L.steps; i++) {
      const bottom = (i - 1) * L.rise
      const height = L.rise - (i <= L.treadCount ? L.treadThickness : 0)
      if (height > 0) risers.push(slab(t, height, L.width, (i - 1) * L.going, bottom))
    }
    parts.push({ name: 'risers', geometry: merge(risers), color: 0xe0cdb0 })
  }

  // --- Stringers ----------------------------------------------------------
  const stringerStyle = str(p, 'stringers')
  if (stringerStyle !== 'none') {
    const t = num(p, 'stringerThickness')
    const shape = stringerShape(
      stringerStyle,
      L.steps,
      L.going,
      L.rise,
      num(p, 'stringerDepth'),
      L.treadThickness,
    )
    const geoms = []
    for (const side of [1, -1]) {
      const g = extrudeProfile(shape, t, 0, 0)
      g.translate(0, 0, side * (L.width / 2 + t / 2))
      geoms.push(g)
    }
    parts.push({ name: 'stringers', geometry: merge(geoms), color: 0x8a6a3f })
  }

  // --- Handrail + balusters ----------------------------------------------
  const railSides = str(p, 'handrail')
  if (railSides !== 'none') {
    const railHeight = num(p, 'railHeight')
    const railDia = num(p, 'railDiameter')
    const balusterDia = num(p, 'balusterDiameter')
    const perStep = Math.max(1, Math.round(num(p, 'balustersPerStep')))
    const sides = railSides === 'both' ? [1, -1] : railSides === 'left' ? [1] : [-1]
    const railZOffset = L.width / 2 - Math.max(balusterDia, railDia) / 2 - 15

    // Height of the nosing line at a given run position.
    const nosingLineY = (x) => L.rise + ((x + L.nosing) * L.rise) / L.going
    const xStart = -L.nosing
    const xEnd = (L.treadCount - 1) * L.going

    const rails = []
    const balusters = []

    for (const side of sides) {
      const z = side * railZOffset
      rails.push(
        tube(
          railDia,
          new THREE.Vector3(xStart, nosingLineY(xStart) + railHeight, z),
          new THREE.Vector3(xEnd, nosingLineY(xEnd) + railHeight, z),
        ),
      )

      if (bool(p, 'balusters')) {
        for (let i = 1; i <= L.treadCount; i++) {
          for (let j = 0; j < perStep; j++) {
            const x = (i - 1) * L.going - L.nosing + ((j + 0.5) * L.going) / perStep
            if (x > xEnd) continue
            const base = i * L.rise
            const top = nosingLineY(x) + railHeight - railDia / 2
            if (top > base) balusters.push(post(balusterDia, top - base, x, base, z, 12))
          }
        }
      }
    }

    parts.push({ name: 'handrail', geometry: merge(rails), color: 0x6f7f92 })
    if (balusters.length) {
      parts.push({ name: 'balusters', geometry: merge(balusters), color: 0x94a5b8 })
    }
  }

  return parts
}

export function metrics(p) {
  const L = layout(p)
  const rise = L.rise
  const going = L.going
  const rule = 2 * rise + going
  const pitch = (Math.atan2(rise, going) * 180) / Math.PI

  const riserLevel = rise > 196 ? 'error' : rise > 190 || rise < 100 ? 'warn' : 'ok'
  const goingLevel = going < 254 ? (going < 230 ? 'error' : 'warn') : 'ok'
  const ruleLevel = rule < 550 || rule > 700 ? 'warn' : 'ok'
  const pitchLevel = pitch > 42 ? 'error' : pitch > 37 || pitch < 26 ? 'warn' : 'ok'

  return [
    {
      label: 'Riser height',
      value: formatLength(rise),
      level: riserLevel,
      note: riserLevel === 'ok' ? undefined : 'IRC R311.7.5.1 caps risers at 7¾" (196 mm).',
    },
    {
      label: 'Tread depth (going)',
      value: formatLength(going),
      level: goingLevel,
      note: goingLevel === 'ok' ? undefined : 'IRC R311.7.5.2 requires at least 10" (254 mm).',
    },
    {
      label: '2R + G',
      value: formatLength(rule),
      level: ruleLevel,
      note: ruleLevel === 'ok' ? undefined : 'Comfortable stairs land between 550 and 700 mm.',
    },
    {
      label: 'Pitch',
      value: `${pitch.toFixed(1)}°`,
      level: pitchLevel,
      note: pitchLevel === 'ok' ? undefined : 'Domestic stairs are usually 30–37°.',
    },
    { label: 'Total run', value: formatLength(L.totalRun) },
    { label: 'Treads drawn', value: `${L.treadCount} of ${L.steps} steps` },
  ]
}
