// AT desktop, 1981–1993.
//
// The beige box the monitor sat on. Its size was not a styling decision: the
// board standard set the footprint, the card height set how tall the lid had to
// be, and the drive bays set how much of the front was taken up. Change the
// board from XT to AT here and the case grows the way the real ones did.
//
//   depth  = board depth + the bezel at the front and the ports at the back
//   width  = board width + the bay stack beside it + the supply behind that
//   height = a card standing in a slot, plus the lid, or the bays if taller
//
// Built with the front at -X and turned at the end to face +Z, which is where
// the studio's Front view looks from. Width then runs along X centred on zero,
// +Y is up, and the desk is Y = 0.

export const meta = {
  order: 9,
  name: 'AT desktop',
  description:
    'The 1981–93 desktop with the monitor on top — case sized from the board standard, the card height and the drive bays, with full-height or half-height 5¼" openings and ISA cards.',
}

// Board standards, in millimetres, as the specifications had them in inches.
const BOARD = {
  pc: { label: 'IBM PC 5150', w: 216, d: 279.4, slots: 5, bus: '8-bit ISA' },
  xt: { label: 'PC/XT', w: 216, d: 330, slots: 8, bus: '8-bit ISA' },
  at: { label: 'AT', w: 305, d: 351, slots: 8, bus: '16-bit ISA' },
  babyAt: { label: 'Baby-AT', w: 216, d: 330, slots: 8, bus: '16-bit ISA' },
}

// Drive openings, in the sizes the industry settled on.
const BAY = {
  full: { h: 82.5, w: 146, label: 'full-height 5¼"' },
  half: { h: 41.3, w: 146, label: 'half-height 5¼"' },
  small: { h: 25.4, w: 101.6, label: '3½"' },
}

const CARD_HEIGHT = 106.7 // an ISA card, edge to bracket
const PSU_WIDTH = 150

const FINISH = {
  oatmeal: { shell: 0xd9cfb4, bezel: 0xcfc4a6, trim: 0x7d7660 },
  beige: { shell: 0xd6c9a4, bezel: 0xcabd97, trim: 0x7d7660 },
  putty: { shell: 0xcac4b2, bezel: 0xbfb9a6, trim: 0x6f6a5c },
  grey: { shell: 0xb4b3ac, bezel: 0xa8a7a0, trim: 0x63625d },
}

const COLOR = {
  metal: 0xa9b0b6,
  board: 0x2f6b45,
  dark: 0x25282c,
  led: 0x4ad06a,
  screen: 0x23262a,
}

const PHOSPHOR = { green: 0x64c47c, amber: 0xdb9a30, colour: 0x9fb8d8 }

