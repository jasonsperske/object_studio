// CRT television, 1948–2008.
//
// A tube, and something built round it. The tube is the whole specification: a
// cathode ray tube of a given diagonal is a given width, height and depth, and
// every set ever made was a cabinet drawn round that glass with room behind it
// for the neck and the chassis. Nothing here is styling for its own sake — the
// case is as deep as the funnel and no deeper.
//
// What changed over sixty years was not the tube but the cabinet and the
// controls, and those are the two dials worth turning. A set began as a piece
// of furniture standing on the floor, veneered and moulded and often with doors
// that shut over the screen. It became a moulded box on a sideboard with a
// column of knobs down one side and the speaker under them. And it ended as a
// black box with four small buttons below the glass, because everything you
// actually did to it had moved onto the remote control.
//
// Built with the front at -X and turned at the end to face +Z, which is where
// the studio's Front view looks from. Width then runs along X centred on zero,
// +Y is up, and the floor — or the sideboard, or whatever it stands on — is
// Y = 0.

export const meta = {
  order: 15,
  name: 'CRT television',
  description:
    'The tube television, 1948–2008 — sized by its tube and housed in a console, a moulded box, a portable or a late black box, with the dials, push-buttons or nothing-at-all its own years had.',
}

const ASPECT = {
  fourThree: { w: 0.8, h: 0.6, depth: 0.86, label: '4:3' },
  sixteenNine: { w: 0.872, h: 0.49, depth: 0.74, label: '16:9' },
}

const FINISH = {
  walnut: { shell: 0x6a4526, trim: 0x4a2f18, knob: 0x241a10, cloth: 0xa79877 },
  teak: { shell: 0x9a6534, trim: 0x6f4522, knob: 0x2a1d12, cloth: 0xb0a181 },
  oak: { shell: 0xb08a51, trim: 0x8a6636, knob: 0x3a2a17, cloth: 0xc6b592 },
  woodgrain: { shell: 0x7d5a35, trim: 0x543c22, knob: 0x2b2119, cloth: 0x9c8f74 },
  cream: { shell: 0xe0d6bd, trim: 0xc9bda0, knob: 0x54493a, cloth: 0xb9ae95 },
  red: { shell: 0xb03427, trim: 0x8a251b, knob: 0x2a2320, cloth: 0xd8cfc2 },
  charcoal: { shell: 0x3a3d41, trim: 0x2b2e32, knob: 0x1b1d20, cloth: 0x33363a },
  silver: { shell: 0xb9bec3, trim: 0x8f9499, knob: 0x35383c, cloth: 0x6f7479 },
}

const COLOR = {
  dark: 0x1b1e21,
  glassOff: 0x2c312e,
  colour: 0xd2e2f0,
  monochrome: 0xd6d8d2,
  lamp: 0xe2564a,
  metal: 0xc2c7cc,
}

