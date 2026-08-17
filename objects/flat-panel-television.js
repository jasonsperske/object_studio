// Flat panel television, 1998–present.
//
// The set after the tube. There is no cabinet left to design: a panel, the
// boards behind it, and something holding it up. So the panel is the whole
// specification — diagonal, aspect, bezel, chin — and everything else follows
// from it, which is exactly how these have always been sold.
//
// The one thing that is not styling is `tech`. Plasma needed a sheet of glass
// on the front and sixty millimetres of depth behind it; edge-lit LCD got down
// to a slab you could hang flat; OLED is a few millimetres of panel with the
// whole machine in a box across the bottom third of the back. Those three
// really do give three different shapes, and picking one sets the depth the way
// picking a board standard sets the size of a desktop computer.
//
// Built with the front at -X and turned at the end to face +Z, which is where
// the studio's Front view looks from. Width then runs along X centred on zero,
// +Y is up, and the table or the floor is Y = 0.

export const meta = {
  order: 16,
  name: 'Flat panel television',
  description:
    'The set after the tube — sized entirely by its panel, shaped by whether it is plasma, LCD or OLED, on a pedestal, a pair of feet, an easel or a wall.',
}

const ASPECT = {
  sixteenNine: { w: 0.872, h: 0.49, label: '16:9' },
  sixteenTen: { w: 0.848, h: 0.53, label: '16:10' },
  twentyOneNine: { w: 0.922, h: 0.395, label: '21:9' },
}

// What each panel technology costs in depth, and what it weighs per square
// metre of screen. These are the numbers that decide the shape of the thing.
const TECH = {
  plasma: { label: 'Plasma', floor: 58, glass: true, boxed: false, mass: 52, from: 1997, to: 2014 },
  lcd: { label: 'LCD', floor: 22, glass: false, boxed: false, mass: 20, from: 1998, to: 2030 },
  oled: { label: 'OLED', floor: 6, glass: false, boxed: true, mass: 17, from: 2013, to: 2030 },
}

const FINISH = {
  black: { shell: 0x2a2d31, bezel: 0x1f2225, trim: 0x8d949c },
  glossBlack: { shell: 0x191c1f, bezel: 0x131517, trim: 0xa8afb6 },
  gunmetal: { shell: 0x4a5058, bezel: 0x3a4046, trim: 0x9aa2aa },
  silver: { shell: 0xb8bdc2, bezel: 0xa2a7ad, trim: 0x5f6469 },
  aluminium: { shell: 0xd0d4d8, bezel: 0x8e9498, trim: 0x62686d },
  white: { shell: 0xeceae4, bezel: 0xdedcd5, trim: 0x9198a0 },
}

const COLOR = {
  dark: 0x15181b,
  screenOff: 0x1a1d20,
  picture: 0xc9dcef,
  lamp: 0xd8dde1,
  fabric: 0x6c6f74,
}

