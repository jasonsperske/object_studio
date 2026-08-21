// Integrated micro, 1977–1983.
//
// The other shape the first machines took: a monitor and a computer in one
// pressed-steel or moulded box, with the tape or the disks built into the same
// case. There is no expansion here either — what these had was a port at the
// back for a printer or a disk unit, and that was the lot.
//
// The case is sized by the tube. A cathode ray tube of a given diagonal is a
// given width, height and depth, and everything else is the margin the moulding
// needed around it, plus whatever the drives added beside or below it.
//
// The front is the part worth getting right, because it is the part you sat in
// front of: a moulding standing proud all round, and set back inside it a dark
// mask panel carrying the tube and the drive bays. The tube leans back within
// that recess rather than through it.
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
const LAMP = 0xd4402c

// A full-height 5¼" drive, which is what set the size of every bay here.
const DRIVE = { w: 146, h: 41.3 }

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
  { id: 'tilt', label: 'Screen tilt', type: 'number', min: 0, max: 16, step: 0.5, default: 6, unit: '°', group: 'Tube', help: 'How far the tube leans back inside the recess. The moulding gets deeper to take it.' },

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
      { value: 'beside', label: 'Beside the tube — stacked up the right' },
      { value: 'below', label: 'Below the tube, in a row across the front' },
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

/**
 * Stands a plan-built solid on its face. Everything the studio sweeps is built
 * in plan and grows upwards; the front of a case is that tipped forward, so the
 * outline's own x becomes height and the height it grew becomes depth — a
 * solid built between y = 0 and y = t ends up between x = -t and x = 0, which
 * is to say standing proud of wherever it is then put.
 */
