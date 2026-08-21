// Multimedia PC, 1995–2001.
//
// The beige mini tower that came with a sound card, a CD-ROM drive and a pair
// of speakers, and was sold on the strength of an encyclopaedia. Two buses at
// once, because the ISA cards people already owned had to keep working while
// PCI took over.
//
// The case comes out of the board and the bays, the way real ones did:
//
//   depth  = board front to back + the bezel and the ports
//   width  = a card standing off the board, plus the panel either side
//   height = the board, the supply above it, and the bay stack at the front
//
// Built with the front at -X and turned at the end to face +Z, which is where
// the studio's Front view looks from. Width then runs along X centred on zero,
// +Y is up, the floor is Y = 0.

export const meta = {
  order: 10,
  name: 'Multimedia PC',
  description:
    'The 1995–2001 beige mini tower — sized from its board and bays, with a CD-ROM, a floppy, ISA and PCI cards side by side, and the speakers it was sold with.',
}

// Board standards, in millimetres. In a tower the shorter edge stands up: the
// slots run down the back of it, and the longer edge runs front to back.
const BOARD = {
  babyAt: { label: 'Baby-AT', d: 330, h: 216, isa: 4, pci: 3 },
  atx: { label: 'ATX', d: 305, h: 244, isa: 3, pci: 4 },
  microAtx: { label: 'microATX', d: 244, h: 244, isa: 2, pci: 3 },
}

const BAY = {
  ext525: { h: 41.3, w: 146, label: '5¼"' },
  ext35: { h: 25.4, w: 101.6, label: '3½"' },
  int35: { h: 26, w: 101.6, label: '3½" internal' },
}

const CARD_HEIGHT = 106.7
const PSU_HEIGHT = 86
const SLOT_PITCH = 20.32

const FINISH = {
  beige: { shell: 0xd6c9a4, bezel: 0xcabd97, trim: 0x7d7660 },
  putty: { shell: 0xcac4b2, bezel: 0xbfb9a6, trim: 0x6f6a5c },
  white: { shell: 0xe4e1d6, bezel: 0xd8d5c9, trim: 0x8b8a83 },
  charcoal: { shell: 0x44464b, bezel: 0x3b3d42, trim: 0x9aa0a6 },
}

// What was either side of the monitor, and how big each of them was. The pair
// in the box sat a drum on a base with the knobs on it; the towers were plastic
// columns; the monitors were something somebody chose, with a mesh disc and a
// row of controls under it.
const SPEAKER = {
  compact: { w: 106, d: 118, h: 152, label: 'the pair in the box' },
  tower: { w: 92, d: 108, h: 264, label: 'plastic towers' },
  monitors: { w: 134, d: 168, h: 212, label: 'powered studio monitors' },
}

const COLOR = {
  metal: 0xa9b0b6,
  cloth: 0x8b8f93,
  isa: 0x1f5c3a,
  pci: 0xf0ece0,
  board: 0x2f6b45,
  dark: 0x25282c,
  power: 0x4ad06a,
  activity: 0xd8a13a,
  screen: 0x23262a,
}

