// Gaming tower, 2002–2012.
//
// Black steel and acrylic, and built around a graphics card that had grown into
// the biggest single thing in the case. The floppy has gone, the supply has
// moved to the floor of it, and the fans are the point rather than an
// afterthought.
//
// Sized the way the real ones were:
//
//   depth  = board front to back + the cage at the front and the ports behind
//   width  = a card standing off the board, plus the panel either side
//   height = board, supply, and however many 5¼" and 3½" bays were asked for
//
// Built with the front at -X and turned to face +X at the end. +Z is width,
// +Y is up, the floor is Y = 0.

export const meta = {
  order: 11,
  name: 'Gaming tower',
  description:
    'The 2002–12 black ATX tower — sized from its board and bays, with a double-height graphics card, PCI and PCI Express, a windowed side panel and the fans to go with it.',
}

const BOARD = {
  atx: { label: 'ATX', d: 305, h: 244, slots: 7 },
  microAtx: { label: 'microATX', d: 244, h: 244, slots: 4 },
  miniItx: { label: 'mini-ITX', d: 170, h: 170, slots: 1 },
}

const BAY = {
  ext525: { h: 41.3, w: 146 },
  ext35: { h: 25.4, w: 101.6 },
  int35: { h: 26, w: 101.6 },
}

const CARD_HEIGHT = 106.7
const PSU_HEIGHT = 86
const SLOT_PITCH = 20.32

const FINISH = {
  black: { shell: 0x2f3237, bezel: 0x26292d, trim: 0x8e959c, accent: 0x9aa1a8 },
  gunmetal: { shell: 0x4a4e55, bezel: 0x40444a, trim: 0xa8afb6, accent: 0xb9c0c7 },
  silver: { shell: 0xb9bec4, bezel: 0xaab0b6, trim: 0x5f656b, accent: 0x6f757b },
  red: { shell: 0x2f3237, bezel: 0x26292d, trim: 0x8e959c, accent: 0xc0392b },
}

const COLOR = {
  metal: 0xa9b0b6,
  board: 0x24333f,
  card: 0x1e2a33,
  dark: 0x1c1f22,
  window: 0x39424b,
  led: 0x4fa8f0,
  activity: 0xd8a13a,
  copper: 0xb87333,
  screen: 0x1e2124,
}

