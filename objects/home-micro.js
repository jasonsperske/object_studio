// Home micro, 1977–1985.
//
// The machine that was a keyboard. Everything lived under the keys — board,
// power, modulator — and the television was the monitor, which is why there is
// no screen here and no card slots either: what expansion there was came out of
// an edge connector at the back on a ribbon cable.
//
// The case is sized by the keyboard, because that is what actually drove it:
// the key pitch and the number of columns set the width, the rows set the
// depth, and the mouldings around them set the rest. A wedge is then a front
// band to rest your wrists on, a deck behind the keys for the badge and the
// vent ribs, and a slope between them.
//
// The archetype is the breadbin: a full-size sculpted keyboard with a column of
// function keys down the right of it, four hundred millimetres of cream plastic
// with ribs moulded across the back, a lamp at one end of the deck and the
// joystick ports out of the right-hand side. That is what the defaults build.
//
// Built with the front at -X and turned at the end to face +Z, so the keys look
// out of the studio's Front view. Width then runs along X centred on zero, +Y is
// up, the desk is Y = 0.

export const meta = {
  order: 7,
  name: 'Home micro',
  description:
    'The 1977–85 wedge with the keyboard built in — sized by its key pitch and layout, with function keys, a cassette deck, cartridge slot and edge connector rather than bays and cards.',
}

const FINISH = {
  cream: { shell: 0xe0d6bc, keys: 0xcfc4a6, trim: 0x9a9080, badge: 0x8f3f2c },
  beige: { shell: 0xd6c9a4, keys: 0xc3b691, trim: 0x8b836c, badge: 0x2f4f7a },
  brown: { shell: 0x6b5744, keys: 0xd9cdb4, trim: 0x4a3d30, badge: 0xc8a24a },
  charcoal: { shell: 0x36383c, keys: 0x4a4d52, trim: 0x8d949c, badge: 0xc03a2b },
}

const KEY_COLOUR = {
  matching: null,
  dark: 0x3a3d42,
  brown: 0x574b3f,
  grey: 0x8b8f94,
  light: 0xdcd6c4,
}

/** Rough perceived lightness of a colour, 0 to 1. */
function luma(c) {
  return (((c >> 16) & 255) * 0.3 + ((c >> 8) & 255) * 0.59 + (c & 255) * 0.11) / 255
}

const LAMP = 0xd4402c
const DARK = 0x2b2e32

// What each fitting takes along the back, surround and all. Shared with the
// metrics, which are the only warning you get that they will not all go.
const BACK_WIDTH = {
  edgeConnector: 66,
  cassette: 50,
  aerial: 20,
  composite: 26,
  joystick: 31,
  rocker: 24,
  inlet: 24,
  cartridge: 104,
}

/** The widths of everything coming out of the back, in order from the left. */
function backRun(p, sideways) {
  const run = []
  if (bool(p, 'edgeConnector')) run.push(BACK_WIDTH.edgeConnector)
  if (str(p, 'cassette') === 'port') run.push(BACK_WIDTH.cassette)
  const video = str(p, 'videoOut')
  if (video === 'rf' || video === 'both') run.push(BACK_WIDTH.aerial)
  if (video === 'composite' || video === 'both') run.push(BACK_WIDTH.composite)
  if (!sideways) {
    for (let i = 0; i < Math.round(num(p, 'joystickPorts')); i++) run.push(BACK_WIDTH.joystick)
    run.push(BACK_WIDTH.rocker, BACK_WIDTH.inlet)
  }
  if (bool(p, 'cartridge')) run.push(BACK_WIDTH.cartridge)
  return run
}

/** The straight run of back panel, which stops where the corners begin. */
function backWidth(W, radius) {
  return Math.max(40, W - 2 * (Math.min(radius, W / 4) + 4))
}