export const params = [
  // --- Tube ---------------------------------------------------------------
  {
    id: 'tube',
    label: 'Tube',
    type: 'number',
    min: 5,
    max: 40,
    step: 0.5,
    default: 21,
    unit: '″',
    group: 'Tube',
    help: 'Diagonal, corner to corner. 12″ is a portable, 21″ the family set, 32″ about as big as a tube ever sensibly got.',
  },
  {
    id: 'aspect',
    label: 'Shape',
    type: 'select',
    default: 'fourThree',
    group: 'Tube',
    options: [
      { value: 'fourThree', label: '4:3 — every tube until the late nineties' },
      { value: 'sixteenNine', label: '16:9 — the widescreen tubes, 1998 on' },
    ],
  },
  {
    id: 'faceCurve',
    label: 'Curve of the glass',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 65,
    unit: '%',
    group: 'Tube',
    help: 'A domed face with rounded corners early on, flat and square by the end. Rounds the screen corners and bulges the glass out of the moulding.',
  },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: true, group: 'Tube' },
  {
    id: 'picture',
    label: 'Picture',
    type: 'select',
    default: 'colour',
    group: 'Tube',
    visibleWhen: (p) => bool(p, 'screenOn'),
    options: [
      { value: 'colour', label: 'Colour' },
      { value: 'monochrome', label: 'Black and white' },
    ],
  },

  // --- Cabinet ------------------------------------------------------------
  {
    id: 'cabinet',
    label: 'Cabinet',
    type: 'select',
    default: 'tabletop',
    group: 'Cabinet',
    help: 'What the tube is housed in. This is the decade, more than anything else here.',
    options: [
      { value: 'console', label: 'Console — furniture, standing on the floor' },
      { value: 'tabletop', label: 'Tabletop — the moulded box on a sideboard' },
      { value: 'portable', label: 'Portable — small, rounded, a handle over the top' },
      { value: 'blackBox', label: 'Black box — the late set on its own plinth' },
    ],
  },
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'woodgrain',
    group: 'Cabinet',
    options: [
      { value: 'walnut', label: 'Walnut' },
      { value: 'teak', label: 'Teak' },
      { value: 'oak', label: 'Oak' },
      { value: 'woodgrain', label: 'Printed woodgrain over chipboard' },
      { value: 'cream', label: 'Cream plastic' },
      { value: 'red', label: 'Red plastic' },
      { value: 'charcoal', label: 'Charcoal' },
      { value: 'silver', label: 'Silver' },
    ],
  },
  {
    id: 'bezel',
    label: 'Bezel',
    type: 'number',
    min: 8,
    max: 140,
    step: 1,
    default: 40,
    unit: 'mm',
    group: 'Cabinet',
    help: 'Moulding between the glass and the edge of the cabinet.',
  },
  { id: 'radius', label: 'Corner radius', type: 'number', min: 0, max: 90, step: 1, default: 18, unit: 'mm', group: 'Cabinet' },
  {
    id: 'depthAllowance',
    label: 'Room behind the tube',
    type: 'number',
    min: 20,
    max: 320,
    step: 5,
    default: 70,
    unit: 'mm',
    group: 'Cabinet',
    help: 'The neck, the yoke and the chassis, and air round all three.',
  },
  {
    id: 'taperBack',
    label: 'Tapered back',
    type: 'boolean',
    default: true,
    group: 'Cabinet',
    visibleWhen: (p) => str(p, 'cabinet') !== 'console',
    help: 'The moulded back drawn in toward the neck — the sides and the top come in, the bottom stays flat because the set has to stand on it. A console hides the same tube in a square box.',
  },
  { id: 'vents', label: 'Vents in the back', type: 'boolean', default: true, group: 'Cabinet' },
  { id: 'badge', label: 'Badge', type: 'boolean', default: true, group: 'Cabinet' },
  {
    id: 'handle',
    label: 'Carry handle',
    type: 'boolean',
    default: true,
    group: 'Cabinet',
    visibleWhen: (p) => str(p, 'cabinet') === 'portable',
  },

  // --- Console ------------------------------------------------------------
  {
    id: 'cabinetMargin',
    label: 'Timber round the works',
    type: 'number',
    min: 0,
    max: 600,
    step: 10,
    default: 220,
    unit: 'mm',
    group: 'Console',
    visibleWhen: (p) => str(p, 'cabinet') === 'console',
    help: 'How far the cabinet runs past the tube each side — the room the speakers, the record deck and the drinks went in.',
  },
  {
    id: 'ornament',
    label: 'Ornament',
    type: 'int',
    min: 0,
    max: 5,
    step: 1,
    default: 2,
    group: 'Console',
    visibleWhen: (p) => str(p, 'cabinet') === 'console',
    help: 'A plain box at 0. A base moulding at 1, a cornice at 2, corner pilasters at 3, fluting at 4, and a beaded frame round the grille at 5.',
  },
  {
    id: 'legs',
    label: 'Legs',
    type: 'select',
    default: 'tapered',
    group: 'Console',
    visibleWhen: (p) => str(p, 'cabinet') === 'console',
    options: [
      { value: 'tapered', label: 'Splayed and tapered — the Danish one' },
      { value: 'turned', label: 'Turned' },
      { value: 'cabriole', label: 'Cabriole, on a pad foot' },
      { value: 'bracket', label: 'Bracket feet' },
      { value: 'plinth', label: 'A recessed plinth to the floor' },
      { value: 'none', label: 'Straight to the floor' },
    ],
  },
  {
    id: 'legHeight',
    label: 'How far it stands off the floor',
    type: 'number',
    min: 20,
    max: 420,
    step: 5,
    default: 200,
    unit: 'mm',
    group: 'Console',
    visibleWhen: (p) => str(p, 'cabinet') === 'console' && str(p, 'legs') !== 'none',
  },
  {
    id: 'legThickness',
    label: 'Leg thickness',
    type: 'number',
    min: 20,
    max: 120,
    step: 2,
    default: 46,
    unit: 'mm',
    group: 'Console',
    visibleWhen: (p) => str(p, 'cabinet') === 'console' && !['plinth', 'none'].includes(str(p, 'legs')),
  },
  {
    id: 'splay',
    label: 'Leg splay',
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    default: 8,
    unit: '°',
    group: 'Console',
    visibleWhen: (p) => str(p, 'cabinet') === 'console' && str(p, 'legs') === 'tapered',
  },
  {
    id: 'doors',
    label: 'Doors over the screen',
    type: 'select',
    default: 'none',
    group: 'Console',
    visibleWhen: (p) => str(p, 'cabinet') === 'console',
    help: 'The pair that shut the television away and left you a sideboard.',
    options: [
      { value: 'none', label: 'None' },
      { value: 'open', label: 'Folded back against the sides' },
      { value: 'closed', label: 'Shut' },
    ],
  },

  // --- Controls -----------------------------------------------------------
  {
    id: 'controls',
    label: 'Controls',
    type: 'select',
    default: 'sideDials',
    group: 'Controls',
    help: 'Where the things you turn or press actually are. The single most dating detail on a television.',
    options: [
      { value: 'sideDials', label: 'Dials down one side, above the speaker' },
      { value: 'frontDials', label: 'Dials in a row across the front' },
      { value: 'pushButtons', label: 'A row of tuning push-buttons' },
      { value: 'discreet', label: 'Small buttons under the screen — the remote era' },
      { value: 'none', label: 'Nothing on show at all' },
    ],
  },
  {
    id: 'dials',
    label: 'How many dials',
    type: 'int',
    min: 1,
    max: 6,
    step: 1,
    default: 3,
    group: 'Controls',
    visibleWhen: (p) => ['sideDials', 'frontDials'].includes(str(p, 'controls')),
    help: 'Channel and volume at two; add fine tune, brightness, contrast and hold as it climbs.',
  },
  {
    id: 'dialSize',
    label: 'Dial diameter',
    type: 'number',
    min: 14,
    max: 80,
    step: 1,
    default: 38,
    unit: 'mm',
    group: 'Controls',
    visibleWhen: (p) => ['sideDials', 'frontDials'].includes(str(p, 'controls')),
  },
  {
    id: 'buttons',
    label: 'How many buttons',
    type: 'int',
    min: 2,
    max: 14,
    step: 1,
    default: 6,
    group: 'Controls',
    visibleWhen: (p) => ['pushButtons', 'discreet'].includes(str(p, 'controls')),
  },
  {
    id: 'flap',
    label: 'A flap over them',
    type: 'boolean',
    default: false,
    group: 'Controls',
    visibleWhen: (p) => str(p, 'controls') !== 'none',
    help: 'Hinged along the bottom and drawn hanging open, so you can see both it and what it hides.',
  },
  { id: 'standby', label: 'Standby lamp', type: 'boolean', default: true, group: 'Controls' },
  {
    id: 'remote',
    label: 'Remote control',
    type: 'boolean',
    default: false,
    group: 'Controls',
    help: 'A handset lying in front of the set.',
  },

  // --- Speaker ------------------------------------------------------------
  {
    id: 'speaker',
    label: 'Speaker',
    type: 'select',
    default: 'side',
    group: 'Speaker',
    options: [
      { value: 'side', label: 'Beside the screen, under the dials' },
      { value: 'below', label: 'Across the front under the screen' },
      { value: 'both', label: 'Both' },
      { value: 'none', label: 'None on the front' },
    ],
  },
  {
    id: 'grille',
    label: 'Grille',
    type: 'select',
    default: 'cloth',
    group: 'Speaker',
    visibleWhen: (p) => str(p, 'speaker') !== 'none',
    options: [
      { value: 'cloth', label: 'Cloth in a frame' },
      { value: 'perforated', label: 'Perforated plastic' },
      { value: 'slots', label: 'Moulded slots' },
      { value: 'fret', label: 'Cut fretwork over cloth — the furniture sets' },
    ],
  },

  // --- Aerial -------------------------------------------------------------
  {
    id: 'aerial',
    label: 'Aerial',
    type: 'select',
    default: 'rabbitEars',
    group: 'Aerial',
    options: [
      { value: 'none', label: 'None — fed off the roof' },
      { value: 'telescopic', label: 'One telescopic rod' },
      { value: 'rabbitEars', label: 'Rabbit ears — two rods in a V' },
      { value: 'loopAndDipole', label: 'A UHF loop and a VHF dipole' },
    ],
  },
  {
    id: 'aerialLength',
    label: 'Rod length',
    type: 'number',
    min: 150,
    max: 1400,
    step: 10,
    default: 700,
    unit: 'mm',
    group: 'Aerial',
    visibleWhen: (p) => str(p, 'aerial') !== 'none',
    help: 'Fully extended. Telescopic rods came in at about a fifth of this.',
  },
  {
    id: 'aerialSpread',
    label: 'Spread',
    type: 'number',
    min: 0,
    max: 80,
    step: 1,
    default: 45,
    unit: '°',
    group: 'Aerial',
    visibleWhen: (p) => ['rabbitEars', 'loopAndDipole'].includes(str(p, 'aerial')),
  },
]

// ---------------------------------------------------------------------------
// Size
//
// A tube of a given diagonal in a given aspect is a given face and a given
// depth, and the cabinet is that plus the moulding round it, the bands the
// speaker and the controls need, and the room behind for the chassis.
// ---------------------------------------------------------------------------

