// Notebook, 1995–2008.
//
// The clamshell, back when it was thick. There is no board standard to build
// this one around — every maker drew their own — so what sets the size is the
// panel and the keyboard: the screen fixes the width and how far back the lid
// goes, the key pitch fixes what will fit in the base, and the thickness is
// whatever the drive bay and the battery demanded.
//
// No expansion cards either. What these had was a PC Card slot in the side and
// a bay you could swap a drive into, which is what the options here are.
//
// Built with the front at -X and turned to face +X at the end. +Z is width,
// +Y is up, the desk is Y = 0.

export const meta = {
  order: 12,
  name: 'Notebook',
  description:
    'The 1995–2008 clamshell — sized by its panel and its keyboard, with a swappable drive bay, a PC Card slot and a battery under the back rather than bays and cards.',
}

const FINISH = {
  charcoal: { shell: 0x3c3f44, deck: 0x35383c, keys: 0x2b2e32, trim: 0x9aa1a8 },
  graphite: { shell: 0x54585e, deck: 0x4a4e54, keys: 0x2f3237, trim: 0xa8afb6 },
  silver: { shell: 0xbfc4c9, deck: 0xb2b7bc, keys: 0x3a3d42, trim: 0x6e747a },
  magnesium: { shell: 0x8f9498, deck: 0x83888c, keys: 0x2b2e32, trim: 0xd8dde1 },
  ivory: { shell: 0xded9c8, deck: 0xd2cdbc, keys: 0x4a463c, trim: 0x8b8578 },
}

const COLOR = { dark: 0x1e2124, port: 0x24272b, lamp: 0x4ad06a, screenOff: 0x232629 }

// Panels: the diagonal and the shape of it, which changed halfway through.
const ASPECT = {
  fourThree: { w: 0.8, h: 0.6, label: '4:3' },
  sixteenTen: { w: 0.848, h: 0.53, label: '16:10' },
  sixteenNine: { w: 0.872, h: 0.49, label: '16:9' },
}

export const params = [
  // --- Panel --------------------------------------------------------------
  { id: 'panel', label: 'Panel', type: 'number', min: 8, max: 17, step: 0.1, default: 14.1, unit: '″', group: 'Panel', help: 'Diagonal. This is what the width of the machine comes from.' },
  {
    id: 'aspect',
    label: 'Shape',
    type: 'select',
    default: 'fourThree',
    group: 'Panel',
    options: [
      { value: 'fourThree', label: '4:3 — square-ish, the early one' },
      { value: 'sixteenTen', label: '16:10' },
      { value: 'sixteenNine', label: '16:9 — once panels came off television lines' },
    ],
  },
  { id: 'lidBezel', label: 'Lid bezel', type: 'number', min: 8, max: 40, step: 1, default: 20, unit: 'mm', group: 'Panel' },
  { id: 'lidAngle', label: 'Lid angle', type: 'number', min: 0, max: 135, step: 1, default: 105, unit: '°', group: 'Panel' },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: true, group: 'Panel' },
  { id: 'latch', label: 'Lid latch', type: 'boolean', default: true, group: 'Panel', help: 'The catch and the button that let it go. Later ones did without.' },

  // --- Keyboard -----------------------------------------------------------
  { id: 'keyPitch', label: 'Key pitch', type: 'number', min: 14, max: 19.05, step: 0.05, default: 19.05, unit: 'mm', group: 'Keyboard', help: 'Full size is 19.05. Sub-notebooks went down to 16 and you noticed.' },
  { id: 'keyRows', label: 'Rows', type: 'int', min: 5, max: 6, step: 1, default: 6, group: 'Keyboard' },
  {
    id: 'pointing',
    label: 'Pointing device',
    type: 'select',
    default: 'trackpad',
    group: 'Keyboard',
    options: [
      { value: 'trackball', label: 'Trackball — under the space bar' },
      { value: 'stick', label: 'Pointing stick — between G, H and B' },
      { value: 'trackpad', label: 'Trackpad' },
      { value: 'both', label: 'Stick and trackpad' },
    ],
  },
  { id: 'palmrest', label: 'Palm rest', type: 'number', min: 0, max: 90, step: 1, default: 52, unit: 'mm', group: 'Keyboard', help: 'How much deck there is in front of the keys. This is most of the depth of the machine.' },

  // --- Bay and battery ----------------------------------------------------
  {
    id: 'bay',
    label: 'Swappable bay',
    type: 'select',
    default: 'dvd',
    group: 'Bay',
    help: 'One bay in the side, and you carried whatever else you needed in the bag.',
    options: [
      { value: 'none', label: 'Empty — a blanking plate' },
      { value: 'floppy', label: 'Floppy drive' },
      { value: 'cd', label: 'CD-ROM' },
      { value: 'dvd', label: 'DVD' },
      { value: 'battery', label: 'A second battery' },
    ],
  },
  { id: 'batteryBulge', label: 'Battery under the back', type: 'boolean', default: true, group: 'Bay', help: 'The cylinder pack that lifted the back of the machine and tilted the keyboard.' },
  { id: 'pcCard', label: 'PC Card slot', type: 'boolean', default: true, group: 'Bay' },
  { id: 'thickness', label: 'Base thickness', type: 'number', min: 18, max: 60, step: 1, default: 38, unit: 'mm', group: 'Bay', help: 'A drive bay in the side needs about 30 mm of it.' },

  // --- Case ---------------------------------------------------------------
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'charcoal',
    group: 'Case',
    options: [
      { value: 'charcoal', label: 'Charcoal' },
      { value: 'graphite', label: 'Graphite' },
      { value: 'silver', label: 'Silver' },
      { value: 'magnesium', label: 'Magnesium' },
      { value: 'ivory', label: 'Ivory, going yellow' },
    ],
  },
  { id: 'radius', label: 'Corner radius', type: 'number', min: 0, max: 30, step: 1, default: 8, unit: 'mm', group: 'Case' },
  { id: 'statusPanel', label: 'Status lamps', type: 'boolean', default: true, group: 'Case', help: 'The little row of icons that told you the disk was busy.' },
  { id: 'speakers', label: 'Speaker grilles', type: 'boolean', default: true, group: 'Case' },
]

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