/** How much of its asking width the back can actually give the sockets. */
function squeezeOf(run, usable) {
  const taken = run.reduce((a, b) => a + b, 0)
  const spans = Math.max(1, run.length - 1)
  return Math.min(1, (usable - 5 * spans) / Math.max(1, taken))
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
    default: 'typewriter',
    group: 'Keyboard',
    options: [
      { value: 'calculator', label: 'Calculator — small square caps in a grid' },
      { value: 'chiclet', label: 'Chiclet — flat rounded caps in a sea of plastic' },
      { value: 'rubber', label: 'Rubber — one moulded mat, dead to the touch' },
      { value: 'typewriter', label: 'Typewriter — full travel, sculpted rows' },
    ],
  },
  { id: 'columns', label: 'Columns', type: 'int', min: 10, max: 22, step: 1, default: 17, group: 'Keyboard', help: 'Key units across the main block. Ten was a calculator; seventeen takes a full number row.' },
  { id: 'rows', label: 'Rows', type: 'int', min: 3, max: 6, step: 1, default: 5, group: 'Keyboard' },
  { id: 'pitch', label: 'Key pitch', type: 'number', min: 12, max: 20, step: 0.05, default: 19, unit: 'mm', group: 'Keyboard', help: 'Centre to centre. A typewriter is 19.05; below about 16 you are hunting and pecking.' },
  { id: 'functionKeys', label: 'Function keys', type: 'int', min: 0, max: 4, step: 1, default: 4, group: 'Keyboard', help: 'A column of tall keys down the right of the block, each one two legends deep.' },
  { id: 'keypad', label: 'Numeric keypad', type: 'boolean', default: false, group: 'Keyboard', help: 'Four more columns on the right, and a wider case to hold them.' },
  {
    id: 'keyColour',
    label: 'Key colour',
    type: 'select',
    default: 'brown',
    group: 'Keyboard',
    help: 'Function keys take a lighter shade of this, the way they were always picked out.',
    options: [
      { value: 'matching', label: 'Matching the case' },
      { value: 'dark', label: 'Dark' },
      { value: 'brown', label: 'Brown' },
      { value: 'grey', label: 'Grey' },
      { value: 'light', label: 'Light' },
    ],
  },

  // --- Case ---------------------------------------------------------------
  { id: 'margin', label: 'Moulding at the sides', type: 'number', min: 8, max: 60, step: 1, default: 22, unit: 'mm', group: 'Case', help: 'Plastic between the key block and each end of the case.' },
  { id: 'frontBand', label: 'Band in front of the keys', type: 'number', min: 10, max: 90, step: 1, default: 44, unit: 'mm', group: 'Case', help: 'The blank plastic your wrists rest on.' },
  { id: 'backDeck', label: 'Deck behind the keys', type: 'number', min: 10, max: 120, step: 1, default: 72, unit: 'mm', group: 'Case', help: 'The strip behind the key well, which carried the badge, the lamp and the vent ribs.' },
  { id: 'lip', label: 'Front lip height', type: 'number', min: 12, max: 70, step: 1, default: 43, unit: 'mm', group: 'Case', help: 'How thick the case is at the front edge, where your wrists rest.' },
  { id: 'slope', label: 'Slope', type: 'number', min: 0, max: 22, step: 0.5, default: 7.5, unit: '°', group: 'Case', help: 'The rake of the top. The back is as tall as this makes it.' },
  { id: 'radius', label: 'Corner radius', type: 'number', min: 0, max: 60, step: 1, default: 14, unit: 'mm', group: 'Case' },
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
  { id: 'ribs', label: 'Moulded ribs', type: 'boolean', default: true, group: 'Case', help: 'The vent band sunk into the deck behind the keys, with the ribs standing in it. Wants about 52 mm of deck to go into.' },
  { id: 'badge', label: 'Badge', type: 'boolean', default: true, group: 'Case' },
  { id: 'lamp', label: 'Power lamp', type: 'boolean', default: true, group: 'Case', help: 'The one on the deck that told you it was on, because nothing else did.' },

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

  // --- Sockets ------------------------------------------------------------
  { id: 'edgeConnector', label: 'Expansion edge connector', type: 'boolean', default: true, group: 'Sockets', help: 'The bare fingers of the board, brought out through a slot. Everything hung off this.' },
  { id: 'joystickPorts', label: 'Joystick ports', type: 'int', min: 0, max: 2, step: 1, default: 2, group: 'Sockets' },
  {
    id: 'portSide',
    label: 'Joysticks and power',
    type: 'select',
    default: 'right',
    group: 'Sockets',
    help: 'Where the joystick ports, the switch and the power inlet come out.',
    options: [
      { value: 'right', label: 'Out of the right-hand side' },
      { value: 'back', label: 'Along the back with everything else' },
    ],
  },
  {
    id: 'videoOut',
    label: 'Video out',
    type: 'select',
    default: 'both',
    group: 'Sockets',
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
function rect(depth, width, radius, cx = 0, cz = 0) {
  const d = depth / 2
  const w = width / 2
  const corners = [
    { x: cx + d, z: cz - w },
    { x: cx + d, z: cz + w },
    { x: cx - d, z: cz + w },
    { x: cx - d, z: cz - w },
  ]
  const r = Math.max(0, Math.min(radius, d - 1, w - 1))
  return r < 1 ? ring(corners) : roundCorners(corners, r, 4)
}

/** Two colours mixed, for the caps that were picked out from the rest. */
function mix(a, b, t) {
  const ch = (shift) => {
    const va = (a >> shift) & 255
    const vb = (b >> shift) & 255
    return Math.round(va + (vb - va) * t) << shift
  }
  return ch(16) | ch(8) | ch(0)
}

// ---------------------------------------------------------------------------
// Keyboard
//
// Built flat about its own centre and laid on the slope by the caller, which is
// the one way to be sure the caps and the top surface agree about where the
// surface is.
// ---------------------------------------------------------------------------

/**
 * One key cap, at the origin, standing on Y = 0. Cheap to repeat: caps of the
 * same size are built once and cloned, and a keyboard has perhaps six sizes.
 */
function capShape(style, w, d, cache) {
  const key = w.toFixed(2) + 'x' + d.toFixed(2)
  const hit = cache.get(key)
  if (hit) return hit
  let g
  if (style === 'rubber') {
    // One moulded mat: the keys are bumps in it rather than separate caps.
    g = new THREE.SphereGeometry(1, 8, 6)
    g.scale(d / 2, 3.2, w / 2)
  } else {
    const height = style === 'typewriter' ? 11 : style === 'calculator' ? 6 : 4
    const taper = style === 'typewriter' ? 1.9 : 1
    const skirt = height * (style === 'typewriter' ? 0.45 : 0.55)
    const outline = plan(rect(d, w, Math.min(2.6, d / 3, w / 3)))
    const top = hull(outline.offset(taper))
    // Walked from the top down, which is what puts the normals on the outside.
    g = merge(
      [
        sweep(outline, [{ inset: taper, y: height }, { inset: 0, y: skirt }, { inset: 0, y: 0 }], false),
        face([top], height, true),
      ].filter(Boolean),
    )
  }
  cache.set(key, g)
  return g
}

/** A cap of `uw` units across and `ud` deep, centred on the key grid. */
function cap(style, pitch, uw, ud, x, z, cache) {
  const gap = style === 'chiclet' ? 0.3 : style === 'rubber' ? 0.14 : 0.16
  const g = capShape(style, (uw - gap) * pitch, (ud - gap) * pitch, cache).clone()
  g.translate(x, 0, z)
  return g
}

/**
 * A row of the main block, as key widths in units, left to right. Rows are
 * numbered from the back, so row nought is the numbers and the last is the
 * space bar.
 *
 * The widths do not have to add up to `columns`: they did not on the real
 * thing either, which is why the cursor keys stop short of the delete key.
 */
function rowLayout(row, rows, columns, uniform) {
  // A rubber mat or a calculator was moulded as one grid, every key the same.
  if (uniform) return Array.from({ length: columns }, () => ({ u: 1 }))
  const fill = (left, right) => {
    const used = [...left, ...right].reduce((a, b) => a + b, 0)
    const middle = Math.max(1, Math.round(columns - used))
    return [
      ...left.map((u) => ({ u })),
      ...Array.from({ length: middle }, () => ({ u: 1 })),
      ...right.map((u) => ({ u })),
    ]
  }
  if (row === rows - 1) {
    // The space bar, and nothing else: it sits under the letters with blank
    // plastic either side of it.
    const bar = Math.max(3, Math.round(columns * 0.55))
    const lead = Math.max(1, Math.round((columns - bar) / 2))
    return [{ u: lead, gap: true }, { u: bar }]
  }
  // The shift row: a command key and a shift at the left, a shift and the
  // cursor keys at the right.
  if (row === rows - 2) return fill([1.25, 1.5], [1.5, 1, 1])
  // The numbers, which run edge to edge.
  if (row === 0) return fill([], [])
  // The letter rows: a modifier at each end, return being the wide one.
  return fill([1.5], [1.5])
}

/**
 * The whole key block: the main rows, the function column down the right of
 * them and a numeric pad beyond that. Returns the two geometries separately,
 * because the function keys were always a different colour.
 */
function keyBlock(style, columns, rows, pitch, functionKeys, keypad) {
  const cache = new Map()
  const uniform = style === 'rubber' || style === 'calculator'
  const fnUnits = functionKeys > 0 ? 1.4 : 0
  const fnGap = functionKeys > 0 ? 0.55 : 0
  const padUnits = keypad ? 4 : 0
  const padGap = keypad ? 0.7 : 0
  const units = columns + fnGap + fnUnits + padGap + padUnits
  const width = units * pitch
  const depth = rows * pitch
  const z0 = -width / 2
  const xBack = depth / 2
  const main = []
  const fn = []

  for (let r = 0; r < rows; r++) {
    const x = xBack - (r + 0.5) * pitch
    let u = 0
    for (const key of rowLayout(r, rows, columns, uniform)) {
      if (!key.gap) main.push(cap(style, pitch, key.u, 1, x, z0 + (u + key.u / 2) * pitch, cache))
      u += key.u
    }
    // The pad keeps the back row for itself and leaves the space row alone.
    if (keypad && r < rows - 1) {
      for (let c = 0; c < 4; c++) {
        const z = z0 + (columns + fnGap + fnUnits + padGap + c + 0.5) * pitch
        main.push(cap(style, pitch, 1, 1, x, z, cache))
      }
    }
  }

  // The function column: as tall as the block, divided between them, so each
  // cap carries two legends.
  if (functionKeys > 0) {
    const z = z0 + (columns + fnGap + fnUnits / 2) * pitch
    const each = rows / functionKeys
    for (let i = 0; i < functionKeys; i++) {
      fn.push(cap(style, pitch, fnUnits, each, xBack - (i + 0.5) * each * pitch, z, cache))
    }
  }

  return {
    main: main.length ? merge(main) : null,
    fn: fn.length ? merge(fn) : null,
    width,
    depth,
  }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const style = str(p, 'keyStyle')
  const columns = Math.round(num(p, 'columns'))
  const rows = Math.round(num(p, 'rows'))
  const pitch = num(p, 'pitch')
  const functionKeys = Math.round(num(p, 'functionKeys'))
  const keypad = bool(p, 'keypad')
  const margin = num(p, 'margin')
  const frontBand = num(p, 'frontBand')
  const backDeck = num(p, 'backDeck')
  const lip = num(p, 'lip')
  const slope = (num(p, 'slope') * Math.PI) / 180
  const radius = num(p, 'radius')
  const finish = FINISH[str(p, 'finish')] ?? FINISH.cream
  const keyColour = KEY_COLOUR[str(p, 'keyColour')] ?? finish.keys
  const cassette = str(p, 'cassette')
  const deck = cassette === 'deck'
  const sideways = str(p, 'portSide') === 'right'

  // --- Size, from the keyboard out ----------------------------------------
  const block = keyBlock(style, columns, rows, pitch, functionKeys, keypad)
  const deckWidth = deck ? 176 : 0
  const W = block.width + margin * 2 + deckWidth
  const D = block.depth + frontBand + backDeck
  const front = -D / 2
  const back = D / 2
  // It stands on its feet, and the lid rises from the front lip at the slope it
  // was moulded to.
  const stand = 3
  const tan = Math.tan(slope)
  const heightAt = (x) => stand + lip + (x - front) * tan
  const H = heightAt(back)
  // The key block, with its band of plastic in front and its deck behind. A
  // built-in tape deck takes the right of the case, so the keys shuffle left.
  const keyX = front + frontBand + block.depth / 2
  const keyZ = -deckWidth / 2
  // The deck behind the keys: a clear band for the badge and the lamp, and the
  // ribbed band behind that. A tape mechanism owns the right of the case, so
  // both of them stop where it begins.
  const bandDepth = Math.min(17, backDeck * 0.4)
  const deckX = back - backDeck + bandDepth / 2 + 3
  const deckRight = deck ? W / 2 - deckWidth : W / 2 + 0.5
  // Half the width of the case at a given depth, which is the case width until
  // the moulded corner starts taking it away.
  const corner = Math.max(0, Math.min(radius, D / 2 - 1, W / 2 - 1))
  const halfWidthAt = (x) => {
    const over = x - (back - corner)
    return over <= 0 ? W / 2 : W / 2 - corner + Math.sqrt(Math.max(0, corner * corner - over * over))
  }

  const shell = []
  const detail = []
  const dark = []
  const lamps = []
  const parts = []

  // Anything moulded into the top surface is built flat and sheared up onto the
  // slope: shear leaves vertical faces vertical and only lifts the horizontal
  // ones, so a rib or a well wall stays plumb while its top follows the lid.
  const lidShear = new THREE.Matrix4().set(
    1, 0, 0, 0,
    tan, 1, 0, stand + lip - tan * front,
    0, 0, 1, 0,
    0, 0, 0, 1,
  )
  const onLid = (geometry) => {
    if (geometry) geometry.applyMatrix4(lidShear)
    return geometry
  }
  // Key caps, on the other hand, stand perpendicular to the surface, so they
  // are rotated about their own middle and then set down on it.
  const onSlope = (geometry, x, z, sink = 0) => {
    if (!geometry) return geometry
    geometry.rotateZ(slope)
    geometry.translate(x, heightAt(x) - sink, z)
    return geometry
  }

  // --- Case ---------------------------------------------------------------
  //
  // One sloping lid over a sweep: a section per point of the outline, so the
  // slope follows the plan whatever the corners do. The seam between the two
  // halves of the moulding runs round it at a constant height.
  const outline = plan(rect(D, W, radius))
  const seamY = stand + lip * 0.42
  const body = sweep(
    outline,
    (i) => [
      { inset: 0, y: heightAt(outline.pts[i].x) },
      { inset: 0, y: seamY + 1.4 },
      { inset: 1.1, y: seamY },
      { inset: 0, y: seamY - 1.4 },
      { inset: 0, y: stand },
    ],
    false,
  )
  shell.push(body, face([outline.pts], stand, false))

  // --- The key well -------------------------------------------------------
  //
  // A real recess: the lid is a face with a hole in it, the walls drop from the
  // rim and the keys stand on the floor.
  const wellDepth = style === 'rubber' ? 2 : 4
  // The rim round the keys, never so wide that the well eats the case wall.
  const rim = Math.max(2, Math.min(8, margin - 3, frontBand - 6, backDeck - 6))
  const wellOutline = plan(
    rect(block.depth + rim * 2, block.width + rim * 2, Math.min(radius, 10), keyX, keyZ),
  )
  // The tape well is the other hole in the lid, so it is worked out here even
  // though it is furnished further down. It follows the keys unless the case is
  // too shallow to take it there, and keeps a band of lid in front for the
  // piano keys.
  const tapeDeep = Math.max(40, Math.min(78, D - 46))
  const tapeX = Math.min(
    Math.max(keyX + 8, front + 28 + tapeDeep / 2),
    back - 10 - tapeDeep / 2,
  )
  const tapeZ = W / 2 - margin - deckWidth / 2
  const tapeOutline = deck ? plan(rect(tapeDeep, 118, 8, tapeX, tapeZ)) : null
  // The vents are a band sunk into the deck with the ribs standing in it, so
  // they are moulded into the case rather than stuck onto the outside of it.
  const ventBack = back - Math.max(6, corner * 0.4)
  const ventFront = deckX + bandDepth / 2 + 3
  const ventRight = Math.min(halfWidthAt(ventBack), deckRight) - 5
  const ventLeft = -(halfWidthAt(ventBack) - 5)
  const ventOutline =
    bool(p, 'ribs') && ventBack - ventFront >= 14 && ventRight - ventLeft >= 40
      ? plan(
          rect(
            ventBack - ventFront,
            ventRight - ventLeft,
            6,
            (ventBack + ventFront) / 2,
            (ventRight + ventLeft) / 2,
          ),
        )
      : null
  const lid = face(
    [
      outline.pts,
      wellOutline.pts,
      ...(tapeOutline ? [tapeOutline.pts] : []),
      ...(ventOutline ? [ventOutline.pts] : []),
    ],
    0,
    true,
  )
  if (lid) shell.push(onLid(lid))
  // Walked bottom to top, which is what turns the wall's normals inward.
  shell.push(onLid(sweep(wellOutline, [{ inset: 0, y: -wellDepth }, { inset: 0, y: 0 }], false)))
  shell.push(onLid(face([wellOutline.pts], -wellDepth, true)))

  // --- Keys ---------------------------------------------------------------
  onSlope(block.main, keyX, keyZ, wellDepth)
  onSlope(block.fn, keyX, keyZ, wellDepth)

  // --- Cassette deck ------------------------------------------------------
  //
  // A well in the right of the lid with the spindles in the floor of it and the
  // piano keys in front, all of it built flat and sheared up with the lid.
  if (tapeOutline) {
    // The well can only be as deep as the case is tall at its shallowest end,
    // which on a sloping lid is the front of it.
    const deep = Math.min(36, heightAt(tapeX - tapeDeep / 2) - stand - 12)
    if (deep > 12) {
      const walls = sweep(
        tapeOutline,
        [
          { inset: 8, y: -deep },
          { inset: 0, y: -deep * 0.8 },
          { inset: 0, y: 0 },
        ],
        false,
      )
      const floor = face([hull(tapeOutline.offset(8))], -deep, true)
      for (const g of [walls, floor].filter(Boolean)) dark.push(onLid(g))
      for (const z of [-24, 24]) {
        dark.push(onLid(post(30, 5, tapeX, -deep + 2, tapeZ + z, 12)))
      }
      // The piano keys, in the band of lid left in front of the well.
      for (let i = 0; i < 5; i++) {
        const px = Math.max(front + 6, tapeX - tapeDeep / 2 - 24)
        detail.push(onLid(box(22, 7, 20, px, -3, tapeZ - 60 + i * 24)))
      }
    }
  }

  // --- The deck behind the keys -------------------------------------------
  //
  // Ribs run across it and carry on round both ends of the case, which is how
  // they were moulded: one line of tooling, straight through the corner.
  // The vent band: walls and floor sunk into the lid, with the ribs standing
  // between the grooves. The ribs are case, the recess is moulding, so what you
  // read is the shadow in the grooves.
  if (ventOutline) {
    const sink = 1.8
    detail.push(onLid(sweep(ventOutline, [{ inset: 0, y: -sink }, { inset: 0, y: 0 }], false)))
    detail.push(onLid(face([ventOutline.pts], -sink, true)))
    const period = 8
    const groove = 2.6
    const ribs = []
    for (let x = ventFront + 1.5; x + period - groove < ventBack - 1; x += period) {
      ribs.push(onLid(box(period - groove, sink - 0.4, ventRight - ventLeft - 3, x, -sink + 0.1, ventLeft + 1.5)))
    }
    if (ribs.length) shell.push(merge(ribs))
  }
  if (bool(p, 'badge')) {
    const badgeWidth = Math.min(96, W * 0.34)
    const badge = onLid(
      box(bandDepth * 0.85, 1.6, badgeWidth, deckX - bandDepth * 0.42, -0.4, -W / 2 + margin + 10),
    )
    parts.push({ name: 'badge', geometry: badge, color: finish.badge })
  }
  if (bool(p, 'lamp')) {
    const legend = Math.min(26, W * 0.09)
    const right = Math.min(deckRight, W / 2 + 0.5) - margin
    detail.push(
      onLid(box(bandDepth * 0.6, 1.4, legend, deckX - bandDepth * 0.3, -0.3, right - legend - 26)),
    )
    lamps.push(onLid(post(5, 2.4, deckX, -0.2, right - 16, 10)))
  }

  // --- The back -----------------------------------------------------------
  //
  // Sockets are built lying at the origin and moved back rather than spun about
  // it, and every one of them stands a whisker proud of the wall it comes out
  // of: two faces in the same plane flicker against one another.
  const wall = H - stand
  const backY = stand + wall * 0.46
  // A socket cannot be taller than the wall it comes out of: a low machine gets
  // the same fittings, trimmed to what will go through the back of it.
  const fit = (size) => Math.min(size, wall * 0.5)
  const proud = 1.5
  /** A round socket out of the back — an aerial, a DIN. */
  const backSocket = (diameter, y, z) => {
    const g = post(diameter, 9, 0, 0, 0, 12)
    g.rotateZ(-Math.PI / 2)
    g.translate(back - 9 + proud, y, z)
    return g
  }
  /** A slot out of the back: a cartridge letterbox, an edge connector, a D. */
  const backSlot = (height, width, y, z) =>
    box(10, height, width, back - 10 + proud, y - height / 2, z - width / 2)
  /** Four bars round a slot, which is a surround that does not cover it. */
  const bezel = (height, width, y, z, x, depth) => {
    const t = 5
    return merge([
      box(depth, t, width + t * 2, x, y + height / 2, z - width / 2 - t),
      box(depth, t, width + t * 2, x, y - height / 2 - t, z - width / 2 - t),
      box(depth, height, t, x, y - height / 2, z - width / 2 - t),
      box(depth, height, t, x, y - height / 2, z + width / 2),
    ])
  }

  // Everything that comes out of the back, in order from the machine's left,
  // and then spread across whatever width the keyboard has left us: on a small
  // case the sockets close up, rather than marching off the end of it.
  const joysticks = Math.round(num(p, 'joystickPorts'))
  const video = str(p, 'videoOut')
  const along = []
  let squeeze = 1
  const onBack = (w, draw) => along.push({ w, draw })
  if (bool(p, 'edgeConnector')) {
    onBack(BACK_WIDTH.edgeConnector, (z) => dark.push(backSlot(fit(16), BACK_WIDTH.edgeConnector * squeeze, backY, z)))
  }
  if (cassette === 'port') {
    onBack(BACK_WIDTH.cassette, (z) => dark.push(backSlot(fit(15), BACK_WIDTH.cassette * squeeze, backY, z)))
  }
  if (video === 'rf' || video === 'both') {
    onBack(BACK_WIDTH.aerial, (z) => dark.push(backSocket(fit(15 * squeeze), backY, z)))
  }
  if (video === 'composite' || video === 'both') {
    onBack(BACK_WIDTH.composite, (z) => dark.push(backSocket(fit(21 * squeeze), backY, z)))
  }
  if (!sideways) {
    for (let i = 0; i < joysticks; i++) {
      onBack(BACK_WIDTH.joystick, (z) => dark.push(backSlot(fit(13), 31 * squeeze, backY, z)))
    }
    onBack(BACK_WIDTH.rocker, (z) =>
      detail.push(
        box(7, fit(12), BACK_WIDTH.rocker * squeeze, back - 5, backY - fit(12) / 2, z - 12 * squeeze),
      ),
    )
    onBack(BACK_WIDTH.inlet, (z) => dark.push(backSocket(fit(18 * squeeze), backY, z)))
  }
  if (bool(p, 'cartridge')) {
    onBack(BACK_WIDTH.cartridge, (z) => {
      const slot = 92 * squeeze
      dark.push(backSlot(fit(26), slot, backY, z))
      detail.push(bezel(fit(26), slot, backY, z, back - 3, 5))
    })
  }
  const taken = along.reduce((a, b) => a + b.w, 0)
  const spans = Math.max(1, along.length - 1)
  const usable = backWidth(W, radius)
  squeeze = squeezeOf(along.map((item) => item.w), usable)
  const gap = Math.min(46, Math.max(5, (usable - taken * squeeze) / spans))
  let z = -(taken * squeeze + gap * spans) / 2
  for (const item of along) {
    item.draw(z + (item.w * squeeze) / 2)
    z += item.w * squeeze + gap
  }

  // --- The right-hand side ------------------------------------------------
  //
  // The joysticks, the switch and the power inlet, out of the side where your
  // hand fell on them — or along the back with everything else.
  const sideSocket = (diameter, x, y) => {
    const g = post(diameter, 9, 0, 0, 0, 12)
    g.rotateX(Math.PI / 2)
    g.translate(x, y, W / 2 - 9 + proud)
    return g
  }
  const sideSlot = (height, width, x, y) =>
    box(width, height, 10, x - width / 2, y - height / 2, W / 2 - 10 + proud)
  // Sized and placed against the wall they come out of, then packed against
  // the back of it: on a short case they close up rather than running off the
  // front.
  const sideWall = heightAt(front + D * 0.3) - stand
  const sideFit = (size) => Math.min(size, sideWall * 0.5)
  const sideY = stand + sideWall * 0.5
  if (sideways) {
    const wall = [
      { w: BACK_WIDTH.inlet, draw: (x, k) => dark.push(sideSocket(sideFit(18 * k), x, sideY)) },
      {
        w: BACK_WIDTH.rocker,
        draw: (x, k) =>
          detail.push(
            box(BACK_WIDTH.rocker * k, sideFit(12), 7, x - (BACK_WIDTH.rocker * k) / 2, sideY - sideFit(12) / 2, W / 2 - 5),
          ),
      },
    ]
    for (let i = 0; i < joysticks; i++) {
      wall.push({
        w: BACK_WIDTH.joystick,
        draw: (x, k) => dark.push(sideSlot(sideFit(13), 31 * k, x, sideY)),
      })
    }
    const nominal = wall.reduce((a, b) => a + b.w, 0) + 14 * Math.max(0, wall.length - 1)
    const k = Math.min(1, backWidth(D, radius) / nominal)
    let sx = back - Math.min(radius, D / 4) - 4
    for (const item of wall) {
      sx -= (item.w * k) / 2
      item.draw(sx, k)
      sx -= (item.w * k) / 2 + 14 * k
    }
  }

  // Feet, so it does not sit flat on the desk.
  const feet = []
  for (const fx of [front + 30, back - 30]) {
    for (const fz of [-W / 2 + 34, W / 2 - 34]) feet.push(post(24, stand, fx, 0, fz, 10))
  }

  const add = (name, list, color) => {
    const usable = list.filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }
  add('case', shell, finish.shell)
  add('keys', [block.main], keyColour)
  add('function keys', [block.fn], mix(keyColour, luma(keyColour) < 0.45 ? finish.shell : finish.trim, 0.55))
  add('mouldings', detail, finish.trim)
  add('sockets', dark, DARK)
  add('lamp', lamps, LAMP)
  add('feet', feet, DARK)

  // Turned to face the standard view, the way the sitter saw it: swung round
  // from -X to +Z, which is where the Front view looks from.
  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  for (const part of facing) part.geometry.rotateY(Math.PI / 2)
  return facing
}

export function metrics(p) {
  const style = str(p, 'keyStyle')
  const columns = Math.round(num(p, 'columns'))
  const rows = Math.round(num(p, 'rows'))
  const pitch = num(p, 'pitch')
  const functionKeys = Math.round(num(p, 'functionKeys'))
  const keypad = bool(p, 'keypad')
  const margin = num(p, 'margin')
  const frontBand = num(p, 'frontBand')
  const backDeck = num(p, 'backDeck')
  const lip = num(p, 'lip')
  const slope = (num(p, 'slope') * Math.PI) / 180
  const cassette = str(p, 'cassette')
  const deck = cassette === 'deck'
  const uniform = style === 'rubber' || style === 'calculator'

  const fnUnits = functionKeys > 0 ? 1.95 : 0
  const units = columns + fnUnits + (keypad ? 4.7 : 0)
  const blockWidth = units * pitch
  const blockDepth = rows * pitch
  const W = blockWidth + margin * 2 + (deck ? 176 : 0)
  const D = blockDepth + frontBand + backDeck
  const H = 3 + lip + D * Math.tan(slope)

  const run = backRun(p, str(p, 'portSide') === 'right')
  const usable = backWidth(W, num(p, 'radius'))
  const squeeze = squeezeOf(run, usable)

  let keys = functionKeys + (keypad ? (rows - 1) * 4 : 0)
  for (let r = 0; r < rows; r++) keys += rowLayout(r, rows, columns, uniform).filter((k) => !k.gap).length

  const pitchLevel = pitch >= 18 ? 'ok' : pitch >= 16 ? 'warn' : 'error'
  const ribRoom = backDeck >= 52
  return [
    { label: 'Case', value: formatLength(W) + ' × ' + formatLength(D) + ' × ' + formatLength(H), note: 'Width and depth follow the key block; height follows the lip and the slope.' },
    { label: 'Desk taken', value: ((W * D) / 1e6).toFixed(2) + ' m²' },
    { label: 'Keys', value: keys + ', ' + style + (functionKeys ? ' with ' + functionKeys + ' function keys' : '') },
    {
      label: 'Key pitch',
      value: formatLength(pitch) + ' — ' + ((pitch / FULL_PITCH) * 100).toFixed(0) + '% of a typewriter',
      level: pitchLevel,
      note:
        pitchLevel === 'ok'
          ? undefined
          : pitchLevel === 'warn'
            ? 'Cramped for touch typing, which was rather the point of the price.'
            : 'Two fingers only.',
    },
    {
      label: 'Back panel',
      value:
        formatLength(run.reduce((a, b) => a + b, 0) + 5 * Math.max(0, run.length - 1)) +
        ' of sockets and gaps in ' +
        formatLength(usable),
      level: squeeze < 1 ? 'warn' : 'ok',
      note:
        squeeze < 1
          ? 'They will not all go side by side: widen the case, or fit fewer of them.'
          : undefined,
    },
    {
      label: 'Deck behind the keys',
      value: formatLength(backDeck),
      level: bool(p, 'ribs') && !ribRoom ? 'warn' : 'ok',
      note: bool(p, 'ribs') && !ribRoom ? 'Too shallow to sink a vent band into; give it 52 mm or turn the ribs off.' : undefined,
    },
    { label: 'Storage', value: deck ? 'Built-in cassette deck' : cassette === 'port' ? 'Cassette, on a lead' : 'None fitted' },
  ]
}

export const presets = [
  {
    name: 'Breadbin micro',
    params: {
      keyStyle: 'typewriter', columns: 17, rows: 5, pitch: 19, functionKeys: 4, keypad: false,
      keyColour: 'brown', margin: 22, frontBand: 44, backDeck: 72, lip: 43, slope: 7.5,
      radius: 14, finish: 'cream', ribs: true, badge: true, lamp: true,
      cassette: 'port', cartridge: true, edgeConnector: true, joystickPorts: 2,
      portSide: 'right', videoOut: 'both',
    },
  },
  {
    name: 'Chiclet micro',
    params: {
      keyStyle: 'chiclet', columns: 14, rows: 4, pitch: 16, functionKeys: 0, keypad: false,
      margin: 26, frontBand: 34, backDeck: 54, lip: 24, slope: 8, radius: 18, finish: 'cream',
      keyColour: 'dark', cassette: 'port', cartridge: true, edgeConnector: false,
      joystickPorts: 2, portSide: 'right', videoOut: 'rf', ribs: true, lamp: false,
    },
  },
  {
    name: 'Rubber-key micro',
    params: {
      keyStyle: 'rubber', columns: 10, rows: 4, pitch: 17, functionKeys: 0, keypad: false,
      margin: 16, frontBand: 22, backDeck: 26, lip: 20, slope: 6, radius: 12, finish: 'charcoal',
      keyColour: 'grey', cassette: 'port', cartridge: false, edgeConnector: true,
      joystickPorts: 0, portSide: 'right', videoOut: 'rf', ribs: false, lamp: false, badge: true,
    },
  },
  {
    name: 'Cartridge micro',
    params: {
      keyStyle: 'typewriter', columns: 15, rows: 5, pitch: 17.5, functionKeys: 4, keypad: false,
      margin: 20, frontBand: 42, backDeck: 54, lip: 30, slope: 9, radius: 16, finish: 'beige',
      keyColour: 'light', cassette: 'port', cartridge: true, edgeConnector: true,
      joystickPorts: 1, portSide: 'right', videoOut: 'rf', ribs: true, lamp: true,
    },
  },
  {
    name: 'Built-in tape micro',
    params: {
      keyStyle: 'typewriter', columns: 15, rows: 5, pitch: 18, functionKeys: 0, keypad: true,
      margin: 20, frontBand: 34, backDeck: 56, lip: 30, slope: 8, radius: 14, finish: 'brown',
      keyColour: 'light', cassette: 'deck', cartridge: false, edgeConnector: true,
      joystickPorts: 1, portSide: 'back', videoOut: 'composite', ribs: true, lamp: true,
    },
  },
  {
    name: 'Business-minded micro',
    params: {
      keyStyle: 'typewriter', columns: 18, rows: 6, pitch: 19.05, functionKeys: 4, keypad: true,
      margin: 26, frontBand: 40, backDeck: 46, lip: 32, slope: 11, radius: 10, finish: 'beige',
      keyColour: 'light', cassette: 'port', cartridge: false, edgeConnector: true,
      joystickPorts: 0, portSide: 'back', videoOut: 'composite', ribs: false, badge: true,
      lamp: true,
    },
  },
  {
    name: 'Calculator micro',
    params: {
      keyStyle: 'calculator', columns: 10, rows: 4, pitch: 13, functionKeys: 0, keypad: false,
      margin: 22, frontBand: 16, backDeck: 20, lip: 18, slope: 5, radius: 10, finish: 'charcoal',
      keyColour: 'light', cassette: 'port', cartridge: false, edgeConnector: true,
      joystickPorts: 0, portSide: 'right', videoOut: 'rf', ribs: false, badge: false, lamp: false,
    },
  },
]