function tubeSize(inches, aspectKey) {
  const aspect = ASPECT[aspectKey] ?? ASPECT.fourThree
  const diagonal = inches * 25.4
  const w = diagonal * aspect.w
  const h = diagonal * aspect.h
  return { aspect, diagonal, w, h, d: w * aspect.depth }
}

function layout(p) {
  const cabinet = str(p, 'cabinet')
  const console_ = cabinet === 'console'
  const crt = tubeSize(num(p, 'tube'), str(p, 'aspect'))
  const bezel = num(p, 'bezel')
  const controls = str(p, 'controls')
  const speaker = str(p, 'speaker')
  const dialSize = num(p, 'dialSize')

  const sideSpeaker = speaker === 'side' || speaker === 'both'
  const belowSpeaker = speaker === 'below' || speaker === 'both'

  // The band down one side carries the dials, the speaker, or both — which is
  // exactly how the sets that had it were arranged, knobs above the grille.
  const sideBand = Math.max(
    controls === 'sideDials' ? dialSize * 1.9 : 0,
    sideSpeaker ? Math.max(crt.w * 0.17, 96) : 0,
  )
  // The band under the screen stacks a control strip on top of a speaker.
  const controlBand =
    controls === 'frontDials'
      ? dialSize * 1.55
      : controls === 'pushButtons'
        ? 50
        : controls === 'discreet'
          ? 32
          : 0
  const speakerBand = belowSpeaker ? Math.max(crt.h * 0.24, 76) : 0
  const bottomBand = controlBand + speakerBand

  const margin = console_ ? num(p, 'cabinetMargin') : 0
  const W = crt.w + bezel * 2 + sideBand + margin * 2
  const H = crt.h + bezel * 2 + bottomBand + (console_ ? margin * 0.35 : 0)
  const D = crt.d + num(p, 'depthAllowance') + (console_ ? 70 : 26)

  // What the body stands on. A console is on legs or a plinth; everything else
  // has four small feet, except the late black box, which grew its own base.
  const legs = console_ ? str(p, 'legs') : 'none'
  const plinth = console_ ? legs === 'plinth' : cabinet === 'blackBox'
  const lift = console_
    ? legs === 'none'
      ? 0
      : num(p, 'legHeight')
    : cabinet === 'blackBox'
      ? 44
      : 14

  const screenY = lift + bottomBand + bezel + crt.h / 2
  const screenZ = -W / 2 + margin + sideBand + bezel + crt.w / 2
  const bandZ = -W / 2 + margin // the near edge of the side band

  return {
    cabinet,
    console_,
    crt,
    bezel,
    controls,
    speaker,
    sideSpeaker,
    belowSpeaker,
    sideBand,
    controlBand,
    speakerBand,
    bottomBand,
    margin,
    legs,
    plinth,
    lift,
    W,
    H,
    D,
    xFront: -D / 2,
    xBack: D / 2,
    screenY,
    screenZ,
    bandZ,
  }
}

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

/** A rounded rectangle in plan: `depth` along x, `width` along z, about the origin. */
function rect(depth, width, radius) {
  const d = depth / 2
  const w = width / 2
  const corners = [
    { x: d, z: -w },
    { x: d, z: w },
    { x: -d, z: w },
    { x: -d, z: -w },
  ]
  const r = Math.max(0, Math.min(radius, d - 1, w - 1))
  return r < 1 ? ring(corners) : roundCorners(corners, r, 5)
}

/** An outline moved bodily in the plan plane. */
function shift(points, dx, dz) {
  return points.map((q) => ({ x: q.x + dx, z: q.z + dz }))
}

/**
 * The walls between two outlines of the same point count, one at each depth.
 *
 * `sweep` works by offsetting a single outline, and an offset deep enough to
 * draw a back in collapses the rounded corners of it: the rim the walls end on
 * and the cap laid over that rim then disagree by a couple of centimetres.
 * Lofting between outlines that were each drawn in their own right keeps the
 * two the same shape by construction. Both must come straight from `rect` — a
 * `plan` hulls what it is given and is free to start the ring elsewhere, which
 * twists the loft.
 */