export const params = [
  // --- Board --------------------------------------------------------------
  {
    id: 'board',
    label: 'Board',
    type: 'select',
    default: 'at',
    group: 'Board',
    help: 'The standard the case is built around. Everything else follows from it.',
    options: [
      { value: 'pc', label: 'IBM PC 5150 — 216 × 279.4 mm, five 8-bit slots' },
      { value: 'xt', label: 'PC/XT — 216 × 330 mm, 8-bit slots' },
      { value: 'at', label: 'AT — 305 × 351 mm, 16-bit slots' },
      { value: 'babyAt', label: 'Baby-AT — 216 × 330 mm, 16-bit slots' },
    ],
  },
  { id: 'slots', label: 'Slots cut in the back', type: 'int', min: 3, max: 8, step: 1, default: 8, group: 'Board' },
  { id: 'cards', label: 'Cards fitted', type: 'int', min: 0, max: 8, step: 1, default: 4, group: 'Board', help: 'Video, disk controller, serial and parallel, and whatever else the machine needed.' },
  { id: 'cutaway', label: 'Lid off', type: 'boolean', default: false, group: 'Board', help: 'Takes the lid and the near side away, and builds the board, the cards, the supply and the drive cage.' },

  // --- Drives -------------------------------------------------------------
  {
    id: 'bayHeight',
    label: 'Bay openings',
    type: 'select',
    default: 'half',
    group: 'Drives',
    help: 'Full height is the early one: two of them filled the front. Half height came in around 1985 and doubled what would fit.',
    options: [
      { value: 'full', label: 'Full height — 82.5 mm' },
      { value: 'half', label: 'Half height — 41.3 mm' },
    ],
  },
  { id: 'bayColumns', label: 'Bay columns', type: 'int', min: 1, max: 2, step: 1, default: 2, group: 'Drives', help: 'Side by side across the front. Each column widens the case by 160 mm.' },
  { id: 'floppies', label: '5¼" floppy drives', type: 'int', min: 0, max: 4, step: 1, default: 2, group: 'Drives' },
  { id: 'smallFloppy', label: '3½" floppy drive', type: 'boolean', default: false, group: 'Drives', help: 'The later fitment, in a frame that filled a 5¼" opening.' },
  { id: 'hardDisk', label: 'Hard disk', type: 'boolean', default: true, group: 'Drives', help: 'In a bay of its own, with a lamp on the front and no opening.' },
  { id: 'tapeDrive', label: 'Tape streamer', type: 'boolean', default: false, group: 'Drives', help: 'For the nightly backup, in the last free opening.' },

  // --- Case ---------------------------------------------------------------
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'oatmeal',
    group: 'Case',
    options: [
      { value: 'oatmeal', label: 'Oatmeal' },
      { value: 'beige', label: 'Beige' },
      { value: 'putty', label: 'Putty' },
      { value: 'grey', label: 'Grey' },
    ],
  },
  { id: 'keyLock', label: 'Key lock', type: 'boolean', default: true, group: 'Case', help: 'The barrel lock that froze the keyboard. Nobody knew where the key was.' },
  { id: 'turboButton', label: 'Turbo button and clock display', type: 'boolean', default: false, group: 'Case', help: 'A clone fitment, and the number on it was decorative.' },
  { id: 'badge', label: 'Badge', type: 'boolean', default: true, group: 'Case' },

  // --- Monitor and keyboard -----------------------------------------------
  {
    id: 'display',
    label: 'Monitor on top',
    type: 'select',
    default: 'green',
    group: 'Desk',
    options: [
      { value: 'none', label: 'None' },
      { value: 'green', label: 'Monochrome green' },
      { value: 'amber', label: 'Monochrome amber' },
      { value: 'colour', label: 'Colour' },
    ],
  },
  { id: 'monitorSize', label: 'Monitor', type: 'number', min: 9, max: 16, step: 0.5, default: 12, unit: '″', group: 'Desk', visibleWhen: (p) => str(p, 'display') !== 'none' },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: false, group: 'Desk', visibleWhen: (p) => str(p, 'display') !== 'none' },
  { id: 'keyboard', label: 'Keyboard', type: 'boolean', default: true, group: 'Desk' },
]

/**
 * The size of the case, from the board and the bays.
 *
 * Depth is the board plus the bezel at the front and the ports at the back.
 * Width is the board plus the drive cage beside it — less the overlap, because
 * the cage sat over the edge of the board rather than clear of it — and the
 * supply sits behind the cage rather than beside it, so it costs nothing here.
 * Height is a card standing in its slot, or the bay stack if that is taller.
 */
