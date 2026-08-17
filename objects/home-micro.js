// Home micro, 1977–1985.
//
// The machine that was a keyboard. Everything lived under the keys — board,
// power, modulator — and the television was the monitor, which is why there is
// no screen here and no card slots either: what expansion there was came out of
// an edge connector at the back on a ribbon cable.
//
// The case is sized by the keyboard, because that is what actually drove it:
// the key pitch and the number of columns set the width, the rows set the
// depth, and the moulding around them set the rest. A wedge is then a front lip
// and a slope, which is how the mouldings were specified.
//
// Built with the front at -X and turned at the end to face +Z, so the keys look
// out of the studio's Front view. Width then runs along X centred on zero, +Y is
// up, the desk is Y = 0.

export const meta = {
  order: 7,
  name: 'Home micro',
  description:
    'The 1977–85 wedge with the keyboard built in — sized by its key pitch and layout, with a cassette deck, cartridge slot and edge connector rather than bays and cards.',
}

const FINISH = {
  cream: { shell: 0xe3d9bd, keys: 0xcfc4a6, trim: 0x8b8271, badge: 0x8f3f2c },
  beige: { shell: 0xd6c9a4, keys: 0xc3b691, trim: 0x7d7660, badge: 0x2f4f7a },
  brown: { shell: 0x6b5744, keys: 0xd9cdb4, trim: 0x3f342a, badge: 0xc8a24a },
  charcoal: { shell: 0x36383c, keys: 0x4a4d52, trim: 0x8d949c, badge: 0xc03a2b },
}

const KEY_COLOUR = {
  matching: null,
  dark: 0x3a3d42,
  light: 0xdcd6c4,
  grey: 0x8b8f94,
}

// Key pitch of a typewriter, for comparison in the metrics.
const FULL_PITCH = 19.05