function loft(a, ya, b, yb) {
  const n = Math.min(a.length, b.length)
  const position = []
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    // Wound the way `sweep` winds it, top rim first, which puts the normals on
    // the outside.
    const quad = [
      { x: a[i].x, y: ya, z: a[i].z },
      { x: a[j].x, y: ya, z: a[j].z },
      { x: b[j].x, y: yb, z: b[j].z },
      { x: b[i].x, y: yb, z: b[i].z },
    ]
    for (const [u, v, w] of [[0, 1, 2], [0, 2, 3]]) {
      for (const q of [quad[u], quad[v], quad[w]]) position.push(q.x, q.y, q.z)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
  g.computeVertexNormals()
  return g
}

/**
 * Stands a plan-built solid on its face. Everything the studio sweeps is built
 * in plan and grows upwards; a screen, a bezel or a cabinet front is that tipped
 * forward, so the outline's own x becomes height and the sweep's own y becomes
 * how far forward the surface is.
 */
function faceForward(geometry) {
  geometry.rotateZ(Math.PI / 2)
  return geometry
}

/** A cylinder lying along X with its front face at `x`, centred on (y, z). */
function drum(diameter, length, x, y, z, segments = 20) {
  const g = post(diameter, length, 0, 0, 0, segments)
  g.rotateZ(-Math.PI / 2)
  g.translate(x - length, y, z)
  return g
}

/** A knob: the drum, and the pointer moulded up its face. */
function knob(diameter, x, y, z) {
  const length = diameter * 0.62
  return {
    body: drum(diameter, length, x, y, z),
    mark: box(2.5, diameter * 0.36, diameter * 0.13, x - length - 2.5, y, z - diameter * 0.065),
  }
}

/**
 * The panel a speaker sits behind, on the front face at `x`: a dark void, and
 * over it whatever the front of that decade was — cloth in a frame, a moulded
 * lattice, a run of slots, or fretwork.
 */
function grillePanel(style, x, y0, y1, z0, z1) {
  const h = y1 - y0
  const w = z1 - z0
  if (h < 8 || w < 8) return { void: [], bars: [] }
  const voids = [box(10, h, w, x + 2, y0, z0)]
  const bars = []
  const frame = (t) => {
    bars.push(box(5, t, w, x - 3, y0, z0), box(5, t, w, x - 3, y1 - t, z0))
    bars.push(box(5, h, t, x - 3, y0, z0), box(5, h, t, x - 3, y0, z1 - t))
  }
  if (style === 'cloth') {
    frame(Math.min(10, h * 0.12))
  } else if (style === 'perforated') {
    // A fine lattice: from any distance at all it reads as punched holes.
    const pitch = Math.max(7, Math.min(h, w) / 18)
    for (let z = z0; z < z1 - 1; z += pitch) bars.push(box(4, h, pitch * 0.36, x - 2, y0, z))
    for (let y = y0; y < y1 - 1; y += pitch) bars.push(box(4, pitch * 0.36, w, x - 2, y, z0))
  } else if (style === 'slots') {
    const pitch = Math.max(11, h / 9)
    for (let y = y0 + pitch * 0.4; y < y1 - pitch * 0.5; y += pitch) {
      bars.push(box(5, pitch * 0.52, w * 0.92, x - 3, y, z0 + w * 0.04))
    }
    frame(Math.min(9, h * 0.1))
  } else {
    // Fretwork: bars cut to an arch, the way a cabinet-maker sawed a speaker
    // opening out of a solid front rather than covering a hole in one.
    const count = Math.max(3, Math.round(w / 46))
    frame(Math.min(12, h * 0.14))
    for (let i = 0; i < count; i++) {
      const u = count === 1 ? 0.5 : i / (count - 1)
      const arch = 0.42 + 0.34 * Math.cos((u - 0.5) * Math.PI)
      const bw = w * 0.06
      const z = z0 + w * 0.1 + (w * 0.8 - bw) * u
      bars.push(box(6, h * arch, bw, x - 4, y0 + (h - h * arch) / 2, z))
    }
  }
  return { void: voids, bars }
}

// ---------------------------------------------------------------------------
// Legs, for the console
// ---------------------------------------------------------------------------

const TURNING = [
  [0.0, 0.0],
  [0.0, 0.86],
  [0.04, 0.9],
  [0.08, 0.7],
  [0.14, 0.58],
  [0.2, 0.72],
  [0.26, 0.6],
  [0.5, 0.66],
  [0.62, 0.86],
  [0.7, 0.78],
  [0.78, 0.58],
  [0.86, 0.68],
  [0.92, 0.62],
  [1.0, 0.66],
  [1.0, 0.0],
]

// A cabriole leg in section, floor to cabinet: how far it stands out from the
// corner, and how thick it is there.
const CABRIOLE = [
  [0.0, 0.55, 0.55],
  [0.1, 0.1, 0.44],
  [0.32, -0.06, 0.56],
  [0.58, 0.48, 0.8],
  [0.78, 1.0, 0.98],
  [1.0, 0.42, 1.0],
]

function cabrioleLeg(height, size, x, z, outX, outZ) {
  const links = []
  const padHeight = size * 0.22
  const reach = Math.min(size * 1.4, height * 0.14)
  const control = CABRIOLE.map(([t, out]) =>
    new THREE.Vector3(x + outX * out * reach, padHeight + (height - padHeight) * t, z + outZ * out * reach),
  )
  const curve = new THREE.CatmullRomCurve3(control)
  const samples = 12
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
    links.push(strut(previous, point, diameter((i - 1) / samples), diameter(t), 10))
    if (i > 1) {
      const joint = new THREE.SphereGeometry(diameter((i - 1) / samples) / 2, 8, 6)
      joint.translate(previous.x, previous.y, previous.z)
      links.push(joint)
    }
    previous = point
  }
  links.push(post(size * 1.2, padHeight * 1.1, control[0].x, 0, control[0].z, 14))
  return merge(links)
}

/** One leg under the corner at (x, z), leaning out by `splay` if it splays. */
function legGeometry(profile, height, size, x, z, outX, outZ, splay, collar) {
  const reach = height * Math.tan(splay)
  // A leaning strut is cut off square to its own axis, so its lowest corner
  // would dip through the floor. Lift it by exactly what the angle takes off —
  // measured from the axis it actually ends up on, which leans diagonally and
  // so tilts further than the splay itself.
  const out = Math.hypot(outX * reach, outZ * reach)
  const stand = ((size * 0.62) / 2) * (out / Math.hypot(out, height))
  const base = new THREE.Vector3(x + outX * reach, stand, z + outZ * reach)
  const tip = new THREE.Vector3(x, height, z)
  if (profile === 'cabriole') return cabrioleLeg(height, size, x, z, outX, outZ)
  if (profile === 'turned') {
    const points = TURNING.map(([f, r]) => new THREE.Vector2(Math.max(r * size * 0.5, 1e-3), f * height))
    const g = new THREE.LatheGeometry(points, 20)
    g.translate(x, 0, z)
    if (!collar) return g
    const ring_ = new THREE.TorusGeometry(size * 0.44, size * 0.08, 8, 20)
    ring_.rotateX(Math.PI / 2)
    ring_.translate(x, height * 0.62, z)
    return merge([g, ring_])
  }
  if (profile === 'bracket') {
    // Two boards mitred at the corner, scrolled away from it.
    const t = size * 0.55
    const run = size * 2.2
    return merge([
      box(run, height, t, x - (outX > 0 ? run : 0), 0, z - t / 2),
      box(t, height, run, x - t / 2, 0, z - (outZ > 0 ? run : 0)),
    ])
  }
  return strut(base, tip, size * 0.62, size, profile === 'tapered' ? 4 : 16, profile === 'tapered' ? Math.PI / 4 : 0)
}

// ---------------------------------------------------------------------------
// When it could have existed
//
// Every choice here belongs to some stretch of the tube's sixty years. Overlap
// them and you get the years a set like this could have been sold in; fail to
// overlap them and the metric says which two choices never met.
// ---------------------------------------------------------------------------