function caseSize(board, bay, columns) {
  const bayRows = bay === BAY.full ? 1 : 2
  if (board === BOARD.pc) return { W: 508 + (columns - 2) * 160, D: 410, H: 152.4, bayRows }
  const overlap = Math.min(90, board.w * 0.3)
  return {
    W: board.w + columns * (bay.w + 14) + 44 - overlap,
    D: board.d + 90,
    H: Math.max(CARD_HEIGHT + 34, bayRows * bay.h + 40) + 22,
    bayRows,
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

/** An upright plate with its front face at `x`, centred on (y, z). */
function plate(outline, x, thickness, radius, y, z = 0) {
  const g = faceForward(profiledBoard(outline, 0, thickness, radius > 0 ? 'rounded' : 'square', radius))
  g.translate(x + thickness, y, z)
  return g
}

/**
 * A cylinder lying along the depth — a lock barrel, a fan grille, a socket.
 * Built at the origin and then moved, because rotating one already in place
 * would swing it about the middle of the machine instead of its own.
 */
function socket(diameter, length, x, y, z) {
  const g = post(diameter, length, 0, 0, 0, 12)
  g.rotateZ(-Math.PI / 2)
  g.translate(x, y, z)
  return g
}

/** A drive fascia, built about the origin facing -X. */
function fascia(kind, height, relief) {
  const w = kind === 'small' ? BAY.small.w : BAY.half.w
  const plastic = box(relief, height, w, -relief, -height / 2, -w / 2)
  const detail = []
  if (kind === 'floppy525') {
    detail.push(box(relief + 2, 5, w * 0.72, -relief - 1, height * 0.06, -w * 0.36))
    detail.push(box(relief + 6, height * 0.34, w * 0.1, -relief - 5, -height * 0.4, -w * 0.05))
  } else if (kind === 'small') {
    detail.push(box(relief + 2, 4, w * 0.66, -relief - 1, height * 0.05, -w * 0.33))
    detail.push(box(relief + 2, 5, 11, -relief - 1, -height * 0.28, w * 0.22))
  } else if (kind === 'tape') {
    detail.push(box(relief + 3, height * 0.5, w * 0.6, -relief - 2, -height * 0.14, -w * 0.3))
  } else {
    // A blanking plate, with the moulded ribs they always had.
    for (let i = 0; i < 3; i++) {
      detail.push(box(relief + 1, 3, w * 0.7, -relief - 0.5, -height * 0.2 + i * 8, -w * 0.35))
    }
  }
  return { plastic, detail: merge(detail) }
}

/** The big AT keyboard, built about the origin, front row nearest -X. */
function keyboard(pitch, originalPC = false) {
  const columns = 17
  const rows = originalPC ? 5 : 6
  const width = (columns + 5.2) * pitch
  const depth = rows * pitch + 14
  const shellHeight = 34
  const outline = plan(rect(depth + 30, width + 34, 8))
  const shell = [
    sweep(outline, [{ inset: 0, y: shellHeight }, { inset: 0, y: 0 }], false),
    face([outline.pts], shellHeight, true),
    face([outline.pts], 0, false),
  ]
  const keys = []
  for (let r = 0; r < rows; r++) {
    const x = -depth / 2 + r * pitch
    if (r === 0) {
      keys.push(box(pitch * 0.82, 8, pitch * 6, x, shellHeight, -pitch * 3))
      for (const side of [-1, 1]) {
        keys.push(box(pitch * 0.82, 8, pitch * 1.5, x, shellHeight, side * pitch * 4))
      }
      continue
    }
    if (originalPC) for (let c = 0; c < 2; c++) keys.push(box(pitch * .82, 8, pitch * .84, x, shellHeight, -width / 2 + c * pitch))
    for (let c = 0; c < columns; c++) {
      const z = -width / 2 + c * pitch + ((rows - r) % 3) * pitch * 0.25
      if (originalPC && c < 2) continue
      if (z + pitch > width / 2 - pitch * 5.4) continue
      keys.push(box(pitch * 0.82, 8, pitch * 0.84, x, shellHeight, z))
    }
    for (let c = 0; c < 4; c++) {
      keys.push(box(pitch * 0.82, 8, pitch * 0.84, x, shellHeight, width / 2 - pitch * 4.4 + c * pitch))
    }
  }
  return { shell: merge(shell.filter(Boolean)), keys: merge(keys) }
}

/** Matched rounded-rectangle rings, in monitor-local XY, front normal +Z.
 * Rebuild every section at its own size: large polygon offsets invert small
 * corner arcs. Shared indexed vertices smooth the arcs without faceting. */
function monitorRing(width, height, radius) {
  const points = [], steps = 12
  const r = Math.min(radius, width / 2, height / 2)
  for (let corner = 0; corner < 4; corner++) {
    const a = corner * Math.PI / 2
    const cx = (corner === 0 || corner === 3 ? 1 : -1) * (width / 2 - r)
    const cy = (corner < 2 ? 1 : -1) * (height / 2 - r)
    for (let i = 0; i <= steps; i++) {
      const angle = a + i * Math.PI / (2 * steps)
      points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)])
    }
  }
  return points
}