export const params = [
  // --- Panel --------------------------------------------------------------
  {
    id: 'panel',
    label: 'Panel',
    type: 'number',
    min: 13,
    max: 98,
    step: 0.5,
    default: 55,
    unit: '″',
    group: 'Panel',
    help: 'The diagonal. Everything else on this set follows from it.',
  },
  {
    id: 'aspect',
    label: 'Shape',
    type: 'select',
    default: 'sixteenNine',
    group: 'Panel',
    options: [
      { value: 'sixteenNine', label: '16:9 — what a television is' },
      { value: 'sixteenTen', label: '16:10 — the early panels, borrowed from monitors' },
      { value: 'twentyOneNine', label: '21:9 — the cinema-shaped ones' },
    ],
  },
  {
    id: 'tech',
    label: 'Panel technology',
    type: 'select',
    default: 'lcd',
    group: 'Panel',
    help: 'Not a finish. This is what sets how thin the set can honestly be and how much of the back is boxed.',
    options: [
      { value: 'plasma', label: 'Plasma — glass front, and deep behind it' },
      { value: 'lcd', label: 'LCD — a backlit slab' },
      { value: 'oled', label: 'OLED — a wafer, with the machine in a box low down' },
    ],
  },
  {
    id: 'bezel',
    label: 'Bezel',
    type: 'number',
    min: 1,
    max: 60,
    step: 0.5,
    default: 10,
    unit: 'mm',
    group: 'Panel',
    help: 'Round the sides and the top. Forty millimetres reads as 2007, two as 2020.',
  },
  {
    id: 'chin',
    label: 'Chin',
    type: 'number',
    min: 2,
    max: 140,
    step: 1,
    default: 22,
    unit: 'mm',
    group: 'Panel',
    help: 'The deeper band under the picture, where the badge, the lamp and the infrared window went.',
  },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: true, group: 'Panel' },

  // --- Body ---------------------------------------------------------------
  {
    id: 'thickness',
    label: 'Thickness',
    type: 'number',
    min: 4,
    max: 140,
    step: 1,
    default: 58,
    unit: 'mm',
    group: 'Body',
    help: 'At the thickest point. The metrics will say if the technology you picked cannot fit inside it.',
  },
  {
    id: 'profile',
    label: 'Back',
    type: 'select',
    default: 'stepped',
    group: 'Body',
    options: [
      { value: 'slab', label: 'Slab — the same depth all over' },
      { value: 'tapered', label: 'Tapered — thick in the middle, thinning to the edge' },
      { value: 'stepped', label: 'Stepped — a thin panel with a box across the bottom' },
    ],
  },
  { id: 'radius', label: 'Corner radius', type: 'number', min: 0, max: 40, step: 1, default: 8, unit: 'mm', group: 'Body' },
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'black',
    group: 'Body',
    options: [
      { value: 'black', label: 'Black plastic' },
      { value: 'glossBlack', label: 'Gloss black' },
      { value: 'gunmetal', label: 'Gunmetal' },
      { value: 'silver', label: 'Silver' },
      { value: 'aluminium', label: 'Brushed aluminium' },
      { value: 'white', label: 'White' },
    ],
  },
  {
    id: 'curved',
    label: 'Curved screen',
    type: 'boolean',
    default: false,
    group: 'Body',
    help: 'The 2014–17 idea: the whole set wrapped round a vertical cylinder, concave toward the room.',
  },
  {
    id: 'curveRadius',
    label: 'Curve radius',
    type: 'number',
    min: 1500,
    max: 8000,
    step: 100,
    default: 4000,
    unit: 'mm',
    group: 'Body',
    visibleWhen: (p) => bool(p, 'curved'),
    help: 'Quoted as 4000R and so on. Smaller is more bent.',
  },

  // --- Fittings -----------------------------------------------------------
  { id: 'badge', label: 'Badge on the chin', type: 'boolean', default: true, group: 'Fittings' },
  { id: 'standby', label: 'Standby lamp', type: 'boolean', default: true, group: 'Fittings' },
  {
    id: 'speakers',
    label: 'Speakers',
    type: 'select',
    default: 'downFiring',
    group: 'Fittings',
    options: [
      { value: 'downFiring', label: 'Down-firing, out of the bottom edge' },
      { value: 'grille', label: 'A grille band under the picture' },
      { value: 'soundbar', label: 'A separate soundbar in front of it' },
      { value: 'none', label: 'None to look at' },
    ],
  },
  { id: 'ports', label: 'Ports on the back', type: 'int', min: 0, max: 12, step: 1, default: 7, group: 'Fittings' },
  {
    id: 'camera',
    label: 'Pop-up camera',
    type: 'boolean',
    default: false,
    group: 'Fittings',
    help: 'The one the smart sets grew for a few years and then quietly dropped.',
  },

  // --- Stand --------------------------------------------------------------
  {
    id: 'stand',
    label: 'Stand',
    type: 'select',
    default: 'feet',
    group: 'Stand',
    options: [
      { value: 'pedestal', label: 'Pedestal — a neck on a plate in the middle' },
      { value: 'feet', label: 'Feet — a pair, out near the ends' },
      { value: 'plate', label: 'Plate — a slim plinth the whole thing sits on' },
      { value: 'easel', label: 'Easel — a leg raked back to the floor' },
      { value: 'none', label: 'None — on a wall bracket' },
    ],
  },
  {
    id: 'standHeight',
    label: 'How high it holds it',
    type: 'number',
    min: 10,
    max: 400,
    step: 5,
    default: 70,
    unit: 'mm',
    group: 'Stand',
    visibleWhen: (p) => str(p, 'stand') !== 'none',
  },
  {
    id: 'footSpread',
    label: 'How far apart the feet are',
    type: 'number',
    min: 20,
    max: 100,
    step: 1,
    default: 78,
    unit: '%',
    group: 'Stand',
    visibleWhen: (p) => str(p, 'stand') === 'feet',
    help: 'As a share of the width. Wide feet want a wide table, which is the complaint everyone had about them.',
  },
  {
    id: 'tilt',
    label: 'Tilt',
    type: 'number',
    min: -4,
    max: 16,
    step: 1,
    default: 3,
    unit: '°',
    group: 'Stand',
    visibleWhen: (p) => str(p, 'stand') !== 'none',
  },
  {
    id: 'bracket',
    label: 'Wall bracket',
    type: 'boolean',
    default: true,
    group: 'Stand',
    visibleWhen: (p) => str(p, 'stand') === 'none',
  },
]

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