function faceForward(geometry) {
  if (geometry) geometry.rotateZ(Math.PI / 2)
  return geometry
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
  const floppy = storage === 'floppy'
  const floppies = Math.round(num(p, 'floppies'))
  const tilt = (num(p, 'tilt') * Math.PI) / 180
  const keyStyle = str(p, 'keyboard')

  // --- Size, from the tube out --------------------------------------------
  //
  // Drives beside the tube stack up a column and add their width; drives below
  // it stand in a row and add their height.
  const bayGap = 16
  const stackH = floppy ? DRIVE.h * floppies + bayGap * (floppies - 1) : 96
  const stackW = floppy ? DRIVE.w + 34 : 150
  const rowW = floppy ? DRIVE.w * floppies + bayGap * (floppies - 1) : 150
  const rowH = floppy ? DRIVE.h + 34 : 96

  const shelf = keyStyle === 'shelf'
  const shelfHeight = 34
  const shelfDepth = shelf ? 4 * num(p, 'keyPitch') + 40 : 0

  const W = Math.max(
    tube.w + margin * 2 + (beside ? stackW : 0),
    below ? rowW + margin * 2 : 0,
  )
  const H = (below ? rowH : 0) + Math.max(tube.h, beside ? stackH : 0) + margin * 2
  // The moulding stands proud of the mask by enough to take the tube's lean.
  const sag = Math.sin(tilt) * (tube.h / 2)
  const frameT = Math.min(52, Math.max(16, 2 * sag + 10))
  const D = tube.d + margin + 30 + shelfDepth + frameT
  const front = -D / 2
  const back = D / 2

  const shell = []
  const detail = []
  const dark = []
  const glass = []
  const fascia = []
  const lamps = []
  const keys = []
  const parts = []

  // --- Case ---------------------------------------------------------------
  //
  // The box, which stops short of the front: the moulding and the mask panel
  // take the last of the depth.
  const faceX = front + shelfDepth
  const bodyFront = faceX + frameT
  const outline = plan(rect(D - shelfDepth - frameT, W, radius))
  const body = sweep(
    outline,
    [
      { inset: 0, y: H },
      { inset: 0, y: 0 },
    ],
    false,
  )
  shell.push(body, face([outline.pts], H, true), face([outline.pts], 0, false))
  const bodyShift = (shelfDepth + frameT) / 2
  for (const g of shell) g.translate(bodyShift, 0, 0)

  // --- What the front carries ---------------------------------------------
  const screenY = (below ? rowH : 0) + (H - (below ? rowH : 0)) / 2
  const screenZ = beside ? -(W / 2) + margin + tube.w / 2 : 0
  // Where the drives sit, as centres on the front, worked out once so the mask
  // can be drawn round them.
  const bays = []
  if (storage !== 'none') {
    const bayW = floppy ? DRIVE.w : 132
    const bayH = floppy ? DRIVE.h : 78
    if (beside) {
      // A column up the right of the tube, hung from the top of it.
      const z = W / 2 - margin - stackW / 2
      const top = screenY + Math.max(tube.h, stackH) / 2 - bayH / 2
      const count = floppy ? floppies : 1
      for (let i = 0; i < count; i++) bays.push({ y: top - i * (bayH + bayGap), z, w: bayW, h: bayH })
    } else {
      // A row across the front below the tube, clear of the keyboard shelf.
      const count = floppy ? floppies : 1
      const y = Math.max(rowH / 2, (shelf ? shelfHeight : 0) + bayH / 2 + 14)
      for (let i = 0; i < count; i++) {
        bays.push({ y, z: (i - (count - 1) / 2) * (bayW + bayGap), w: bayW, h: bayH })
      }
    }
  }

  // --- The front: a moulding, and a mask panel set back inside it ----------
  //
  // The mask is the dark panel the tube and the bays are let into, and it takes
  // in whatever they cover. Built in the elevation plane — plan x is height,
  // plan z is width — and stood on its face.
  let lowY = screenY - tube.h / 2
  let highY = screenY + tube.h / 2
  let leftZ = screenZ - tube.w / 2
  let rightZ = screenZ + tube.w / 2
  for (const bay of bays) {
    lowY = Math.min(lowY, bay.y - bay.h / 2)
    highY = Math.max(highY, bay.y + bay.h / 2)
    leftZ = Math.min(leftZ, bay.z - bay.w / 2)
    rightZ = Math.max(rightZ, bay.z + bay.w / 2)
  }
  const pad = 14
  const clampY = (y) => Math.min(Math.max(y, 12), H - 12)
  const clampZ = (z) => Math.min(Math.max(z, -W / 2 + radius + 8), W / 2 - radius - 8)
  const maskLow = clampY(lowY - pad)
  const maskHigh = clampY(highY + pad)
  const maskLeft = clampZ(leftZ - pad)
  const maskRight = clampZ(rightZ + pad)
  const maskOutline = plan(
    rect(maskHigh - maskLow, maskRight - maskLeft, 8, (maskHigh + maskLow) / 2, (maskLeft + maskRight) / 2),
  )
  // The moulding is a panel across the flat of the front, stopping where the
  // case's own corners begin to curve away: anything wider would stand proud of
  // them, which is what a lip on a moulding looks like.
  const frontOutline = plan(rect(H, Math.max(60, W - radius * 2), radius, H / 2, 0))

  const onFront = (geometry, x = bodyFront) => {
    if (!geometry) return geometry
    faceForward(geometry)
    geometry.translate(x, 0, 0)
    return geometry
  }
  // The moulding: a face with the mask cut out of it, the outer edge run round
  // it, and the opening's own wall run back to the mask.
  shell.push(onFront(face([frontOutline.pts, maskOutline.pts], frameT, true)))
  shell.push(onFront(sweep(frontOutline, [{ inset: 0, y: frameT }, { inset: 0, y: 0 }], false)))
  // Walked bottom to top, which turns the opening's normals inward.
  shell.push(onFront(sweep(maskOutline, [{ inset: 0, y: 0 }, { inset: 0, y: frameT }], false)))
  dark.push(onFront(face([maskOutline.pts], 0.4, true)))

  // --- The tube -----------------------------------------------------------
  //
  // The glass sits proud of the mask and leans back inside the recess, so the
  // moulding is always in front of it whatever the tilt.
  const glassProud = sag + 3
  const glassOutline = rect(tube.h - 10, tube.w - 10, radius * 0.5, screenY, screenZ)
  const screen = onFront(profiledBoard(glassOutline, glassProud, 4, 'square', 0))
  const pivot = bodyFront - glassProud - 2
  screen.translate(-pivot, -screenY, 0)
  screen.rotateZ(-tilt)
  screen.translate(pivot, screenY, 0)
  glass.push(screen)

  if (bool(p, 'hood')) {
    // The brow over the tube, standing out of the recess.
    const reach = Math.max(8, frameT - 6)
    detail.push(
      box(reach, 10, tube.w + 24, bodyFront - reach, screenY + tube.h / 2 + 6, screenZ - (tube.w + 24) / 2),
    )
  }

  // --- Storage ------------------------------------------------------------
  //
  // A bay is a fascia standing out of the mask with the slot sunk back into it,
  // the door lever beside the slot and the lamp under it.
  const relief = Math.min(6, frameT - 6)
  for (const bay of bays) {
    const faceAt = bodyFront - 0.6 - relief
    // The fascia stands out of the mask; the slot or the well is sunk back into
    // it, so both read against a panel that is already dark.
    fascia.push(box(relief, bay.h, bay.w, faceAt, bay.y - bay.h / 2, bay.z - bay.w / 2))
    if (floppy) {
      dark.push(box(relief - 2, 7, bay.w * 0.6, faceAt + 2, bay.y - 1, bay.z - bay.w * 0.3))
      fascia.push(box(relief + 3, bay.h * 0.42, bay.w * 0.08, faceAt - 3, bay.y + 2, bay.z - bay.w * 0.33))
      lamps.push(box(relief + 1.4, 4, 6, faceAt - 1.4, bay.y - bay.h * 0.36, bay.z - bay.w * 0.36))
    } else {
      // A cassette well, with the transport buttons in a row under it.
      dark.push(box(relief - 2, bay.h * 0.56, bay.w * 0.82, faceAt + 2, bay.y - bay.h * 0.06, bay.z - bay.w * 0.41))
      for (let i = 0; i < 5; i++) {
        fascia.push(box(relief + 3, 9, 17, faceAt - 3, bay.y - bay.h / 2 + 4, bay.z - bay.w * 0.4 + i * 21))
      }
      lamps.push(box(relief + 1, 4, 6, faceAt - 1, bay.y + bay.h * 0.3, bay.z + bay.w * 0.36))
    }
  }

  // --- Keyboard -----------------------------------------------------------
  const rows = 5
  if (keyStyle !== 'none') {
    const block = keyBlock(Math.round(num(p, 'keyColumns')), rows, num(p, 'keyPitch'), bool(p, 'keypad'))
    if (shelf) {
      // A shelf stepped out of the bottom of the case, keys sunk into it.
      const shelfOutline = plan(rect(shelfDepth + 30, Math.min(W, block.width + 70), radius * 0.5))
      const tray = sweep(
        shelfOutline,
        [
          { inset: 0, y: shelfHeight },
          { inset: 0, y: 0 },
        ],
        false,
      )
      for (const g of [tray, face([shelfOutline.pts], shelfHeight, true), face([shelfOutline.pts], 0, false)].filter(Boolean)) {
        g.translate(front + shelfDepth / 2 + 8, 0, 0)
        shell.push(g)
      }
      block.keys.translate(front + shelfDepth / 2 + 6, shelfHeight - 2, 0)
      keys.push(block.keys)
    } else {
      const slabPlan = plan(rect(block.depth + 46, block.width + 40, 10))
      const slab = sweep(
        slabPlan,
        [
          { inset: 0, y: 26 },
          { inset: 0, y: 0 },
        ],
        false,
      )
      for (const g of [slab, face([slabPlan.pts], 26, true), face([slabPlan.pts], 0, false)].filter(Boolean)) {
        g.translate(front - 120, 0, 0)
        detail.push(g)
      }
      block.keys.translate(front - 120, 26, 0)
      keys.push(block.keys)
    }
  }

  // --- Back and vents -----------------------------------------------------
  //
  // The body was shifted to meet the front, but its back face never moved: it
  // is at `back`, and everything here stands a whisker proud of it.
  const socket = (width, height, y, z) => box(6, height, width, back - 5, y, z - width / 2)
  if (bool(p, 'parallelPort')) dark.push(socket(64, 18, H * 0.3, -W / 4))
  if (bool(p, 'expansionPort')) dark.push(socket(88, 16, H * 0.3, W / 4))
  dark.push(socket(28, 26, H * 0.12, 0))

  if (bool(p, 'vents')) {
    const slots = []
    for (let i = 0; i < 9; i++) {
      const y = H * 0.6 + i * 9
      if (y > H - 12) break
      slots.push(box(3, 4, W * 0.5, back - 2, y, -W * 0.25))
    }
    // Down both sides, proud of the wall rather than sunk inside it.
    for (let i = 0; i < 6; i++) {
      const y = H * 0.55 + i * 10
      if (y > H - 12) break
      slots.push(box(D * 0.24, 4, 3, bodyFront + 30, y, W / 2 - 1))
      slots.push(box(D * 0.24, 4, 3, bodyFront + 30, y, -W / 2 - 2))
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
  add('drive bays', fascia, finish.trim)
  add('keys', keys, finish.trim)
  add('recess', dark, DARK)
  add('lamp', lamps, LAMP)
  add('screen', glass, bool(p, 'screenOn') ? PHOSPHOR[str(p, 'phosphor')] : 0x3c4145)

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
  const floppy = storage === 'floppy'
  const floppies = Math.round(num(p, 'floppies'))
  const tilt = (num(p, 'tilt') * Math.PI) / 180

  const bayGap = 16
  const stackH = floppy ? DRIVE.h * floppies + bayGap * (floppies - 1) : 96
  const stackW = floppy ? DRIVE.w + 34 : 150
  const rowW = floppy ? DRIVE.w * floppies + bayGap * (floppies - 1) : 150
  const rowH = floppy ? DRIVE.h + 34 : 96
  const shelfDepth = str(p, 'keyboard') === 'shelf' ? 4 * num(p, 'keyPitch') + 40 : 0
  const frameT = Math.min(52, Math.max(16, 2 * Math.sin(tilt) * (tube.h / 2) + 14))

  const W = Math.max(tube.w + margin * 2 + (beside ? stackW : 0), below ? rowW + margin * 2 : 0)
  const H = (below ? rowH : 0) + Math.max(tube.h, beside ? stackH : 0) + margin * 2
  const D = tube.d + margin + 30 + shelfDepth + frameT
  const screenCentre = (below ? rowH : 0) + (H - (below ? rowH : 0)) / 2

  // These sat on the desk and you looked down into them — a tube centred in its
  // own case never reached eye level, so what is worth reporting is how far
  // down. Eye level at a 750 desk is about 400 up, at arm's length.
  const down = (Math.atan2(400 - screenCentre, 600) * 180) / Math.PI
  const level = down > 30 ? 'warn' : screenCentre > 430 ? 'warn' : 'ok'

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
      value: `${formatLength(screenCentre)} above the desk — ${Math.abs(down).toFixed(0)}° ${down >= 0 ? 'below' : 'above'} the eye`,
      level,
      note:
        level === 'ok'
          ? undefined
          : screenCentre > 430
            ? 'Above eye level at a 750 desk. You would be looking up at it.'
            : 'Craning down at it. The case wants more moulding under the tube, or something to stand on.',
    },
    {
      label: 'Storage',
      value:
        storage === 'floppy'
          ? `${floppies} × 5¼" drives, ${below ? 'in a row below the tube' : 'stacked beside the tube'}`
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