function monitorLoft(sections, inward = false) {
  const positions = [], indices = []
  const rings = sections.map(s => monitorRing(s.w, s.h, s.r))
  const n = rings[0].length
  rings.forEach((ring, j) => ring.forEach(([x, y]) => positions.push(x, y, -sections[j].d)))
  for (let j = 0; j < sections.length - 1; j++) for (let i = 0; i < n; i++) {
    const a = j * n + i, b = j * n + (i + 1) % n, c = b + n, d = a + n
    indices.push(...(inward ? [a, b, c, a, c, d] : [a, c, b, a, d, c]))
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function monitorFace(width, height, radius, depth, hole, back = false) {
  const contour = monitorRing(width, height, radius).map(([x, y]) => new THREE.Vector2(x, y))
  const shape = new THREE.Shape(contour)
  if (hole) shape.holes.push(new THREE.Path(monitorRing(hole.w, hole.h, hole.r).reverse().map(([x, y]) => new THREE.Vector2(x, y))))
  const geometry = new THREE.ShapeGeometry(shape)
  if (back) geometry.rotateY(Math.PI)
  geometry.translate(0, 0, -depth)
  return geometry
}

/** Raised DIP packages remain meshes; copper, pads and silk bake to textures.
 * Coordinates in this helper start in XY with the populated face towards +Z. */
function circuit(parts, name, width, height, transform, surface, motherboard) {
  const traces = [], pads = [], silk = [], chips = [], pins = []
  const patch = (list, x, y, w, h, z = 0) => {
    const g = new THREE.PlaneGeometry(w, h)
    g.translate(x + w / 2, y + h / 2, z)
    list.push(g)
  }
  const rows = motherboard ? 4 : 2
  const cols = motherboard ? 9 : 7
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = 8 + c * (width - 22) / cols
    const y = 10 + r * (height - 26) / rows
    chips.push(box(16, 7, 3, x, y, 0.2))
    for (let pin = 0; pin < 7; pin++) {
      for (const side of [-1, 1]) {
        const py = side < 0 ? y - 2 : y + 7
        patch(pads, x + pin * 2.2, py, 1.2, 2, 0.04)
        pins.push(box(0.7, 2, 0.7, x + pin * 2.2, py, 0.2))
      }
    }
    patch(traces, x + 2, y - 5, 0.55, 3, 0.02)
    patch(traces, x + 2, y - 5, (width - 22) / cols - 2, 0.55, 0.02)
    patch(traces, x + 19, y - 5, 0.55, 16, 0.02)
    patch(silk, x - 1, y - 1, 18, 0.4, 0.06)
    patch(silk, x - 1, y + 8, 18, 0.4, 0.06)
    patch(silk, x - 1, y - 1, 0.4, 9, 0.06)
  }
  if (motherboard) {
    // Larger processor/ROM packages along the clear front edge.
    for (let i = 0; i < 3; i++) chips.push(box(36, 10, 4, 15 + i * 52, height - 18, 0.2))
  } else {
    for (let i = 0; i < 31; i++) patch(pads, 12 + i * 2.54, 0, 1.5, 5, 0.04)
  }
  for (const [suffix, list, color, bake] of [
    ['traces', traces, 0x73935b, true], ['pads', pads, 0xc4a85b, true],
    ['silkscreen', silk, 0xd8dfbd, true], ['chips', chips, 0x202328, false],
    ['pins', pins, 0xa9adb0, false],
  ]) {
    const geometry = merge(list)
    transform(geometry)
    parts.push({ name: name + '-' + suffix, geometry, color, ...(bake ? { lod: { surface } } : {}) })
  }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const board = BOARD[str(p, 'board')] ?? BOARD.at
  const bay = BAY[str(p, 'bayHeight')] ?? BAY.half
  const columns = Math.round(num(p, 'bayColumns'))
  const finish = FINISH[str(p, 'finish')] ?? FINISH.oatmeal
  const cutaway = bool(p, 'cutaway')
  const slots = Math.min(board.slots, Math.round(num(p, 'slots')))
  const cards = Math.min(Math.round(num(p, 'cards')), slots)

  // --- Size, from the board and the bays out ------------------------------
  const { W, D, H, bayRows } = caseSize(board, bay, columns)
  const front = -D / 2
  const back = D / 2
  const wall = 2.5
  const radius = 2
  const originalPC = board === BOARD.pc

  const shell = []
  const bezel = []
  const detail = []
  const dark = []
  const metal = []
  const boards = []
  const lamps = []
  const parts = []

  // --- Case ---------------------------------------------------------------
  //
  // Panels rather than a solid, so taking the lid off is a matter of not
  // drawing two of them.
  if (!cutaway) {
    // An opaque closed unit needs no inner panel faces or hidden hardware.
    shell.push(box(D, H, W, front, 0, -W / 2))
  } else {
    shell.push(box(D, wall * 2, W, front, 0, -W / 2))
    shell.push(box(D, H, wall * 2, front, 0, W / 2 - wall * 2))
    shell.push(box(wall * 2, H, W, back - wall * 2, 0, -W / 2))
  }

  // --- Front bezel and drives ---------------------------------------------
  const bezelDepth = 14
  const relief = 2
  bezel.push(plate(rect(H, W, radius), front - bezelDepth, bezelDepth, 5, H / 2))

  // The bay block sits at one end of the front, the width of the openings.
  const bayZone = W / 2 - columns * (bay.w + 12) - 14
  const openings = []
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < bayRows; r++) {
      openings.push({
        y: H - 26 - bay.h / 2 - r * (bay.h + 6),
        z: bayZone + c * (bay.w + 12) + bay.w / 2 + 12,
      })
    }
  }

  // What goes in them, in the order a machine of the day was filled.
  const fitted = []
  for (let i = 0; i < Math.round(num(p, 'floppies')); i++) fitted.push('floppy525')
  if (bool(p, 'smallFloppy')) fitted.push('small')
  if (bool(p, 'tapeDrive')) fitted.push('tape')
  while (fitted.length < openings.length) fitted.push('blank')

  openings.forEach((opening, i) => {
    const kind = fitted[i] ?? 'blank'
    const piece = fascia(kind, bay.h - 3, relief)
    const at = new THREE.Matrix4().makeTranslation(front - bezelDepth, opening.y, opening.z)
    piece.plastic.applyMatrix4(at)
    piece.detail.applyMatrix4(at)
    if (originalPC) dark.push(piece.plastic)
    else bezel.push(piece.plastic)
    if (originalPC) detail.push(piece.detail)
    else dark.push(piece.detail)
    if (cutaway && kind !== 'blank') {
      metal.push(
        box(
          kind === 'small' ? 150 : 203,
          bay.h - 6,
          (kind === 'small' ? BAY.small.w : bay.w) - 8,
          front + 10,
          opening.y - (bay.h - 6) / 2,
          opening.z - ((kind === 'small' ? BAY.small.w : bay.w) - 8) / 2,
        ),
      )
    }
  })

  // Switch, lock, lamps and badge on the clear part of the bezel.
  const panelZ = -W / 2 + 60
  if (!originalPC) detail.push(box(relief + 5, 20, 40, front - bezelDepth - relief - 3, H * 0.3, panelZ - 20))
  if (!originalPC) lamps.push(box(relief + 2, 5, 10, front - bezelDepth - relief, H * 0.3 + 30, panelZ - 5))
  if (bool(p, 'hardDisk')) {
    lamps.push(box(relief + 2, 5, 10, front - bezelDepth - relief, H * 0.3 + 30, panelZ + 12))
    if (cutaway) metal.push(box(146, 41.3, 101.6, front + 40, wall * 2 + 6, -W / 2 + 40))
  }
  if (bool(p, 'keyLock')) {
    dark.push(socket(18, relief + 6, front - bezelDepth - relief - 4, H * 0.3 - 34, panelZ + 34))
  }
  if (bool(p, 'turboButton')) {
    detail.push(box(relief + 4, 14, 26, front - bezelDepth - relief - 2, H * 0.3 - 4, panelZ + 60))
    dark.push(box(relief + 3, 16, 44, front - bezelDepth - relief - 1, H * 0.62, panelZ + 46))
  }
  if (bool(p, 'badge')) {
    parts.push({
      name: 'badge',
      geometry: box(relief + 1, 16, 76, front - bezelDepth - relief, H - 26, -W / 2 + 62),
      color: 0x35404f,
    })
  }

  // Recessed ventilation bank and red side-mounted mains paddle.
  const ventWidth = Math.max(24, bayZone + W / 2 - 34)
  const vents = []
  for (let i = 0; i < 10; i++) {
    const g = new THREE.PlaneGeometry(ventWidth, 2)
    g.rotateY(-Math.PI / 2)
    g.translate(front - bezelDepth - 0.1, 24 + i * 7, -W / 2 + 18 + ventWidth / 2)
    vents.push(g)
  }
  parts.push({ name: 'front-vent-slits', geometry: merge(vents), color: COLOR.dark, lod: { surface: 'z' } })
  parts.push({ name: 'power-switch', geometry: box(24, 27, 5, back - 70, H - 57, W / 2), color: 0xb52d20 })

  // --- The back: slots, supply, ports -------------------------------------
  const slotPitch = 20.3
  const slotBase = wall * 2 + 12
  const slotZ = -W / 2 + 34
  for (let i = 0; i < slots; i++) {
    metal.push(box(wall * 2, Math.min(CARD_HEIGHT + 12, H - slotBase - 8), slotPitch - 2, back + 0.1, slotBase, slotZ + i * slotPitch))
    if (i < cards) {
      dark.push(box(4, 24, 9, back + wall * 2 + 0.2, slotBase + 30, slotZ + i * slotPitch + slotPitch / 2 - 4.5))
    }
  }
  // The supply, its fan and the two big sockets in the back of it.
  const psuZ = W / 2 - PSU_WIDTH - 12
  dark.push(socket(80, 6, back + 0.2, H * 0.55, psuZ + 50))
  for (const z of [psuZ + 108, psuZ + 134]) {
    dark.push(box(6, 30, 22, back + 0.2, H * 0.24, z - 11))
  }
  dark.push(socket(13, 3, back + 0.2, 16, slotZ - 12))
  if (originalPC) dark.push(socket(13, 3, back + 0.2, 40, slotZ - 12))
  if (cutaway) {
    metal.push(box(150, 86, PSU_WIDTH, back - 160, H - 86 - wall * 2 - 8, psuZ))
    const bx = back - 40 - board.d, bz = -W / 2 + 26, by = slotBase - 8
    boards.push(box(board.d, 1.6, board.w, bx, by, bz))
    // Local circuit coordinates are (length, width), normal +Z. Each layer is
    // transformed independently and marked with its FINAL model-space normal.
    circuit(parts, 'motherboard', board.d - 16, board.w - 16, (g) => {
      g.rotateX(-Math.PI / 2)
      g.translate(bx + 8, by + 1.7, bz + board.w - 8)
    }, 'y', true)
    for (let i = 0; i < slots; i++) {
      const z = slotZ + i * slotPitch + slotPitch / 2
      detail.push(box(84, 7, 7, back - 130, by + 1.6, z - 2.7))
      if (board.bus === '16-bit ISA') detail.push(box(45, 7, 7, back - 179, by + 1.6, z - 2.7))
      if (i >= cards) continue
      const length = Math.min(board.d - 24, 240 + (i % 2) * 30)
      const height = Math.min(CARD_HEIGHT, H - slotBase - 12)
      const x = back - 24 - length
      boards.push(box(length, height, 1.6, x, slotBase, z))
      circuit(parts, 'card-' + (i + 1), length - 12, height - 12, (g) => {
        g.translate(x + 6, slotBase + 6, z + 1.7)
      }, 'x', false)
    }

  }

  // --- Monitor on top -----------------------------------------------------
  const display = str(p, 'display')
  const glass = []
  if (display !== 'none') {
    const diagonal = num(p, 'monitorSize') * 25.4
    const screenW = diagonal * 0.8
    const screenH = diagonal * 0.6
    const bezelWidth = 28
    const caseW = screenW + bezelWidth * 2
    const caseH = screenH + bezelWidth * 2
    const depth = Math.max(300, screenW * 0.95)
    const stand = 24
    const y0 = H + stand
    const monitorFront = front + 26

    const place = (g) => g.rotateY(-Math.PI / 2).translate(monitorFront, y0 + caseH / 2, 0)
    const rearW = caseW * 0.66, rearH = caseH * 0.68
    const sections = [
      { w: caseW - 8, h: caseH - 8, r: 15, d: 0 },
      { w: caseW - 2.4, h: caseH - 2.4, r: 18, d: 1.2 },
      { w: caseW, h: caseH, r: 20, d: 4 },
      { w: caseW, h: caseH, r: 20, d: 16 },
      { w: caseW - 1, h: caseH - 1, r: 20, d: depth * 0.37 },
      { w: caseW - 6, h: caseH - 6, r: 21, d: depth * 0.48 },
      { w: caseW - 22, h: caseH - 22, r: 23, d: depth * 0.60 },
      { w: rearW + 24, h: rearH + 24, r: 25, d: depth - 36 },
      { w: rearW + 9, h: rearH + 9, r: 22, d: depth - 15 },
      { w: rearW + 3, h: rearH + 3, r: 19, d: depth - 6 },
      { w: rearW, h: rearH, r: 17, d: depth - 2 },
      { w: rearW - 4, h: rearH - 4, r: 15, d: depth },
    ]
    const aperture = { w: screenW + 10, h: screenH + 10, r: 18 }
    shell.push(place(merge([
      monitorLoft(sections),
      monitorFace(caseW - 8, caseH - 8, 15, 0, aperture),
      monitorLoft([
        { ...aperture, d: 0 },
        { w: screenW + 3, h: screenH + 3, r: 15, d: 5 },
        { w: screenW, h: screenH, r: 14, d: 9 },
      ], true),
      monitorFace(rearW - 4, rearH - 4, 15, depth, null, true),
    ])))
    glass.push(place(monitorFace(screenW, screenH, 14, 9)))
    // Flush rear-panel details remain outside the capped housing.
    const rearVents = []
    for (let row = 0; row < 9; row++) for (const side of [-1, 1]) {
      const vent = new THREE.PlaneGeometry(rearW * 0.34, 2.5)
      vent.rotateY(Math.PI)
      vent.translate(side * rearW * 0.22, rearH * 0.30 - row * 6, -depth - 0.15)
      rearVents.push(place(vent))
    }
    parts.push({ name: 'monitor-rear-vents', geometry: merge(rearVents), color: COLOR.dark })
    const panel = new THREE.PlaneGeometry(rearW * 0.46, 22)
    panel.rotateY(Math.PI)
    panel.translate(0, -rearH * 0.30, -depth - 0.2)
    parts.push({ name: 'monitor-rear-panel', geometry: place(panel), color: finish.trim })
    // A tilt-and-swivel foot, which is what these all sat on.
    shell.push(profiledBoard(rect(depth * 0.6, caseW * 0.8, 12), H, stand, 'rounded', 6).translate(monitorFront + depth * 0.45, 0, 0))
    detail.push(box(30, 10, 60, back - 90, H + 4, -30))
  }

  // --- Keyboard -----------------------------------------------------------
  if (bool(p, 'keyboard')) {
    const kb = keyboard(19.05, originalPC)
    for (const g of [kb.shell, kb.keys]) g.translate(front - 190, 0, 0)
    parts.push({ name: 'keyboard', geometry: kb.shell, color: finish.bezel })
    parts.push({ name: 'keycaps', geometry: kb.keys, color: originalPC ? 0xc5baa0 : finish.trim })
  }

  const add = (name, list, color) => {
    const usable = list.filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }
  add('case', shell, finish.shell)
  add('bezel', bezel, finish.bezel)
  add('fittings', detail, finish.trim)
  add('openings', dark, COLOR.dark)
  add('chassis', metal, COLOR.metal)
  add('boards', boards, COLOR.board)
  add('lamps', lamps, COLOR.led)
  add('screen', glass, bool(p, 'screenOn') && display !== 'none' ? PHOSPHOR[display] ?? PHOSPHOR.green : COLOR.screen)

  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  // Swung round from -X to +Z, which is where the Front view looks from, so the
  // front of the machine is what the front view shows.
  for (const part of facing) part.geometry.rotateY(Math.PI / 2)
  return facing
}