export const params = [
  // --- Board --------------------------------------------------------------
  {
    id: 'board',
    label: 'Board',
    type: 'select',
    default: 'atx',
    group: 'Board',
    help: 'Sets the footprint, the height of the case and how many slots there are.',
    options: [
      { value: 'atx', label: 'ATX — 305 × 244 mm, 7 slots' },
      { value: 'microAtx', label: 'microATX — 244 × 244 mm, 4 slots' },
      { value: 'miniItx', label: 'mini-ITX — 170 × 170 mm, 1 slot' },
    ],
  },
  { id: 'graphicsCard', label: 'Graphics card', type: 'boolean', default: true, group: 'Board', help: 'Double height with its own cooler, and it takes two slots.' },
  { id: 'cards', label: 'Other cards', type: 'int', min: 0, max: 5, step: 1, default: 1, group: 'Board', help: 'Sound, network, capture, or a second graphics card.' },
  { id: 'cutaway', label: 'Side panel off', type: 'boolean', default: false, group: 'Board' },

  // --- Drives -------------------------------------------------------------
  { id: 'bays525', label: '5¼" openings', type: 'int', min: 0, max: 4, step: 1, default: 2, group: 'Drives', help: '41.3 mm of case height each.' },
  { id: 'optical', label: 'Optical drives', type: 'int', min: 0, max: 2, step: 1, default: 1, group: 'Drives', help: 'DVD, then Blu-ray. The same tray from the outside.' },
  { id: 'fanController', label: 'Fan controller', type: 'boolean', default: false, group: 'Drives', help: 'In a 5¼" opening, with dials and a temperature readout.' },
  { id: 'cardReader', label: 'Card reader', type: 'boolean', default: true, group: 'Drives', help: 'In the 3½" opening the floppy used to have.' },
  { id: 'hardDisks', label: 'Hard disks', type: 'int', min: 0, max: 6, step: 1, default: 2, group: 'Drives', help: 'In the internal cage — 26 mm of height each.' },
  { id: 'ssd', label: 'Solid state drive', type: 'boolean', default: false, group: 'Drives', help: 'A 2½" drive on a bracket. The late fitment.' },

  // --- Cooling ------------------------------------------------------------
  { id: 'frontFan', label: 'Front fan', type: 'boolean', default: true, group: 'Cooling' },
  { id: 'rearFan', label: 'Rear fan', type: 'boolean', default: true, group: 'Cooling' },
  { id: 'topFan', label: 'Top fan', type: 'boolean', default: false, group: 'Cooling' },
  { id: 'fanSize', label: 'Fan size', type: 'number', min: 80, max: 140, step: 20, default: 120, unit: 'mm', group: 'Cooling' },

  // --- Case ---------------------------------------------------------------
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'black',
    group: 'Case',
    options: [
      { value: 'black', label: 'Black' },
      { value: 'gunmetal', label: 'Gunmetal' },
      { value: 'silver', label: 'Silver' },
      { value: 'red', label: 'Black with red trim' },
    ],
  },
  { id: 'window', label: 'Windowed side panel', type: 'boolean', default: true, group: 'Case', visibleWhen: (p) => !bool(p, 'cutaway') },
  { id: 'frontMesh', label: 'Mesh front', type: 'boolean', default: true, group: 'Case' },
  { id: 'frontPorts', label: 'Ports on the front', type: 'boolean', default: true, group: 'Case' },

  // --- Desk ---------------------------------------------------------------
  {
    id: 'display',
    label: 'Monitor',
    type: 'select',
    default: 'wide22',
    group: 'Desk',
    options: [
      { value: 'none', label: 'None' },
      { value: 'crt19', label: '19″ tube — the last of them' },
      { value: 'wide19', label: '19″ flat panel' },
      { value: 'wide22', label: '22″ widescreen panel' },
      { value: 'wide27', label: '27″ widescreen panel' },
    ],
  },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: false, group: 'Desk', visibleWhen: (p) => str(p, 'display') !== 'none' },
  { id: 'keyboard', label: 'Keyboard and mouse', type: 'boolean', default: true, group: 'Desk' },
]

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