function spans(p) {
  const out = []
  const add = (from, to, what) => out.push({ from, to, what })
  const cabinet = str(p, 'cabinet')
  const controls = str(p, 'controls')

  add(...{ console: [1948, 1979], tabletop: [1957, 1999], portable: [1960, 2001], blackBox: [1988, 2008] }[cabinet], `a ${cabinet === 'blackBox' ? 'black box' : cabinet} cabinet`)
  add(
    ...{
      sideDials: [1948, 1991],
      frontDials: [1948, 1989],
      pushButtons: [1968, 1995],
      discreet: [1980, 2008],
      none: [1986, 2008],
    }[controls],
    controls === 'discreet' ? 'buttons hidden under the screen' : controls === 'none' ? 'no controls on the set' : `${controls === 'pushButtons' ? 'tuning push-buttons' : 'dials'}`,
  )
  if (str(p, 'aspect') === 'sixteenNine') add(1998, 2008, 'a widescreen tube')
  if (bool(p, 'screenOn') && str(p, 'picture') === 'monochrome') add(1948, 1987, 'a black and white picture')
  if (bool(p, 'screenOn') && str(p, 'picture') === 'colour') add(1954, 2008, 'a colour picture')
  if (str(p, 'aerial') === 'loopAndDipole') add(1964, 2008, 'a UHF loop')
  if (bool(p, 'remote')) add(1956, 2008, 'a remote control')
  if (bool(p, 'flap')) add(1958, 1996, 'a flap over the controls')
  if (str(p, 'grille') === 'fret' && str(p, 'speaker') !== 'none') add(1948, 1972, 'cut fretwork')
  if (cabinet === 'console') {
    if (str(p, 'doors') !== 'none') add(1948, 1974, 'doors over the screen')
    if (num(p, 'ornament') >= 4) add(1948, 1967, 'that much ornament')
    const legs = str(p, 'legs')
    if (legs === 'cabriole' || legs === 'turned') add(1948, 1966, `${legs} legs`)
    if (legs === 'tapered') add(1955, 1974, 'splayed tapered legs')
  }
  if (num(p, 'tube') >= 30) add(1988, 2008, 'a tube that big')
  if (num(p, 'tube') <= 9) add(1958, 2001, 'a tube that small')
  return out
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const L = layout(p)
  const { W, H, D, crt, bezel, xFront, xBack, lift, screenY, screenZ } = L
  const finish = FINISH[str(p, 'finish')] ?? FINISH.woodgrain
  const radius = num(p, 'radius')
  const curve = num(p, 'faceCurve') / 100
  const controls = L.controls
  const ornament = L.console_ ? Math.round(num(p, 'ornament')) : 0

  const shell = []
  const trim = []
  const legs = []
  const dark = []
  const cloth = []
  const bars = []
  const knobs = []
  const glass = []
  const metal = []
  const lamps = []
  const parts = []

  // --- The body -----------------------------------------------------------
  //
  // Built lying down in plan — the outline's x is the height of the front, its
  // z the width — and then stood on its face. The section is walked front to
  // back, so drawing the back in is one inset at the far end of it.
  const taper = bool(p, 'taperBack') && !L.console_
  const backInset = taper ? Math.min(Math.min(H, W) * 0.26, D * 0.45) : 0
  // How far the moulding has drawn in, at a depth measured back from the front.
  // The sides and the top come in; the bottom does not, because the set has to
  // stand on it. Everything that lands on the cabinet asks this — the feet under
  // it, the aerial and the handle on top of it, the sockets out of the back —
  // or it ends up hanging in the air beside a tapered back.
  const drawIn = (fromFront) => {
    if (!taper) return 0
    const y = D - Math.max(0, Math.min(D, fromFront))
    if (y >= D * 0.6) return 0
    if (y >= D * 0.28) return (backInset * 0.5 * (D * 0.6 - y)) / (D * 0.6 - D * 0.28)
    return backInset * 0.5 + (backInset * 0.5 * (D * 0.28 - y)) / (D * 0.28)
  }
  const insetAt = (worldX) => drawIn(worldX - xFront)
  const topAt = (worldX) => lift + H - insetAt(worldX)
  const halfWidthAt = (worldX) => W / 2 - insetAt(worldX)

  // A rim of the cabinet at a given draw-in: the bottom edge stays put and
  // everything else comes in around it.
  const rim = (inset) =>
    inset < 0.5
      ? rect(H, W, radius)
      : shift(
          rect(Math.max(40, H - inset), Math.max(40, W - inset * 2), Math.max(1.5, radius - inset * 0.4)),
          -inset / 2,
          0,
        )
  const frontRim = rim(0)
  const midRim = rim(backInset * 0.5)
  const backRim = rim(backInset)
  // The front face is the bezel: the whole outline with the screen cut out of it.
  const aperture = shift(rect(crt.h + 8, crt.w + 8, crt.h * (0.03 + 0.17 * curve) + 6), screenY - lift - H / 2, screenZ)
  const screenOutline = shift(rect(crt.h, crt.w, crt.h * (0.03 + 0.17 * curve)), screenY - lift - H / 2, screenZ)

  const stand = (g) => {
    if (!g) return null
    faceForward(g)
    g.translate(xFront + D, lift + H / 2, 0)
    return g
  }

  shell.push(
    stand(
      merge(
        [
          loft(frontRim, D, frontRim, D * 0.6),
          loft(frontRim, D * 0.6, midRim, D * 0.28),
          loft(midRim, D * 0.28, backRim, 0),
          face([frontRim, aperture], D, true),
          face([backRim], 0, false),
        ].filter(Boolean),
      ),
    ),
  )

  // --- The screen ---------------------------------------------------------
  //
  // The glass is a dome over the aperture: the outline pulled inwards step by
  // step and lifted forward on a parabola, which is a rounded rectangle of
  // constant sag — near enough what a tube face actually is. A flat-square tube
  // is the same surface with the sag taken out of it.
  const rimY = D - 10
  const bulge = 3 + 20 * curve
  const screenR = crt.h * (0.03 + 0.17 * curve)
  // Each contour of the dome is drawn as a rectangle in its own right rather
  // than offset off the rim. Offsetting a rounded rectangle this far collapses
  // its corners, and the cap over the middle then belongs to a different shape
  // from the walls under it — which is the extra, oddly-angled facets that used
  // to sit across the glass.
  const reach = Math.min(crt.h, crt.w) * 0.24
  const steps = 6
  const contour = (t) =>
    shift(
      rect(
        Math.max(20, crt.h - t * 2),
        Math.max(20, crt.w - t * 2),
        Math.max(1.5, screenR - t * 0.5),
      ),
      screenY - lift - H / 2,
      screenZ,
    )
  const layers = []
  for (let i = 0; i <= steps; i++) {
    const u = i / steps // nought at the rim, one in the middle
    layers.push({ pts: contour(reach * u), y: rimY + bulge * (1 - (1 - u) * (1 - u)) })
  }
  const dome = []
  for (let i = layers.length - 1; i > 0; i--) {
    dome.push(loft(layers[i].pts, layers[i].y, layers[i - 1].pts, layers[i - 1].y))
  }
  // The lip of the glass, turning back into the moulding.
  dome.push(loft(layers[0].pts, layers[0].y, layers[0].pts, rimY - 7))
  dome.push(face([layers[layers.length - 1].pts], layers[layers.length - 1].y, true))
  glass.push(stand(merge(dome.filter(Boolean))))
  // The dark ring between the glass and the moulding, and the lip of the
  // aperture above it — walked back to front, which turns its normals inward so
  // you can see into the recess rather than through it.
  dark.push(stand(face([aperture, screenOutline], rimY, true)))
  dark.push(
    stand(
      sweep(
        plan(aperture),
        [
          { inset: 0, y: rimY },
          { inset: 0, y: D },
        ],
        false,
      ),
    ),
  )

  // --- The bands: speaker and controls -------------------------------------
  const fx = xFront
  const grilleStyle = str(p, 'grille')
  const pad = Math.min(14, bezel * 0.4)

  // Where the dials down the side actually land, worked out before the grille
  // goes in so that the grille can start below the last of them. Knobs above
  // the speaker was the whole arrangement; knobs on top of it is not.
  const dialYs = []
  if (controls === 'sideDials') {
    const size = num(p, 'dialSize')
    const count = Math.round(num(p, 'dials'))
    const top = screenY + crt.h / 2 + bezel - pad - size * 0.7
    for (let i = 0; i < count; i++) {
      const y = top - i * size * 1.5
      if (y < lift + L.bottomBand + size * 0.7) break
      dialYs.push(y)
    }
  }

  if (L.sideSpeaker) {
    // Under the dials if they are there too, and the full height of the band
    // if they are not.
    const clear = dialYs.length ? dialYs[dialYs.length - 1] - num(p, 'dialSize') * 0.85 : Infinity
    const top = Math.min(clear, screenY + crt.h / 2 + bezel - pad)
    const g = grillePanel(grilleStyle, fx, lift + L.bottomBand + pad, top, L.bandZ + pad, L.bandZ + L.sideBand - pad)
    cloth.push(...g.void)
    bars.push(...g.bars)
  }
  if (L.belowSpeaker) {
    const g = grillePanel(
      grilleStyle,
      fx,
      lift + pad,
      lift + L.speakerBand - pad * 0.5,
      -W / 2 + L.margin + pad,
      W / 2 - L.margin - pad,
    )
    cloth.push(...g.void)
    bars.push(...g.bars)
  }

  // Where the control strip lives, and how tall it is.
  const stripY = lift + L.speakerBand
  const stripH = L.controlBand

  if (controls === 'sideDials') {
    const size = num(p, 'dialSize')
    const z = L.bandZ + L.sideBand / 2
    for (const y of dialYs) {
      const k = knob(size, fx, y, z)
      knobs.push(k.body, k.mark)
      // A whisker proud of the front, or its face and the front of the cabinet
      // are in the same plane and flicker against one another.
      dark.push(drum(size * 1.35, 3, fx + 2, y, z, 20))
    }
  } else if (controls === 'frontDials') {
    const size = num(p, 'dialSize')
    const count = Math.round(num(p, 'dials'))
    const y = stripY + stripH / 2
    const runFrom = -W / 2 + L.margin + L.sideBand + bezel
    const pitch = size * 1.5
    for (let i = 0; i < count; i++) {
      const z = runFrom + size * 0.9 + i * pitch
      if (z > W / 2 - L.margin - size * 0.7) break
      const k = knob(size, fx, y, z)
      knobs.push(k.body, k.mark)
      dark.push(drum(size * 1.35, 3, fx + 2, y, z, 20))
    }
  } else if (controls === 'pushButtons' || controls === 'discreet') {
    const count = Math.round(num(p, 'buttons'))
    const wide = controls === 'pushButtons'
    const bw = wide ? 20 : 15
    const bh = wide ? stripH * 0.62 : stripH * 0.4
    const pitch = bw * (wide ? 1.35 : 1.6)
    const runFrom = -W / 2 + L.margin + L.sideBand + bezel + 12
    const y = stripY + (stripH - bh) / 2
    dark.push(box(6, stripH * 0.82, Math.min(count * pitch + 16, W - L.margin * 2 - 24), fx + 1, stripY + stripH * 0.09, runFrom - 8))
    for (let i = 0; i < count; i++) {
      const z = runFrom + i * pitch
      if (z + bw > W / 2 - L.margin - 8) break
      knobs.push(box(wide ? 12 : 4, bh, bw, fx - (wide ? 12 : 4), y, z))
    }
  }

  if (bool(p, 'standby')) {
    const z = controls === 'sideDials' ? L.bandZ + L.sideBand / 2 : -W / 2 + L.margin + L.sideBand + bezel + 8
    lamps.push(box(3, 7, 7, fx - 3, stripH > 12 ? stripY + stripH / 2 - 3 : lift + L.bottomBand + 6, z))
  }

  // A flap along the bottom of the control strip, hanging open.
  if (bool(p, 'flap') && controls !== 'none' && stripH > 10) {
    const flapH = controls === 'sideDials' ? L.sideBand * 0.9 : stripH + 8
    const flapW = controls === 'sideDials' ? L.sideBand - 8 : W - L.margin * 2 - 16
    const flapZ = controls === 'sideDials' ? L.bandZ + 4 : -W / 2 + L.margin + 8
    const hingeY = controls === 'sideDials' ? screenY + crt.h / 2 + bezel - pad - L.sideBand : stripY - 4
    const g = box(8, flapH, flapW, -8, 0, flapZ)
    g.rotateZ((75 * Math.PI) / 180)
    g.translate(fx, hingeY, 0)
    trim.push(g)
  }

  // --- Console: mouldings, doors, legs --------------------------------------
  const footprint = plan(rect(D, W, Math.min(radius, 40)))
  if (ornament >= 1) {
    trim.push(sweep(footprint, beadSection(-3, lift + 12, 9), true))
  }
  if (ornament >= 2) {
    trim.push(sweep(footprint, beadSection(-4, lift + H - 14, 11), true))
    trim.push(sweep(footprint, beadSection(-1, lift + H - 30, 5), true))
  }
  if (ornament >= 3) {
    // Pilasters standing at the front corners.
    for (const sz of [-1, 1]) {
      const z = sz * (W / 2 - 26)
      trim.push(box(16, H - 44, 46, xFront - 8, lift + 22, z - 23))
    }
  }
  if (ornament >= 4) {
    for (const sz of [-1, 1]) {
      const z = sz * (W / 2 - 26)
      for (let i = 0; i < 3; i++) {
        trim.push(drum(9, 5, xFront - 8, lift + 40, z - 14 + i * 14, 8))
        trim.push(box(5, H - 90, 5, xFront - 12, lift + 45, z - 16 + i * 14))
      }
    }
  }

  const doors = L.console_ ? str(p, 'doors') : 'none'
  if (doors !== 'none') {
    const doorH = H - 40
    // Hinged just outside the cabinet, so that folding one back lays it along
    // the side rather than inside it. Shut, the pair meets with a finger's gap
    // down the middle.
    const overhang = 10
    const doorW = (W + overhang * 2 - 12) / 2
    // Shut, they stand a little proud of the moulding, which is where a rebated
    // door sits anyway and keeps them clear of whatever knobs are behind them.
    const standoff = doors === 'closed' ? 36 : 0
    for (const sz of [-1, 1]) {
      const hinge = sz * (W / 2 + overhang)
      // Drawn out from its own hinge and then swung about it, so a shut door
      // lies flat across the front and an open one folds back along the side.
      // The handle is drawn in the same frame and swings with it.
      const inward = sz < 0 ? 0 : -doorW
      const leaf = merge([
        box(18, doorH, doorW, -18 - standoff, 0, inward),
        box(22, doorH - 40, doorW - 32, -21 - standoff, 20, inward + 16),
      ])
      const grip = drum(14, 22, -20 - standoff, doorH / 2, inward + (sz < 0 ? doorW - 26 : 26), 12)
      if (doors === 'open') {
        const angle = (-sz * 102 * Math.PI) / 180
        leaf.rotateY(angle)
        grip.rotateY(angle)
      }
      for (const g of [leaf, grip]) g.translate(xFront, lift + 20, hinge)
      shell.push(leaf)
      trim.push(grip)
    }
  }

  if (L.console_) {
    const size = num(p, 'legThickness')
    if (L.legs === 'plinth') {
      shell.push(box(D - 90, lift, W - 90, -D / 2 + 45, 0, -W / 2 + 45))
    } else if (L.legs !== 'none') {
      const splay = (num(p, 'splay') * Math.PI) / 180
      const inset = L.legs === 'bracket' ? 0 : Math.max(size * 0.9, 40)
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          legs.push(
            legGeometry(
              L.legs,
              lift,
              size,
              sx * (D / 2 - inset),
              sz * (W / 2 - inset),
              sx,
              sz,
              L.legs === 'tapered' ? splay : 0,
              ornament >= 5,
            ),
          )
        }
      }
    }
  } else if (L.cabinet === 'blackBox') {
    // The late set stands on a moulded pedestal rather than on feet. Capped top
    // and bottom, and drawn between two rims of its own so the foot of it and
    // the cap under it are the same shape.
    const deck = rect(D * 0.66, W * 0.5, 24)
    const foot = rect(D * 0.66 - 28, W * 0.5 - 28, 10)
    shell.push(
      merge(
        [
          loft(deck, lift + 4, deck, 10),
          loft(deck, 10, foot, 0),
          face([deck], lift + 4, true),
          face([foot], 0, false),
        ].filter(Boolean),
      ),
    )
  } else {
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        // The bottom of the case stays flat, but its sides draw in toward the
        // neck, so a foot out at the back corner has to come in with them.
        const fxp = sx * D * 0.3
        const room = Math.max(40, halfWidthAt(fxp) - 26)
        legs.push(box(34, lift, 34, fxp - 17, 0, sz * Math.min(W * 0.34, room) - 17))
      }
    }
  }

  // --- Handle, badge, vents -------------------------------------------------
  if (L.cabinet === 'portable' && bool(p, 'handle')) {
    // Both legs stand on the top of the cabinet, which slopes away toward the
    // back on a tapered case: an arm drawn to one height leaves its back leg in
    // the air.
    const reachX = Math.min(D * 0.55, 170)
    const rise = Math.max(60, W * 0.12)
    const from = xFront + D * 0.16
    const to = Math.min(from + reachX, xBack - 26)
    const crest = Math.max(topAt(from), topAt(to)) + rise
    const a = new THREE.Vector3(from, topAt(from) - 6, 0)
    const b = new THREE.Vector3(from, crest, 0)
    const c = new THREE.Vector3(to, crest, 0)
    const d2 = new THREE.Vector3(to, topAt(to) - 6, 0)
    const arm = merge([tube(16, a, b, 10), tube(16, b, c, 10), tube(16, c, d2, 10)])
    arm.scale(1, 1, 2.2)
    trim.push(arm)
  }

  if (bool(p, 'badge')) {
    const y = L.bottomBand > 26 ? lift + L.bottomBand * 0.45 : lift + H - 22
    const z = -W / 2 + L.margin + L.sideBand + bezel + crt.w * 0.5
    trim.push(box(3, 11, 66, fx - 3, y, z - 33))
  }

  if (bool(p, 'vents')) {
    // What the taper leaves at the back is what these have to fit inside — and
    // they stand a whisker proud of it, or a slot cut flush is no slot at all.
    const halfW = Math.max(40, W / 2 - backInset - 14)
    const low = lift + 22
    const high = lift + H - backInset - 22
    const slotW = Math.min(halfW * 2, Math.max(60, W * 0.55))
    const slots = []
    for (let y = low + (high - low) * 0.45; y < high && slots.length < 10; y += 22) {
      slots.push(box(5, 6, slotW, xBack - 4, y, -slotW / 2))
    }
    // And the sockets the aerial and the mains went into.
    const socketY = Math.max(low, Math.min(high - 30, lift + H * 0.18))
    slots.push(box(8, 26, 26, xBack - 5, socketY, Math.max(-halfW + 8, -60)))
    slots.push(box(8, 22, 34, xBack - 5, socketY, Math.min(halfW - 42, 26)))
    dark.push(merge(slots))
  }

  // --- Aerial ---------------------------------------------------------------
  const aerial = str(p, 'aerial')
  if (aerial !== 'none') {
    const length = num(p, 'aerialLength')
    const spread = (num(p, 'aerialSpread') * Math.PI) / 180
    const baseX = xBack - Math.min(70, D * 0.2)
    // On the top of the cabinet at that depth, not on the top it would have had
    // if the back had never been drawn in.
    const baseY = topAt(baseX)
    metal.push(box(46, 16, 78, baseX - 23, baseY - 3, -39))
    const rod = (sz) => {
      const lean = (24 * Math.PI) / 180
      const half = aerial === 'telescopic' ? 0 : (spread / 2) * sz
      const dir = new THREE.Vector3(
        Math.sin(lean),
        Math.cos(lean) * Math.cos(half),
        Math.cos(lean) * Math.sin(half),
      )
      const from = new THREE.Vector3(baseX, baseY + 12, sz * (aerial === 'telescopic' ? 0 : 22))
      // Three telescoping sections, each thinner than the one it came out of.
      const pieces = []
      for (let i = 0; i < 3; i++) {
        const a = from.clone().addScaledVector(dir, (length * i) / 3)
        const b = from.clone().addScaledVector(dir, (length * (i + 1)) / 3)
        pieces.push(strut(a, b, 11 - i * 3, 8 - i * 3, 10))
      }
      return merge(pieces)
    }
    if (aerial === 'telescopic') metal.push(rod(1))
    else for (const sz of [-1, 1]) metal.push(rod(sz))
    if (aerial === 'loopAndDipole') {
      const loop = new THREE.TorusGeometry(Math.min(length * 0.28, 150), 7, 8, 28)
      loop.rotateY(Math.PI / 2)
      loop.translate(baseX, baseY + 30 + Math.min(length * 0.28, 150), 0)
      metal.push(loop)
    }
  }

  // --- Remote ---------------------------------------------------------------
  if (bool(p, 'remote')) {
    const rx = xFront - 260
    const rz = W * 0.28
    trim.push(box(190, 22, 58, rx, 0, rz))
    const pips = []
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 3; c++) {
        pips.push(box(16, 3, 12, rx + 22 + r * 26, 22, rz + 12 + c * 16))
      }
    }
    dark.push(merge(pips))
  }

  // --- Collect --------------------------------------------------------------
  const add = (name, list, color) => {
    const usable = list.filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }
  add('cabinet', shell, finish.shell)
  add('mouldings', trim, finish.trim)
  add('legs', legs, finish.trim)
  add('speaker', cloth, COLOR.dark)
  add('grille', bars, finish.cloth)
  add('controls', knobs, finish.knob)
  add('recess', dark, COLOR.dark)
  add('aerial', metal, COLOR.metal)
  add('lamp', lamps, COLOR.lamp)
  add(
    'screen',
    glass,
    bool(p, 'screenOn') ? (str(p, 'picture') === 'monochrome' ? COLOR.monochrome : COLOR.colour) : COLOR.glassOff,
  )

  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  // Swung round from -X to +Z, which is where the Front view looks from, so the
  // front of the machine is what the front view shows.
  for (const part of facing) part.geometry.rotateY(Math.PI / 2)
  return facing
}

