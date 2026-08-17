// Integrated micro, 1977–1983.
//
// The other shape the first machines took: a monitor and a computer in one
// pressed-steel or moulded box, with the tape or the disks built into the same
// case. There is no expansion here either — what these had was a port at the
// back for a printer or a disk unit, and that was the lot.
//
// The case is sized by the tube. A cathode ray tube of a given diagonal is a
// given width, height and depth, and everything else is the margin the moulding
// needed around it, plus whatever the drives added along the bottom.
//
// Built with the front at -X and turned at the end to face +Z, which is where
// the studio's Front view looks from. Width then runs along X centred on zero,
// +Y is up, the desk is Y = 0.

export const meta = {
  order: 8,
  name: 'Integrated micro',
  description:
    'The 1977–83 all-in-one — a tube, a case moulded around it, and the tape deck or twin floppies built into the same box. Sized by the tube it was built around.',
}

const FINISH = {
  cream: { shell: 0xe3d9bd, bezel: 0xd9cdac, trim: 0x8b8271 },
  beige: { shell: 0xd6c9a4, bezel: 0xcabd97, trim: 0x7d7660 },
  putty: { shell: 0xcac4b2, bezel: 0xbfb9a6, trim: 0x6f6a5c },
  steel: { shell: 0xb8bcc0, bezel: 0xa7abb0, trim: 0x5f6469 },
  charcoal: { shell: 0x3a3d42, bezel: 0x33363b, trim: 0x8d949c },
}

const PHOSPHOR = { green: 0x64c47c, amber: 0xdb9a30, white: 0xd8d8d8, blue: 0x8fb6d8 }

const DARK = 0x22252a

// A tube of a given diagonal, in the 4:3 it always was, and about as deep as
// it was wide — which is what made these cases the shape they are.
function tubeSize(inches) {
  const diagonal = inches * 25.4
  return { w: diagonal * 0.8, h: diagonal * 0.6, d: diagonal * 0.78 }
}

export const params = [
  // --- Tube ---------------------------------------------------------------
  { id: 'tube', label: 'Tube', type: 'number', min: 5, max: 15, step: 0.5, default: 9, unit: '″', group: 'Tube', help: 'Diagonal. Nine inches was the usual; twelve made a much bigger box.' },
  {
    id: 'phosphor',
    label: 'Phosphor',
    type: 'select',
    default: 'green',
    group: 'Tube',
    options: [
      { value: 'green', label: 'Green — P1, the common one' },
      { value: 'amber', label: 'Amber — easier on the eyes, said the adverts' },
      { value: 'white', label: 'White — for the ones that drove a television tube' },
      { value: 'blue', label: 'Blue' },
    ],
  },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: true, group: 'Tube' },
  { id: 'hood', label: 'Screen hood', type: 'boolean', default: true, group: 'Tube', help: 'The brow moulded over the tube to keep the strip lights off it.' },
  { id: 'tilt', label: 'Screen tilt', type: 'number', min: 0, max: 16, step: 0.5, default: 6, unit: '°', group: 'Tube', help: 'How far the screen face leans back.' },

  // --- Case ---------------------------------------------------------------
  { id: 'margin', label: 'Moulding around the tube', type: 'number', min: 20, max: 140, step: 2, default: 62, unit: 'mm', group: 'Case' },
  { id: 'radius', label: 'Corner radius', type: 'number', min: 0, max: 70, step: 1, default: 22, unit: 'mm', group: 'Case' },
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'cream',
    group: 'Case',
    options: [
      { value: 'cream', label: 'Cream' },
      { value: 'beige', label: 'Beige' },
      { value: 'putty', label: 'Putty' },
      { value: 'steel', label: 'Pressed steel' },
      { value: 'charcoal', label: 'Charcoal' },
    ],
  },
  { id: 'vents', label: 'Vent slots', type: 'boolean', default: true, group: 'Case', help: 'Down the sides and across the back, because the tube ran hot.' },

  // --- Storage ------------------------------------------------------------
  {
    id: 'storage',
    label: 'Built-in storage',
    type: 'select',
    default: 'cassette',
    group: 'Storage',
    help: 'What was moulded into the case beside or below the tube.',
    options: [
      { value: 'none', label: 'None — a port at the back and nothing else' },
      { value: 'cassette', label: 'Cassette deck' },
      { value: 'floppy', label: 'Floppy drives' },
    ],
  },
  { id: 'floppies', label: '5¼" drives', type: 'int', min: 1, max: 2, step: 1, default: 2, group: 'Storage', visibleWhen: (p) => str(p, 'storage') === 'floppy' },
  {
    id: 'drivePlace',
    label: 'Where they sit',
    type: 'select',
    default: 'beside',
    group: 'Storage',
    visibleWhen: (p) => str(p, 'storage') !== 'none',
    options: [
      { value: 'beside', label: 'Beside the tube' },
      { value: 'below', label: 'Below the tube, across the front' },
    ],
  },

  // --- Keyboard -----------------------------------------------------------
  {
    id: 'keyboard',
    label: 'Keyboard',
    type: 'select',
    default: 'shelf',
    group: 'Keyboard',
    options: [
      { value: 'shelf', label: 'Built into a shelf on the front' },
      { value: 'separate', label: 'Separate, on a lead' },
      { value: 'none', label: 'None' },
    ],
  },
  { id: 'keyColumns', label: 'Columns', type: 'int', min: 10, max: 20, step: 1, default: 15, group: 'Keyboard', visibleWhen: (p) => str(p, 'keyboard') !== 'none' },
  { id: 'keyPitch', label: 'Key pitch', type: 'number', min: 12, max: 20, step: 0.05, default: 17.5, unit: 'mm', group: 'Keyboard', visibleWhen: (p) => str(p, 'keyboard') !== 'none' },
  { id: 'keypad', label: 'Numeric keypad', type: 'boolean', default: true, group: 'Keyboard', visibleWhen: (p) => str(p, 'keyboard') !== 'none' },

  // --- Back ---------------------------------------------------------------
  { id: 'parallelPort', label: 'Parallel port for a printer', type: 'boolean', default: true, group: 'Back' },
  { id: 'expansionPort', label: 'Expansion port for a disk unit', type: 'boolean', default: true, group: 'Back' },
]

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

