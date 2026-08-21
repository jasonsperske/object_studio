// All-in-one, 2007–2018.
//
// The machine that went back into the screen once the screen had stopped being
// a tube. There is no case to speak of and nothing to expand: a panel, a laptop
// board behind it, and a stand. What is left to decide is the panel, how thick
// the chin under it is, and what the stand does.
//
// So the size here comes from the panel and nothing else — which is exactly how
// these were specified.
//
// Built with the front at -X and turned at the end to face +Z, which is where
// the studio's Front view looks from. Width then runs along X centred on zero,
// +Y is up, and the desk is Y = 0.

export const meta = {
  order: 13,
  name: 'All-in-one',
  description:
    'The 2007–18 machine behind the screen — sized entirely by its panel, with a slot-loading drive, a chin or a bezel, and a foot, an arm or nothing at all.',
}

const ASPECT = {
  sixteenTen: { w: 0.848, h: 0.53, label: '16:10' },
  sixteenNine: { w: 0.872, h: 0.49, label: '16:9' },
}

const FINISH = {
  white: { shell: 0xeceae4, bezel: 0xdedcd5, trim: 0x9ba0a4 },
  silver: { shell: 0xc6cbd0, bezel: 0xb7bcc1, trim: 0x70767c },
  aluminium: { shell: 0xd2d6da, bezel: 0x8e9498, trim: 0x63696e },
  black: { shell: 0x2e3135, bezel: 0x25282c, trim: 0x8e959c },
  glassBlack: { shell: 0x1f2225, bezel: 0x181b1e, trim: 0x9aa1a8 },
}

const COLOR = { screenOff: 0x1c1f22, dark: 0x17191c, lamp: 0xd8dde1 }

export const params = [
  // --- Panel --------------------------------------------------------------
  { id: 'panel', label: 'Panel', type: 'number', min: 17, max: 34, step: 0.5, default: 24, unit: '″', group: 'Panel', help: 'The diagonal. Everything else on this machine follows from it.' },
  {
    id: 'aspect',
    label: 'Shape',
    type: 'select',
    default: 'sixteenNine',
    group: 'Panel',
    options: [
      { value: 'sixteenTen', label: '16:10' },
      { value: 'sixteenNine', label: '16:9' },
    ],
  },
  { id: 'bezel', label: 'Bezel', type: 'number', min: 4, max: 40, step: 1, default: 18, unit: 'mm', group: 'Panel', help: 'Round the sides and the top. It got thinner every year.' },
  { id: 'chin', label: 'Chin', type: 'number', min: 8, max: 120, step: 1, default: 52, unit: 'mm', group: 'Panel', help: 'The deeper band under the panel, where the board and the badge went.' },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: true, group: 'Panel' },
  { id: 'webcam', label: 'Webcam', type: 'boolean', default: true, group: 'Panel' },

  // --- Case ---------------------------------------------------------------
  { id: 'thickness', label: 'Thickness', type: 'number', min: 12, max: 90, step: 1, default: 42, unit: 'mm', group: 'Case', help: 'At the thickest point. A slot-loading drive needs about 30.' },
  { id: 'taper', label: 'Tapered back', type: 'boolean', default: true, group: 'Case', help: 'Thick in the middle where the board is, thin at the edges.' },
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'aluminium',
    group: 'Case',
    options: [
      { value: 'white', label: 'White plastic' },
      { value: 'silver', label: 'Silver plastic' },
      { value: 'aluminium', label: 'Aluminium' },
      { value: 'black', label: 'Black' },
      { value: 'glassBlack', label: 'Black behind glass' },
    ],
  },
  { id: 'radius', label: 'Corner radius', type: 'number', min: 0, max: 40, step: 1, default: 14, unit: 'mm', group: 'Case' },
  { id: 'badge', label: 'Badge on the chin', type: 'boolean', default: true, group: 'Case' },

  // --- Drives and ports ---------------------------------------------------
  {
    id: 'optical',
    label: 'Optical drive',
    type: 'select',
    default: 'slot',
    group: 'Fittings',
    options: [
      { value: 'none', label: 'None — it was the first thing to go' },
      { value: 'slot', label: 'Slot loading, in the side' },
      { value: 'tray', label: 'Tray loading, in the side' },
    ],
  },
  { id: 'cardReader', label: 'Card reader', type: 'boolean', default: true, group: 'Fittings' },
  { id: 'ports', label: 'Ports on the back', type: 'int', min: 2, max: 8, step: 1, default: 6, group: 'Fittings' },
  { id: 'speakerGrille', label: 'Speaker grille under the chin', type: 'boolean', default: true, group: 'Fittings' },

  // --- Stand --------------------------------------------------------------
  {
    id: 'stand',
    label: 'Stand',
    type: 'select',
    default: 'foot',
    group: 'Stand',
    options: [
      { value: 'foot', label: 'Foot — a plate and a neck' },
      { value: 'arm', label: 'Arm — a hinged one, off a slab' },
      { value: 'easel', label: 'Easel — a leg folded out of the back' },
      { value: 'none', label: 'None — on a wall mount' },
    ],
  },
  { id: 'standHeight', label: 'How high it holds it', type: 'number', min: 40, max: 260, step: 5, default: 120, unit: 'mm', group: 'Stand', visibleWhen: (p) => str(p, 'stand') === 'foot' || str(p, 'stand') === 'arm', help: 'A foot or an arm lifts the panel. An easel does not — it rests on the desk and the leg props it.' },
  { id: 'tilt', label: 'Tilt', type: 'number', min: -5, max: 25, step: 1, default: 8, unit: '°', group: 'Stand' },

  // --- Desk ---------------------------------------------------------------
  { id: 'keyboard', label: 'Keyboard and mouse', type: 'boolean', default: true, group: 'Desk', help: 'The slim wireless pair these came with.' },
]

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