function panelSize(p) {
  const aspect = ASPECT[str(p, 'aspect')] ?? ASPECT.sixteenNine
  const diagonal = num(p, 'panel') * 25.4
  const screenW = diagonal * aspect.w
  const screenH = diagonal * aspect.h
  const bezel = num(p, 'bezel')
  const chin = num(p, 'chin')
  return {
    aspect,
    diagonal,
    screenW,
    screenH,
    bezel,
    chin,
    W: screenW + bezel * 2,
    H: screenH + bezel + chin,
    screenCentre: chin + screenH / 2,
  }
}

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

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
  return r < 1 ? ring(corners) : roundCorners(corners, r, 4)
}

function shift(points, dx, dz) {
  return points.map((q) => ({ x: q.x + dx, z: q.z + dz }))
}

/** Stands a plan-built solid on its face: the outline's x becomes height. */
function faceForward(geometry) {
  geometry.rotateZ(Math.PI / 2)
  return geometry
}

/** An upright plate with its front face at `x`, centred on (y, z). */
function plate(outline, x, thickness, radius, y, z = 0) {
  const g = faceForward(profiledBoard(outline, 0, thickness, radius > 0 ? 'rounded' : 'square', radius))
  g.translate(x + thickness, y, z)
  return g
}

/**
 * Wraps a geometry round a vertical cylinder of the given radius, keeping arc
 * length along Z — so a panel bends without stretching, which is what bending
 * a panel is. The axis sits behind the set, so the face ends up concave toward
 * the room. Front is -X while this runs, so the middle stays put and the ends
 * come forward.
 */