/** Panel, keyboard and palm rest between them decide the footprint. */
function footprint(p) {
  const aspect = ASPECT[str(p, 'aspect')] ?? ASPECT.fourThree
  const diagonal = num(p, 'panel') * 25.4
  const screenW = diagonal * aspect.w
  const screenH = diagonal * aspect.h
  const bezel = num(p, 'lidBezel')
  const pitch = num(p, 'keyPitch')
  const rows = Math.round(num(p, 'keyRows'))
  const keyWidth = 15.5 * pitch
  const keyDepth = rows * pitch
  const W = Math.max(screenW + bezel * 2, keyWidth + 30)
  const D = keyDepth + num(p, 'palmrest') + 30
  return { W, D, screenW, screenH, bezel, pitch, rows, keyWidth, keyDepth, aspect }
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

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const size = footprint(p)
  const { W, D, screenW, screenH, bezel, pitch, rows } = size
  const finish = FINISH[str(p, 'finish')] ?? FINISH.charcoal
  const radius = num(p, 'radius')
  const thickness = num(p, 'thickness')
  const bay = str(p, 'bay')
  const pointing = str(p, 'pointing')
  const front = -D / 2
  const back = D / 2

  const shell = []
  const deck = []
  const keys = []
  const dark = []
  const lamps = []
  const glass = []
  const parts = []

  // --- Base ---------------------------------------------------------------
  //
  // A wedge, thinner at the front, which is what the battery under the back
  // made of every machine of the period.
  const bulge = bool(p, 'batteryBulge') ? 10 : 0
  const frontThickness = Math.max(12, thickness - 10 - bulge)
  const heightAt = (x) => frontThickness + ((x - front) / D) * (thickness + bulge - frontThickness)
  const baseOutline = plan(rect(D, W, radius))
  const body = sweep(
    baseOutline,
    (i) => [
      { inset: 0, y: heightAt(baseOutline.pts[i].x) },
      { inset: 0, y: 0 },
    ],
    false,
  )
  const top = face([baseOutline.pts], 0, true)
  if (top) {
    const slope = (thickness + bulge - frontThickness) / D
    top.applyMatrix4(
      new THREE.Matrix4().set(1, 0, 0, 0, slope, 1, 0, frontThickness - slope * front, 0, 0, 1, 0, 0, 0, 0, 1),
    )
    shell.push(top)
  }
  shell.push(body, face([baseOutline.pts], 0, false))

  // The keyboard well, sunk into the deck.
  const deckSlope = Math.atan((thickness + bulge - frontThickness) / D)
  const onDeck = (geometry, x, z, sink = 0) => {
    geometry.rotateZ(deckSlope)
    geometry.translate(x, heightAt(x) - sink, z)
    return geometry
  }
  const keyCentre = back - size.keyDepth / 2 - 26
  const well = sweep(
    plan(rect(size.keyDepth + 12, size.keyWidth + 12, 4)),
    [
      { inset: 0, y: 0 },
      { inset: 0, y: -3 },
      { inset: 4, y: -3 },
      { inset: 4, y: 0 },
    ],
    true,
  )
  if (well) deck.push(onDeck(well, keyCentre, 0))

  // --- Keys ---------------------------------------------------------------
  const block = []
  for (let r = 0; r < rows; r++) {
    const x = -size.keyDepth / 2 + r * pitch
    if (r === 0) {
      block.push(box(pitch * 0.86, 4, pitch * 5.5, x, 0, -pitch * 2.75))
      for (const side of [-1, 1]) {
        block.push(box(pitch * 0.86, 4, pitch * 1.3, x, 0, side * pitch * 3.6))
      }
      continue
    }
    // The top row is half height, as function keys were on these.
    const capDepth = r === rows - 1 ? pitch * 0.6 : pitch * 0.86
    for (let c = 0; c < 15; c++) {
      const z = -size.keyWidth / 2 + c * pitch + ((rows - r) % 3) * pitch * 0.2
      if (z + pitch > size.keyWidth / 2) continue
      block.push(box(capDepth, 4, pitch * 0.86, x, 0, z))
      if ((pointing === 'stick' || pointing === 'both') && r === 3 && c === 6) {
        dark.push(onDeck(post(6, 5, x + pitch * 0.5, 0, z + pitch * 0.5, 8), keyCentre, 0, -1.5))
      }
    }
  }
  keys.push(onDeck(merge(block), keyCentre, 0, 1))

  // --- Pointing device and palm rest --------------------------------------
  const palmCentre = front + num(p, 'palmrest') / 2 + 12
  if (pointing === 'trackpad' || pointing === 'both') {
    const padDepth = Math.min(52, Math.max(24, num(p, 'palmrest') * 0.6))
    deck.push(onDeck(sweep(
      plan(rect(padDepth, padDepth * 1.6, 4)),
      [
        { inset: 0, y: 0 },
        { inset: 0, y: -1.6 },
        { inset: 3, y: -1.6 },
        { inset: 3, y: 0 },
      ],
      true,
    ), palmCentre, 0))
    for (const side of [-1, 1]) {
      deck.push(onDeck(box(12, 3, padDepth * 0.7, -padDepth / 2 - 14, -1, side * padDepth * 0.36 - padDepth * 0.35), palmCentre, 0))
    }
  } else if (pointing === 'trackball') {
    const ball = new THREE.SphereGeometry(15, 14, 10)
    dark.push(onDeck(ball, palmCentre + 8, 0, -6))
    for (const side of [-1, 1]) {
      deck.push(onDeck(box(14, 3, 34, -14, -1, side * 22 - 17), palmCentre + 8, 0))
    }
  }

  // --- Status lamps, speakers, latch --------------------------------------
  if (bool(p, 'statusPanel')) {
    for (let i = 0; i < 4; i++) {
      lamps.push(onDeck(box(5, 1.5, 5, -4, -0.5, -26 + i * 14), back - 14, W / 2 - 70))
    }
  }
  if (bool(p, 'speakers')) {
    for (const side of [-1, 1]) {
      const grille = []
      for (let i = 0; i < 5; i++) {
        grille.push(box(3, 2, 30, -22 + i * 6, -1, -15))
      }
      dark.push(onDeck(merge(grille), back - 40, side * (W / 2 - 46)))
    }
  }
  if (bool(p, 'latch')) {
    deck.push(box(10, 5, 34, front - 1, heightAt(front) - 8, -17))
  }

  // --- The bay in the side ------------------------------------------------
  const bayHeight = Math.min(Math.max(12, thickness - 12), 30)
  if (bay !== 'none') {
    const width = bay === 'floppy' ? 110 : 132
    const x = back - 90 - width / 2
    const fascia = []
    fascia.push(box(width, bayHeight, 3, x - width / 2, 6, -W / 2 - 2))
    if (bay === 'cd' || bay === 'dvd') {
      dark.push(box(width * 0.8, 3, 3.5, x - width * 0.4, 6 + bayHeight * 0.55, -W / 2 - 3))
      dark.push(box(10, 5, 4, x + width * 0.3, 6 + bayHeight * 0.2, -W / 2 - 3))
    } else if (bay === 'floppy') {
      dark.push(box(width * 0.7, 3.5, 3.5, x - width * 0.35, 6 + bayHeight * 0.5, -W / 2 - 3))
      dark.push(box(12, 6, 4, x + width * 0.28, 6 + bayHeight * 0.15, -W / 2 - 3))
    }
    deck.push(merge(fascia))
  }
  if (bool(p, 'pcCard')) {
    dark.push(box(60, 6, 4, back - 190, 8, W / 2 - 1))
    deck.push(box(10, 5, 4, back - 210, 8, W / 2 - 1))
  }
  // Ports across the back, and the battery pack under it.
  dark.push(box(4, 12, 44, back - 3, 10, -60))
  dark.push(socket(11, 5, back - 4, 12, 30))
  if (bulge > 0) {
    // The cylindrical pack under the back edge, lying across the machine and
    // resting on the desk — which is what tilted the keyboard.
    const packRadius = bulge * 1.05
    const pack = post(packRadius * 2, W - 60, 0, 0, 0, 14)
    pack.rotateX(Math.PI / 2)
    pack.translate(back - bulge * 0.6, packRadius, -(W - 60) / 2)
    deck.push(pack)
  }

  // --- Lid ----------------------------------------------------------------
  const lidThickness = Math.max(8, thickness * 0.42)
  const lidW = W
  const lidH = screenH + bezel * 2
  const angle = (num(p, 'lidAngle') * Math.PI) / 180
  const lidShell = plate(rect(lidH, lidW, radius), 0, lidThickness, radius * 0.6, lidH / 2)
  const lidScreen = plate(rect(screenH, screenW, radius * 0.4), -1.5, 2.5, 0, lidH / 2)
  const hinge = { x: back - 12, y: heightAt(back - 12) }
  for (const g of [lidShell, lidScreen]) {
    // Stood up on the hinge line and then laid back by the lid angle.
    g.rotateZ(-Math.PI / 2)
    g.rotateZ(angle)
    g.translate(hinge.x, hinge.y, 0)
  }
  shell.push(lidShell)
  glass.push(lidScreen)

  const add = (name, list, color) => {
    const usable = list.filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }
  add('case', shell, finish.shell)
  add('deck', deck, finish.deck)
  add('keys', keys, finish.keys)
  add('ports', dark, COLOR.port)
  add('lamps', lamps, COLOR.lamp)
  add('screen', glass, bool(p, 'screenOn') ? 0x9fc3e8 : COLOR.screenOff)

  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  for (const part of facing) part.geometry.rotateY(Math.PI)
  return facing
}