export const params = [
  // --- Keyboard -----------------------------------------------------------
  //
  // The case is built around this, so it comes first.
  {
    id: 'keyStyle',
    label: 'Keys',
    type: 'select',
    default: 'chiclet',
    group: 'Keyboard',
    options: [
      { value: 'calculator', label: 'Calculator — small square caps' },
      { value: 'chiclet', label: 'Chiclet — flat rounded caps in a sea of plastic' },
      { value: 'rubber', label: 'Rubber — one moulded mat, dead to the touch' },
      { value: 'typewriter', label: 'Typewriter — full travel, sculpted rows' },
    ],
  },
  { id: 'columns', label: 'Columns', type: 'int', min: 10, max: 20, step: 1, default: 15, group: 'Keyboard', help: 'Keys across the main block. Ten was a calculator; fifteen took a full alphabet row.' },
  { id: 'rows', label: 'Rows', type: 'int', min: 3, max: 6, step: 1, default: 5, group: 'Keyboard' },
  { id: 'pitch', label: 'Key pitch', type: 'number', min: 12, max: 20, step: 0.05, default: 17.5, unit: 'mm', group: 'Keyboard', help: 'Centre to centre. A typewriter is 19.05; below about 16 you are hunting and pecking.' },
  { id: 'keypad', label: 'Numeric keypad', type: 'boolean', default: false, group: 'Keyboard', help: 'Four more columns on the right, and a wider case to hold them.' },
  {
    id: 'keyColour',
    label: 'Key colour',
    type: 'select',
    default: 'matching',
    group: 'Keyboard',
    options: [
      { value: 'matching', label: 'Matching the case' },
      { value: 'dark', label: 'Dark' },
      { value: 'light', label: 'Light' },
      { value: 'grey', label: 'Grey' },
    ],
  },

  // --- Case ---------------------------------------------------------------
  { id: 'margin', label: 'Moulding around the keys', type: 'number', min: 8, max: 90, step: 1, default: 26, unit: 'mm', group: 'Case', help: 'Plastic between the key block and the edge of the case.' },
  { id: 'lip', label: 'Front lip height', type: 'number', min: 12, max: 70, step: 1, default: 26, unit: 'mm', group: 'Case', help: 'How thick the case is at the front edge, where your wrists rest.' },
  { id: 'slope', label: 'Slope', type: 'number', min: 0, max: 22, step: 0.5, default: 9, unit: '°', group: 'Case', help: 'The rake of the top. The back is as tall as this makes it.' },
  { id: 'radius', label: 'Corner radius', type: 'number', min: 0, max: 60, step: 1, default: 16, unit: 'mm', group: 'Case' },
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'cream',
    group: 'Case',
    options: [
      { value: 'cream', label: 'Cream' },
      { value: 'beige', label: 'Beige' },
      { value: 'brown', label: 'Brown' },
      { value: 'charcoal', label: 'Charcoal' },
    ],
  },
  { id: 'ribs', label: 'Moulded ribs', type: 'boolean', default: true, group: 'Case', help: 'The ridges across the back of the top, hiding the vents and stiffening the lid.' },
  { id: 'badge', label: 'Badge', type: 'boolean', default: true, group: 'Case' },

  // --- Storage ------------------------------------------------------------
  {
    id: 'cassette',
    label: 'Cassette',
    type: 'select',
    default: 'port',
    group: 'Storage',
    help: 'Tape was the storage. Either a deck moulded into the case or a socket for one on a lead.',
    options: [
      { value: 'none', label: 'None' },
      { value: 'port', label: 'Socket at the back for a deck on a lead' },
      { value: 'deck', label: 'Deck built into the right of the case' },
    ],
  },
  { id: 'cartridge', label: 'Cartridge slot', type: 'boolean', default: true, group: 'Storage', help: 'A letterbox in the back for a ROM cartridge.' },

  // --- Back --------------------------------------------------------------
  { id: 'edgeConnector', label: 'Expansion edge connector', type: 'boolean', default: true, group: 'Back', help: 'The bare fingers of the board, brought out through a slot. Everything hung off this.' },
  { id: 'joystickPorts', label: 'Joystick ports', type: 'int', min: 0, max: 2, step: 1, default: 2, group: 'Back' },
  {
    id: 'videoOut',
    label: 'Video out',
    type: 'select',
    default: 'rf',
    group: 'Back',
    options: [
      { value: 'rf', label: 'Aerial socket — tune the television in' },
      { value: 'composite', label: 'Composite, for a monitor' },
      { value: 'both', label: 'Both' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

/** A rectangle in plan, with the corners moulded off. */
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

/** One key cap, sculpted a little if the style calls for it. */
function keycap(style, pitch, width, x, z) {
  const gap = style === 'chiclet' ? 0.32 : style === 'rubber' ? 0.12 : 0.18
  const w = pitch * width - pitch * gap
  const d = pitch * (1 - gap)
  const height = style === 'typewriter' ? 9 : style === 'calculator' ? 4.5 : 3.5
  if (style === 'rubber') {
    // One moulded mat: the keys are bumps in it rather than separate caps.
    const cap = new THREE.SphereGeometry(1, 8, 6)
    cap.scale(d / 2, height, w / 2)
    cap.translate(x, 0, z)
    return cap
  }
  const cap = box(d, height, w, x - d / 2, 0, z - w / 2)
  if (style !== 'typewriter') return cap
  // A sculpted cap: a smaller top face, so the row reads as dished.
  const top = box(d * 0.78, 1.5, w * 0.82, x - d * 0.39, height, z - w * 0.41)
  return merge([cap, top])
}

/**
 * The key block, built flat about the origin. The caller lays it on the slope,
 * which is what keeps the keys and the top surface in the same plane.
 */
function keyBlock(style, columns, rows, pitch, keypad) {
  const keys = []
  const width = (columns + (keypad ? 4.6 : 0)) * pitch
  const depth = rows * pitch
  for (let r = 0; r < rows; r++) {
    const x = -depth / 2 + r * pitch
    // Row nought is nearest the user: the space bar and its neighbours. The
    // rows behind it are the alphabet, and the numbers behind those.
    if (r === 0) {
      keys.push(keycap(style, pitch, 1.4, x + pitch, -width / 2 + pitch * 0.7))
      keys.push(keycap(style, pitch, Math.min(6, columns - 6), x + pitch, -pitch * 1.5))
      keys.push(keycap(style, pitch, 1.6, x + pitch, pitch * 3.2))
      continue
    }
    // Rows step over by a quarter key, as they have since typewriters.
    const stagger = r === rows - 1 ? 0 : ((rows - r) % 3) * pitch * 0.25
    for (let c = 0; c < columns; c++) {
      const z = -width / 2 + c * pitch + stagger
      if (z + pitch > width / 2) continue
      keys.push(keycap(style, pitch, r === rows - 1 && c === columns - 1 ? 1.6 : 1, x + pitch, z))
    }
    if (keypad && r < rows - 1) {
      for (let c = 0; c < 4; c++) {
        keys.push(keycap(style, pitch, 1, x + pitch, width / 2 - pitch * 4.3 + c * pitch))
      }
    }
  }
  return { keys: merge(keys), width, depth }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const style = str(p, 'keyStyle')
  const columns = Math.round(num(p, 'columns'))
  const rows = Math.round(num(p, 'rows'))
  const pitch = num(p, 'pitch')
  const keypad = bool(p, 'keypad')
  const margin = num(p, 'margin')
  const lip = num(p, 'lip')
  const slope = (num(p, 'slope') * Math.PI) / 180
  const radius = num(p, 'radius')
  const finish = FINISH[str(p, 'finish')] ?? FINISH.cream
  const keyColour = KEY_COLOUR[str(p, 'keyColour')] ?? null
  const cassette = str(p, 'cassette')
  const deck = cassette === 'deck'

  // --- Size, from the keyboard out ----------------------------------------
  const block = keyBlock(style, columns, rows, pitch, keypad)
  const deckWidth = deck ? 168 : 0
  const W = block.width + margin * 2 + deckWidth
  const D = block.depth + margin * 2 + (str(p, 'cassette') === 'none' ? 0 : 8)
  const front = -D / 2
  const back = D / 2
  // It stands on its feet, and the lid rises from the front lip at the slope it
  // was moulded to.
  const stand = 3
  const heightAt = (x) => stand + lip + (x - front) * Math.tan(slope)
  const H = heightAt(back)

  const shell = []
  const detail = []
  const dark = []
  const parts = []

  // --- Case ---------------------------------------------------------------
  //
  // One sloping lid: a section per point of the outline, so the slope follows
  // the plan whatever the corners do, then the flat top sheared to match.
  const outline = plan(rect(D, W, radius))
  const body = sweep(
    outline,
    (i) => [
      { inset: 0, y: heightAt(outline.pts[i].x) },
      { inset: 0, y: stand },
    ],
    false,
  )
  const lid = face([outline.pts], 0, true)
  if (lid) {
    lid.applyMatrix4(
      new THREE.Matrix4().set(1, 0, 0, 0, Math.tan(slope), 1, 0, stand + lip - Math.tan(slope) * front, 0, 0, 1, 0, 0, 0, 0, 1),
    )
    shell.push(lid)
  }
  shell.push(body, face([outline.pts], stand, false))

  // A moulded step around the key well, the way these cases always had.
  const wellDepth = 3
  const well = sweep(
    plan(rect(block.depth + 14, block.width + 14, radius * 0.5)),
    [
      { inset: 0, y: 0 },
      { inset: 0, y: -wellDepth },
      { inset: 5, y: -wellDepth },
      { inset: 5, y: 0 },
    ],
    true,
  )

  // --- Keys ---------------------------------------------------------------
  //
  // Built flat and then laid on the slope, which is the one way to be sure the
  // caps and the lid agree about where the surface is.
  const keyZ = deck ? -deckWidth / 2 : 0
  // Rotated about its own middle and then set on the surface, so the caps and
  // the lid agree about where that surface is. The lid rises toward the back,
  // so the rotation is positive about Z.
  const onSlope = (geometry, x, z, sink = 0) => {
    geometry.rotateZ(slope)
    geometry.translate(x, heightAt(x) - sink, z)
    return geometry
  }
  const keyCentre = -(str(p, 'cassette') === 'none' ? 0 : 4)
  onSlope(block.keys, keyCentre, keyZ, 1)
  if (well) {
    onSlope(well, keyCentre, keyZ)
    detail.push(well)
  }

  // --- Cassette deck ------------------------------------------------------
  //
  // Everything here is built about the origin and then laid on the slope by
  // `onSlope`; rotating a piece already in place would swing it about the
  // middle of the machine instead of its own.
  if (deck) {
    const deckZ = W / 2 - deckWidth / 2 - margin * 0.4
    const deckX = -6
    // The well can only be as deep as the case is tall at its shallowest end,
    // which on a sloping lid is the front of it.
    const wellDeep = Math.min(30, heightAt(deckX - 59) - stand - 10)
    if (wellDeep > 12) {
      const wellOutline = plan(rect(118, 132, 8))
      const cut = sweep(
        wellOutline,
        [
          { inset: 0, y: -2 },
          { inset: 0, y: -wellDeep * 0.87 },
          { inset: 8, y: -wellDeep },
        ],
        false,
      )
      const floorFace = face([hull(wellOutline.offset(8))], -wellDeep, true)
      for (const g of [cut, floorFace].filter(Boolean)) {
        onSlope(g, deckX, deckZ)
        dark.push(g)
      }
      for (const z of [-26, 26]) {
        dark.push(onSlope(post(34, 5, -14, -wellDeep + 2, z, 12), deckX, deckZ))
      }
      for (let i = 0; i < 5; i++) {
        dark.push(onSlope(box(20, 7, 20, 44, -Math.min(12, wellDeep * 0.4), -60 + i * 24), deckX, deckZ))
      }
    }
  }

  // --- The back -----------------------------------------------------------
  //
  // Sockets are cylinders lying along the depth, built at the origin and moved
  // back rather than spun about it.
  const backY = Math.max(stand + 26, H * 0.45)
  const socket = (diameter, length, y, z) => {
    const g = post(diameter, length, 0, 0, 0, 12)
    g.rotateZ(-Math.PI / 2)
    g.translate(back - length, y, z)
    return g
  }
  if (bool(p, 'cartridge')) {
    // A letterbox through the back, with a moulded surround.
    dark.push(box(10, 26, 92, back - 9, backY - 13, -46))
    detail.push(box(4, 34, 104, back - 3, backY - 17, -52))
  }
  if (bool(p, 'edgeConnector')) {
    dark.push(box(8, 16, 74, back - 7, Math.max(stand + 4, Math.min(backY + 22, H - 20)), W / 2 - 110))
  }
  for (let i = 0; i < Math.round(num(p, 'joystickPorts')); i++) {
    dark.push(socket(24, 6, backY - 4, -W / 2 + 46 + i * 34))
  }
  const video = str(p, 'videoOut')
  const videoZ = -W / 2 + 120
  if (video === 'rf' || video === 'both') dark.push(socket(14, 8, backY + 8, videoZ))
  if (video === 'composite' || video === 'both') {
    dark.push(socket(12, 8, backY + 8, videoZ + (video === 'both' ? 26 : 0)))
  }
  if (str(p, 'cassette') === 'port') {
    dark.push(socket(16, 8, Math.max(stand + 10, backY - 22), videoZ + 52))
  }

  // --- Mouldings ----------------------------------------------------------
  if (bool(p, 'ribs')) {
    const ribs = []
    for (let i = 0; i < 7; i++) {
      const x = back - 16 - i * 9
      ribs.push(onSlope(box(4, 3, W * 0.44, -2, -1, -W * 0.22), x, 0))
    }
    detail.push(merge(ribs))
  }
  if (bool(p, 'badge')) {
    const badge = onSlope(box(24, 1.5, 62, -12, -0.5, -31), front + 26, W / 2 - 96)
    parts.push({ name: 'badge', geometry: badge, color: finish.badge })
  }
  // Feet, so it does not sit flat on the desk.
  const feet = []
  for (const sx of [front + 26, back - 26]) {
    for (const sz of [-W / 2 + 30, W / 2 - 30]) feet.push(post(22, stand, sx, 0, sz, 10))
  }

  const add = (name, list, color) => {
    const usable = list.filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }
  add('case', shell, finish.shell)
  add('keys', [block.keys], keyColour ?? finish.keys)
  add('mouldings', detail, finish.trim)
  add('sockets', dark, 0x2b2e32)
  add('feet', feet, 0x2b2e32)

  // Turned to face the standard view, the way the sitter saw it.
  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  // Swung round from -X to +Z, which is where the Front view looks from, so the
  // front of the machine is what the front view shows.
  for (const part of facing) part.geometry.rotateY(Math.PI / 2)
  return facing
}

export function metrics(p) {
  const style = str(p, 'keyStyle')
  const columns = Math.round(num(p, 'columns'))
  const rows = Math.round(num(p, 'rows'))
  const pitch = num(p, 'pitch')
  const keypad = bool(p, 'keypad')
  const margin = num(p, 'margin')
  const lip = num(p, 'lip')
  const slope = (num(p, 'slope') * Math.PI) / 180
  const deck = str(p, 'cassette') === 'deck'

  const blockWidth = (columns + (keypad ? 4.6 : 0)) * pitch
  const blockDepth = rows * pitch
  const W = blockWidth + margin * 2 + (deck ? 168 : 0)
  const D = blockDepth + margin * 2 + (str(p, 'cassette') === 'none' ? 0 : 8)
  const H = lip + D * Math.tan(slope)
  const keys = columns * (rows - 1) + 3 + (keypad ? (rows - 1) * 4 : 0)

  const pitchLevel = pitch >= 18 ? 'ok' : pitch >= 16 ? 'warn' : 'error'
  return [
    { label: 'Case', value: `${formatLength(W)} × ${formatLength(D)} × ${formatLength(H)}`, note: 'Width and depth follow the key block; height follows the lip and the slope.' },
    { label: 'Desk taken', value: `${((W * D) / 1e6).toFixed(2)} m²` },
    { label: 'Keys', value: `${keys}, ${style}` },
    {
      label: 'Key pitch',
      value: `${formatLength(pitch)} — ${(pitch / FULL_PITCH * 100).toFixed(0)}% of a typewriter`,
      level: pitchLevel,
      note:
        pitchLevel === 'ok'
          ? undefined
          : pitchLevel === 'warn'
            ? 'Cramped for touch typing, which was rather the point of the price.'
            : 'Two fingers only.',
    },
    { label: 'Storage', value: deck ? 'Built-in cassette deck' : str(p, 'cassette') === 'port' ? 'Cassette, on a lead' : 'None fitted' },
  ]
}

export const presets = [
  {
    name: 'Chiclet micro',
    params: {
      keyStyle: 'chiclet', columns: 13, rows: 4, pitch: 16, keypad: false, margin: 30,
      lip: 24, slope: 8, radius: 18, finish: 'cream', cassette: 'port', cartridge: true,
      edgeConnector: true, joystickPorts: 2, videoOut: 'rf', ribs: true,
    },
  },
  {
    name: 'Rubber-key micro',
    params: {
      keyStyle: 'rubber', columns: 10, rows: 4, pitch: 17, keypad: false, margin: 22,
      lip: 20, slope: 6, radius: 12, finish: 'charcoal', keyColour: 'grey',
      cassette: 'port', cartridge: false, edgeConnector: true, joystickPorts: 0, videoOut: 'rf',
      ribs: false,
    },
  },
  {
    name: 'Cartridge micro',
    params: {
      keyStyle: 'typewriter', columns: 15, rows: 5, pitch: 17.5, keypad: false, margin: 26,
      lip: 26, slope: 9, radius: 16, finish: 'beige', cassette: 'port', cartridge: true,
      edgeConnector: true, joystickPorts: 2, videoOut: 'both', ribs: true,
    },
  },
  {
    name: 'Built-in tape micro',
    params: {
      keyStyle: 'typewriter', columns: 15, rows: 5, pitch: 18, keypad: false, margin: 24,
      lip: 28, slope: 10, radius: 14, finish: 'brown', keyColour: 'light',
      cassette: 'deck', cartridge: false, edgeConnector: true, joystickPorts: 1,
      videoOut: 'composite', ribs: true,
    },
  },
  {
    name: 'Business-minded micro',
    params: {
      keyStyle: 'typewriter', columns: 17, rows: 6, pitch: 19.05, keypad: true, margin: 34,
      lip: 30, slope: 11, radius: 10, finish: 'beige', keyColour: 'light',
      cassette: 'port', cartridge: false, edgeConnector: true, joystickPorts: 0,
      videoOut: 'composite', ribs: false, badge: true,
    },
  },
  {
    name: 'Calculator micro',
    params: {
      keyStyle: 'calculator', columns: 10, rows: 3, pitch: 13, keypad: false, margin: 16,
      lip: 18, slope: 5, radius: 10, finish: 'charcoal', keyColour: 'light',
      cassette: 'port', cartridge: false, edgeConnector: true, joystickPorts: 0,
      videoOut: 'rf', ribs: false, badge: false,
    },
  },
]