function bendAroundZ(geometry, radius, front) {
  const pos = geometry.getAttribute('position')
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const angle = z / radius
    // Distance from the axis, which lies `radius` behind the front face.
    const r = radius - (front - x)
    pos.setXYZ(i, front - (radius - r * Math.cos(angle)), pos.getY(i), r * Math.sin(angle))
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

/** A run of ports let into a face, going back from `x`. */
function portBlock(count, x, y, z) {
  const holes = []
  for (let i = 0; i < count; i++) {
    holes.push(box(9, 15, 17, x - 9, y, z + i * 22))
  }
  return holes.length ? merge(holes) : null
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const size = panelSize(p)
  const { W, H, screenW, screenH, bezel, chin } = size
  const tech = TECH[str(p, 'tech')] ?? TECH.lcd
  const finish = FINISH[str(p, 'finish')] ?? FINISH.black
  const radius = num(p, 'radius')
  const thickness = num(p, 'thickness')
  const profile = str(p, 'profile')
  const standKind = str(p, 'stand')
  const standHeight = standKind === 'none' ? 0 : num(p, 'standHeight')
  const tilt = standKind === 'none' ? 0 : (num(p, 'tilt') * Math.PI) / 180
  const speakers = str(p, 'speakers')

  const shell = []
  const front = []
  const dark = []
  const glass = []
  const lamps = []
  const fabric = []
  const parts = []

  // --- The slab -----------------------------------------------------------
  //
  // Built lying down in plan and stood on its face. The section is walked front
  // to back, so a taper is one inset at the far end and a step is two.
  const faceOutline = plan(rect(H, W, radius))
  const inset = Math.min(H, W) * 0.12
  // The thin part of the set is the technology itself; anything deeper than
  // that is the box behind it. So a stepped OLED is 8 mm at the edge whatever
  // its box measures, and a stepped plasma cannot get under 58.
  const skin = Math.min(thickness, Math.max(tech.floor, 8))
  let body
  if (profile === 'slab' || thickness <= skin + 2) {
    body = profiledBoard(faceOutline, 0, thickness, 'rounded', Math.min(radius, thickness / 2))
  } else if (profile === 'tapered') {
    body = merge(
      [
        sweep(
          faceOutline,
          [
            { inset: 0, y: thickness },
            { inset: 0, y: thickness - skin },
            { inset, y: 0 },
          ],
          false,
        ),
        face([faceOutline.pts], thickness, true),
        face([hull(faceOutline.offset(inset))], 0, false),
      ].filter(Boolean),
    )
  } else {
    // Stepped: a thin panel over the whole face, and a box on the back of it
    // holding the boards and the speakers. The step is not concentric — it
    // stands on the bottom of the panel rather than in the middle of it — so
    // the box is its own outline, shifted down the face before it is swept.
    const boxH = H * 0.42
    const boxOutline = plan(shift(rect(boxH, W * 0.82, Math.min(radius, 12)), -H / 2 + boxH / 2 + 4, 0))
    body = merge(
      [
        profiledBoard(faceOutline, thickness - skin, skin, 'rounded', Math.min(radius, skin / 2)),
        sweep(
          boxOutline,
          [
            { inset: 0, y: thickness - skin },
            { inset: 0, y: 6 },
            { inset: 12, y: 0 },
          ],
          false,
        ),
        face([boxOutline.pts], thickness - skin, true),
        face([hull(boxOutline.offset(12))], 0, false),
      ].filter(Boolean),
    )
  }
  faceForward(body)
  body.translate(thickness, H / 2, 0)
  shell.push(body)

  // The front of the set: a face plate over the whole outline, the picture
  // inside it, and the dark mask printed round the picture.
  const screenOutline = shift(rect(screenH, screenW, Math.max(1, radius * 0.3)), size.screenCentre - H / 2, 0)
  const faceThickness = tech.glass ? 4 : 1.4
  front.push(plate(rect(H, W, radius), -faceThickness, faceThickness, radius * 0.5, H / 2))
  dark.push(plate(shift(rect(screenH + 8, screenW + 8, Math.max(1, radius * 0.3)), size.screenCentre - H / 2, 0), -faceThickness - 0.6, 0.6, 0, H / 2))
  glass.push(plate(screenOutline, -faceThickness - 1.4, 1.2, 0, H / 2))

  if (bool(p, 'badge')) {
    parts.push({ name: 'badge', geometry: box(1.6, Math.min(12, chin * 0.5), 58, -faceThickness - 2, chin * 0.28, -29), color: finish.trim })
  }
  if (bool(p, 'standby')) {
    lamps.push(box(2, 4, 12, -faceThickness - 2, chin * 0.3, W * 0.22))
  }
  if (bool(p, 'camera')) {
    // Popped up out of the top edge, which is the only state worth drawing.
    shell.push(box(24, 26, 54, thickness * 0.3, H, -27))
    dark.push(box(4, 9, 9, thickness * 0.3 - 4, H + 9, -4.5))
  }

  // --- Speakers -------------------------------------------------------------
  if (speakers === 'grille') {
    const bandH = Math.max(8, chin * 0.55)
    const y = chin * 0.2
    const holes = []
    for (let i = 0; i < 48; i++) {
      holes.push(box(3, bandH, 4, -faceThickness - 1, y, -W * 0.4 + i * ((W * 0.8) / 47)))
    }
    dark.push(merge(holes))
  } else if (speakers === 'downFiring') {
    const slots = []
    for (const sz of [-1, 1]) {
      for (let i = 0; i < 8; i++) {
        slots.push(box(thickness * 0.4, 4, 8, thickness * 0.3, 2, sz * W * 0.34 + i * 11 - 44))
      }
    }
    dark.push(merge(slots))
  }

  // --- Ports and vents on the back ------------------------------------------
  const ports = Math.round(num(p, 'ports'))
  if (ports > 0) {
    const backX = profile === 'slab' ? thickness : thickness - skin * 0.4
    dark.push(portBlock(Math.ceil(ports / 2), backX, H * 0.22, -W * 0.24))
    if (ports > 1) dark.push(portBlock(Math.floor(ports / 2), backX, H * 0.22 - 20, -W * 0.24))
  }

  // --- Bend it, tilt it, then stand it up -----------------------------------
  //
  // Everything above is part of the panel. Curving comes first, because it is a
  // property of the set; the tilt and the lift belong to the stand.
  const panelParts = [...shell, ...front, ...dark, ...glass, ...lamps]
  for (const part of parts) panelParts.push(part.geometry)

  if (bool(p, 'curved')) {
    const r = num(p, 'curveRadius')
    for (const g of panelParts) if (g) bendAroundZ(g, r, -faceThickness - 2.6)
  }

  const lean = Math.max(0, thickness * Math.sin(tilt))
  for (const g of panelParts) {
    if (!g) continue
    g.rotateZ(-tilt)
    g.translate(0, standHeight + lean, 0)
  }

  // --- Stand ----------------------------------------------------------------
  const deck = standHeight + lean
  if (standKind === 'pedestal') {
    const neck = Math.max(70, W * 0.1)
    shell.push(box(30, deck + 24, neck, thickness - 6, 0, -neck / 2))
    shell.push(
      profiledBoard(rect(Math.max(200, H * 0.42), Math.max(260, W * 0.3), 14), 0, 14, 'rounded', 6).translate(
        thickness / 2 + 30,
        0,
        0,
      ),
    )
  } else if (standKind === 'feet') {
    // A pair out near the ends: a blade down to the table and a foot along it.
    const spread = (num(p, 'footSpread') / 100) * W
    for (const sz of [-1, 1]) {
      const z = (sz * spread) / 2
      shell.push(box(26, deck + 20, 30, thickness - 8, 0, z - 15))
      shell.push(
        profiledBoard(rect(Math.max(190, H * 0.36), 42, 10), 0, 10, 'rounded', 4).translate(thickness / 2 + 20, 0, z),
      )
    }
  } else if (standKind === 'plate') {
    shell.push(
      profiledBoard(rect(Math.max(180, H * 0.34), W * 0.66, 10), 0, Math.max(8, deck), 'rounded', 5).translate(
        thickness / 2 + 10,
        0,
        0,
      ),
    )
    shell.push(box(24, deck + 26, W * 0.3, thickness - 10, 0, -W * 0.15))
  } else if (standKind === 'easel') {
    // A leg raked back to the floor, spread across the width so that leaning it
    // cannot push a corner through the table.
    const legWidth = Math.max(90, W * 0.3)
    const thin = 22
    const top = new THREE.Vector3(thickness - 6, deck + H * 0.6, 0)
    const foot = new THREE.Vector3(thickness + deck * 1.1 + H * 0.34, 0, 0)
    const leg = strut(foot, top, thin, thin * 0.85, 4, Math.PI / 4)
    leg.scale(1, 1, legWidth / thin)
    // The foot is cut off square to the leg's own axis, so where its lowest
    // corner ends up depends on the rake. Measure it and drop the leg onto the
    // table, rather than predicting it and being a millimetre out either way.
    leg.computeBoundingBox()
    leg.translate(0, -leg.boundingBox.min.y, 0)
    shell.push(leg)
  } else if (bool(p, 'bracket')) {
    // A wall plate and the arms out to the panel. The wall is the back of it.
    const armWidth = Math.max(80, W * 0.16)
    shell.push(box(16, H * 0.5, armWidth, thickness + 34, H * 0.25, -armWidth / 2))
    for (const sy of [0.3, 0.7]) {
      shell.push(box(34, 40, armWidth * 0.5, thickness, H * sy, -armWidth * 0.25))
    }
  }

  // --- A soundbar in front of it --------------------------------------------
  if (speakers === 'soundbar') {
    const barW = W * 0.72
    const barH = Math.max(58, H * 0.11)
    const outline = plan(rect(96, barW, 12))
    shell.push(
      merge(
        [
          sweep(
            outline,
            [
              { inset: 0, y: barH },
              { inset: 0, y: 0 },
            ],
            false,
          ),
          face([outline.pts], barH, true),
          face([outline.pts], 0, false),
        ].filter(Boolean),
      ).translate(-140, 0, 0),
    )
    const mesh = []
    for (let i = 0; i < 40; i++) {
      mesh.push(box(3, barH * 0.6, 5, -191, barH * 0.2, -barW * 0.44 + i * ((barW * 0.88) / 39)))
    }
    fabric.push(merge(mesh))
  }

  // --- Collect --------------------------------------------------------------
  const add = (name, list, color) => {
    const usable = list.filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }
  add('body', shell, finish.shell)
  add('front', front, finish.bezel)
  add('mask', dark, COLOR.dark)
  add('soundbar', fabric, COLOR.fabric)
  add('screen', glass, bool(p, 'screenOn') ? COLOR.picture : COLOR.screenOff)
  add('lamp', lamps, COLOR.lamp)

  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  // Swung round from -X to +Z, which is where the Front view looks from, so the
  // front of the machine is what the front view shows.
  for (const part of facing) part.geometry.rotateY(Math.PI / 2)
  return facing
}

export function metrics(p) {
  const size = panelSize(p)
  const tech = TECH[str(p, 'tech')] ?? TECH.lcd
  const thickness = num(p, 'thickness')
  const profile = str(p, 'profile')
  // What the set measures at its edge, which is the number these were sold on.
  const skin = Math.min(thickness, Math.max(tech.floor, 8))
  const edge = profile === 'slab' ? thickness : skin
  const bloated = profile === 'slab' && thickness > tech.floor * 3
  const standKind = str(p, 'stand')
  const standHeight = standKind === 'none' ? 0 : num(p, 'standHeight')
  const inches = num(p, 'panel')

  const screenArea = (size.screenW * size.screenH) / 1e6
  const bodyArea = (size.W * size.H) / 1e6
  const screenShare = (screenArea / bodyArea) * 100

  const mass = screenArea * tech.mass + 1.6 + (standKind === 'none' ? 0 : 2.4)

  // A set is watched from about one and a half times its width for 4K and
  // three times for 1080, which is the whole argument about screen size.
  const near = size.screenW * 1.5
  const far = size.screenW * 3

  const rows = [
    {
      label: 'Whole set',
      value: `${formatLength(size.W)} × ${formatLength(size.H)} × ${formatLength(thickness)}`,
      note: 'The panel, the bezel round it and the chin under it. There is nothing else to it.',
    },
    {
      label: 'Panel',
      value: `${inches}″ ${size.aspect.label} — ${formatLength(size.screenW)} × ${formatLength(size.screenH)}`,
    },
    {
      label: 'Screen to body',
      value: `${screenShare.toFixed(0)}% screen`,
      level: screenShare < 62 ? 'warn' : 'ok',
      note: screenShare < 62 ? 'Mostly bezel and chin. Thin one or the other.' : undefined,
    },
    {
      label: 'Thickness',
      value:
        profile === 'slab'
          ? `${formatLength(thickness)} all over`
          : `${formatLength(edge)} at the edge, ${formatLength(thickness)} at its deepest`,
      level: thickness < tech.floor ? 'error' : bloated ? 'warn' : 'ok',
      note:
        thickness < tech.floor
          ? `${tech.label} will not go thinner than about ${formatLength(tech.floor)}. Thicken it, step the back, or change the technology.`
          : bloated
            ? `Three times what ${tech.label} needs, and the same depth all over. Step or taper the back, or thin it.`
            : `${tech.label} needs about ${formatLength(tech.floor)} of it.`,
    },
    {
      label: 'Mass',
      value: `${mass.toFixed(1)} kg`,
      note: `${tech.label} at about ${tech.mass} kg per square metre of screen — ${mass < 16 ? 'one person' : mass < 32 ? 'two people to hang it' : 'two people and a bracket you trust'}.`,
    },
    {
      label: 'Watch it from',
      value: `${formatLength(near)} to ${formatLength(far)}`,
      note: 'One and a half times the picture width at 4K, three times at 1080.',
    },
    {
      label: 'Screen centre',
      value:
        standKind === 'none'
          ? `${formatLength(size.screenCentre)} above the bottom of the set`
          : `${formatLength(standHeight + size.screenCentre)} above the table`,
      note:
        standKind === 'none'
          ? 'On a bracket, so where it ends up is where you put it. A seated eye is about 1150 mm off the floor.'
          : 'A seated eye is about 1150 mm off the floor, so a 400 mm unit puts a set this size about right.',
    },
  ]

  if (standKind === 'feet') {
    const spread = (num(p, 'footSpread') / 100) * size.W
    rows.push({
      label: 'Table it needs',
      value: `${formatLength(spread + 60)} wide`,
      level: spread > size.W * 0.85 ? 'warn' : 'ok',
      note:
        spread > size.W * 0.85
          ? 'Feet almost at the corners, so it wants a unit as wide as the set. This is the complaint everyone had.'
          : undefined,
    })
  }

  // The years this set could have been sold in: the technology, the bezel it
  // has and the tricks it has been given.
  let from = tech.from
  let to = tech.to
  let why = `${tech.label} panels`
  const narrow = (f, t, what) => {
    if (f > from) {
      from = f
      why = what
    }
    if (t < to) {
      to = t
      why = what
    }
  }
  if (bool(p, 'curved')) narrow(2013, 2018, 'a curved screen')
  if (bool(p, 'camera')) narrow(2012, 2017, 'a pop-up camera')
  if (str(p, 'aspect') === 'twentyOneNine') narrow(2012, 2016, 'a 21:9 panel')
  if (str(p, 'aspect') === 'sixteenTen') narrow(1998, 2008, 'a 16:10 panel')
  if (num(p, 'bezel') >= 30) narrow(1998, 2011, 'a bezel that wide')
  if (num(p, 'bezel') <= 3) narrow(2015, 2030, 'a bezel that thin')
  if (inches >= 75) narrow(2013, 2030, 'a panel that big')
  rows.push(
    from <= to
      ? {
          label: 'Reads as',
          value: `${from}–${to === 2030 ? 'now' : to}`,
          note: `Set by ${why}.`,
        }
      : {
          label: 'Reads as',
          value: 'no single year',
          level: 'error',
          note: `${why[0].toUpperCase()}${why.slice(1)} never overlapped with the rest of this.`,
        },
  )

  return rows
}

export const presets = [
  {
    name: '2008 plasma',
    params: {
      panel: 42, aspect: 'sixteenNine', tech: 'plasma', bezel: 34, chin: 62, screenOn: true,
      thickness: 92, profile: 'tapered', radius: 12, finish: 'glossBlack', speakers: 'grille',
      stand: 'pedestal', standHeight: 90, tilt: 0, ports: 6, badge: true,
    },
  },
  {
    name: '2011 edge-lit LCD',
    params: {
      panel: 40, aspect: 'sixteenNine', tech: 'lcd', bezel: 18, chin: 34, screenOn: true,
      thickness: 34, profile: 'tapered', radius: 8, finish: 'black', speakers: 'downFiring',
      stand: 'pedestal', standHeight: 80, tilt: 2, ports: 8, badge: true,
    },
  },
  {
    name: '2016 curved 4K',
    params: {
      panel: 55, aspect: 'sixteenNine', tech: 'lcd', bezel: 8, chin: 18, screenOn: true,
      thickness: 42, profile: 'stepped', radius: 6, finish: 'gunmetal', curved: true,
      curveRadius: 4200, speakers: 'downFiring', stand: 'feet', footSpread: 82, standHeight: 60,
      tilt: 2, ports: 8, camera: false, badge: true,
    },
  },
  {
    name: '2019 OLED on a plate',
    params: {
      panel: 65, aspect: 'sixteenNine', tech: 'oled', bezel: 4, chin: 10, screenOn: true,
      thickness: 48, profile: 'stepped', radius: 4, finish: 'gunmetal', speakers: 'downFiring',
      stand: 'plate', standHeight: 46, tilt: 0, ports: 9, badge: false, standby: true,
    },
  },
  {
    name: '2022 wall-mounted 75″',
    params: {
      panel: 75, aspect: 'sixteenNine', tech: 'lcd', bezel: 3, chin: 8, screenOn: true,
      thickness: 30, profile: 'stepped', radius: 4, finish: 'black', speakers: 'soundbar',
      stand: 'none', bracket: true, ports: 10, badge: false,
    },
  },
  {
    name: 'Small kitchen set',
    params: {
      panel: 24, aspect: 'sixteenNine', tech: 'lcd', bezel: 12, chin: 22, screenOn: true,
      thickness: 40, profile: 'slab', radius: 6, finish: 'white', speakers: 'grille',
      stand: 'easel', standHeight: 30, tilt: 6, ports: 3, badge: true,
    },
  },
]