export function metrics(p) {
  const size = footprint(p)
  const thickness = num(p, 'thickness')
  const bulge = bool(p, 'batteryBulge') ? 10 : 0
  const bay = str(p, 'bay')
  const pitch = num(p, 'keyPitch')

  const closed = thickness + bulge + Math.max(8, thickness * 0.42)
  const bayNeeds = bay === 'cd' || bay === 'dvd' ? 30 : bay === 'floppy' ? 24 : 0
  const bayLevel = bayNeeds > thickness - 12 ? 'warn' : 'ok'
  const pitchLevel = pitch >= 18.5 ? 'ok' : pitch >= 16.5 ? 'warn' : 'error'

  // Two litres and a kilo per litre is roughly what these weighed.
  const volume = (size.W * size.D * closed) / 1e6
  return [
    {
      label: 'Footprint',
      value: `${formatLength(size.W)} × ${formatLength(size.D)}`,
      note: 'Width from the panel or the keyboard, whichever is wider; depth from the keys and the palm rest.',
    },
    { label: 'Closed', value: `${formatLength(closed)} thick`, note: bulge ? 'Including the battery under the back.' : undefined },
    { label: 'Panel', value: `${num(p, 'panel')}″ ${size.aspect.label} — ${formatLength(size.screenW)} × ${formatLength(size.screenH)}` },
    {
      label: 'Key pitch',
      value: `${formatLength(pitch)} — ${((pitch / 19.05) * 100).toFixed(0)}% of full size`,
      level: pitchLevel,
      note: pitchLevel === 'ok' ? undefined : 'Below about 18 mm the touch typists start complaining.',
    },
    {
      label: 'Bay',
      value: bay === 'none' ? 'Empty' : bay === 'battery' ? 'Second battery' : `${bay === 'floppy' ? 'Floppy' : bay.toUpperCase()} drive`,
      level: bayLevel,
      note: bayLevel === 'ok' ? undefined : `A ${bay} drive wants about ${formatLength(bayNeeds)} of base to sit in.`,
    },
    { label: 'Bulk', value: `${volume.toFixed(1)} litres — about ${(volume * 1.05).toFixed(1)} kg` },
  ]
}