export function metrics(p) {
  const board = BOARD[str(p, 'board')] ?? BOARD.at
  const bay = BAY[str(p, 'bayHeight')] ?? BAY.half
  const columns = Math.round(num(p, 'bayColumns'))
  const slots = Math.min(board.slots, Math.round(num(p, 'slots')))
  const cards = Math.round(num(p, 'cards'))
  const { W, D, H, bayRows } = caseSize(board, bay, columns)

  const openings = columns * bayRows
  const wanted =
    Math.round(num(p, 'floppies')) + (bool(p, 'smallFloppy') ? 1 : 0) + (bool(p, 'tapeDrive') ? 1 : 0)
  const monitor = str(p, 'display') !== 'none'

  return [
    {
      label: 'Case',
      value: `${formatLength(W)} × ${formatLength(D)} × ${formatLength(H)}`,
      note: `${board.label} board, ${columns} bay column${columns > 1 ? 's' : ''}, ${formatLength(CARD_HEIGHT)} of card.`,
    },
    { label: 'Board', value: `${board.label} — ${formatLength(board.w)} × ${formatLength(board.d)}, ${board.bus}` },
    {
      label: 'Openings',
      value: `${Math.min(wanted, openings)} of ${openings} used`,
      level: wanted > openings ? 'warn' : 'ok',
      note:
        wanted > openings
          ? `${wanted - openings} more drive${wanted - openings > 1 ? 's' : ''} than there are ${bay.label} openings. Add a column, or halve the bay height.`
          : undefined,
    },
    {
      label: 'Slots',
      value: `${Math.min(cards, slots)} of ${slots} used`,
      level: cards > slots ? 'warn' : 'ok',
      note: cards > slots ? 'More cards than slots to put them in.' : undefined,
    },
    { label: 'Desk taken', value: `${((W * D) / 1e6).toFixed(2)} m²${monitor ? ', the monitor on top of it' : ''}` },
  ]
}