/** Panel, bezel and chin: the whole of it. */
function panelSize(p) {
  const aspect = ASPECT[str(p, 'aspect')] ?? ASPECT.sixteenNine
  const diagonal = num(p, 'panel') * 25.4
  const screenW = diagonal * aspect.w
  const screenH = diagonal * aspect.h
  const bezel = num(p, 'bezel')
  const chin = num(p, 'chin')
  return {
    aspect,
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

function faceForward(geometry) {
  geometry.rotateZ(Math.PI / 2)
  return geometry
}

function plate(outline, x, thickness, radius, y, z = 0) {
  const g = faceForward(profiledBoard(outline, 0, thickness, radius > 0 ? 'rounded' : 'square', radius))
  g.translate(x + thickness, y, z)
  return g
}

function socket(diameter, length, x, y, z) {
  const g = post(diameter, length, 0, 0, 0, 10)
  g.rotateZ(-Math.PI / 2)
  g.translate(x, y, z)
  return g
}

/** The slim keyboard these were sold with, built about the origin. */
function keyboard(pitch, numpad) {
  const columns = numpad ? 21 : 15.5
  const rows = 6
  const width = columns * pitch
  const depth = rows * pitch + 8
  const height = 10
  const outline = plan(rect(depth + 14, width + 16, 4))
  const shell = [
    sweep(outline, [{ inset: 0, y: height }, { inset: 0, y: 0 }], false),
    face([outline.pts], height, true),
    face([outline.pts], 0, false),
  ]
  const keys = []
  for (let r = 0; r < rows; r++) {
    const x = -depth / 2 + r * pitch
    if (r === 0) {
      keys.push(box(pitch * 0.86, 2.5, pitch * 5.5, x, height, -pitch * 2.75))
      for (const side of [-1, 1]) keys.push(box(pitch * 0.86, 2.5, pitch * 1.3, x, height, side * pitch * 3.6))
      continue
    }
    const capDepth = r === rows - 1 ? pitch * 0.58 : pitch * 0.86
    for (let c = 0; c < Math.floor(columns); c++) {
      const z = -width / 2 + c * pitch + ((rows - r) % 3) * pitch * 0.2
      if (z + pitch > width / 2) continue
      keys.push(box(capDepth, 2.5, pitch * 0.86, x, height, z))
    }
  }
  return { shell: merge(shell.filter(Boolean)), keys: merge(keys) }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const size = panelSize(p)
  const { W, H, screenW, screenH, bezel, chin } = size
  const finish = FINISH[str(p, 'finish')] ?? FINISH.aluminium
  const radius = num(p, 'radius')
  const thickness = num(p, 'thickness')
  const standKind = str(p, 'stand')
  // A kickstand rests the panel's own bottom edge on the desk; a foot or an arm
  // lifts it clear.
  const standHeight = standKind === 'foot' || standKind === 'arm' ? num(p, 'standHeight') : 0
  // A wall mount does not tilt; anything on a stand does.
  const tilt = str(p, 'stand') === 'none' ? 0 : (num(p, 'tilt') * Math.PI) / 180
  const optical = str(p, 'optical')

  // Leaning the panel back drops its back edge, so it is lifted by that as well
  // as by the stand.
  const lean = Math.max(0, thickness * Math.sin(tilt))
  // Where a point on the back of the panel ends up once the panel has been leant
  // back and lifted. The stand has to meet it there rather than where it was
  // drawn, or it comes out through the glass.
  const onPanel = (x, y) =>
    new THREE.Vector3(
      x * Math.cos(tilt) + y * Math.sin(tilt),
      -x * Math.sin(tilt) + y * Math.cos(tilt) + standHeight + lean,
      0,
    )
  // How much of the middle of the back the stand takes, worked out before the
  // fittings so they can keep out of its way.
  const standWidth =
    standKind === 'foot'
      ? Math.max(60, W * 0.12)
      : standKind === 'arm'
        ? Math.max(70, W * 0.1)
        : standKind === 'easel'
          ? Math.max(80, W * 0.36)
          : 0

  const shell = []
  const front = []
  const dark = []
  const glass = []
  const lamps = []
  const parts = []

  // --- The slab -----------------------------------------------------------
  //
  // Built lying down in plan and then stood on its face, which is how every
  // panel-shaped thing here is made: the outline's own x becomes height.
  const faceOutline = plan(rect(H, W, radius))
  const aperture = ring(rect(screenH, screenW, Math.max(2, radius * 0.3)))
  // Plan y runs from the back of the machine at nought to the front at the full
  // thickness, because standing the slab on its face turns the outline over.
  const taperInset = Math.min(H, W) * 0.14
  const body = bool(p, 'taper')
    ? // Full size at the glass and drawn in toward the back, the way a moulded
      // back does it. Walked front to back, which is what puts the normals on
      // the outside of it.
      merge(
        [
          sweep(
            faceOutline,
            [
              { inset: 0, y: thickness },
              { inset: 0, y: thickness * 0.6 },
              { inset: taperInset, y: 0 },
            ],
            false,
          ),
          face([faceOutline.pts], thickness, true),
          face([hull(faceOutline.offset(taperInset))], 0, false),
        ].filter(Boolean),
      )
    : profiledBoard(faceOutline, 0, thickness, 'rounded', Math.min(radius, thickness / 2))
  faceForward(body)
  body.translate(thickness, H / 2, 0)
  shell.push(body)

  // The glass over the front, and the panel behind it.
  front.push(plate(rect(H, W, radius), -1.2, 1.2, radius * 0.5, H / 2))
  glass.push(plate(rect(screenH, screenW, Math.max(2, radius * 0.3)), -2, 1.4, 0, size.screenCentre))
  // A dark surround printed on the back of the glass, which is how they did it —
  // never wider than the bezel it is printed on, or it laps over the edge of a
  // machine with hardly any bezel at all.
  const printed = Math.min(10, bezel * 1.6)
  dark.push(
    plate(rect(screenH + printed, screenW + printed, Math.max(2, radius * 0.3)), -0.8, 0.8, 0, size.screenCentre),
  )

  if (bool(p, 'webcam')) {
    dark.push(socket(7, 2, -2.6, H - bezel / 2, 0))
    lamps.push(box(1.5, 2, 2, -2.6, H - bezel / 2, 14))
  }
  if (bool(p, 'badge')) {
    parts.push({
      name: 'badge',
      geometry: box(1.5, 14, 62, -2.6, chin / 2 - 7, -31),
      color: finish.trim,
    })
  }
  if (bool(p, 'speakerGrille')) {
    const grille = []
    for (let i = 0; i < 22; i++) {
      grille.push(box(10, 3, 8, thickness * 0.35, -1, -W * 0.32 + i * (W * 0.64) / 21))
    }
    dark.push(merge(grille))
  }

  // --- Fittings in the side ------------------------------------------------
  // A disc goes in with its face parallel to the screen, so the slot is a slit
  // running up the side rather than across the machine — which is all the side
  // has room for anyway, the machine being forty millimetres thick.
  const sideX = thickness * 0.25
  if (optical !== 'none') {
    const y = size.screenCentre - screenH * 0.1
    if (optical === 'slot') {
      dark.push(box(5, 128, 4, sideX, y - 64, W / 2 - 2))
    } else {
      dark.push(box(thickness * 0.4, 140, 3, sideX * 0.6, y - 70, W / 2 - 1))
      dark.push(box(5, 132, 4, sideX, y - 66, W / 2 - 2))
    }
  }
  if (bool(p, 'cardReader')) {
    dark.push(box(5, 30, 4, sideX, chin + screenH * 0.2, W / 2 - 2))
  }
  // Ports across the back, low down where the board is — and on the back, which
  // a tapered case draws in, so they have to be inside what it draws in to.
  // They run off to one side as well: the middle of the back is the stand's,
  // and a neck or an arm lands right where a row through the centre would be.
  const portY = bool(p, 'taper')
    ? Math.min(Math.max(chin * 0.5, taperInset + 16), H - taperInset - 30)
    : chin * 0.5
  const portCount = Math.round(num(p, 'ports'))
  const portEdge = (bool(p, 'taper') ? taperInset : radius) + 12
  const portRight = standWidth ? -(standWidth / 2 + 14) : W * 0.16
  const portStep = Math.min(16, (portRight + W / 2 - portEdge) / portCount)
  for (let i = 0; i < portCount; i++) {
    dark.push(box(10, 14, 5, thickness - 9, portY, portRight - (i + 1) * portStep))
  }

  // --- Tilt the panel, then stand it up ------------------------------------
  //
  // Only the panel leans: it turns about its own bottom edge and is then lifted
  // onto the stand, which stands up straight underneath it.
  const panelParts = [...shell, ...front, ...dark, ...glass, ...lamps]
  for (const part of parts) panelParts.push(part.geometry)
  for (const g of panelParts) {
    if (!g) continue
    g.rotateZ(-tilt)
    g.translate(0, standHeight + lean, 0)
  }

  if (standKind === 'foot') {
    const neckWidth = standWidth
    const neck = onPanel(thickness - 8, chin * 0.5)
    shell.push(box(28, neck.y, neckWidth, neck.x - 14, 0, -neckWidth / 2))
    shell.push(
      profiledBoard(rect(Math.max(150, H * 0.42), Math.max(180, W * 0.34), 12), 0, 12, 'rounded', 5).translate(
        neck.x,
        0,
        0,
      ),
    )
  } else if (standKind === 'arm') {
    const armWidth = standWidth
    // A hinged arm off a slab, holding the panel out in front of its foot.
    const joint = onPanel(thickness - 6, chin * 0.4 + 12)
    shell.push(box(150, 22, armWidth, joint.x, joint.y - 22, -armWidth / 2))
    shell.push(box(26, joint.y - 11, armWidth, joint.x + 124, 0, -armWidth / 2))
    shell.push(
      profiledBoard(rect(Math.max(160, H * 0.4), Math.max(200, W * 0.36), 14), 0, 14, 'rounded', 6).translate(
        joint.x + 120,
        0,
        0,
      ),
    )
  } else if (standKind === 'easel') {
    // A leg folded out of the back, reaching the desk behind the machine, with
    // the panel's own bottom edge on the desk in front of it. Built thin and
    // then spread across the width, so that standing it at an angle cannot push
    // a corner of it through the desk.
    const legWidth = standWidth
    const thin = 18
    const top = onPanel(thickness - 4, H * 0.55)
    const foot = new THREE.Vector3(top.x + H * 0.34 + 40, thin * 0.6, 0)
    const leg = strut(foot, top, thin, thin * 0.8, 4, Math.PI / 4)
    leg.scale(1, 1, legWidth / thin)
    shell.push(leg)
  }

  // --- Desk ----------------------------------------------------------------
  if (bool(p, 'keyboard')) {
    const kb = keyboard(19.05, W > 560)
    for (const g of [kb.shell, kb.keys]) g.translate(-190, 0, 0)
    parts.push({ name: 'keyboard', geometry: kb.shell, color: finish.shell })
    parts.push({ name: 'keycaps', geometry: kb.keys, color: finish.bezel })
    const mouse = new THREE.SphereGeometry(1, 14, 10)
    mouse.scale(56, 14, 30)
    mouse.translate(-150, 14, 260)
    parts.push({ name: 'mouse', geometry: mouse, color: finish.shell })
  }

  const add = (name, list, color) => {
    const usable = list.filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }
  add('case', shell, finish.shell)
  add('front', front, finish.bezel)
  add('surround', dark, COLOR.dark)
  add('screen', glass, bool(p, 'screenOn') ? 0xc3d9f2 : COLOR.screenOff)
  add('lamps', lamps, COLOR.lamp)

  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  // Swung round from -X to +Z, which is where the Front view looks from, so the
  // front of the machine is what the front view shows.
  for (const part of facing) part.geometry.rotateY(Math.PI / 2)
  return facing
}

export function metrics(p) {
  const size = panelSize(p)
  const stand = str(p, 'stand')
  const standHeight = stand === 'foot' || stand === 'arm' ? num(p, 'standHeight') : 0
  const thickness = num(p, 'thickness')
  const optical = str(p, 'optical')

  // Sitting at a 750 desk, the eye is about 400 mm above it.
  const centre = standHeight + size.screenCentre
  const eyeLevel = 400
  // A wall mount hangs wherever it is hung, so there is nothing to warn about;
  // a kickstand sits on the desk and is meant to be low.
  const level =
    stand === 'none'
      ? 'ok'
      : centre > eyeLevel + 160
        ? 'warn'
        : stand !== 'easel' && centre < eyeLevel - 120
          ? 'warn'
          : 'ok'
  const bezelShare = ((size.W * size.H - size.screenW * size.screenH) / (size.W * size.H)) * 100
  const opticalNeeds = optical === 'tray' ? 26 : optical === 'slot' ? 18 : 0

  return [
    {
      label: 'Whole thing',
      value: `${formatLength(size.W)} × ${formatLength(size.H)} × ${formatLength(thickness)}`,
      note: 'The panel, the bezel round it and the chin under it. There is nothing else to it.',
    },
    { label: 'Panel', value: `${num(p, 'panel')}″ ${size.aspect.label} — ${formatLength(size.screenW)} × ${formatLength(size.screenH)}` },
    {
      label: 'Screen to body',
      value: `${(100 - bezelShare).toFixed(0)}% screen`,
      level: bezelShare > 45 ? 'warn' : 'ok',
      note: bezelShare > 45 ? 'Mostly bezel and chin. Thin the bezel or shrink the chin.' : undefined,
    },
    {
      label: 'Screen centre',
      value:
        stand === 'none'
          ? `${formatLength(size.screenCentre)} up the machine — it hangs where you hang it`
          : `${formatLength(centre)} above the desk`,
      level,
      note: level === 'ok' ? undefined : 'Eye level at a 750 desk is about 400 mm above it.',
    },
    {
      label: 'Optical drive',
      value: optical === 'none' ? 'None' : optical === 'slot' ? 'Slot loading' : 'Tray loading',
      level: opticalNeeds > thickness - 12 ? 'warn' : 'ok',
      note:
        opticalNeeds > thickness - 12
          ? `A ${optical}-loading drive wants about ${formatLength(opticalNeeds + 12)} of thickness to hide in.`
          : undefined,
    },
    { label: 'Desk taken', value: `${((size.W * (thickness + (stand === 'none' ? 0 : 180))) / 1e6).toFixed(2)} m²` },
  ]
}

export const presets = [
  {
    name: '2007 white all-in-one',
    params: {
      panel: 20, aspect: 'sixteenTen', bezel: 26, chin: 62, thickness: 60, taper: true,
      finish: 'white', radius: 20, optical: 'slot', cardReader: false, stand: 'foot',
      standHeight: 110, tilt: 10, keyboard: true,
    },
  },
  {
    name: '2010 aluminium 27″',
    params: {
      panel: 27, aspect: 'sixteenNine', bezel: 22, chin: 56, thickness: 54, taper: true,
      finish: 'aluminium', radius: 12, optical: 'slot', cardReader: true, stand: 'foot',
      standHeight: 140, tilt: 6, ports: 8, keyboard: true,
    },
  },
  {
    name: '2012 office 21″',
    params: {
      panel: 21.5, aspect: 'sixteenNine', bezel: 16, chin: 44, thickness: 46, taper: false,
      finish: 'black', radius: 8, optical: 'tray', cardReader: true, stand: 'arm',
      standHeight: 130, tilt: 8, ports: 6, keyboard: true,
    },
  },
  {
    name: '2015 thin bezel',
    params: {
      panel: 24, aspect: 'sixteenNine', bezel: 8, chin: 26, thickness: 24, taper: true,
      finish: 'silver', radius: 8, optical: 'none', cardReader: true, stand: 'easel',
      standHeight: 90, tilt: 12, ports: 5, speakerGrille: true, keyboard: true,
    },
  },
  {
    name: '2018 wall-mounted',
    params: {
      panel: 27, aspect: 'sixteenNine', bezel: 6, chin: 14, thickness: 18, taper: false,
      finish: 'glassBlack', radius: 6, optical: 'none', cardReader: false, stand: 'none',
      tilt: 0, ports: 4, badge: false, keyboard: false,
    },
  },
]