export const presets = [
  {
    name: '1995 luggable',
    params: {
      panel: 10.4, aspect: 'fourThree', lidBezel: 26, keyPitch: 18, keyRows: 6,
      pointing: 'trackball', palmrest: 40, bay: 'floppy', batteryBulge: true,
      pcCard: true, thickness: 55, finish: 'ivory', radius: 6, lidAngle: 100,
    },
  },
  {
    name: '1999 business notebook',
    params: {
      panel: 13.3, aspect: 'fourThree', lidBezel: 22, keyPitch: 19.05, keyRows: 6,
      pointing: 'stick', palmrest: 48, bay: 'cd', batteryBulge: true, pcCard: true,
      thickness: 44, finish: 'charcoal', radius: 8, lidAngle: 105,
    },
  },
  {
    name: '2002 desktop replacement',
    params: {
      panel: 15.4, aspect: 'sixteenTen', lidBezel: 20, keyPitch: 19.05, keyRows: 6,
      pointing: 'both', palmrest: 60, bay: 'dvd', batteryBulge: true, pcCard: true,
      thickness: 48, finish: 'graphite', radius: 10, lidAngle: 110, screenOn: true,
    },
  },
  {
    name: '2004 thin and light',
    params: {
      panel: 12.1, aspect: 'fourThree', lidBezel: 16, keyPitch: 17.5, keyRows: 6,
      pointing: 'trackpad', palmrest: 44, bay: 'none', batteryBulge: false, pcCard: true,
      thickness: 26, finish: 'magnesium', radius: 6, lidAngle: 115,
    },
  },
  {
    name: '2007 consumer widescreen',
    params: {
      panel: 15.6, aspect: 'sixteenNine', lidBezel: 18, keyPitch: 19.05, keyRows: 6,
      pointing: 'trackpad', palmrest: 62, bay: 'dvd', batteryBulge: false, pcCard: false,
      thickness: 34, finish: 'silver', radius: 10, lidAngle: 105, screenOn: true,
    },
  },
  {
    name: '2006 sub-notebook',
    params: {
      panel: 10.6, aspect: 'sixteenTen', lidBezel: 14, keyPitch: 16, keyRows: 5,
      pointing: 'trackpad', palmrest: 34, bay: 'none', batteryBulge: true, pcCard: true,
      thickness: 24, finish: 'magnesium', radius: 5, lidAngle: 120,
    },
  },
]