/**
 * Stands a plan-built solid on its face. Everything the studio sweeps is built
 * in plan and grows upwards; a screen, a bezel or a front panel is that tipped
 * forward, so the outline's own x becomes height and its height becomes depth.
 */
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

/** A key block built flat about the origin, front row first. */
function keyBlock(columns, rows, pitch, keypad) {
  const keys = []
  const width = (columns + (keypad ? 4.6 : 0)) * pitch
  const depth = rows * pitch
  for (let r = 0; r < rows; r++) {
    const x = -depth / 2 + r * pitch
    if (r === 0) {
      keys.push(box(pitch * 0.82, 7, pitch * 5, x, 0, -pitch * 2.5))
      for (const side of [-1, 1]) {
        keys.push(box(pitch * 0.82, 7, pitch * 1.4, x, 0, side * pitch * 3.4))
      }
      continue
    }
    for (let c = 0; c < columns; c++) {
      const z = -width / 2 + c * pitch + ((rows - r) % 3) * pitch * 0.25
      if (z + pitch > width / 2) continue
      keys.push(box(pitch * 0.82, 7, pitch * 0.84, x, 0, z))
    }
    if (keypad) {
      for (let c = 0; c < 4; c++) {
        keys.push(box(pitch * 0.82, 7, pitch * 0.84, x, 0, width / 2 - pitch * 4.3 + c * pitch))
      }
    }
  }
  return { keys: merge(keys), width, depth }
}