export function metrics(p) {
  const L = layout(p)
  const { W, H, D, crt } = L
  const inches = num(p, 'tube')

  // The glass and the shadow mask are most of what a television weighs, and
  // they go up with the area of the face rather than with the diagonal.
  const tubeMass = 0.055 * inches * inches
  const skin = (2 * (W * H + W * D + H * D)) / 1e6
  const cabinetMass = skin * (L.console_ ? 10.4 : 3.2)
  const mass = tubeMass + cabinetMass + 3.5 + inches * 0.06
  const lift =
    mass < 18
      ? 'one person, easily'
      : mass < 32
        ? 'one person, and it is all in the front'
        : mass < 65
          ? 'two people, and mind your back'
          : 'two people and a plan'

  const screenArea = crt.w * crt.h
  const faceArea = W * H
  const bezelShare = ((faceArea - screenArea) / faceArea) * 100
  // Judged against the set rather than the furniture: on a console the timber
  // each side is the point of the thing, not a fault in it.
  const setArea = (W - L.margin * 2) * (H - L.margin * 0.35)
  const setShare = ((setArea - screenArea) / setArea) * 100

  // A tube television is watched from four to six times the height of the
  // picture — the number the trade quoted for 405 and 625 lines alike.
  const near = crt.h * 4
  const far = crt.h * 6

  const rows = [
    {
      label: 'Cabinet',
      value: `${formatLength(W)} × ${formatLength(D)} × ${formatLength(H)}`,
      note: 'Width, depth, height. All of it is the tube, the moulding round it and the room behind it.',
    },
    {
      label: 'Tube',
      value: `${inches}″ ${crt.aspect.label} — ${formatLength(crt.w)} × ${formatLength(crt.h)}, ${formatLength(crt.d)} deep`,
    },
    {
      label: 'Screen to cabinet',
      value: `${(100 - bezelShare).toFixed(0)}% screen`,
      level: setShare > 68 ? 'warn' : 'ok',
      note:
        setShare > 68
          ? 'The moulding is swallowing the tube. Thin the bezel, or drop a band you are not using.'
          : L.console_
            ? `${(100 - setShare).toFixed(0)}% of the set itself — the rest is the furniture round it.`
            : undefined,
    },
    {
      label: 'Mass',
      value: `${mass.toFixed(0)} kg`,
      note: `Tube ${tubeMass.toFixed(0)} kg, cabinet ${cabinetMass.toFixed(0)} kg, chassis the rest — ${lift}.`,
      level: mass > 70 ? 'warn' : 'ok',
    },
    {
      label: 'Watch it from',
      value: `${formatLength(near)} to ${formatLength(far)}`,
      note: 'Four to six times the height of the picture, which is what the trade quoted throughout.',
    },
  ]

  if (L.console_) {
    const centre = L.screenY
    const level = centre > 1200 ? 'warn' : centre < 520 ? 'warn' : 'ok'
    rows.push({
      label: 'Screen centre',
      value: `${formatLength(centre)} above the floor`,
      level,
      note:
        level === 'ok'
          ? undefined
          : centre > 1200
            ? 'Above a seated eye, which is about 1150 mm off the floor. Shorten the legs.'
            : 'Low enough to be looking down at it from an armchair. Lengthen the legs, or put the speaker under the screen rather than beside it.',
    })
  } else {
    rows.push({
      label: 'Screen centre',
      value: `${formatLength(L.screenY)} above its own base`,
      note: 'Add whatever it is standing on. A seated eye is about 1150 mm off the floor.',
    })
  }

  // What years a set like this could have been sold in.
  const all = spans(p)
  let from = -Infinity
  let to = Infinity
  let latest = all[0]
  let earliest = all[0]
  for (const s of all) {
    if (s.from > from) {
      from = s.from
      latest = s
    }
    if (s.to < to) {
      to = s.to
      earliest = s
    }
  }
  rows.push(
    from <= to
      ? { label: 'Reads as', value: `${from}–${to}`, note: 'The years every choice here overlapped in.' }
      : {
          label: 'Reads as',
          value: 'no single year',
          level: 'error',
          note: `${latest.what[0].toUpperCase()}${latest.what.slice(1)} arrived in ${latest.from}; ${earliest.what} had gone by ${earliest.to}.`,
        },
  )

  return rows
}