export const params = [
  // --- Board --------------------------------------------------------------
  {
    id: 'board',
    label: 'Board',
    type: 'select',
    default: 'atx',
    group: 'Board',
    help: 'Sets the footprint, how tall the case has to be, and how many slots there are to fill.',
    options: [
      { value: 'babyAt', label: 'Baby-AT — 216 × 330 mm, on its way out' },
      { value: 'atx', label: 'ATX — 305 × 244 mm, ports in a block at the back' },
      { value: 'microAtx', label: 'microATX — 244 × 244 mm' },
    ],
  },
  { id: 'isaCards', label: 'ISA cards', type: 'int', min: 0, max: 4, step: 1, default: 1, group: 'Board', help: 'The sound card usually, and a modem if it was old enough.' },
  { id: 'pciCards', label: 'PCI cards', type: 'int', min: 0, max: 5, step: 1, default: 2, group: 'Board', help: 'Graphics, network, SCSI, or the sound card once it moved over.' },
  { id: 'cutaway', label: 'Side panel off', type: 'boolean', default: false, group: 'Board', help: 'Builds the board, the cards, the drive cage and the supply.' },

  // --- Drives -------------------------------------------------------------
  { id: 'bays525', label: '5¼" openings', type: 'int', min: 1, max: 4, step: 1, default: 2, group: 'Drives', help: 'Each one is 41.3 mm of case height.' },
  { id: 'optical', label: 'CD-ROM drives', type: 'int', min: 0, max: 2, step: 1, default: 1, group: 'Drives' },
  { id: 'tapeDrive', label: 'Tape or Zip drive', type: 'boolean', default: false, group: 'Drives' },
  { id: 'bays35', label: '3½" openings', type: 'int', min: 0, max: 2, step: 1, default: 1, group: 'Drives', help: '25.4 mm each. The floppy went in one of these.' },
  { id: 'floppy', label: 'Floppy drive', type: 'boolean', default: true, group: 'Drives' },
  { id: 'hardDisks', label: 'Hard disks', type: 'int', min: 0, max: 3, step: 1, default: 1, group: 'Drives', help: 'In the internal cage, which adds 26 mm of height each.' },

  // --- Case ---------------------------------------------------------------
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'beige',
    group: 'Case',
    options: [
      { value: 'beige', label: 'Beige' },
      { value: 'putty', label: 'Putty' },
      { value: 'white', label: 'White, going yellow' },
      { value: 'charcoal', label: 'Charcoal' },
    ],
  },
  { id: 'resetButton', label: 'Reset button', type: 'boolean', default: true, group: 'Case' },
  { id: 'badge', label: 'Badge', type: 'boolean', default: true, group: 'Case' },
  { id: 'feet', label: 'Feet', type: 'boolean', default: true, group: 'Case' },

  // --- Desk ---------------------------------------------------------------
  {
    id: 'speakers',
    label: 'Speakers',
    type: 'select',
    default: 'compact',
    group: 'Desk',
    help: 'One either side of the monitor. What they are says as much about the machine as the case does.',
    options: [
      { value: 'none', label: 'None' },
      { value: 'compact', label: 'The pair in the box — a drum on a base, knobs on one of them' },
      { value: 'tower', label: 'Plastic towers, standing either side of the monitor' },
      { value: 'monitors', label: 'Powered monitors — a mesh disc and a row of controls' },
    ],
  },
  {
    id: 'display',
    label: 'Monitor',
    type: 'select',
    default: 'crt15',
    group: 'Desk',
    options: [
      { value: 'none', label: 'None' },
      { value: 'crt14', label: '14″ tube' },
      { value: 'crt15', label: '15″ tube' },
      { value: 'crt17', label: '17″ tube' },
    ],
  },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: false, group: 'Desk', visibleWhen: (p) => str(p, 'display') !== 'none' },
  { id: 'keyboard', label: 'Keyboard and mouse', type: 'boolean', default: true, group: 'Desk' },
]

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

/**
 * The case, from the board and the bays. The bay stack is what usually decides
 * the height of a tower this size — a fourth 5¼" opening is another 41 mm of
 * steel whether anything goes in it or not.
 */