function caseSize(board, bays525, cardReader, hardDisks) {
  const stack = bays525 * BAY.ext525.h + (cardReader ? BAY.ext35.h : 0) + hardDisks * BAY.int35.h
  return {
    W: CARD_HEIGHT + 88,
    D: board.d + 130,
    H: Math.max(board.h + 70, stack + 90) + PSU_HEIGHT + 24,
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

/**
 * A cylinder lying along the depth — a button, a socket, a dial. Built at the
 * origin and then moved, because rotating one already in place would swing it
 * about the middle of the case instead of its own.
 */
function socket(diameter, length, x, y, z) {
  const g = post(diameter, length, 0, 0, 0, 12)
  g.rotateZ(-Math.PI / 2)
  g.translate(x, y, z)
  return g
}

/** A fan, facing along X, built about the origin. */
function fan(size, blades = 9) {
  const parts = [post(size * 0.28, 5, 0, -2.5, 0, 14)]
  for (let i = 0; i < blades; i++) {
    const blade = box(size * 0.34, 2.5, size * 0.13, size * 0.11, -1.25, -size * 0.065)
    blade.rotateY((Math.PI * 2 * i) / blades)
    parts.push(blade)
  }
  // The frame around it.
  const frame = sweep(
    plan(rect(size, size, size * 0.16)),
    [
      { inset: 0, y: 4 },
      { inset: 0, y: -4 },
      { inset: 7, y: -4 },
      { inset: 7, y: 4 },
    ],
    true,
  )
  const g = merge([...parts, frame].filter(Boolean))
  g.rotateZ(Math.PI / 2)
  return g
}

/** A drive fascia, built about the origin facing -X. */
function fascia(kind, height, width, relief) {
  const plastic = box(relief, height, width, -relief, -height / 2, -width / 2)
  const detail = []
  if (kind === 'optical') {
    detail.push(box(relief + 2, 3, width * 0.84, -relief - 1, height * 0.06, -width * 0.42))
    detail.push(box(relief + 2, 4, 10, -relief - 1, -height * 0.3, width * 0.3))
  } else if (kind === 'reader') {
    for (let i = 0; i < 4; i++) {
      detail.push(box(relief + 2, 3, 16, -relief - 1, -height * 0.24 + i * 6, -width * 0.4 + i * 22))
    }
  } else if (kind === 'controller') {
    detail.push(box(relief + 2, height * 0.44, width * 0.42, -relief - 1, -height * 0.1, -width * 0.44))
    for (let i = 0; i < 4; i++) {
      detail.push(socket(14, relief + 4, -relief - 3, -height * 0.1, width * 0.06 + i * 17))
    }
  } else {
    detail.push(box(relief + 0.5, height * 0.5, width * 0.86, -relief - 0.25, -height * 0.25, -width * 0.43))
  }
  return { plastic, detail: merge(detail) }
}

function keyboard(pitch) {
  const columns = 17
  const rows = 6
  const width = (columns + 5.2) * pitch
  const depth = rows * pitch + 10
  const height = 20
  const outline = plan(rect(depth + 22, width + 26, 6))
  const shell = [
    sweep(outline, [{ inset: 0, y: height }, { inset: 0, y: 0 }], false),
    face([outline.pts], height, true),
    face([outline.pts], 0, false),
  ]
  const keys = []
  for (let r = 0; r < rows; r++) {
    const x = -depth / 2 + r * pitch
    if (r === 0) {
      keys.push(box(pitch * 0.84, 6, pitch * 6, x, height, -pitch * 3))
      for (const side of [-1, 1]) keys.push(box(pitch * 0.84, 6, pitch * 1.5, x, height, side * pitch * 4))
      continue
    }
    for (let c = 0; c < columns; c++) {
      const z = -width / 2 + c * pitch + ((rows - r) % 3) * pitch * 0.25
      if (z + pitch > width / 2 - pitch * 5.4) continue
      keys.push(box(pitch * 0.84, 6, pitch * 0.86, x, height, z))
    }
    for (let c = 0; c < 4; c++) {
      keys.push(box(pitch * 0.84, 6, pitch * 0.86, x, height, width / 2 - pitch * 4.4 + c * pitch))
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
  const cardReader = bool(p, 'cardReader')
  const hardDisks = Math.round(num(p, 'hardDisks'))
  const finish = FINISH[str(p, 'finish')] ?? FINISH.black
  const cutaway = bool(p, 'cutaway')
  const graphics = bool(p, 'graphicsCard')
  const otherCards = Math.round(num(p, 'cards'))
  const fanSize = num(p, 'fanSize')

  const { W, D, H } = caseSize(board, bays525, cardReader, hardDisks)
  const front = -D / 2
  const back = D / 2
  const wall = 2.5
  const radius = 4
  const OPEN = -1

  const shell = []
  const bezel = []
  const detail = []
  const dark = []
  const metal = []
  const boards = []
  const glassy = []
  const lamps = []
  const screen = []
  const parts = []

  // --- Case ---------------------------------------------------------------
  const outline = rect(D, W, radius)
  shell.push(profiledBoard(outline, 0, wall * 2, 'chamfer', 2))
  shell.push(profiledBoard(outline, H - wall * 2, wall * 2, 'chamfer', 2))
  for (const side of [-1, 1]) {
    if (cutaway && side === OPEN) continue
    if (side === OPEN && bool(p, 'window')) {
      // A window cut in the near panel, with acrylic in it.
      const frame = box(D, H, wall * 2, front, 0, side * (W / 2))
      shell.push(frame)
      glassy.push(box(1.5, H * 0.62, D * 0.66, front + D * 0.2, H * 0.2, side * (W / 2) + 0.5))
      continue
    }
    shell.push(box(D, H, wall * 2, front, 0, side * (W / 2) - (side > 0 ? wall * 2 : 0)))
  }
  shell.push(box(wall * 2, H, W, back - wall * 2, 0, -W / 2))

  // --- Front --------------------------------------------------------------
  const bezelDepth = 16
  const relief = 1.2
  bezel.push(plate(rect(H, W, radius), front - bezelDepth, bezelDepth, 3, H / 2))

  let y = H - 24
  const openings = []
  for (let i = 0; i < bays525; i++) {
    y -= BAY.ext525.h
    openings.push({ y: y + BAY.ext525.h / 2, h: BAY.ext525.h, w: BAY.ext525.w, big: true })
    y -= 3
  }
  if (cardReader) {
    y -= BAY.ext35.h + 6
    openings.push({ y: y + BAY.ext35.h / 2, h: BAY.ext35.h, w: BAY.ext35.w, big: false })
  }

  const wanted = []
  for (let i = 0; i < Math.round(num(p, 'optical')); i++) wanted.push('optical')
  if (bool(p, 'fanController')) wanted.push('controller')
  let bigIndex = 0
  for (const opening of openings) {
    const kind = opening.big ? wanted[bigIndex++] ?? 'blank' : 'reader'
    const piece = fascia(kind, opening.h - 2, opening.w, relief)
    const at = new THREE.Matrix4().makeTranslation(front - bezelDepth, opening.y, 0)
    piece.plastic.applyMatrix4(at)
    piece.detail.applyMatrix4(at)
    bezel.push(piece.plastic)
    dark.push(piece.detail)
    if (cutaway && kind !== 'blank') {
      metal.push(box(opening.big ? 180 : 130, opening.h - 4, opening.w - 8, front + 14, opening.y - (opening.h - 4) / 2, -(opening.w - 8) / 2))
    }
  }

  // Mesh over the lower front, where the intake is.
  const meshTop = Math.max(40, y - 20)
  if (bool(p, 'frontMesh')) {
    const mesh = []
    for (let i = 0; i * 12 < meshTop - 30; i++) {
      mesh.push(box(relief + 2, 6, W * 0.62, front - bezelDepth - relief - 1, 24 + i * 12, -W * 0.31))
    }
    dark.push(merge(mesh))
  }
  // Power button, lamps and the ports on the front.
  detail.push(socket(26, relief + 6, front - bezelDepth - relief - 4, meshTop + 4, -W * 0.22))
  lamps.push(box(relief + 2, 4, 8, front - bezelDepth - relief, meshTop + 22, -W * 0.24))
  if (hardDisks > 0) lamps.push(box(relief + 2, 4, 8, front - bezelDepth - relief, meshTop + 22, -W * 0.12))
  if (bool(p, 'frontPorts')) {
    for (let i = 0; i < 2; i++) {
      dark.push(box(relief + 3, 7, 14, front - bezelDepth - relief - 1, meshTop + 2, W * 0.06 + i * 20))
    }
    for (let i = 0; i < 2; i++) {
      dark.push(socket(9, relief + 3, front - bezelDepth - relief - 1.5, meshTop - 14, W * 0.09 + i * 16))
    }
  }

  // --- Back ---------------------------------------------------------------
  const slotBase = wall * 2 + PSU_HEIGHT + 24
  const slotZ = OPEN * (W / 2 - 30)
  const slotsUsed = Math.min(board.slots, (graphics ? 2 : 0) + otherCards)
  for (let i = 0; i < board.slots; i++) {
    metal.push(box(wall * 2, 18, SLOT_PITCH - 2, back - wall * 4, slotBase + i * SLOT_PITCH, slotZ - 9))
    if (i < slotsUsed) {
      dark.push(box(4, 9, 24, back - wall * 5, slotBase + i * SLOT_PITCH + 4, slotZ - 12))
    }
  }
  // The port block, and the supply down at the floor of the case.
  dark.push(box(5, 44, 160, back - wall * 2 - 4, slotBase + board.slots * SLOT_PITCH + 12, -80))
  dark.push(box(6, 30, 26, back - wall * 2 - 5, wall * 2 + 24, W / 2 - 60))
  if (bool(p, 'rearFan')) {
    const g = fan(fanSize)
    g.translate(back - wall * 2 - 4, slotBase + board.slots * SLOT_PITCH + 12 + fanSize / 2 + 6, W / 2 - fanSize / 2 - 24)
    detail.push(g)
  }
  if (bool(p, 'frontFan')) {
    const g = fan(fanSize)
    g.translate(front + 22, Math.max(fanSize / 2 + 20, meshTop / 2), 0)
    detail.push(g)
  }
  if (bool(p, 'topFan')) {
    const g = fan(fanSize)
    g.rotateZ(Math.PI / 2)
    g.translate(back - 140, H - wall * 2 - 4, 0)
    detail.push(g)
  }

  // --- Innards ------------------------------------------------------------
  if (cutaway) {
    const mbZ = -OPEN * (W / 2 - 16)
    const stand = (thickness, gap = 5) => (OPEN > 0 ? mbZ + gap : mbZ - gap - thickness)
    boards.push(box(board.d, board.h, 1.6, back - 46 - board.d, slotBase - 14, mbZ))
    let slot = 0
    if (graphics) {
      const length = Math.min(270, D - 120)
      boards.push(box(length, 1.6, CARD_HEIGHT, back - 20 - length, slotBase + 14, stand(CARD_HEIGHT)))
      // The cooler hanging off it, and the fan in that.
      metal.push(box(length * 0.8, 38, CARD_HEIGHT * 0.86, back - 24 - length * 0.82, slotBase - 24, stand(CARD_HEIGHT * 0.86)))
      const g = fan(70)
      g.rotateZ(Math.PI / 2)
      g.translate(back - 40 - length * 0.5, slotBase - 26, stand(0, CARD_HEIGHT * 0.5))
      metal.push(g)
      slot = 2
    }
    for (let i = 0; i < otherCards && slot + i < board.slots; i++) {
      const length = Math.min(180, D - 140)
      boards.push(box(length, 1.6, CARD_HEIGHT * 0.8, back - 20 - length, slotBase + (slot + i) * SLOT_PITCH + 12, stand(CARD_HEIGHT * 0.8)))
    }
    // Supply on the floor, cooler on the processor, memory beside it.
    metal.push(box(150, PSU_HEIGHT, Math.min(150, W - 24), back - 170, wall * 2 + 4, -W / 2 + 12))
    metal.push(box(90, 130, 90, back - 150, slotBase + board.h * 0.35, stand(90)))
    for (let i = 0; i < 4; i++) {
      boards.push(box(6, 133, 32, back - 90 + i * 10, slotBase + board.h * 0.3, stand(32)))
    }
    for (let i = 0; i < hardDisks; i++) {
      metal.push(box(146, BAY.int35.h - 2, 101.6, front + 34, 120 + i * BAY.int35.h, -50))
    }
    if (bool(p, 'ssd')) metal.push(box(100, 7, 70, front + 40, 100, 20))
  }

  // --- Stand it where it goes ---------------------------------------------
  const display = str(p, 'display')
  const towerZ = display === 'none' ? 0 : -(W / 2 + 300)
  const stand = 12
  for (const list of [shell, bezel, detail, dark, metal, boards, glassy, lamps]) {
    for (const g of list) if (g) g.translate(0, stand, towerZ)
  }
  for (const part of parts) part.geometry.translate(0, stand, towerZ)
  for (const sx of [front + 40, back - 40]) {
    for (const sz of [-W / 2 + 20, W / 2 - 20]) {
      detail.push(box(46, stand, 26, sx - 23, 0, sz - 13 + towerZ))
    }
  }

  // --- Desk ---------------------------------------------------------------
  if (display !== 'none') {
    const crt = display === 'crt19'
    const inches = display === 'wide27' ? 27 : display === 'wide22' ? 22 : 19
    const diagonal = inches * 25.4
    const wide = !crt && display !== 'wide19'
    const screenW = diagonal * (wide ? 0.872 : 0.79)
    const screenH = diagonal * (wide ? 0.49 : 0.59)
    const surround = crt ? 26 : 16
    const caseW = screenW + surround * 2
    const caseH = screenH + surround * 2
    const monitorFront = front + 60

    if (crt) {
      const depth = Math.max(400, screenW * 0.95)
      const faceOutline = plan(rect(caseH, caseW, 14))
      const neck = Math.min(caseH, caseW) * 0.26
      const aperture = ring(rect(screenH, screenW, 10)).slice().reverse()
      const body = faceForward(
        merge(
          [
            sweep(faceOutline, [{ inset: 0, y: depth }, { inset: 0, y: depth * 0.62 }, { inset: neck, y: 0 }], false),
            face([faceOutline.pts, aperture], depth, true),
            face([hull(faceOutline.offset(neck))], 0, false),
          ].filter(Boolean),
        ),
      )
      body.translate(monitorFront + depth, 46 + caseH / 2, 0)
      shell.push(body)
      screen.push(plate(rect(screenH, screenW, 10), monitorFront - 0.5, 4, 0, 46 + caseH / 2))
      shell.push(profiledBoard(rect(depth * 0.6, caseW * 0.78, 10), 0, 46, 'rounded', 8).translate(monitorFront + depth * 0.45, 0, 0))
    } else {
      const neck = Math.max(120, screenH * 0.42)
      shell.push(plate(rect(caseH, caseW, 8), monitorFront, 46, 6, neck + caseH / 2))
      screen.push(plate(rect(screenH, screenW, 6), monitorFront - 0.5, 4, 0, neck + caseH / 2))
      shell.push(box(50, neck, caseW * 0.12, monitorFront + 40, 0, -caseW * 0.06))
      shell.push(profiledBoard(rect(190, 260, 10), 0, 14, 'rounded', 5).translate(monitorFront + 60, 0, 0))
    }
  }
  if (bool(p, 'keyboard')) {
    const kb = keyboard(19.05)
    for (const g of [kb.shell, kb.keys]) g.translate(front - 200, 0, 0)
    parts.push({ name: 'keyboard', geometry: kb.shell, color: finish.bezel })
    parts.push({ name: 'keycaps', geometry: kb.keys, color: finish.trim })
    const mouse = new THREE.SphereGeometry(1, 12, 9)
    mouse.scale(52, 21, 33)
    mouse.translate(front - 160, 21, 320)
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
  add('chassis', metal, COLOR.metal)
  add('boards', boards, COLOR.board)
  add('window', glassy, COLOR.window)
  add('lamps', lamps, str(p, 'finish') === 'red' ? finish.accent : COLOR.led)
  add('screen', screen, bool(p, 'screenOn') ? 0xb9d4ef : COLOR.screen)

  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  for (const part of facing) part.geometry.rotateY(Math.PI)
  return facing
}

export function metrics(p) {
  const board = BOARD[str(p, 'board')] ?? BOARD.atx
  const bays525 = Math.round(num(p, 'bays525'))
  const cardReader = bool(p, 'cardReader')
  const hardDisks = Math.round(num(p, 'hardDisks'))
  const { W, D, H, stack } = caseSize(board, bays525, cardReader, hardDisks)

  const graphics = bool(p, 'graphicsCard')
  const otherCards = Math.round(num(p, 'cards'))
  const slotsWanted = (graphics ? 2 : 0) + otherCards
  const opticalWanted = Math.round(num(p, 'optical')) + (bool(p, 'fanController') ? 1 : 0)
  const fans = (bool(p, 'frontFan') ? 1 : 0) + (bool(p, 'rearFan') ? 1 : 0) + (bool(p, 'topFan') ? 1 : 0)

  return [
    {
      label: 'Case',
      value: `${formatLength(W)} × ${formatLength(D)} × ${formatLength(H)}`,
      note: `${board.label} board, ${formatLength(stack)} of drive stack, ${formatLength(PSU_HEIGHT)} of supply.`,
    },
    { label: 'Board', value: `${board.label} — ${formatLength(board.d)} × ${formatLength(board.h)}, ${board.slots} slot${board.slots > 1 ? 's' : ''}` },
    {
      label: 'Slots',
      value: `${Math.min(slotsWanted, board.slots)} of ${board.slots} used${graphics ? ', two of them the graphics card' : ''}`,
      level: slotsWanted > board.slots ? 'warn' : 'ok',
      note:
        slotsWanted > board.slots
          ? `A double-height graphics card and ${otherCards} other card${otherCards === 1 ? '' : 's'} want ${slotsWanted} slots. This board has ${board.slots}.`
          : undefined,
    },
    {
      label: '5¼" openings',
      value: `${Math.min(opticalWanted, bays525)} of ${bays525} used`,
      level: opticalWanted > bays525 ? 'warn' : 'ok',
      note: opticalWanted > bays525 ? 'More drives than openings; each one added is 41.3 mm of case.' : undefined,
    },
    { label: 'Disks', value: `${hardDisks} × 3½"${bool(p, 'ssd') ? ' and a 2½" solid state' : ''}` },
    { label: 'Fans', value: `${fans} × ${formatLength(num(p, 'fanSize'))}${fans === 0 ? ' — good luck' : ''}`, level: fans === 0 ? 'warn' : 'ok' },
    { label: 'Floor taken', value: `${((W * D) / 1e6).toFixed(2)} m²` },
  ]
}

export const presets = [
  {
    name: '2003 first build',
    params: {
      board: 'atx', graphicsCard: true, cards: 2, bays525: 3, optical: 2, cardReader: false,
      hardDisks: 1, finish: 'silver', window: false, frontMesh: false, frontPorts: false,
      frontFan: true, rearFan: true, fanSize: 80, display: 'crt19', keyboard: true,
    },
  },
  {
    name: '2006 windowed rig',
    params: {
      board: 'atx', graphicsCard: true, cards: 1, bays525: 2, optical: 1, fanController: true,
      cardReader: true, hardDisks: 2, finish: 'black', window: true, frontMesh: true,
      frontPorts: true, frontFan: true, rearFan: true, topFan: true, fanSize: 120,
      display: 'wide22', screenOn: true, keyboard: true,
    },
  },
  {
    name: '2009 quiet build, open',
    params: {
      board: 'atx', graphicsCard: true, cards: 0, bays525: 2, optical: 1, cardReader: true,
      hardDisks: 3, ssd: false, finish: 'gunmetal', cutaway: true, frontMesh: true,
      frontFan: true, rearFan: true, fanSize: 140, display: 'none', keyboard: false,
    },
  },
  {
    name: '2011 small form factor',
    params: {
      board: 'microAtx', graphicsCard: true, cards: 0, bays525: 1, optical: 1,
      cardReader: true, hardDisks: 1, ssd: true, finish: 'black', window: false,
      frontMesh: true, frontPorts: true, frontFan: true, rearFan: true, fanSize: 120,
      display: 'wide22', keyboard: true,
    },
  },
  {
    name: '2012 red-trim tower',
    params: {
      board: 'atx', graphicsCard: true, cards: 2, bays525: 3, optical: 1, fanController: true,
      cardReader: true, hardDisks: 4, ssd: true, finish: 'red', window: true, frontMesh: true,
      frontPorts: true, frontFan: true, rearFan: true, topFan: true, fanSize: 140,
      display: 'wide27', screenOn: true, keyboard: true,
    },
  },
]