export const presets = [
  {
    name: '1958 walnut console',
    params: {
      tube: 21, aspect: 'fourThree', faceCurve: 100, screenOn: true, picture: 'monochrome',
      cabinet: 'console', finish: 'walnut', bezel: 62, radius: 26, depthAllowance: 150,
      cabinetMargin: 210, ornament: 4, legs: 'turned', legHeight: 230, legThickness: 54,
      doors: 'open', controls: 'frontDials', dials: 4, dialSize: 44, speaker: 'below',
      grille: 'fret', aerial: 'rabbitEars', aerialLength: 800, badge: true,
    },
  },
  {
    name: '1966 teak console',
    params: {
      tube: 23, aspect: 'fourThree', faceCurve: 85, screenOn: true, picture: 'colour',
      cabinet: 'console', finish: 'teak', bezel: 54, radius: 22, depthAllowance: 130,
      cabinetMargin: 220, ornament: 1, legs: 'tapered', legHeight: 230, legThickness: 44,
      splay: 12, doors: 'none', controls: 'sideDials', dials: 4, dialSize: 40,
      speaker: 'side', grille: 'cloth', aerial: 'none', badge: true,
    },
  },
  {
    name: '1978 portable',
    params: {
      tube: 12, aspect: 'fourThree', faceCurve: 80, screenOn: true, picture: 'monochrome',
      cabinet: 'portable', finish: 'cream', bezel: 26, radius: 34, depthAllowance: 55,
      taperBack: true, handle: true, controls: 'sideDials', dials: 3, dialSize: 26,
      speaker: 'side', grille: 'perforated', aerial: 'telescopic', aerialLength: 420,
      badge: true, standby: false,
    },
  },
  {
    name: '1983 woodgrain set',
    params: {
      tube: 22, aspect: 'fourThree', faceCurve: 60, screenOn: true, picture: 'colour',
      cabinet: 'tabletop', finish: 'woodgrain', bezel: 44, radius: 16, depthAllowance: 80,
      taperBack: true, controls: 'pushButtons', buttons: 8, flap: true, speaker: 'side',
      grille: 'slots', aerial: 'loopAndDipole', aerialLength: 620, remote: false, badge: true,
    },
  },
  {
    name: '1996 black box',
    params: {
      tube: 25, aspect: 'fourThree', faceCurve: 25, screenOn: true, picture: 'colour',
      cabinet: 'blackBox', finish: 'charcoal', bezel: 30, radius: 14, depthAllowance: 90,
      taperBack: true, controls: 'discreet', buttons: 5, speaker: 'below', grille: 'slots',
      aerial: 'none', remote: true, badge: true, standby: true,
    },
  },
  {
    name: '2003 widescreen tube',
    params: {
      tube: 32, aspect: 'sixteenNine', faceCurve: 0, screenOn: true, picture: 'colour',
      cabinet: 'blackBox', finish: 'silver', bezel: 26, radius: 12, depthAllowance: 110,
      taperBack: true, controls: 'none', speaker: 'below', grille: 'perforated',
      aerial: 'none', remote: true, badge: false, standby: true,
    },
  },
]