function caseSize(board, bays525, bays35, hardDisks) {
  const stack = bays525 * BAY.ext525.h + bays35 * BAY.ext35.h + hardDisks * BAY.int35.h
  return {
    W: CARD_HEIGHT + 72,
    D: board.d + 105,
    H: Math.max(board.h + 40, stack + 70) + PSU_HEIGHT + 30,
    stack,
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

/** A cylinder lying along the depth, built at the origin and then placed. */
function socket(diameter, length, x, y, z) {
  const g = post(diameter, length, 0, 0, 0, 12)
  g.rotateZ(-Math.PI / 2)
  g.translate(x, y, z)
  return g
}

/** A drive fascia, built about the origin facing -X. */
function fascia(kind, height, width, relief) {
  const plastic = box(relief, height, width, -relief, -height / 2, -width / 2)
  const detail = []
  if (kind === 'optical') {
    detail.push(box(relief + 2, 3.5, width * 0.8, -relief - 1, height * 0.08, -width * 0.4))
    detail.push(box(relief + 2, 6, 14, -relief - 1, -height * 0.28, width * 0.28))
    detail.push(box(relief + 2, 4, 4, -relief - 1, -height * 0.28, width * 0.12))
  } else if (kind === 'floppy') {
    detail.push(box(relief + 2, 4, width * 0.66, -relief - 1, height * 0.1, -width * 0.33))
    detail.push(box(relief + 2, 5, 12, -relief - 1, -height * 0.3, width * 0.24))
  } else if (kind === 'tape') {
    detail.push(box(relief + 3, height * 0.46, width * 0.66, -relief - 2, -height * 0.1, -width * 0.33))
  } else {
    for (let i = 0; i < 2; i++) {
      detail.push(box(relief + 1, 2.5, width * 0.72, -relief - 0.5, -height * 0.16 + i * 9, -width * 0.36))
    }
  }
  return { plastic, detail: merge(detail) }
}

/**
 * The walls between two outlines of the same point count, one at each depth.
 *
 * `sweep` cannot do this job: it works by offsetting a single outline, and an
 * offset deep enough to make a funnel collapses the rounded corners of it. The
 * rim the walls then end on and the cap laid over that rim disagree by better
 * than a centimetre, which is two faces fighting over the back of the monitor.
 * Lofting between two outlines that were drawn separately keeps them the same
 * shape by construction.
 */
function loft(a, ya, b, yb) {
  const n = Math.min(a.length, b.length)
  const position = []
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    // Wound the way `sweep` winds it — top rim first — which is what puts the
    // normals on the outside.
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

/** A circle as a plan outline, for a round grille. */
function circle(diameter, steps = 24) {
  const pts = []
  for (let i = 0; i < steps; i++) {
    const a = (Math.PI * 2 * i) / steps
    pts.push({ x: (Math.cos(a) * diameter) / 2, z: (Math.sin(a) * diameter) / 2 })
  }
  return ring(pts)
}

/** What a chosen monitor measures, which is what the desk is laid out around. */
function displaySize(display) {
  if (display === 'none') return null
  const inches = display === 'crt14' ? 14 : display === 'crt17' ? 17 : 15
  const diagonal = inches * 25.4
  const screenW = diagonal * 0.79
  const screenH = diagonal * 0.59
  const surround = 26
  return {
    screenW,
    screenH,
    caseW: screenW + surround * 2,
    caseH: screenH + surround * 2,
    depth: Math.max(340, screenW * 0.95),
  }
}

/**
 * A speaker, built about the origin with its grille facing -X and standing on
 * the desk. `controls` puts the knobs on this one — on a cheap pair they were
 * on one of the two and the other was the slave, on a lead.
 */
function speaker(kind, controls) {
  const size = SPEAKER[kind]
  const shell = []
  const cloth = []
  const dark = []
  const knobs = []
  const lamps = []
  const front = -size.d / 2

  if (kind === 'compact') {
    // A base with the knobs on it, and a rounded drum leaning back off it.
    const baseH = 46
    shell.push(profiledBoard(rect(size.d, size.w, 12), 0, baseH, 'rounded', 8))
    const headH = size.h - baseH + 14
    const headD = size.d * 0.58
    const head = plate(rect(headH, size.w - 8, 22), -headD, headD, 12, 0)
    const cover = plate(rect(headH - 28, size.w - 34, 16), -headD - 1.2, 1.6, 0, 0)
    const lean = (10 * Math.PI) / 180
    for (const g of [head, cover]) {
      g.rotateZ(-lean)
      g.translate(size.d * 0.05, baseH - 10 + headH / 2, 0)
    }
    shell.push(head)
    cloth.push(cover)
    if (controls) {
      knobs.push(socket(24, 9, front - 6, baseH - 20, -size.w * 0.28))
      for (let i = 0; i < 2; i++) {
        knobs.push(socket(15, 7, front - 5, baseH - 22, size.w * 0.04 + i * 26))
      }
      lamps.push(box(4, 5, 5, front - 3, baseH - 20, -size.w * 0.05))
    }
  } else if (kind === 'tower') {
    shell.push(profiledBoard(rect(size.d, size.w, 10), 0, size.h, 'rounded', 7))
    cloth.push(plate(rect(size.h - 46, size.w - 14, 8), front - 1.2, 1.6, 0, size.h / 2))
    // A tweeter up the top and a woofer down the bottom, behind the cloth.
    dark.push(socket(32, 3, front - 3.4, size.h * 0.76, 0))
    dark.push(socket(64, 3, front - 3.4, size.h * 0.34, 0))
    if (controls) {
      knobs.push(socket(18, 8, front - 5, 30, size.w * 0.16))
      lamps.push(box(4, 5, 5, front - 3, 30, -size.w * 0.18))
    }
  } else {
    // A cabinet with a moulded ring round the driver and the mesh sunk inside
    // it, and the controls in a strip along the bottom.
    shell.push(profiledBoard(rect(size.d, size.w, 12), 0, size.h, 'rounded', 9))
    const dia = Math.min(size.w - 26, size.h * 0.5)
    const cy = size.h * 0.58
    const surround = sweep(
      plan(circle(dia + 20)),
      [
        { inset: 0, y: 7 },
        { inset: 0, y: 0 },
        { inset: 10, y: 0 },
        { inset: 10, y: 7 },
      ],
      true,
    )
    if (surround) {
      faceForward(surround)
      surround.translate(front, cy, 0)
      shell.push(surround)
    }
    cloth.push(socket(dia + 6, 4, front - 4, cy, 0))
    dark.push(socket(dia * 0.3, 2, front - 5, cy, 0))
    const strip = 34
    dark.push(box(4, strip, size.w - 18, front - 1, 9, -(size.w - 18) / 2))
    for (let i = 0; i < 3; i++) {
      knobs.push(socket(13, 7, front - 6, 9 + strip * 0.6, -size.w * 0.3 + i * 18))
    }
    lamps.push(box(4, 5, 5, front - 4, 9 + strip * 0.6, size.w * 0.06))
    knobs.push(box(6, 13, 18, front - 5, 9 + strip * 0.3, size.w * 0.18))
  }
  return { shell, cloth, dark, knobs, lamps }
}

/** A desktop keyboard of the period, built about the origin. */
function keyboard(pitch) {
  const columns = 17
  const rows = 6
  const width = (columns + 5.2) * pitch
  const depth = rows * pitch + 12
  const height = 26
  const outline = plan(rect(depth + 26, width + 30, 8))
  const shell = [
    sweep(outline, [{ inset: 0, y: height }, { inset: 0, y: 0 }], false),
    face([outline.pts], height, true),
    face([outline.pts], 0, false),
  ]
  const keys = []
  for (let r = 0; r < rows; r++) {
    const x = -depth / 2 + r * pitch
    if (r === 0) {
      keys.push(box(pitch * 0.82, 7, pitch * 6, x, height, -pitch * 3))
      for (const side of [-1, 1]) keys.push(box(pitch * 0.82, 7, pitch * 1.5, x, height, side * pitch * 4))
      continue
    }
    for (let c = 0; c < columns; c++) {
      const z = -width / 2 + c * pitch + ((rows - r) % 3) * pitch * 0.25
      if (z + pitch > width / 2 - pitch * 5.4) continue
      keys.push(box(pitch * 0.82, 7, pitch * 0.84, x, height, z))
    }
    for (let c = 0; c < 4; c++) {
      keys.push(box(pitch * 0.82, 7, pitch * 0.84, x, height, width / 2 - pitch * 4.4 + c * pitch))
    }
  }
  return { shell: merge(shell.filter(Boolean)), keys: merge(keys) }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const board = BOARD[str(p, 'board')] ?? BOARD.atx
  const bays525 = Math.round(num(p, 'bays525'))
  const bays35 = Math.round(num(p, 'bays35'))
  const hardDisks = Math.round(num(p, 'hardDisks'))
  const finish = FINISH[str(p, 'finish')] ?? FINISH.beige
  const cutaway = bool(p, 'cutaway')
  const isaCards = Math.min(Math.round(num(p, 'isaCards')), board.isa)
  const pciCards = Math.min(Math.round(num(p, 'pciCards')), board.pci)

  const { W, D, H } = caseSize(board, bays525, bays35, hardDisks)
  const front = -D / 2
  const back = D / 2
  const wall = 2.5
  const radius = 6
  // The panel that comes off is the one you end up looking at, once the machine
  // is turned round at the end of the build.
  const OPEN = -1

  const shell = []
  const bezel = []
  const detail = []
  const dark = []
  const metal = []
  const boards = []
  const slotsMetal = []
  const lamps = []
  const glass = []
  const speakerShell = []
  const cloth = []
  const parts = []

  // --- Case ---------------------------------------------------------------
  const outline = rect(D, W, radius)
  shell.push(profiledBoard(outline, 0, wall * 2, 'rounded', 3))
  shell.push(profiledBoard(outline, H - wall * 2, wall * 2, 'rounded', 3))
  for (const side of [-1, 1]) {
    if (cutaway && side === OPEN) continue
    shell.push(box(D, H, wall * 2, front, 0, side * (W / 2) - (side > 0 ? wall * 2 : 0)))
  }
  shell.push(box(wall * 2, H, W, back - wall * 2, 0, -W / 2))

  // --- Front bezel --------------------------------------------------------
  const bezelDepth = 12
  const relief = 1.8
  bezel.push(plate(rect(H, W, radius), front - bezelDepth, bezelDepth, 4, H / 2))

  // Openings, stacked from the top: the 5¼" block, then the 3½" block.
  let y = H - 30
  const openings = []
  for (let i = 0; i < bays525; i++) {
    y -= BAY.ext525.h
    openings.push({ y: y + BAY.ext525.h / 2, h: BAY.ext525.h, w: BAY.ext525.w, big: true })
    y -= 4
  }
  y -= 10
  for (let i = 0; i < bays35; i++) {
    y -= BAY.ext35.h
    openings.push({ y: y + BAY.ext35.h / 2, h: BAY.ext35.h, w: BAY.ext35.w, big: false })
    y -= 4
  }

  const wanted = []
  for (let i = 0; i < Math.round(num(p, 'optical')); i++) wanted.push('optical')
  if (bool(p, 'tapeDrive')) wanted.push('tape')
  const smallWanted = bool(p, 'floppy') ? ['floppy'] : []
  let bigIndex = 0
  let smallIndex = 0
  let fitted = 0
  for (const opening of openings) {
    const kind = opening.big
      ? wanted[bigIndex++] ?? 'blank'
      : smallWanted[smallIndex++] ?? 'blank'
    if (kind !== 'blank') fitted++
    const piece = fascia(kind, opening.h - 2.5, opening.w, relief)
    const at = new THREE.Matrix4().makeTranslation(front - bezelDepth, opening.y, 0)
    piece.plastic.applyMatrix4(at)
    piece.detail.applyMatrix4(at)
    bezel.push(piece.plastic)
    dark.push(piece.detail)
    if (cutaway && kind !== 'blank') {
      metal.push(
        box(opening.big ? 190 : 150, opening.h - 5, opening.w - 8, front + 12, opening.y - (opening.h - 5) / 2, -(opening.w - 8) / 2),
      )
    }
  }

  // Buttons and lamps, down at the bottom where they went once the bays moved up.
  const panelY = Math.max(28, y - 40)
  detail.push(box(relief + 4, 16, 30, front - bezelDepth - relief - 2, panelY, -15))
  lamps.push(box(relief + 2, 4, 9, front - bezelDepth - relief, panelY + 26, -22))
  if (hardDisks > 0) lamps.push(box(relief + 2, 4, 9, front - bezelDepth - relief, panelY + 26, -4))
  if (bool(p, 'resetButton')) {
    detail.push(box(relief + 3, 8, 14, front - bezelDepth - relief - 1, panelY + 2, 20))
  }
  if (bool(p, 'badge')) {
    parts.push({
      name: 'badge',
      geometry: box(relief + 1, 18, 64, front - bezelDepth - relief, H - 22, -32),
      color: 0x2f4f7a,
    })
  }
  // Vents down the front, and the moulded strakes these cases all had.
  const strakes = []
  for (let i = 0; i < 5; i++) {
    strakes.push(box(relief + 2, 4, W * 0.5, front - bezelDepth - relief - 0.5, panelY - 20 - i * 8, -W * 0.25))
  }
  detail.push(merge(strakes))

  // --- Back: slots, supply, ports -----------------------------------------
  const slotBase = wall * 2 + 20
  const slotZ = OPEN * (W / 2 - 26)
  const totalSlots = board.isa + board.pci
  for (let i = 0; i < totalSlots; i++) {
    const filled = i < board.isa ? i < isaCards : i - board.isa < pciCards
    slotsMetal.push(box(wall * 2, 18, SLOT_PITCH - 2, back - wall * 4, slotBase + i * SLOT_PITCH, slotZ - 9))
    if (filled) {
      dark.push(box(4, 9, 26, back - wall * 5, slotBase + i * SLOT_PITCH + 4, slotZ - 13))
    }
  }
  // The supply at the top, with its fan and kettle lead socket.
  dark.push(socket(80, 6, back - wall * 2 - 5, H - PSU_HEIGHT / 2 - 20, 0))
  dark.push(box(6, 28, 34, back - wall * 2 - 5, H - 40, W / 2 - 60))
  // The board's port block, which is what ATX brought.
  if (str(p, 'board') !== 'babyAt') {
    dark.push(box(5, 44, 158, back - wall * 2 - 4, slotBase + totalSlots * SLOT_PITCH + 10, -79))
  }

  // --- Innards ------------------------------------------------------------
  if (cutaway) {
    const mbZ = -OPEN * (W / 2 - 14)
    const stand = (thickness, gap = 4) => (OPEN > 0 ? mbZ + gap : mbZ - gap - thickness)
    boards.push(box(board.d, board.h, 1.6, back - 40 - board.d, slotBase - 12, mbZ))
    for (let i = 0; i < totalSlots; i++) {
      const filled = i < board.isa ? i < isaCards : i - board.isa < pciCards
      if (!filled) continue
      const length = i < board.isa ? Math.min(330, D - 90) : Math.min(240, D - 90)
      boards.push(box(length, 1.6, CARD_HEIGHT, back - 16 - length, slotBase + i * SLOT_PITCH + 12, stand(CARD_HEIGHT)))
    }
    metal.push(box(150, PSU_HEIGHT, Math.min(140, W - 24), back - 160, H - PSU_HEIGHT - wall * 2 - 6, -W / 2 + 12))
    metal.push(box(70, 44, 70, back - 150, slotBase + board.h * 0.5, stand(70)))
    for (let i = 0; i < hardDisks; i++) {
      metal.push(box(146, BAY.int35.h - 2, 101.6, front + 30, 30 + i * BAY.int35.h, -50))
    }
  }

  // --- Stand it where it goes ---------------------------------------------
  //
  // Everything above belongs to the tower: it stands on its feet, and beside
  // the monitor rather than under it. Everything after this is desk furniture
  // and stays where it is.
  const display = str(p, 'display')
  const monitor = displaySize(display)
  const speakerKind = str(p, 'speakers')
  const spk = SPEAKER[speakerKind] ?? null
  // The desk is laid out from the middle: the monitor, a speaker either side of
  // it, and the tower beyond the lot rather than through any of it.
  const deskHalf = monitor ? monitor.caseW / 2 : 150
  const speakerZ = spk ? deskHalf + 30 + spk.w / 2 : 0
  const deskEdge = spk ? speakerZ + spk.w / 2 : deskHalf
  const stand = bool(p, 'feet') ? 5 : 0
  const towerZ = !monitor && !spk ? 0 : -(W / 2 + deskEdge + 60)
  for (const list of [shell, bezel, detail, dark, metal, boards, slotsMetal, lamps]) {
    for (const g of list) if (g) g.translate(0, stand, towerZ)
  }
  for (const part of parts) part.geometry.translate(0, stand, towerZ)
  if (stand > 0) {
    for (const sx of [front + 30, back - 30]) {
      for (const sz of [-W / 2 + 18, W / 2 - 18]) {
        detail.push(box(30, stand, 22, sx - 15, 0, sz - 11 + towerZ))
      }
    }
  }

  const monitorFront = front + 40
  if (monitor) {
    const { screenW, screenH, caseW, caseH, depth } = monitor
    const stand = 40

    // The case, and the funnel behind it drawn in to the neck. Both rims are
    // drawn as outlines in their own right, so the walls and the cap over them
    // are the same shape.
    // Both rims are drawn as outlines in their own right, straight from `rect`
    // rather than through `plan`: the two have to correspond point for point,
    // and `plan` hulls what it is given, which is free to start the ring
    // somewhere else and twist the loft.
    const corner = 16
    const neck = Math.min(caseH, caseW) * 0.26
    const frontRim = rect(caseH, caseW, corner)
    const backRim = rect(
      Math.max(60, caseH - neck * 2),
      Math.max(60, caseW - neck * 2),
      Math.max(2, corner - neck * 0.25),
    )
    const aperture = ring(rect(screenH, screenW, 12)).slice().reverse()
    const body = faceForward(
      merge(
        [
          loft(frontRim, depth, frontRim, depth * 0.62),
          loft(frontRim, depth * 0.62, backRim, 0),
          face([frontRim, aperture], depth, true),
          face([backRim], 0, false),
        ].filter(Boolean),
      ),
    )
    body.translate(monitorFront + depth, stand + caseH / 2, 0)
    shell.push(body)
    glass.push(plate(rect(screenH, screenW, 12), monitorFront - 0.5, 4, 0, stand + caseH / 2))
    shell.push(profiledBoard(rect(depth * 0.62, caseW * 0.8, 10), 0, stand, 'rounded', 8).translate(monitorFront + depth * 0.45, 0, 0))
    // The controls along the bottom of the bezel.
    for (let i = 0; i < 5; i++) {
      detail.push(box(6, 8, 14, monitorFront - 5, stand + 12, -caseW * 0.3 + i * 22))
    }
  }

  if (spk) {
    for (const side of [-1, 1]) {
      // A cheap pair had the knobs on one of them; powered monitors each had
      // their own.
      const piece = speaker(speakerKind, side > 0 || speakerKind === 'monitors')
      const at = new THREE.Matrix4().makeTranslation(
        monitorFront + 40 + spk.d / 2,
        0,
        side * speakerZ,
      )
      for (const [list, into] of [
        [piece.shell, speakerShell],
        [piece.cloth, cloth],
        [piece.dark, dark],
        [piece.knobs, detail],
        [piece.lamps, lamps],
      ]) {
        for (const g of list) {
          if (!g) continue
          g.applyMatrix4(at)
          into.push(g)
        }
      }
    }
  }
  if (bool(p, 'keyboard')) {
    const kb = keyboard(19.05)
    for (const g of [kb.shell, kb.keys]) g.translate(front - 190, 0, 0)
    parts.push({ name: 'keyboard', geometry: kb.shell, color: finish.bezel })
    parts.push({ name: 'keycaps', geometry: kb.keys, color: finish.trim })
    const mouse = new THREE.SphereGeometry(1, 12, 9)
    mouse.scale(48, 24, 32)
    mouse.translate(front - 150, 24, 300)
    parts.push({ name: 'mouse', geometry: mouse, color: finish.bezel })
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
  add('slot-brackets', slotsMetal, COLOR.metal)
  add('chassis', metal, COLOR.metal)
  add('boards', boards, COLOR.board)
  add('speakers', speakerShell, finish.shell)
  add('speaker grilles', cloth, COLOR.cloth)
  add('lamps', lamps, COLOR.power)
  add('screen', glass, bool(p, 'screenOn') ? 0x9fb8d8 : COLOR.screen)

  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  // Swung round from -X to +Z, which is where the Front view looks from, so the
  // front of the machine is what the front view shows.
  for (const part of facing) part.geometry.rotateY(Math.PI / 2)
  return facing
}

export function metrics(p) {
  const board = BOARD[str(p, 'board')] ?? BOARD.atx
  const bays525 = Math.round(num(p, 'bays525'))
  const bays35 = Math.round(num(p, 'bays35'))
  const hardDisks = Math.round(num(p, 'hardDisks'))
  const { W, D, H, stack } = caseSize(board, bays525, bays35, hardDisks)

  const bigWanted = Math.round(num(p, 'optical')) + (bool(p, 'tapeDrive') ? 1 : 0)
  const smallWanted = bool(p, 'floppy') ? 1 : 0
  const isaCards = Math.round(num(p, 'isaCards'))
  const pciCards = Math.round(num(p, 'pciCards'))

  const rows = [
    {
      label: 'Case',
      value: `${formatLength(W)} × ${formatLength(D)} × ${formatLength(H)}`,
      note: `${board.label} board, ${formatLength(stack)} of drive stack, ${formatLength(PSU_HEIGHT)} of supply.`,
    },
    { label: 'Board', value: `${board.label} — ${formatLength(board.d)} × ${formatLength(board.h)}, ${board.isa} ISA and ${board.pci} PCI` },
    {
      label: '5¼" openings',
      value: `${Math.min(bigWanted, bays525)} of ${bays525} used`,
      level: bigWanted > bays525 ? 'warn' : 'ok',
      note: bigWanted > bays525 ? 'More drives than openings. Add a bay — the case grows 41.3 mm for each.' : undefined,
    },
    {
      label: '3½" openings',
      value: `${Math.min(smallWanted, bays35)} of ${bays35} used`,
      level: smallWanted > bays35 ? 'warn' : 'ok',
      note: smallWanted > bays35 ? 'Nowhere to put the floppy.' : undefined,
    },
    {
      label: 'Cards',
      value: `${Math.min(isaCards, board.isa)} ISA, ${Math.min(pciCards, board.pci)} PCI`,
      level: isaCards > board.isa || pciCards > board.pci ? 'warn' : 'ok',
      note:
        isaCards > board.isa || pciCards > board.pci
          ? `This board has ${board.isa} ISA and ${board.pci} PCI slots.`
          : undefined,
    },
    { label: 'Floor taken', value: `${((W * D) / 1e6).toFixed(2)} m²` },
  ]
  const spk = SPEAKER[str(p, 'speakers')]
  if (spk) {
    rows.push({
      label: 'Speakers',
      value: `${spk.label} — ${formatLength(spk.w)} × ${formatLength(spk.d)} × ${formatLength(spk.h)} each`,
    })
  }
  return rows
}

export const presets = [
  {
    name: '1995 multimedia bundle',
    params: {
      board: 'babyAt', isaCards: 2, pciCards: 1, bays525: 2, optical: 1, bays35: 1,
      floppy: true, hardDisks: 1, finish: 'beige', speakers: 'compact', display: 'crt14',
      keyboard: true, resetButton: true,
    },
  },
  {
    name: '1997 office ATX',
    params: {
      board: 'atx', isaCards: 1, pciCards: 2, bays525: 2, optical: 1, bays35: 1,
      floppy: true, hardDisks: 1, finish: 'putty', speakers: 'tower', display: 'crt15',
      keyboard: true,
    },
  },
  {
    name: '1999 CD-burner tower',
    params: {
      board: 'atx', isaCards: 1, pciCards: 4, bays525: 3, optical: 2, tapeDrive: false,
      bays35: 1, floppy: true, hardDisks: 2, finish: 'white', speakers: 'monitors',
      display: 'crt17', screenOn: true, keyboard: true,
    },
  },
  {
    name: '2000 small footprint',
    params: {
      board: 'microAtx', isaCards: 0, pciCards: 2, bays525: 1, optical: 1, bays35: 1,
      floppy: true, hardDisks: 1, finish: 'putty', speakers: 'none', display: 'crt15',
      keyboard: true, badge: false,
    },
  },
  {
    name: '1998 workshop machine, open',
    params: {
      board: 'atx', isaCards: 2, pciCards: 3, bays525: 3, optical: 1, tapeDrive: true,
      bays35: 2, floppy: true, hardDisks: 3, finish: 'beige', cutaway: true,
      speakers: 'none', display: 'none', keyboard: false,
    },
  },
]