/** A 5¼" drive fascia, built about the origin facing -X. */
function floppyFascia(relief) {
  const w = 146
  const h = 41.3
  const plastic = box(relief, h, w, -relief, -h / 2, -w / 2)
  const slot = box(relief + 2, 5, w * 0.7, -relief - 1, -h * 0.06, -w * 0.35)
  const lever = box(relief + 5, h * 0.4, w * 0.09, -relief - 4, -h * 0.42, -w * 0.05)
  return { plastic, detail: merge([slot, lever]) }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const tube = tubeSize(num(p, 'tube'))
  const margin = num(p, 'margin')
  const radius = num(p, 'radius')
  const finish = FINISH[str(p, 'finish')] ?? FINISH.cream
  const storage = str(p, 'storage')
  const beside = str(p, 'drivePlace') === 'beside' && storage !== 'none'
  const below = str(p, 'drivePlace') === 'below' && storage !== 'none'
  const tilt = (num(p, 'tilt') * Math.PI) / 180
  const keyStyle = str(p, 'keyboard')

  // --- Size, from the tube out --------------------------------------------
  const driveWidth = storage === 'floppy' ? 168 : storage === 'cassette' ? 150 : 0
  const driveHeight = storage === 'floppy' ? 41.3 * Math.round(num(p, 'floppies')) + 16 : 96
  const shelf = keyStyle === 'shelf'
  const shelfDepth = shelf ? 4 * num(p, 'keyPitch') + 40 : 0

  const W = tube.w + margin * 2 + (beside ? driveWidth : 0)
  const D = tube.d + margin + 30 + shelfDepth
  const H = tube.h + margin * 2 + (below ? driveHeight : 0)
  const front = -D / 2
  const back = D / 2

  const shell = []
  const detail = []
  const dark = []
  const glass = []
  const keys = []
  const parts = []

  // --- Case ---------------------------------------------------------------
  //
  // A box with the tube's face let into the front of it. The keyboard shelf, if
  // there is one, is a step out of the bottom front.
  const caseFront = front + shelfDepth
  const outline = plan(rect(D - shelfDepth, W, radius))
  const body = sweep(
    outline,
    [
      { inset: 0, y: H },
      { inset: 0, y: 0 },
    ],
    false,
  )
  shell.push(body, face([outline.pts], H, true), face([outline.pts], 0, false))
  const bodyShift = shelfDepth / 2
  for (const g of shell) g.translate(bodyShift, 0, 0)

  // --- The tube's face ----------------------------------------------------
  const screenY = (below ? driveHeight : 0) + (H - (below ? driveHeight : 0)) / 2
  const screenZ = beside ? -(W / 2) + tube.w / 2 + margin : 0
  const bezelInset = 14
  // A recess for the tube, the glass proud of it, and a brow over the top.
  const aperture = plan(rect(tube.h, tube.w, radius * 0.8))
  const recess = sweep(
    aperture,
    [
      { inset: 0, y: 0 },
      { inset: 0, y: -bezelInset },
      { inset: 10, y: -bezelInset - 6 },
    ],
    false,
  )
  const surround = plate(rect(tube.h + 26, tube.w + 26, radius * 0.7), caseFront - 2, 2, radius * 0.3, screenY, screenZ)
  for (const g of [recess].filter(Boolean)) {
    faceForward(g)
    g.translate(caseFront + 0.5, screenY, screenZ)
    dark.push(g)
  }
  dark.push(surround)
  const screen = plate(rect(tube.h - 10, tube.w - 10, radius * 0.6), caseFront - 3, 4, 0, screenY, screenZ)
  if (tilt > 0) {
    // The whole face leans back a few degrees, as the mouldings did.
    for (const g of [screen]) {
      g.translate(-caseFront, -screenY, 0)
      g.rotateZ(-tilt)
      g.translate(caseFront, screenY, 0)
    }
  }
  glass.push(screen)

  if (bool(p, 'hood')) {
    const brow = box(26, 10, tube.w + 40, caseFront - 24, screenY + tube.h / 2 + 16, screenZ - (tube.w + 40) / 2)
    detail.push(brow)
  }

  // --- Storage ------------------------------------------------------------
  if (storage === 'floppy') {
    const count = Math.round(num(p, 'floppies'))
    for (let i = 0; i < count; i++) {
      const piece = floppyFascia(3)
      const y = below
        ? driveHeight - 20 - i * (41.3 + 8)
        : screenY + tube.h / 2 - 30 - i * (41.3 + 10)
      const z = beside ? W / 2 - 84 - margin * 0.3 : -W / 2 + 100 + i * 0
      const at = new THREE.Matrix4().makeTranslation(caseFront, Math.max(y, 30), below ? -W / 2 + 110 + i * 160 : z)
      piece.plastic.applyMatrix4(at)
      piece.detail.applyMatrix4(at)
      detail.push(piece.plastic)
      dark.push(piece.detail)
    }
  } else if (storage === 'cassette') {
    // The well and the transport buttons under it, kept clear of the desk.
    const wellHeight = 78
    const centre = below ? driveHeight / 2 + 8 : screenY
    const bottom = Math.max(26, centre - wellHeight / 2)
    const z = beside ? W / 2 - 90 - margin * 0.3 : -W / 2 + 120
    dark.push(box(6, wellHeight, 116, caseFront - 5, bottom, z - 58))
    for (let i = 0; i < 5; i++) {
      detail.push(box(9, 9, 18, caseFront - 8, bottom - 13, z - 52 + i * 24))
    }
  }

  // --- Keyboard -----------------------------------------------------------
  const rows = 5
  if (keyStyle !== 'none') {
    const block = keyBlock(Math.round(num(p, 'keyColumns')), rows, num(p, 'keyPitch'), bool(p, 'keypad'))
    if (shelf) {
      // A shelf stepped out of the bottom of the case, keys sunk into it.
      const shelfHeight = 34
      const shelfOutline = plan(rect(shelfDepth + 30, Math.min(W, block.width + 70), radius * 0.5))
      const tray = sweep(
        shelfOutline,
        [
          { inset: 0, y: shelfHeight },
          { inset: 0, y: 0 },
        ],
        false,
      )
      const trayTop = face([shelfOutline.pts], shelfHeight, true)
      for (const g of [tray, trayTop, face([shelfOutline.pts], 0, false)].filter(Boolean)) {
        g.translate(front + shelfDepth / 2 + 8, 0, 0)
        shell.push(g)
      }
      block.keys.translate(front + shelfDepth / 2 + 6, shelfHeight - 2, 0)
      keys.push(block.keys)
    } else {
      block.keys.translate(front - 120, 26, 0)
      const slab = sweep(
        plan(rect(block.depth + 46, block.width + 40, 10)),
        [
          { inset: 0, y: 26 },
          { inset: 0, y: 0 },
        ],
        false,
      )
      const slabPlan = plan(rect(block.depth + 46, block.width + 40, 10))
      for (const g of [slab, face([slabPlan.pts], 26, true), face([slabPlan.pts], 0, false)].filter(Boolean)) {
        g.translate(front - 120, 0, 0)
        detail.push(g)
      }
      keys.push(block.keys)
    }
  }

  // --- Back and vents -----------------------------------------------------
  const socket = (width, height, y, z) => box(6, height, width, back + bodyShift - 5, y, z - width / 2)
  if (bool(p, 'parallelPort')) dark.push(socket(64, 18, H * 0.3, -W / 4))
  if (bool(p, 'expansionPort')) dark.push(socket(88, 16, H * 0.3, W / 4))
  dark.push(socket(28, 26, H * 0.12, 0))

  if (bool(p, 'vents')) {
    const slots = []
    for (let i = 0; i < 9; i++) {
      slots.push(box(3, 4, W * 0.5, back + bodyShift - 4, H * 0.62 + i * 9, -W * 0.25))
    }
    for (let i = 0; i < 6; i++) {
      for (const sz of [-1, 1]) {
        slots.push(box(D * 0.3, 4, 3, -D * 0.1, H * 0.55 + i * 10, sz * (W / 2 - 4)))
      }
    }
    detail.push(merge(slots))
  }

  const add = (name, list, color) => {
    const usable = list.filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }
  add('case', shell, finish.shell)
  add('mouldings', detail, finish.bezel)
  add('keys', keys, finish.trim)
  add('recess', dark, DARK)
  add('screen', glass, bool(p, 'screenOn') ? PHOSPHOR[str(p, 'phosphor')] : 0x24272b)

  const facing = parts.filter((part) => part.geometry && triangleCount(part.geometry) > 0)
  // Swung round from -X to +Z, which is where the Front view looks from, so the
  // front of the machine is what the front view shows.
  for (const part of facing) part.geometry.rotateY(Math.PI / 2)
  return facing
}