export const presets = [
  {
    name: '1981 IBM PC 5150',
    params: {
      board: 'pc', slots: 5, cards: 2, bayHeight: 'full', bayColumns: 2,
      floppies: 2, smallFloppy: false, hardDisk: false, tapeDrive: false,
      finish: 'oatmeal', keyLock: false, turboButton: false,
      display: 'green', monitorSize: 12, keyboard: true,
    },
  },
  {
    name: '1983 twin-floppy XT',
    params: {
      board: 'xt', slots: 8, cards: 3, bayHeight: 'full', bayColumns: 2, floppies: 2,
      smallFloppy: false, hardDisk: false, tapeDrive: false, finish: 'oatmeal',
      keyLock: false, turboButton: false, display: 'green', monitorSize: 12, keyboard: true,
    },
  },
  {
    name: '1984 AT with a hard disk',
    params: {
      board: 'at', slots: 8, cards: 4, bayHeight: 'full', bayColumns: 2, floppies: 1,
      smallFloppy: false, hardDisk: true, tapeDrive: false, finish: 'oatmeal',
      keyLock: true, turboButton: false, display: 'amber', monitorSize: 12, keyboard: true,
    },
  },
  {
    name: '1988 clone, turbo',
    params: {
      board: 'babyAt', slots: 8, cards: 5, bayHeight: 'half', bayColumns: 2, floppies: 2,
      smallFloppy: true, hardDisk: true, tapeDrive: false, finish: 'beige',
      keyLock: true, turboButton: true, display: 'colour', monitorSize: 14, keyboard: true,
    },
  },
  {
    name: '1990 office machine, lid off',
    params: {
      board: 'babyAt', slots: 8, cards: 4, bayHeight: 'half', bayColumns: 2, floppies: 1,
      smallFloppy: true, hardDisk: true, tapeDrive: true, finish: 'putty', cutaway: true,
      keyLock: true, turboButton: false, display: 'none', keyboard: true,
    },
  },
  {
    name: '1992 grey box',
    params: {
      board: 'babyAt', slots: 6, cards: 3, bayHeight: 'half', bayColumns: 1, floppies: 1,
      smallFloppy: true, hardDisk: true, tapeDrive: false, finish: 'grey',
      keyLock: false, turboButton: true, display: 'colour', monitorSize: 14,
      screenOn: true, keyboard: true,
    },
  },
]
