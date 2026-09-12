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
const DRIVE = { w: 146, h: 82.5 }

// A tube of a given diagonal, in the 4:3 it always was, and about as deep as
// it was wide — which is what made these cases the shape they are.
function tubeSize(inches) {
  const diagonal = inches * 25.4
  return { w: diagonal * 0.8, h: diagonal * 0.6, d: diagonal * 0.78 }
}

export const params = [
  // --- Tube ---------------------------------------------------------------
  { id: 'tube', label: 'Tube', type: 'number', min: 5, max: 15, step: 0.5, default: 12, unit: '″', group: 'Tube', help: 'Diagonal. The default twelve-inch tube follows the TRS-80 Model III-inspired configuration.' },
  {
    id: 'phosphor',
    label: 'Phosphor',
    type: 'select',
    default: 'white',
    group: 'Tube',
    options: [
      { value: 'green', label: 'Green — P1, the common one' },
      { value: 'amber', label: 'Amber — easier on the eyes, said the adverts' },
      { value: 'white', label: 'White — for the ones that drove a television tube' },
      { value: 'blue', label: 'Blue' },
    ],
  },
  { id: 'screenOn', label: 'Switched on', type: 'boolean', default: true, group: 'Tube' },
  { id: 'hood', label: 'Screen hood', type: 'boolean', default: false, group: 'Tube', help: 'The brow moulded over the tube to keep the strip lights off it.' },
  { id: 'tilt', label: 'Screen tilt', type: 'number', min: 0, max: 16, step: 0.5, default: 4, unit: '°', group: 'Tube', help: 'How far the tube leans back inside the recess. The moulding gets deeper to take it.' },

  // --- Case ---------------------------------------------------------------
  { id: 'margin', label: 'Moulding around the tube', type: 'number', min: 20, max: 140, step: 2, default: 28, unit: 'mm', group: 'Case' },
  { id: 'radius', label: 'Corner radius', type: 'number', min: 0, max: 70, step: 1, default: 10, unit: 'mm', group: 'Case' },
  {
    id: 'finish',
    label: 'Finish',
    type: 'select',
    default: 'steel',
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
    default: 'floppy',
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
  { id: 'keyColumns', label: 'Columns', type: 'int', min: 10, max: 20, step: 1, default: 13, group: 'Keyboard', visibleWhen: (p) => str(p, 'keyboard') !== 'none' },
  { id: 'keyPitch', label: 'Key pitch', type: 'number', min: 12, max: 20, step: 0.05, default: 19.05, unit: 'mm', group: 'Keyboard', visibleWhen: (p) => str(p, 'keyboard') !== 'none' },
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
  return r < 1 ? ring(corners) : roundCorners(corners, r, 12)
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

/** Single source of truth for build and metrics, including keyboard clearance. */
function layout(p) {
  const tube = tubeSize(num(p, 'tube')), margin = num(p, 'margin')
  const storage = str(p, 'storage'), floppy = storage === 'floppy'
  const beside = str(p, 'drivePlace') === 'beside' && storage !== 'none'
  const below = str(p, 'drivePlace') === 'below' && storage !== 'none'
  const floppies = Math.round(num(p, 'floppies')), bayGap = 18
  const stackH = floppy ? DRIVE.h * floppies + bayGap * (floppies - 1) : 96
  const stackW = floppy ? DRIVE.w + 26 : 150
  const rowW = floppy ? DRIVE.w * floppies + bayGap * (floppies - 1) : 150
  const rowH = floppy ? DRIVE.h + 28 : 96
  const shelf = str(p, 'keyboard') === 'shelf', pitch = num(p, 'keyPitch')
  const keyWidth = (Math.round(num(p, 'keyColumns')) + (bool(p, 'keypad') ? 4.6 : 0)) * pitch
  const shelfDepth = shelf ? 5 * pitch + 36 : 0
  const deckBack = shelf ? 54 : 0
  const W = Math.max(tube.w + margin * 2 + (beside ? stackW : 0), below ? rowW + margin * 2 : 0,
    shelf ? keyWidth + 42 : 0)
  const H = deckBack + (below ? rowH : 0) + Math.max(tube.h, beside ? stackH : 0) + margin * 2
  const tilt = num(p, 'tilt') * Math.PI / 180, sag = Math.sin(tilt) * tube.h / 2
  const frameT = Math.max(24, sag * 2 + 18)
  const D = tube.d + margin + 30 + shelfDepth + frameT
  const screenCentre = deckBack + (below ? rowH : 0) + (H - deckBack - (below ? rowH : 0)) / 2
  return { tube, margin, storage, floppy, beside, below, floppies, bayGap, stackH, stackW,
    rowH, shelf, pitch, keyWidth, shelfDepth, deckBack, W, H, D, tilt, sag, frameT, screenCentre }
}

/** Tapered keycaps with a smaller top and distinct Enter cap. */
function keyBlock(columns, pitch, keypad) {
  const keys = [], accent = [], legends = []
  const glyphs = {
    A:'010101111101101', B:'110101110101110', C:'011100100100011', D:'110101101101110',
    E:'111100110100111', F:'111100110100100', G:'011100101101011', H:'101101111101101',
    I:'111010010010111', J:'001001001101010', K:'101101110101101', L:'100100100100111',
    M:'101111111101101', N:'101111111111101', O:'010101101101010', P:'110101110100100',
    Q:'010101101111011', R:'110101110101101', S:'011100010001110', T:'111010010010010',
    U:'101101101101111', V:'101101101101010', W:'101101111111101', X:'101101010101101',
    Y:'101101010010010', Z:'111001010100111',
    '0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110',
    '4':'101101111001001','5':'111100110001110','6':'011100111101111','7':'111001010010010',
    '8':'111101111101111','9':'111101111001110',
  }
  const width = (columns + (keypad ? 4.6 : 0)) * pitch, depth = 5 * pitch
  const alphaLeft = -width / 2
  const key = (x, z, w = pitch * .84, list = keys, label = '') => {
    const bottom = rect(pitch * .86, w, 1.2)
    const top = rect(pitch * .68, Math.max(4, w - pitch * .15), 1.2)
    const g = merge([loftRings([{ pts: top, y: 7 }, { pts: bottom, y: 0 }]), face([top], 7, true), face([bottom], 0, false)].filter(Boolean))
    g.translate(x, 0, z)
    list.push(g)
    const pattern = glyphs[label], px = pitch * .065
    if (pattern) [...pattern].forEach((bit, i) => {
      if (bit === '1') legends.push(face([rect(px * .85, px * .85, 0,
        x + (2 - Math.floor(i / 3)) * px, z + (i % 3 - 1) * px)], 7.08, true))
    })
  }
  for (let row = 0; row < 4; row++) {
    const x = -depth / 2 + (row + 1.5) * pitch
    for (let c = 0; c < columns; c++) {
      // Keep all rows inside their block, with a small period keyboard stagger.
      const stagger = row % 2 ? .10 : 0
      key(x, alphaLeft + (c + .5 + stagger) * pitch,
        pitch * .82, row === 1 && c === columns - 1 ? accent : keys, ['ZXCVBNM', 'ASDFGHJKL', 'QWERTYUIOP', '1234567890'][row][c] ?? '')
    }
  }
  key(-depth / 2 + pitch * .5, alphaLeft + columns * pitch * .48, columns * pitch * .52)
  if (keypad) for (let row = 0; row < 4; row++) for (let c = 0; c < 3; c++)
    key(-depth / 2 + (row + 1.5) * pitch, width / 2 - (3.4 - c) * pitch, pitch * .84, keys, ['012','123','456','789'][row][c])
  return { keys: merge(keys), accent: merge(accent), legends: merge(legends), width, depth }
}

/** Flat sheet in the front's elevation coordinates (plan X is height). */
function frontSheet(outline, x) {
  return faceForward(face([outline], 0, true)).translate(x, 0, 0)
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export function build(p) {
  const L = layout(p)
  const { tube, margin, storage, floppy, beside, below, floppies, bayGap, stackH, stackW,
    rowH, shelf, pitch, shelfDepth, deckBack, W, H, D, tilt, sag, frameT, screenCentre: screenY } = L
  const radius = Math.min(num(p, 'radius'), margin * .6)
  const finish = FINISH[str(p, 'finish')] ?? FINISH.cream
  const keyStyle = str(p, 'keyboard')
  const front = -D / 2, back = D / 2, faceX = front + shelfDepth, bodyFront = faceX + frameT
  const screenZ = beside ? -W / 2 + margin + tube.w / 2 : 0
  const shell = [], detail = [], dark = [], glass = [], fascia = [], lamps = [], keys = [], parts = []
  const onFront = g => faceForward(g).translate(bodyFront, 0, 0)

  // A broad upper enclosure, joined to a full-width keyboard wedge below it.
  shell.push(roundedHousing(D - shelfDepth - frameT, W, H, radius)
    .translate((shelfDepth + frameT) / 2, 0, 0))
  const bays = []
  if (storage !== 'none') {
    const w = floppy ? DRIVE.w : 132, h = floppy ? DRIVE.h : 78, count = floppy ? floppies : 1
    for (let i = 0; i < count; i++) bays.push({ w, h,
      y: beside ? screenY + stackH / 2 - h / 2 - i * (h + bayGap) : deckBack + rowH / 2,
      z: beside ? W / 2 - margin - stackW / 2 : (i - (count - 1) / 2) * (w + bayGap),
    })
  }

  // Separate screen and drive openings preserve the painted divider between them.
  const outer = roundedRect(H - deckBack, W, radius).map(q => ({ x: q.x + (H + deckBack) / 2, z: q.z }))
  const screenR = Math.min(tube.h * .12, 24)
  const aperture = roundedRect(tube.h + 10, tube.w + 10, screenR + 4)
    .map(q => ({ x: q.x + screenY, z: q.z + screenZ }))
  const bayHoles = bays.map(b => rect(b.h + 4, b.w + 4, 3, b.y, b.z))
  shell.push(onFront(face([outer, aperture, ...bayHoles], frameT, true)))
  shell.push(onFront(loftRings([{ pts: outer, y: frameT }, { pts: outer, y: 0 }])))

  // Deep dark CRT reveal and a smooth convex face, all leaning within the opening.
  const rearAperture = roundedRect(tube.h, tube.w, screenR)
    .map(q => ({ x: q.x + screenY, z: q.z + screenZ }))
  dark.push(onFront(face([rearAperture], .7, true)))
  dark.push(onFront(loftRings([{ pts: rearAperture, y: .5 }, { pts: aperture, y: frameT - .2 }])))
  const glassProud = sag + 5, bulge = 3
  const layers = []
  for (let i = 0; i <= 6; i++) {
    const u = i / 6, shrink = u * Math.min(tube.h, tube.w) * .22
    layers.push({ pts: roundedRect(tube.h - 12 - shrink * 2, tube.w - 12 - shrink * 2, Math.max(2, screenR - shrink * .35))
      .map(q => ({ x: q.x + screenY, z: q.z + screenZ })), y: glassProud + bulge * (2 * u - u * u) })
  }
  const dome = merge([loftRings(layers.slice().reverse()), face([layers[6].pts], layers[6].y, true)].filter(Boolean))
  const pivot = bodyFront - glassProud
  const onTube = g => {
    onFront(g)
    g.translate(-pivot, -screenY, 0).rotateZ(-tilt).translate(pivot, screenY, 0)
    return g
  }
  glass.push(onTube(dome))
  if (bool(p, 'hood')) detail.push(box(Math.max(8, frameT - 6), 6, tube.w + 18,
    faceX + 2, screenY + tube.h / 2 + 7, screenZ - (tube.w + 18) / 2))

  for (const bay of bays) {
    const x = faceX + 3
    // Black fascia, a visible inset slot, central latch, and red activity lamp.
    fascia.push(box(5, bay.h, bay.w, x, bay.y - bay.h / 2, bay.z - bay.w / 2))
    dark.push(frontSheet(rect(bay.h + 4, bay.w + 4, 3, bay.y, bay.z), x + 5.1))
    if (floppy) {
      parts.push({ name: 'drive-slot-' + (bays.indexOf(bay) + 1), geometry: frontSheet(rect(4, bay.w * .82, 0, bay.y + 4, bay.z), x - 2.2), color: 0x090b0d })
      detail.push(box(7, 7, bay.w * .74, x - 2, bay.y - 1, bay.z - bay.w * .37))
      fascia.push(box(10, bay.h * .30, bay.w * .24, x - 6, bay.y - bay.h * .26, bay.z - bay.w * .12))
      lamps.push(box(1, 4, 5, x - .5, bay.y - bay.h * .32, bay.z - bay.w * .4))
    } else {
      dark.push(frontSheet(rect(bay.h * .48, bay.w * .8, 3, bay.y + 7, bay.z), x - .2))
      for (let i = 0; i < 5; i++) detail.push(box(7, 8, 17, x - 3, bay.y - bay.h / 2 + 5, bay.z - 50 + i * 21))
    }
  }
  // The narrow badge sits on the divider between stacked drives.
  if (bays.length === 2 && beside) {
    const badgeY = (bays[0].y + bays[1].y) / 2
    parts.push({ name: 'nameplate', geometry: frontSheet(rect(10, 118, 1, badgeY, bays[0].z), faceX - .2), color: 0x252b2d })
    detail.push(frontSheet(rect(1, 110, 0, badgeY + 3, bays[0].z), faceX - .3))
  }

  if (keyStyle !== 'none') {
    const block = keyBlock(Math.round(num(p, 'keyColumns')), pitch, bool(p, 'keypad'))
    const depth = shelf ? shelfDepth + 8 : block.depth + 38
    const width = shelf ? W : block.width + 40
    const centre = shelf ? front + shelfDepth / 2 + 4 : front - depth / 2 - 24
    const frontHeight = shelf ? 22 : 18, rearHeight = shelf ? deckBack : 38
    const outline = rect(depth, width, Math.min(radius, 10))
    const well = rect(block.depth + 8, block.width + 12, 5)
    const slope = (rearHeight - frontHeight) / depth
    const wedge = g => g.applyMatrix4(new THREE.Matrix4().set(1,0,0,0, slope,1,0,(frontHeight + rearHeight)/2, 0,0,1,0, 0,0,0,1)).translate(centre, 0, 0)
    const bottom = outline.map(q => ({ x: q.x, z: q.z }))
    // Side walls use a per-vertex height, keeping the floor flat at Y=0.
    const planned = plan(outline)
    const side = sweep(planned, i => [{ inset: 0, y: (frontHeight + rearHeight)/2 + planned.pts[i].x * slope }, { inset: 0, y: 0 }], false)
    shell.push(side.translate(centre,0,0), face([bottom],0,false).translate(centre,0,0), wedge(face([outline, well],0,true)))
    dark.push(wedge(face([well],-3,true)))
    dark.push(wedge(loftRings([{ pts: well, y: -3 }, { pts: well, y: 0 }])))
    keys.push(wedge(block.keys.translate(0,-2,0)))
    parts.push({ name: 'key-legends', geometry: wedge(block.legends.translate(0,-2,0)), color: 0xc9c9be })
    parts.push({ name: 'enter-key', geometry: wedge(block.accent.translate(0,-2,0)), color: 0xdcd5bd })
  }

  // Exterior slots are dark shallow marks, not buried boxes or internal geometry.
  const socket = (width, height, y, z) => box(2, height, width, back + .1, y, z - width / 2)
  if (bool(p, 'parallelPort')) dark.push(socket(64,18,H*.22,-W/4))
  if (bool(p, 'expansionPort')) dark.push(socket(88,16,H*.22,W/4))
  dark.push(socket(28,26,H*.12,0))
  if (bool(p, 'vents')) {
    // A bank of passive cooling slots across the rear of the roof.
    for (let i = 0; i < 30; i++) dark.push(face([rect(22, 2.5, 0,
      back - 32, -W * .36 + i * W * .72 / 29)], H + .12, true))
    for (let i=0;i<9;i++) {
      const y = H*.60+i*7
      if (y>H-radius-10) break
      dark.push(box(1,2.5,W*.55,back+.15,y,-W*.275))
    }
    for (const side of [-1,1]) for (let i=0;i<8;i++) {
      const x = bodyFront+28+i*12
      if (x>back-radius-18) break
      dark.push(box(3,H*.15,1,x,H*.63,side*W/2+(side>0?.1:-1.1)))
    }
  }
  const add = (name, list, color) => { if (list.length) parts.push({ name, geometry: merge(list.filter(Boolean)), color }) }
  add('case',shell,finish.shell); add('mouldings',detail,finish.bezel)
  add('drive bays',fascia,0x303237); add('keys',keys,0x25282b)
  add('recess',dark,DARK); add('lamp',lamps,LAMP)
  const screenColor = new THREE.Color(0x303a37)
  if (bool(p, 'screenOn')) screenColor.lerp(new THREE.Color(PHOSPHOR[str(p, 'phosphor')] ?? PHOSPHOR.green), .08)
  add('screen',glass,screenColor.getHex())
  for (const part of parts) part.geometry.rotateY(Math.PI/2)
  return parts
}

export function metrics(p) {
  const { tube, storage, floppies, below, W, H, D, screenCentre } = layout(p)

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
    name: '1980 TRS-80 Model III inspired',
    params: {
      tube: 12, phosphor: 'white', screenOn: true, margin: 28, radius: 10,
      finish: 'steel', storage: 'floppy', floppies: 2, drivePlace: 'beside',
      keyboard: 'shelf', keyColumns: 13, keyPitch: 19.05, keypad: true,
      hood: false, tilt: 4, vents: true,
    },
  },
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