export function metrics(p) {
  const tube = tubeSize(num(p, 'tube'))
  const margin = num(p, 'margin')
  const storage = str(p, 'storage')
  const beside = str(p, 'drivePlace') === 'beside' && storage !== 'none'
  const below = str(p, 'drivePlace') === 'below' && storage !== 'none'
  const driveWidth = storage === 'floppy' ? 168 : storage === 'cassette' ? 150 : 0
  const driveHeight = storage === 'floppy' ? 41.3 * Math.round(num(p, 'floppies')) + 16 : 96
  const shelfDepth = str(p, 'keyboard') === 'shelf' ? 4 * num(p, 'keyPitch') + 40 : 0

  const W = tube.w + margin * 2 + (beside ? driveWidth : 0)
  const D = tube.d + margin + 30 + shelfDepth
  const H = tube.h + margin * 2 + (below ? driveHeight : 0)
  const screenCentre = (below ? driveHeight : 0) + (H - (below ? driveHeight : 0)) / 2

  // Sitting at a 750 desk, the eye is about 1150 off the floor.
  const eye = 1150 - 750
  const rise = screenCentre - eye
  const riseLevel = rise > 90 ? 'warn' : rise < -140 ? 'warn' : 'ok'

  return [
    {
      label: 'Case',
      value: `${formatLength(W)} × ${formatLength(D)} × ${formatLength(H)}`,
      note: 'All of it follows the tube, the moulding round it and the drives.',
    },
    { label: 'Tube', value: `${num(p, 'tube')}″ — ${formatLength(tube.w)} × ${formatLength(tube.h)}, ${formatLength(tube.d)} deep` },
    { label: 'Desk taken', value: `${((W * D) / 1e6).toFixed(2)} m²` },
    {
      label: 'Screen centre',
      value: `${formatLength(screenCentre)} above the desk`,
      level: riseLevel,
      note: riseLevel === 'ok' ? undefined : 'Comfortable is roughly eye level, 400 mm above a 750 desk.',
    },
    {
      label: 'Storage',
      value:
        storage === 'floppy'
          ? `${Math.round(num(p, 'floppies'))} × 5¼" drives`
          : storage === 'cassette'
            ? 'Cassette deck'
            : 'None built in',
    },
  ]
}

export const presets = [
  {
    name: 'Green-screen trinity',
    params: {
      tube: 9, phosphor: 'green', screenOn: true, margin: 62, radius: 22, finish: 'cream',
      storage: 'cassette', drivePlace: 'beside', keyboard: 'shelf', keyColumns: 15,
      keyPitch: 16, keypad: true, hood: true, tilt: 5,
    },
  },
  {
    name: 'Twin-floppy business micro',
    params: {
      tube: 12, phosphor: 'green', screenOn: true, margin: 70, radius: 18, finish: 'beige',
      storage: 'floppy', floppies: 2, drivePlace: 'beside', keyboard: 'separate',
      keyColumns: 17, keyPitch: 19.05, keypad: true, hood: true, tilt: 4,
    },
  },
  {
    name: 'Amber office terminal',
    params: {
      tube: 12, phosphor: 'amber', screenOn: true, margin: 56, radius: 26, finish: 'putty',
      storage: 'floppy', floppies: 2, drivePlace: 'below', keyboard: 'separate',
      keyColumns: 17, keyPitch: 19.05, keypad: true, hood: false, tilt: 8,
    },
  },
  {
    name: 'Pressed-steel micro',
    params: {
      tube: 9, phosphor: 'white', screenOn: false, margin: 44, radius: 8, finish: 'steel',
      storage: 'cassette', drivePlace: 'below', keyboard: 'shelf', keyColumns: 13,
      keyPitch: 17.5, keypad: false, hood: false, tilt: 0, vents: true,
    },
  },
  {
    name: 'Small classroom micro',
    params: {
      tube: 7, phosphor: 'green', screenOn: true, margin: 40, radius: 20, finish: 'cream',
      storage: 'none', keyboard: 'shelf', keyColumns: 12, keyPitch: 15, keypad: false,
      hood: true, tilt: 6, parallelPort: false, expansionPort: true,
    },
  },
]
