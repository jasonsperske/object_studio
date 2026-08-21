// Gear.
//
// One tooth, drawn once as a flat outline, repeated round a circle and
// extruded. Everything else on the object is a ring: the rim under the teeth,
// the web or the spokes across the middle, the hub round the bore, the flange
// on the face. So the whole thing is a handful of closed 2D outlines pushed
// through a thickness, and the only complication is what happens on the way
// through — a helical gear is the same extrusion with the section turned as it
// goes, and a herringbone is that turn reversed halfway.
//
// The tooth itself is the part that is not styling. An involute flank is fixed
// by the module, the tooth count and the pressure angle, and those three
// numbers are also what decide whether two gears will run together, so they are
// the parameters rather than any diameter. Diameters are reported instead.
//
// Drawn in the XY plane with the axis along Z, then stood on Y = 0 so it faces
// +Z, which is where the studio's Front view looks from: the front view is the
// tooth profile, which is the view worth having of a gear.

export const meta = {
  order: 17,
  name: 'Gear',
  description:
    'A gear cut to a module and a tooth count — involute, cycloidal or cast — spur, helical, herringbone or stepped, on a solid blank, a web, spokes or a spoked ring.',
}

const rad = (d) => (d * Math.PI) / 180
const inv = (a) => Math.tan(a) - a
const pol = (r, a) => ({ x: r * Math.cos(a), y: r * Math.sin(a) })
const angleOf = (q) => Math.atan2(q.y, q.x)
const radiusOf = (q) => Math.hypot(q.x, q.y)
const mirror = (q) => ({ x: q.x, y: -q.y })

// Colour, and the density used to weigh the finished wheel.
const MATERIALS = {
  steel: { label: 'Steel', color: 0x99a3af, density: 7850 },
  castIron: { label: 'Cast iron', color: 0x5d6367, density: 7200 },
  brass: { label: 'Brass', color: 0xc2a02f, density: 8470 },
  bronze: { label: 'Bronze', color: 0xa8703f, density: 8800 },
  aluminium: { label: 'Aluminium', color: 0xc0c7cd, density: 2700 },
  nylon: { label: 'Nylon', color: 0xe3dcc9, density: 1150 },
}

/** Lightens or darkens a packed colour, so the parts read apart. */
function shade(color, f) {
  const c = [(color >> 16) & 255, (color >> 8) & 255, color & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(v * f))),
  )
  return (c[0] << 16) | (c[1] << 8) | c[2]
}

export const params = [
  // --- Gear -----------------------------------------------------------------
  {
    id: 'teeth',
    label: 'Number of teeth',
    type: 'int',
    min: 4,
    max: 200,
    step: 1,
    default: 24,
    group: 'Gear',
    help: 'With the module, this is the whole size of the gear: pitch diameter = module × teeth.',
  },
  {
    id: 'module',
    label: 'Module',
    type: 'number',
    min: 0.3,
    max: 20,
    step: 0.1,
    default: 3,
    unit: 'mm',
    group: 'Gear',
    help: 'Tooth size. Two gears only mesh if their module and pressure angle match.',
  },
  {
    id: 'pressureAngle',
    label: 'Pressure angle',
    type: 'number',
    min: 12,
    max: 30,
    step: 0.5,
    default: 20,
    unit: '°',
    group: 'Gear',
    help: '20° is the modern standard, 14.5° the older one. On a cast tooth it is the flank angle instead.',
  },
  {
    id: 'faceWidth',
    label: 'Face width',
    type: 'number',
    min: 1,
    max: 300,
    step: 1,
    default: 24,
    unit: 'mm',
    group: 'Gear',
    help: 'How thick the wheel is, measured along the shaft.',
  },
  {
    id: 'gearType',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'external', label: 'External' },
      { value: 'internal', label: 'Internal (ring gear)' },
    ],
    default: 'external',
    group: 'Gear',
    help: 'An internal gear is a ring with the teeth pointing inwards — the annulus of a planetary set.',
  },
  {
    id: 'profileShift',
    label: 'Profile shift',
    type: 'number',
    min: -0.6,
    max: 0.6,
    step: 0.05,
    default: 0,
    group: 'Gear',
    help: 'Cuts the tooth further out on the involute. Positive shift is how a small pinion avoids being undercut.',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'toothShape') === 'involute',
  },
  {
    id: 'backlash',
    label: 'Backlash',
    type: 'number',
    min: 0,
    max: 1,
    step: 0.02,
    default: 0.06,
    unit: 'mm',
    group: 'Gear',
    help: 'Taken off the tooth thickness, so a pair has somewhere for the oil to go.',
  },
  {
    id: 'material',
    label: 'Material',
    type: 'select',
    options: [
      { value: 'steel', label: 'Steel' },
      { value: 'castIron', label: 'Cast iron' },
      { value: 'brass', label: 'Brass' },
      { value: 'bronze', label: 'Bronze' },
      { value: 'aluminium', label: 'Aluminium' },
      { value: 'nylon', label: 'Nylon' },
    ],
    default: 'steel',
    group: 'Gear',
    help: 'Colour, and the density the mass is worked out from.',
  },

  // --- Teeth ----------------------------------------------------------------
  {
    id: 'toothShape',
    label: 'Tooth shape',
    type: 'select',
    options: [
      { value: 'involute', label: 'Involute' },
      { value: 'cycloidal', label: 'Cycloidal' },
      { value: 'trapezoidal', label: 'Trapezoidal' },
      { value: 'triangular', label: 'Triangular' },
      { value: 'round', label: 'Round (pin / sprocket)' },
      { value: 'ratchet', label: 'Ratchet' },
    ],
    default: 'involute',
    group: 'Teeth',
    help: 'Involute for anything that transmits power, cycloidal for clocks, the rest for cast, moulded and ratchet wheels.',
  },
  {
    id: 'addendum',
    label: 'Addendum',
    type: 'number',
    min: 0.4,
    max: 1.4,
    step: 0.05,
    default: 1,
    group: 'Teeth',
    help: 'Height of the tooth above the pitch circle, in modules. One is standard.',
  },
  {
    id: 'dedendum',
    label: 'Dedendum',
    type: 'number',
    min: 0.6,
    max: 1.8,
    step: 0.05,
    default: 1.25,
    group: 'Teeth',
    help: 'Depth below the pitch circle, in modules. The quarter over the addendum is the root clearance.',
  },
  {
    id: 'rootFillet',
    label: 'Root fillet',
    type: 'number',
    min: 0,
    max: 0.6,
    step: 0.05,
    default: 0.3,
    group: 'Teeth',
    help: 'Radius where the flank meets the root, in modules. This is where a tooth breaks, so it is never square.',
  },
  {
    id: 'tipRound',
    label: 'Tip rounding',
    type: 'number',
    min: 0,
    max: 0.4,
    step: 0.02,
    default: 0.06,
    group: 'Teeth',
    help: 'Takes the corner off the tip, in modules.',
  },
  {
    id: 'profileSteps',
    label: 'Flank resolution',
    type: 'int',
    min: 3,
    max: 30,
    step: 1,
    default: 10,
    group: 'Teeth',
    help: 'Points along each flank. The whole triangle count scales with this and the tooth count.',
  },
  {
    id: 'ratchetDirection',
    label: 'Ratchet direction',
    type: 'select',
    options: [
      { value: 'cw', label: 'Locks clockwise' },
      { value: 'ccw', label: 'Locks counter-clockwise' },
    ],
    default: 'cw',
    group: 'Teeth',
    help: 'Which way the radial catching face points.',
    visibleWhen: (p) => str(p, 'toothShape') === 'ratchet',
  },

  // --- Arrangement ----------------------------------------------------------
  {
    id: 'arrangement',
    label: 'Tooth arrangement',
    type: 'select',
    options: [
      { value: 'spur', label: 'Spur (straight)' },
      { value: 'helical', label: 'Helical (raked)' },
      { value: 'herringbone', label: 'Herringbone (V)' },
      { value: 'doubleHelical', label: 'Double helical (V, with a groove)' },
      { value: 'stepped', label: 'Stepped (staggered stages)' },
    ],
    default: 'spur',
    group: 'Arrangement',
    help: 'How the tooth runs across the face. Raking it puts more than one tooth in mesh at a time, which is what makes a helical gear quiet.',
  },
  {
    id: 'helixAngle',
    label: 'Helix angle',
    type: 'number',
    min: 5,
    max: 45,
    step: 1,
    default: 20,
    unit: '°',
    group: 'Arrangement',
    help: 'Measured at the pitch circle. 15–30° is usual; past that the thrust down the shaft gets expensive.',
    visibleWhen: (p) => ['helical', 'herringbone', 'doubleHelical'].includes(str(p, 'arrangement')),
  },
  {
    id: 'hand',
    label: 'Hand',
    type: 'select',
    options: [
      { value: 'right', label: 'Right hand' },
      { value: 'left', label: 'Left hand' },
    ],
    default: 'right',
    group: 'Arrangement',
    help: 'A right-hand gear runs with a left-hand one. On a V the two halves are one of each, so it is which way the apex leans.',
    visibleWhen: (p) => ['helical', 'herringbone', 'doubleHelical'].includes(str(p, 'arrangement')),
  },
  {
    id: 'grooveWidth',
    label: 'Relief groove',
    type: 'number',
    min: 1,
    max: 60,
    step: 1,
    default: 8,
    unit: 'mm',
    group: 'Arrangement',
    help: 'The gap between the two halves — the runout the cutter needs at the apex.',
    visibleWhen: (p) => str(p, 'arrangement') === 'doubleHelical',
  },
  {
    id: 'stages',
    label: 'Stages',
    type: 'int',
    min: 2,
    max: 6,
    step: 1,
    default: 3,
    group: 'Arrangement',
    help: 'Slices of straight teeth across the face, each one turned on from the last.',
    visibleWhen: (p) => str(p, 'arrangement') === 'stepped',
  },
  {
    id: 'stagger',
    label: 'Stagger',
    type: 'number',
    min: 0,
    max: 1,
    step: 0.05,
    default: 1,
    group: 'Arrangement',
    help: 'How far each stage is advanced, as a share of one pitch spread over all the stages.',
    visibleWhen: (p) => str(p, 'arrangement') === 'stepped',
  },

  // --- Blank ----------------------------------------------------------------
  {
    id: 'filler',
    label: 'Blank',
    type: 'select',
    options: [
      { value: 'solid', label: 'Solid' },
      { value: 'web', label: 'Recessed web' },
      { value: 'spokes', label: 'Spokes' },
      { value: 'holes', label: 'Lightening holes' },
      { value: 'ring', label: 'Open ring (no centre)' },
    ],
    default: 'solid',
    group: 'Blank',
    help: 'What fills the space between the rim and the hub.',
    visibleWhen: (p) => str(p, 'gearType') === 'external',
  },
  {
    id: 'rimWidth',
    label: 'Rim thickness',
    type: 'number',
    min: 0.5,
    max: 150,
    step: 0.5,
    default: 9,
    unit: 'mm',
    group: 'Blank',
    help: 'Solid metal under the root of the tooth. Thin rims flex and crack across the root.',
  },
  {
    id: 'webThickness',
    label: 'Web thickness',
    type: 'number',
    min: 0.5,
    max: 150,
    step: 0.5,
    default: 8,
    unit: 'mm',
    group: 'Blank',
    help: 'Thickness of the web or the spokes, centred across the face.',
    visibleWhen: (p) =>
      str(p, 'gearType') === 'external' && ['web', 'spokes', 'holes'].includes(str(p, 'filler')),
  },
  {
    id: 'spokeCount',
    label: 'Spokes',
    type: 'int',
    min: 3,
    max: 16,
    step: 1,
    default: 5,
    group: 'Blank',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') === 'spokes',
  },
  {
    id: 'spokeWidth',
    label: 'Spoke width',
    type: 'number',
    min: 1,
    max: 120,
    step: 0.5,
    default: 14,
    unit: 'mm',
    group: 'Blank',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') === 'spokes',
  },
  {
    id: 'spokeShape',
    label: 'Spoke shape',
    type: 'select',
    options: [
      { value: 'straight', label: 'Straight' },
      { value: 'tapered', label: 'Tapered, filleted ends' },
      { value: 'curved', label: 'Curved' },
    ],
    default: 'tapered',
    group: 'Blank',
    help: 'Curved spokes are the cast-iron habit: they let the casting shrink without cracking.',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') === 'spokes',
  },
  {
    id: 'holeCount',
    label: 'Holes',
    type: 'int',
    min: 2,
    max: 20,
    step: 1,
    default: 6,
    group: 'Blank',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') === 'holes',
  },
  {
    id: 'holeSize',
    label: 'Hole size',
    type: 'number',
    min: 0.1,
    max: 0.95,
    step: 0.05,
    default: 0.6,
    group: 'Blank',
    help: 'As a share of the space between the hub and the rim.',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') === 'holes',
  },

  // --- Hub and bore ---------------------------------------------------------
  {
    id: 'bore',
    label: 'Bore diameter',
    type: 'number',
    min: 0,
    max: 400,
    step: 0.5,
    default: 16,
    unit: 'mm',
    group: 'Hub & bore',
    help: 'The hole the shaft goes through. Zero leaves the centre solid.',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') !== 'ring',
  },
  {
    id: 'boreStyle',
    label: 'Bore',
    type: 'select',
    options: [
      { value: 'plain', label: 'Plain' },
      { value: 'keyway', label: 'Keyway' },
      { value: 'dFlat', label: 'D-flat' },
      { value: 'hex', label: 'Hexagon' },
      { value: 'square', label: 'Square' },
      { value: 'splined', label: 'Splined' },
    ],
    default: 'plain',
    group: 'Hub & bore',
    help: 'How the wheel is stopped from turning on its shaft.',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') !== 'ring',
  },
  {
    id: 'keyWidth',
    label: 'Key width',
    type: 'number',
    min: 1,
    max: 40,
    step: 0.5,
    default: 5,
    unit: 'mm',
    group: 'Hub & bore',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'boreStyle') === 'keyway',
  },
  {
    id: 'keyDepth',
    label: 'Key depth',
    type: 'number',
    min: 0.2,
    max: 20,
    step: 0.1,
    default: 2.3,
    unit: 'mm',
    group: 'Hub & bore',
    help: 'Measured out from the bore, the way a shaft keyway is.',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'boreStyle') === 'keyway',
  },
  {
    id: 'flatDepth',
    label: 'Flat depth',
    type: 'number',
    min: 0.2,
    max: 30,
    step: 0.1,
    default: 1.5,
    unit: 'mm',
    group: 'Hub & bore',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'boreStyle') === 'dFlat',
  },
  {
    id: 'splineCount',
    label: 'Splines',
    type: 'int',
    min: 4,
    max: 40,
    step: 1,
    default: 12,
    group: 'Hub & bore',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'boreStyle') === 'splined',
  },
  {
    id: 'hubDiameter',
    label: 'Hub diameter',
    type: 'number',
    min: 0,
    max: 500,
    step: 1,
    default: 40,
    unit: 'mm',
    group: 'Hub & bore',
    help: 'The boss around the bore. Below the bore it is ignored.',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') !== 'ring',
  },
  {
    id: 'hub',
    label: 'Hub stands proud',
    type: 'select',
    options: [
      { value: 'none', label: 'Flush with the face' },
      { value: 'front', label: 'Front' },
      { value: 'back', label: 'Back' },
      { value: 'both', label: 'Both faces' },
    ],
    default: 'none',
    group: 'Hub & bore',
    help: 'A long boss is what a grub screw and a narrow gear need to stay square on the shaft.',
    visibleWhen: (p) => str(p, 'gearType') === 'external' && str(p, 'filler') !== 'ring',
  },
  {
    id: 'hubProjection',
    label: 'Hub projection',
    type: 'number',
    min: 1,
    max: 200,
    step: 1,
    default: 12,
    unit: 'mm',
    group: 'Hub & bore',
    help: 'How far it stands out of each face it is on.',
    visibleWhen: (p) =>
      str(p, 'gearType') === 'external' && str(p, 'filler') !== 'ring' && str(p, 'hub') !== 'none',
  },

  // --- Lip ------------------------------------------------------------------
  {
    id: 'lip',
    label: 'Lip',
    type: 'select',
    options: [
      { value: 'none', label: 'None' },
      { value: 'front', label: 'Front' },
      { value: 'back', label: 'Back' },
      { value: 'both', label: 'Both faces' },
    ],
    default: 'none',
    group: 'Lip',
    help: 'A flange standing off the face, past the tips — what keeps a belt or a chain on a toothed pulley.',
  },
  {
    id: 'lipRise',
    label: 'Lip rise',
    type: 'number',
    min: 0.5,
    max: 60,
    step: 0.5,
    default: 5,
    unit: 'mm',
    group: 'Lip',
    help: 'How far it stands past the tip circle.',
    visibleWhen: (p) => str(p, 'lip') !== 'none',
  },
  {
    id: 'lipThickness',
    label: 'Lip thickness',
    type: 'number',
    min: 0.5,
    max: 40,
    step: 0.5,
    default: 4,
    unit: 'mm',
    group: 'Lip',
    visibleWhen: (p) => str(p, 'lip') !== 'none',
  },
]

/* ===========================================================================
 * Sizes
 * =========================================================================== */

function layout(p) {
  const teeth = Math.max(4, Math.round(num(p, 'teeth')))
  const m = num(p, 'module')
  const alpha = rad(num(p, 'pressureAngle'))
  const internal = str(p, 'gearType') === 'internal'
  const shape = str(p, 'toothShape')
  const shift = internal || shape !== 'involute' ? 0 : num(p, 'profileShift')

  const pitchR = (m * teeth) / 2
  const baseR = pitchR * Math.cos(alpha)
  const ha = num(p, 'addendum') * m
  const hf = num(p, 'dedendum') * m
  // Internal teeth point inwards, so the tip is the small radius and the root
  // the large one. Everything downstream only ever reads tipR and rootR, which
  // is why one set of flank code draws both.
  const tipR = internal ? Math.max(pitchR - ha, m) : pitchR + ha + shift * m
  const rootR = internal ? pitchR + hf : Math.max(pitchR - hf + shift * m, m * 0.4)
  const tau = (Math.PI * 2) / teeth
  const backlash = num(p, 'backlash')
  // Tooth thickness at the pitch circle. A profile shift fattens it; backlash
  // takes a little off. An internal tooth is the space of the wheel it runs in.
  const thick = internal
    ? m * (Math.PI / 2) - backlash
    : m * (Math.PI / 2 + 2 * shift * Math.tan(alpha)) - backlash
  const s = Math.max(thick, m * 0.15)

  const faceWidth = num(p, 'faceWidth')
  const rimWidth = num(p, 'rimWidth')
  const filler = internal ? 'ring' : str(p, 'filler')

  // Everything inside the rim, sized so nothing can pass through anything else.
  const rimInner = internal ? rootR : Math.max(rootR - rimWidth, m * 0.3)
  const rimOuter = internal ? rootR + rimWidth : rootR
  // The toothed band is taken a shade past the root circle rather than to it.
  // A hole that touches its own outline is not a hole — the triangulation of
  // the end faces loses it — and the seam between the band and the rim has to
  // land somewhere that is inside both.
  const overlap = Math.min(1, rimWidth * 0.4, m * 0.3)
  const bandInner = internal ? rootR : rootR - overlap
  const bandOuter = internal ? rootR + overlap : rootR
  // A solid blank is metal all the way in, so the bore may come up under the
  // teeth. Anything else has to leave the rim standing.
  const solid = filler === 'solid'
  const boreAsked = internal ? 0 : num(p, 'bore') / 2
  const boreR = Math.max(0, Math.min(boreAsked, (solid ? bandInner : rimInner) - 1))
  const hubAsked = internal ? 0 : num(p, 'hubDiameter') / 2
  // A web, spokes or lightening holes have to land on something, so those
  // always get a hub even if none was asked for. Only a solid blank can do
  // without one, and then the bore is cut straight through it.
  const wantsHub =
    !internal &&
    filler !== 'ring' &&
    (!solid || hubAsked > boreR + 0.4 || str(p, 'hub') !== 'none')
  const hubR = wantsHub
    ? Math.max(
        boreR + Math.min(1.5, boreR * 0.3 + 0.5),
        Math.min(hubAsked, (solid ? bandInner : rimInner) - 0.5),
      )
    : boreR
  // A hexagon, a keyway or a spline all reach further out than the bore they
  // are cut in. Past the edge of the ring holding them they would stop being a
  // hole at all, so that edge is where they stop.
  const holeLimit = (wantsHub ? hubR : bandInner) - 0.3

  const lip = str(p, 'lip')
  const lipRise = num(p, 'lipRise')
  const lipOuter = internal ? rootR : tipR + lipRise
  const lipInner = internal ? Math.max(tipR - lipRise, m * 0.3) : rootR

  const standR = Math.max(rimOuter, tipR, lip === 'none' ? 0 : lipOuter)

  return {
    p,
    teeth,
    module: m,
    alpha,
    internal,
    shape,
    shift,
    pitchR,
    baseR,
    ha,
    hf,
    tipR,
    rootR,
    tau,
    s,
    psi0: s / (2 * pitchR),
    faceWidth,
    filler,
    rimWidth,
    rimInner,
    rimOuter,
    bandInner,
    bandOuter,
    solid,
    boreR,
    boreAsked,
    hubR,
    hubAsked,
    wantsHub,
    holeLimit,
    lip,
    lipRise,
    lipOuter,
    lipInner,
    lipThickness: num(p, 'lipThickness'),
    webThickness: Math.min(num(p, 'webThickness'), faceWidth),
    profileSteps: Math.max(3, Math.round(num(p, 'profileSteps'))),
    rootFillet: num(p, 'rootFillet') * m,
    tipRound: num(p, 'tipRound') * m,
    material: str(p, 'material'),
    standR,
  }
}

/* ===========================================================================
 * The tooth
 *
 * Each shape supplies one flank, running from the root circle out to the tip
 * and given as XY points about a tooth centred on angle zero. `symmetricTooth`
 * then does the rest — mirror it, fillet where it lands on the root circle,
 * round the tip, and close the gap to the next tooth along the root.
 * =========================================================================== */

/** Drops points closer together than the resolution of the object. */
function dedupe(pts, grain = 0.015) {
  const out = []
  for (const q of pts) {
    const prev = out[out.length - 1]
    if (prev && Math.hypot(prev.x - q.x, prev.y - q.y) < grain) continue
    out.push(q)
  }
  return out
}

function pushPoint(out, q) {
  const prev = out[out.length - 1]
  if (prev && Math.hypot(prev.x - q.x, prev.y - q.y) < 0.015) return
  out.push(q)
}

/** Samples an arc of `r` from `a0` to `a1`, end included. */
function arc(out, r, a0, a1, maxStep = 0.12) {
  const span = a1 - a0
  if (Math.abs(span) < 1e-6) return
  const steps = Math.max(1, Math.ceil(Math.abs(span) / maxStep))
  for (let i = 1; i <= steps; i++) pushPoint(out, pol(r, a0 + (span * i) / steps))
}

/** Quadratic Bézier a → b with c pulling it, which is a corner rounded off. */
function quad(a, c, b, steps = 5) {
  const out = [a]
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    out.push({
      x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    })
  }
  return out
}

/** Length once along a polyline. */
function runLength(pts) {
  let total = 0
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
  return total
}

/** The point `distance` along a polyline, and whatever is left after it. */
function walk(pts, distance) {
  let travelled = 0
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
    if (travelled + seg >= distance) {
      const t = seg < 1e-9 ? 0 : (distance - travelled) / seg
      return {
        point: {
          x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
          y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t,
        },
        rest: pts.slice(i),
      }
    }
    travelled += seg
  }
  return { point: pts[pts.length - 1], rest: [] }
}

/** Radii from root to tip, clustered where the flank turns most. */
function radialSteps(L) {
  const out = []
  for (let i = 0; i <= L.profileSteps; i++) {
    const t = i / L.profileSteps
    out.push(L.rootR + (L.tipR - L.rootR) * Math.pow(t, 1.3))
  }
  return out
}

/**
 * Half the tooth's angular thickness at a radius, on an involute flank.
 *
 * Inside the base circle there is no involute — the generating rack has left
 * the tooth alone down there — so the angle is held and the flank runs straight
 * out of the centre, which is what an undercut root really looks like.
 */
function involuteHalfAngle(L, rho) {
  const clamped = Math.max(rho, L.baseR)
  const aRho = Math.acos(Math.min(1, L.baseR / clamped))
  const d = inv(aRho) - inv(L.alpha)
  return L.psi0 + (L.internal ? d : -d)
}

function straightHalfAngle(L, rho, flankTan) {
  const dir = L.internal ? -1 : 1
  return (L.s / 2 - dir * (rho - L.pitchR) * flankTan) / rho
}

/**
 * Epicycloid above the pitch circle, radial below it: the clockmaker's tooth.
 * The generating circle is 1.5 modules — half the pitch circle of a six-leaf
 * pinion, which is what wheels of this shape are cut to run with.
 */
function cycloidalFlank(L) {
  const clamp = (a) => Math.min(Math.max(a, 0), L.tau * 0.47)
  const pts = []
  const low = Math.max(2, Math.round(L.profileSteps / 2))
  for (let i = 0; i <= low; i++) {
    const rho = L.rootR + (L.pitchR - L.rootR) * (i / low)
    pts.push(pol(rho, clamp(L.psi0)))
  }
  const R = L.pitchR
  const rg = Math.max(1.5 * L.module, 0.15)
  const reach = Math.abs(L.tipR - L.pitchR)
  const k = L.internal ? (R - rg) / rg : (R + rg) / rg
  const curve = []
  for (let i = 1; i <= 3000; i++) {
    const t = i * 0.003
    const q = L.internal
      ? { x: (R - rg) * Math.cos(t) + rg * Math.cos(k * t), y: (R - rg) * Math.sin(t) - rg * Math.sin(k * t) }
      : { x: (R + rg) * Math.cos(t) - rg * Math.cos(k * t), y: (R + rg) * Math.sin(t) - rg * Math.sin(k * t) }
    curve.push(q)
    if (Math.abs(radiusOf(q) - R) >= reach) break
  }
  const steps = Math.max(4, L.profileSteps)
  for (let i = 1; i <= steps; i++) {
    const q = curve[Math.min(curve.length - 1, Math.round((curve.length - 1) * (i / steps)))]
    if (!q) continue
    // The sampling steps past the tip by a hair; the tip circle is the tip.
    const rho = L.internal ? Math.max(radiusOf(q), L.tipR) : Math.min(radiusOf(q), L.tipR)
    pts.push(pol(rho, clamp(L.psi0 - Math.abs(angleOf(q)))))
  }
  return dedupe(pts)
}

/** A half-round tooth on a straight stalk — a pin, lantern or sprocket tooth. */
function roundFlank(L) {
  const dir = L.internal ? -1 : 1
  const w = Math.min(L.s * 1.15, L.tau * L.pitchR * 0.5, Math.abs(L.tipR - L.rootR) * 1.6)
  const rc = L.tipR - dir * (w / 2)
  const base = { x: rc, y: w / 2 }
  const baseA = Math.min(angleOf(base), L.tau * 0.47)
  const pts = [pol(L.rootR, baseA)]
  if (Math.abs(radiusOf(base) - L.rootR) > 0.2) pts.push(pol(radiusOf(base), baseA))
  const steps = Math.max(5, L.profileSteps)
  for (let i = 1; i <= steps; i++) {
    const phi = (Math.PI / 2) * (1 - i / steps)
    pts.push({ x: rc + dir * (w / 2) * Math.cos(phi), y: (w / 2) * Math.sin(phi) })
  }
  return dedupe(pts)
}

function flankOf(L) {
  if (L.shape === 'cycloidal') return cycloidalFlank(L)
  if (L.shape === 'round') return roundFlank(L)
  const clamp = (a) => Math.min(Math.max(a, 0), L.tau * 0.47)
  const flankTan =
    L.shape === 'triangular'
      ? L.s / 2 / Math.max(Math.abs(L.tipR - L.pitchR), 0.05)
      : Math.tan(L.alpha)
  const pts = []
  for (const rho of radialSteps(L)) {
    const a =
      L.shape === 'involute' ? involuteHalfAngle(L, rho) : straightHalfAngle(L, rho, flankTan)
    pts.push(pol(rho, clamp(a)))
  }
  return dedupe(pts)
}

/**
 * One tooth and the space that follows it, as XY points about a tooth centred
 * on angle zero, in order of increasing angle.
 */
function symmetricTooth(L, flank) {
  const half = L.tau / 2
  let plus = dedupe(flank)
  if (plus.length < 2) plus = [pol(L.rootR, L.psi0), pol(L.tipR, 0)]
  const length = runLength(plus)

  // Root fillet: the corner where the flank lands on the root circle.
  const fillet = Math.min(L.rootFillet, length * 0.35, L.rootR * half * 0.6)
  if (fillet > 0.05) {
    const corner = plus[0]
    const stepped = walk(plus, fillet)
    const joinA = Math.min(angleOf(corner) + fillet / L.rootR, half * 0.985)
    plus = quad(pol(L.rootR, joinA), corner, stepped.point, 5).concat(stepped.rest)
  }

  // Tip rounding, worked from the tip back down the flank.
  const tipA = Math.max(angleOf(plus[plus.length - 1]), 0)
  let landA = tipA
  const round = Math.min(L.tipRound, runLength(plus) * 0.3)
  if (round > 0.05) {
    const back = walk(plus.slice().reverse(), round)
    landA = Math.max(tipA - round / L.tipR, 0)
    plus = back.rest
      .slice()
      .reverse()
      .concat(quad(back.point, pol(L.tipR, tipA), pol(L.tipR, landA), 4))
  }
  plus = dedupe(plus)

  const startA = angleOf(plus[0])
  const out = []
  pushPoint(out, pol(L.rootR, -half))
  arc(out, L.rootR, -half, -startA)
  for (const q of plus) pushPoint(out, mirror(q))
  arc(out, L.tipR, -landA, landA)
  for (let i = plus.length - 1; i >= 0; i--) pushPoint(out, plus[i])
  arc(out, L.rootR, startA, half)
  return out
}

/** A sawtooth: a long back rising to the tip, then a radial face to catch on. */
function ratchetTooth(L) {
  const half = L.tau / 2
  const flat = half * 0.25
  const tipA = half * 0.85
  const out = []
  pushPoint(out, pol(L.rootR, -half))
  arc(out, L.rootR, -half, -half + flat)
  const from = pol(L.rootR, -half + flat)
  const to = pol(L.tipR, tipA)
  const steps = Math.max(3, L.profileSteps)
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    pushPoint(out, { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t })
  }
  // The catching face runs back down the radius, filleted where it meets the root.
  const foot = pol(L.rootR, tipA)
  const fillet = Math.min(L.rootFillet, (L.tipR - L.rootR) * 0.3, L.rootR * (half - tipA) * 0.8)
  if (fillet > 0.05) {
    const lift = pol(L.rootR + fillet, tipA)
    for (const q of quad(lift, foot, pol(L.rootR, tipA + fillet / L.rootR), 4)) pushPoint(out, q)
    arc(out, L.rootR, tipA + fillet / L.rootR, half)
  } else {
    pushPoint(out, foot)
    arc(out, L.rootR, tipA, half)
  }
  if (str(L.p, 'ratchetDirection') === 'ccw') return out.map(mirror).reverse()
  return out
}

/** The whole tooth ring: one tooth repeated round the circle. */
function gearOutline(L) {
  const tooth = L.shape === 'ratchet' ? ratchetTooth(L) : symmetricTooth(L, flankOf(L))
  const out = []
  for (let i = 0; i < L.teeth; i++) {
    const a = i * L.tau
    const c = Math.cos(a)
    const s = Math.sin(a)
    for (const q of tooth) pushPoint(out, { x: q.x * c - q.y * s, y: q.x * s + q.y * c })
  }
  while (out.length > 3 && Math.hypot(out[0].x - out[out.length - 1].x, out[0].y - out[out.length - 1].y) < 0.015) {
    out.pop()
  }
  return out
}

/* ===========================================================================
 * Rings, and pushing them through a thickness
 * =========================================================================== */

function circle(r, segments) {
  const n = segments ?? Math.max(24, Math.min(160, Math.round(r * 1.4)))
  const pts = []
  for (let i = 0; i < n; i++) pts.push(pol(r, (Math.PI * 2 * i) / n))
  return pts
}

/**
 * Extrudes a closed outline, with holes, through a thickness along +Z.
 *
 * `twist` turns the section as it goes, which is the whole of a helical tooth:
 * a helix is a straight tooth rotated in proportion to how far along the face
 * it has got. The extrusion is stepped finely enough for the turn to read as a
 * curve rather than a fold.
 */
function extrude(outer, holes, thickness, twist, z0 = 0) {
  if (!outer || outer.length < 3) return null
  const shape = new THREE.Shape(outer.map((q) => new THREE.Vector2(q.x, q.y)))
  for (const hole of holes ?? []) {
    if (hole && hole.length > 2) shape.holes.push(new THREE.Path(hole.map((q) => new THREE.Vector2(q.x, q.y))))
  }
  const depth = Math.max(thickness, 0.05)
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    steps: twist ? twist.steps : 1,
    curveSegments: 8,
  })
  if (twist) {
    const pos = g.getAttribute('position')
    for (let i = 0; i < pos.count; i++) {
      const a = twist.at(pos.getZ(i))
      if (!a) continue
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setXY(i, x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a))
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
  }
  if (z0) g.translate(0, 0, z0)
  return g
}

/** A turn from `a0` at the near face to `a1` at the far one. */
function lerpTwist(thickness, a0, a1) {
  if (Math.abs(a1 - a0) < 2e-3) return null
  const steps = Math.max(2, Math.min(20, Math.ceil((Math.abs(a1 - a0) * 180) / Math.PI / 5)))
  return { steps, at: (z) => a0 + ((a1 - a0) * z) / Math.max(thickness, 1e-6) }
}

/** The toothed band alone: root circle to tip, whichever way the teeth point. */
function toothBand(L, outline, thickness, twist, z0) {
  return L.internal
    ? extrude(circle(L.bandOuter), [outline], thickness, twist, z0)
    : extrude(outline, [circle(L.bandInner)], thickness, twist, z0)
}

/** The teeth, laid out across the face however the arrangement asks. */
function teethSolid(L) {
  const outline = gearOutline(L)
  const b = L.faceWidth
  const arrangement = str(L.p, 'arrangement')
  const sign = str(L.p, 'hand') === 'left' ? -1 : 1
  // Total turn across the face, from the helix angle taken at the pitch circle.
  const total = (b * Math.tan(rad(num(L.p, 'helixAngle')))) / L.pitchR

  if (arrangement === 'helical') {
    return [toothBand(L, outline, b, lerpTwist(b, 0, sign * total), 0)]
  }
  // Where two bands meet they are lapped a tenth of a millimetre into each
  // other. Butted exactly, the two end faces would sit in the same plane and
  // the renderer would have to choose between them every frame.
  const lap = Math.min(0.1, b * 0.02)
  if (arrangement === 'herringbone') {
    const h = b / 2
    return [
      toothBand(L, outline, h, lerpTwist(h, 0, (sign * total) / 2), 0),
      toothBand(L, outline, h + lap, lerpTwist(h + lap, (sign * total) / 2, 0), h - lap),
    ]
  }
  if (arrangement === 'doubleHelical') {
    const groove = Math.min(num(L.p, 'grooveWidth'), b * 0.6)
    const h = (b - groove) / 2
    return [
      toothBand(L, outline, h, lerpTwist(h, 0, (sign * total) / 2), 0),
      toothBand(L, outline, h, lerpTwist(h, (sign * total) / 2, 0), h + groove),
    ]
  }
  if (arrangement === 'stepped') {
    const stages = Math.max(2, Math.round(num(L.p, 'stages')))
    const step = b / stages
    const turn = (L.tau * num(L.p, 'stagger')) / stages
    const out = []
    for (let i = 0; i < stages; i++) {
      const g = toothBand(L, outline, step + (i ? lap : 0), null, 0)
      if (!g) continue
      g.rotateZ(i * turn)
      g.translate(0, 0, i * step - (i ? lap : 0))
      out.push(g)
    }
    return out
  }
  return [toothBand(L, outline, b, null, 0)]
}

/* ===========================================================================
 * The blank: rim, web, spokes, hub, bore, lip
 * =========================================================================== */

/** The hole down the middle, in whatever shape stops it turning on its shaft. */
function boreOutline(L) {
  const r = L.boreR
  if (r < 0.4) return null
  const style = str(L.p, 'boreStyle')
  const limit = Math.max(L.holeLimit, r)
  if (style === 'hex' || style === 'square') {
    const n = style === 'hex' ? 6 : 4
    // Across the flats is the bore; the corners reach further, and are held in.
    const circum = Math.min(r / Math.cos(Math.PI / n), limit)
    const pts = []
    for (let i = 0; i < n; i++) pts.push(pol(circum, (Math.PI * 2 * i) / n + Math.PI / n))
    return pts
  }
  if (style === 'dFlat') {
    const flat = Math.min(num(L.p, 'flatDepth'), r * 0.8)
    return dedupe(circle(r).map((q) => ({ x: q.x, y: Math.min(q.y, r - flat) })))
  }
  if (style === 'splined') {
    const n = Math.max(4, Math.round(num(L.p, 'splineCount')))
    const depth = Math.min(r * 0.14, 1.8, limit - r)
    const pts = []
    const samples = Math.max(96, n * 8)
    for (let i = 0; i < samples; i++) {
      const a = (Math.PI * 2 * i) / samples
      pts.push(pol(r + depth * (0.5 + 0.5 * Math.cos(n * a)), a))
    }
    return pts
  }
  if (style === 'keyway') {
    const kw = Math.min(num(L.p, 'keyWidth'), r * 1.2, limit * 1.6)
    const kd = Math.min(num(L.p, 'keyDepth'), r * 0.8, limit - r)
    const yc = Math.sqrt(Math.max(r * r - (kw / 2) * (kw / 2), 0))
    const pts = []
    let notched = false
    for (const q of circle(r)) {
      if (q.y > 0 && Math.abs(q.x) < kw / 2) {
        if (!notched) {
          pts.push({ x: kw / 2, y: yc }, { x: kw / 2, y: r + kd }, { x: -kw / 2, y: r + kd }, { x: -kw / 2, y: yc })
          notched = true
        }
        continue
      }
      pts.push(q)
    }
    return pts
  }
  return circle(r)
}

/** One spoke, as a closed outline from the hub out to the rim. */
function spokeOutline(L, index, count) {
  const shape = str(L.p, 'spokeShape')
  const w = num(L.p, 'spokeWidth')
  const r0 = Math.max(L.hubR - 1.5, 0.5)
  const r1 = L.rimInner + 1.5
  if (r1 - r0 < 1) return null
  const a0 = (Math.PI * 2 * index) / count
  // A curved spoke leans off the radius on its way out; how far is the only
  // thing that separates it from a straight one.
  const bend = shape === 'curved' ? rad(22) : 0
  const steps = 16
  const left = []
  const right = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const rr = r0 + (r1 - r0) * t
    // Cast spokes are waisted: fat where they meet the hub and the rim, and
    // narrower in between, so nothing is asked to turn a sharp corner.
    const flare =
      shape === 'straight'
        ? 1
        : 1 +
          0.9 * Math.pow(Math.max(0, 1 - t / 0.25), 2) +
          0.7 * Math.pow(Math.max(0, 1 - (1 - t) / 0.2), 2)
    const width = (shape === 'straight' ? w : w * (1 - 0.3 * t)) * flare
    const a = a0 + bend * t * t
    const halfA = width / 2 / rr
    right.push(pol(rr, a - halfA))
    left.push(pol(rr, a + halfA))
  }
  return dedupe(right.concat(left.reverse()))
}

/** Lightening holes, evenly spaced between the hub and the rim. */
function holeOutlines(L) {
  const n = Math.max(2, Math.round(num(L.p, 'holeCount')))
  const mid = (L.rimInner + L.hubR) / 2
  const room = Math.min((L.rimInner - L.hubR) / 2, (Math.PI * mid) / n)
  const r = room * num(L.p, 'holeSize') * 0.95
  if (r < 0.5) return []
  const out = []
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n
    const c = pol(mid, a)
    out.push(circle(r, Math.max(16, Math.min(48, Math.round(r * 2)))).map((q) => ({ x: q.x + c.x, y: q.y + c.y })))
  }
  return out
}

/* ===========================================================================
 * Build
 * =========================================================================== */

export function build(p) {
  const L = layout(p)
  const M = MATERIALS[L.material] ?? MATERIALS.steel
  const b = L.faceWidth
  const parts = []
  const add = (name, geoms, color) => {
    const usable = (Array.isArray(geoms) ? geoms : [geoms]).filter(Boolean)
    if (!usable.length) return
    const geometry = merge(usable)
    if (triangleCount(geometry) > 0) parts.push({ name, geometry, color })
  }

  add('teeth', teethSolid(L), shade(M.color, 1.1))

  const bore = L.internal ? null : boreOutline(L)
  // Where the blank stops: the hub if there is one, the bore if there is not.
  const centreR = L.wantsHub ? L.hubR : L.boreR
  // A solid blank with no hub is one ring, from under the teeth to the bore.
  // Splitting it would only put a seam somewhere the bore might want to be.
  const oneRing = L.solid && !L.wantsHub
  // The rim: a plain ring under the root, holding the teeth together whatever
  // is or is not across the middle.
  const rimStop = L.solid ? Math.max(L.rimInner, centreR) : L.rimInner
  if (L.internal) {
    add('rim', extrude(circle(L.rimOuter), [circle(L.bandOuter)], b, null, 0), M.color)
  } else if (!oneRing && rimStop < L.bandInner - 0.05) {
    add('rim', extrude(circle(L.bandInner), [circle(rimStop)], b, null, 0), M.color)
  }

  if (!L.internal && L.filler !== 'ring') {
    const webZ = (b - L.webThickness) / 2
    if (L.filler === 'solid') {
      // Solid to the hub, and the hub carries on to the bore. Running the web
      // itself to the bore would lay it over the hub, face on face.
      const outer = oneRing ? L.bandInner : rimStop
      if (centreR < outer - 0.05) {
        add(
          'web',
          extrude(circle(outer), [L.wantsHub ? circle(L.hubR) : bore], b, null, 0),
          shade(M.color, 0.94),
        )
      }
    } else if (L.hubR < L.rimInner - 0.5) {
      if (L.filler === 'web') {
        add(
          'web',
          extrude(circle(L.rimInner), [circle(L.hubR)], L.webThickness, null, webZ),
          shade(M.color, 0.94),
        )
      } else if (L.filler === 'holes') {
        add(
          'web',
          extrude(circle(L.rimInner), [circle(L.hubR), ...holeOutlines(L)], L.webThickness, null, webZ),
          shade(M.color, 0.94),
        )
      } else if (L.filler === 'spokes') {
        const count = Math.max(3, Math.round(num(p, 'spokeCount')))
        const spokes = []
        for (let i = 0; i < count; i++) {
          spokes.push(extrude(spokeOutline(L, i, count), [], L.webThickness, null, webZ))
        }
        add('spokes', spokes, shade(M.color, 0.94))
      }
    }

    // The hub: the ring between the bore and the blank. Standing it proud is
    // what a narrow gear needs to sit square on a shaft.
    const side = str(p, 'hub')
    const proj = side === 'none' ? 0 : num(p, 'hubProjection')
    const front = side === 'front' || side === 'both' ? proj : 0
    const back = side === 'back' || side === 'both' ? proj : 0
    if (L.wantsHub && L.hubR > L.boreR + 0.2) {
      add('hub', extrude(circle(L.hubR), [bore], b + front + back, null, -back), shade(M.color, 0.86))
    }
  }

  if (L.lip !== 'none') {
    const t = L.lipThickness
    // Let into the face rather than stood on it, for the same reason the
    // herringbone halves are lapped: two faces in one plane pick a fight.
    const sink = Math.min(0.2, t * 0.2)
    const rings = []
    if (L.lip === 'front' || L.lip === 'both') {
      rings.push(extrude(circle(L.lipOuter), [circle(L.lipInner)], t + sink, null, b - sink))
    }
    if (L.lip === 'back' || L.lip === 'both') {
      rings.push(extrude(circle(L.lipOuter), [circle(L.lipInner)], t + sink, null, -t))
    }
    add('lip', rings, shade(M.color, 1.02))
  }

  // Drawn about the axis with the far face on Z = 0; stood on the ground and
  // pushed back so the front face is Z = 0, facing the studio's Front view.
  for (const part of parts) part.geometry.translate(0, L.standR, -b)
  return parts
}

/* ===========================================================================
 * Metrics
 * =========================================================================== */

/** Roughly what is left after the teeth, the holes and the recesses. */
function volume(L) {
  const ring = (ro, ri, t) => Math.PI * Math.max(ro * ro - ri * ri, 0) * Math.max(t, 0)
  const b = L.faceWidth
  let v = L.internal
    ? ring(L.rootR, L.tipR, b) * 0.5 + ring(L.rimOuter, L.rootR, b)
    : ring(L.tipR, L.rootR, b) * 0.52 + ring(L.rootR, L.rimInner, b)
  if (!L.internal && L.filler !== 'ring') {
    if (L.filler === 'solid') v += ring(L.rimInner, L.boreR, b)
    else if (L.filler === 'web') v += ring(L.rimInner, L.hubR, L.webThickness)
    else if (L.filler === 'holes') v += ring(L.rimInner, L.hubR, L.webThickness) * 0.6
    else if (L.filler === 'spokes') {
      const count = Math.max(3, Math.round(num(L.p, 'spokeCount')))
      v += count * num(L.p, 'spokeWidth') * Math.max(L.rimInner - L.hubR, 0) * L.webThickness
    }
    const side = str(L.p, 'hub')
    const proj = side === 'none' ? 0 : num(L.p, 'hubProjection') * (side === 'both' ? 2 : 1)
    if (L.filler !== 'solid') v += ring(L.hubR, L.boreR, b + proj)
    else v += ring(L.hubR, L.boreR, proj)
  }
  if (L.lip !== 'none') {
    v += ring(L.lipOuter, L.lipInner, L.lipThickness) * (L.lip === 'both' ? 2 : 1)
  }
  return v
}

export function metrics(p) {
  const L = layout(p)
  const rows = []
  const m = L.module

  rows.push({
    label: 'Pitch diameter',
    value: formatLength(L.pitchR * 2),
    note: `Module ${m} × ${L.teeth} teeth. ${
      L.internal
        ? 'A pinion runs inside it at the difference of their pitch radii.'
        : 'Two gears mesh at the sum of their pitch radii.'
    }`,
  })
  rows.push({
    label: L.internal ? 'Tip diameter (inward)' : 'Outside diameter',
    value: formatLength(L.tipR * 2),
  })
  rows.push({ label: 'Root diameter', value: formatLength(L.rootR * 2) })
  if (L.internal) rows.push({ label: 'Outside diameter', value: formatLength(L.rimOuter * 2) })
  if (!L.internal) {
    rows.push({
      label: 'Centres, meshed with an identical gear',
      value: formatLength(L.pitchR * 2),
      note: 'Centre distance for a pair is module × (teeth + teeth) ÷ 2.',
    })
  }

  // Undercut: below this many teeth the cutter digs into the root of the flank
  // and takes the strength with it. A positive profile shift is the way out.
  if (L.shape === 'involute' && !L.internal) {
    const minimum = (2 * num(p, 'addendum') * (1 - L.shift)) / Math.pow(Math.sin(L.alpha), 2)
    if (L.teeth < minimum) {
      rows.push({
        label: 'Undercut',
        value: `below ${Math.ceil(minimum)} teeth`,
        level: L.teeth < minimum * 0.8 ? 'error' : 'warn',
        note: `At ${num(p, 'pressureAngle')}° a shift of about ${(1 - (L.teeth * Math.pow(Math.sin(L.alpha), 2)) / (2 * num(p, 'addendum'))).toFixed(2)} clears it.`,
      })
    }
  }

  // A tooth that runs to a point has no tip left to carry a load. Measured on
  // the flank before the tip is rounded, which is the tooth thickness at the
  // tip circle: rounding the corner off is not the same as having no tooth.
  if (L.shape !== 'ratchet') {
    const flank = flankOf(L)
    const land = 2 * Math.max(angleOf(flank[flank.length - 1]), 0) * L.tipR
    if (L.shape !== 'triangular' && L.shape !== 'round') {
      rows.push({
        label: 'Tip land',
        value: formatLength(land),
        level: land < m * 0.15 ? 'error' : land < m * 0.25 ? 'warn' : 'ok',
        note:
          land < m * 0.25
            ? 'The tooth is running to a point — reduce the addendum or the profile shift.'
            : undefined,
      })
    }
  }

  // Contact ratio: how many teeth are in mesh at once. Below one, the pair
  // stops driving between teeth.
  if (L.shape === 'involute' && !L.internal) {
    const ra = L.tipR
    const rb = L.baseR
    const contact =
      (2 * Math.sqrt(Math.max(ra * ra - rb * rb, 0)) - 2 * L.pitchR * Math.sin(L.alpha)) /
      (Math.PI * m * Math.cos(L.alpha))
    rows.push({
      label: 'Contact ratio, with an identical gear',
      value: contact.toFixed(2),
      level: contact < 1 ? 'error' : contact < 1.2 ? 'warn' : 'ok',
      note: contact < 1.2 ? 'Under 1.2 the pair is noisy; under 1 it stops driving between teeth.' : undefined,
    })
  }

  const arrangement = str(p, 'arrangement')
  if (['helical', 'herringbone', 'doubleHelical'].includes(arrangement)) {
    const beta = rad(num(p, 'helixAngle'))
    const usable =
      arrangement === 'helical'
        ? L.faceWidth
        : arrangement === 'doubleHelical'
          ? (L.faceWidth - Math.min(num(p, 'grooveWidth'), L.faceWidth * 0.6)) / 2
          : L.faceWidth / 2
    const overlap = (usable * Math.sin(beta)) / (Math.PI * m)
    rows.push({
      label: 'Overlap ratio',
      value: overlap.toFixed(2),
      level: overlap < 1 ? 'warn' : 'ok',
      note:
        overlap < 1
          ? 'A helix that does not advance a full pitch across the face runs no more smoothly than a spur gear. Widen the face or steepen the helix.'
          : 'Each helix advances this many pitches across the face — this is what a helical gear buys.',
    })
    if (arrangement === 'helical') {
      rows.push({
        label: 'Axial thrust',
        value: `${(Math.tan(beta) * 100).toFixed(0)}% of the tooth load`,
        level: num(p, 'helixAngle') > 30 ? 'warn' : 'ok',
        note:
          num(p, 'helixAngle') > 30
            ? 'Past 30° the bearings are carrying more thrust than most shafts are set up for. A herringbone cancels it.'
            : 'Pushed down the shaft, and paid for in the bearings. A herringbone cancels it between its halves.',
      })
    }
  }

  // Rim backup: the metal between the root of the tooth and whatever is under
  // it. Thin rims crack across the root rather than losing a tooth.
  const backup = L.rimWidth / Math.max(L.ha + L.hf, 0.01)
  rows.push({
    label: 'Rim backup ratio',
    value: backup.toFixed(2),
    level: backup < 0.8 ? 'error' : backup < 1.2 ? 'warn' : 'ok',
    note:
      backup < 1.2
        ? 'Rim thickness over tooth height. Under 1.2 the crack goes through the rim instead of the tooth.'
        : undefined,
  })

  rows.push({
    label: 'Face width',
    value: `${formatLength(L.faceWidth)} — ${(L.faceWidth / m).toFixed(1)} modules`,
    level: L.faceWidth / m > 20 ? 'warn' : 'ok',
    note:
      L.faceWidth / m > 20
        ? 'Over about 20 modules the load runs off the end of the tooth unless the shafts are very stiff.'
        : '8 to 12 modules is the usual range for a straight-cut gear.',
  })

  if (!L.internal && L.filler !== 'ring') {
    if (L.boreAsked > 0 && L.boreR < L.boreAsked - 0.05) {
      rows.push({
        label: 'Bore',
        value: formatLength(L.boreR * 2),
        level: 'warn',
        note: `Held back from the ${formatLength(L.boreAsked * 2)} asked for: there is no blank left between it and the rim.`,
      })
    } else if (L.boreR > 0) {
      rows.push({ label: 'Bore', value: formatLength(L.boreR * 2) })
    }
    const wall = L.hubR - L.boreR
    if (L.boreR > 0 && L.wantsHub) {
      rows.push({
        label: 'Hub wall',
        value: formatLength(wall),
        level: wall < 2 ? 'warn' : 'ok',
        note: wall < 2 ? 'Less than 2 mm of metal round the bore. Widen the hub.' : undefined,
      })
    }
    if (str(p, 'boreStyle') === 'keyway' && L.boreR > 0) {
      const key = num(p, 'keyWidth')
      rows.push({
        label: 'Keyway',
        value: `${formatLength(key)} × ${formatLength(num(p, 'keyDepth'))}`,
        level: key > L.boreR ? 'warn' : 'ok',
        note: key > L.boreR ? 'A key wider than the bore radius leaves nothing either side of it.' : undefined,
      })
    }
  }

  const mass = (volume(L) * (MATERIALS[L.material]?.density ?? 7850)) / 1e9
  rows.push({
    label: 'Mass, about',
    value: mass < 1 ? `${(mass * 1000).toFixed(0)} g` : `${mass.toFixed(2)} kg`,
    note: 'Rings and teeth added up — near enough to tell a hand-held wheel from a lift.',
  })

  return rows
}

export const presets = [
  {
    name: 'Steel pinion',
    params: {
      teeth: 13,
      module: 2,
      faceWidth: 20,
      profileShift: 0.4,
      filler: 'solid',
      rimWidth: 6,
      bore: 10,
      boreStyle: 'keyway',
      keyWidth: 3,
      keyDepth: 1.4,
      hubDiameter: 22,
      hub: 'both',
      hubProjection: 10,
    },
  },
  {
    name: 'Helical reduction gear',
    params: {
      teeth: 47,
      module: 3,
      faceWidth: 32,
      arrangement: 'helical',
      helixAngle: 20,
      filler: 'web',
      webThickness: 12,
      rimWidth: 12,
      bore: 25,
      boreStyle: 'keyway',
      hubDiameter: 55,
      hub: 'both',
      hubProjection: 10,
    },
  },
  {
    name: 'Herringbone gear',
    params: {
      teeth: 36,
      module: 4,
      faceWidth: 64,
      arrangement: 'herringbone',
      helixAngle: 30,
      filler: 'holes',
      holeCount: 6,
      holeSize: 0.7,
      webThickness: 16,
      rimWidth: 16,
      bore: 30,
      hubDiameter: 70,
    },
  },
  {
    name: 'Double helical, relieved',
    params: {
      teeth: 42,
      module: 5,
      faceWidth: 90,
      arrangement: 'doubleHelical',
      helixAngle: 28,
      grooveWidth: 14,
      filler: 'web',
      webThickness: 22,
      rimWidth: 20,
      bore: 45,
      boreStyle: 'keyway',
      keyWidth: 12,
      keyDepth: 5,
      hubDiameter: 95,
      hub: 'both',
      hubProjection: 24,
    },
  },
  {
    name: 'Cast iron spoked wheel',
    params: {
      teeth: 72,
      module: 6,
      faceWidth: 45,
      material: 'castIron',
      filler: 'spokes',
      spokeCount: 6,
      spokeWidth: 22,
      spokeShape: 'curved',
      webThickness: 26,
      rimWidth: 24,
      bore: 40,
      boreStyle: 'keyway',
      keyWidth: 12,
      keyDepth: 5,
      hubDiameter: 100,
      hub: 'both',
      hubProjection: 28,
    },
  },
  {
    name: 'Clock wheel',
    params: {
      teeth: 60,
      module: 0.8,
      faceWidth: 2,
      toothShape: 'cycloidal',
      addendum: 0.95,
      dedendum: 1.05,
      material: 'brass',
      filler: 'spokes',
      spokeCount: 5,
      spokeWidth: 3.5,
      spokeShape: 'tapered',
      webThickness: 2,
      rimWidth: 2.2,
      bore: 3,
      hubDiameter: 8,
    },
  },
  {
    name: 'Ratchet wheel',
    params: {
      teeth: 30,
      module: 2,
      faceWidth: 5,
      toothShape: 'ratchet',
      addendum: 1.2,
      dedendum: 1.2,
      filler: 'solid',
      rimWidth: 8,
      bore: 8,
      boreStyle: 'dFlat',
      hubDiameter: 18,
    },
  },
  {
    name: 'Toothed belt pulley',
    params: {
      teeth: 20,
      module: 2.5,
      toothShape: 'trapezoidal',
      pressureAngle: 25,
      addendum: 0.7,
      faceWidth: 16,
      material: 'aluminium',
      lip: 'both',
      lipRise: 5,
      lipThickness: 3,
      filler: 'solid',
      rimWidth: 7,
      bore: 12,
      boreStyle: 'dFlat',
      hubDiameter: 26,
      hub: 'back',
      hubProjection: 14,
    },
  },
  {
    name: 'Sprocket',
    params: {
      teeth: 17,
      module: 4,
      toothShape: 'round',
      faceWidth: 6,
      filler: 'holes',
      holeCount: 5,
      holeSize: 0.8,
      webThickness: 6,
      rimWidth: 11,
      bore: 16,
      hubDiameter: 24,
    },
  },
  {
    name: 'Planetary ring gear',
    params: {
      gearType: 'internal',
      teeth: 60,
      module: 1.5,
      faceWidth: 12,
      rimWidth: 8,
      material: 'nylon',
    },
  },
  {
    name: 'Stepped spur gear',
    params: {
      teeth: 30,
      module: 3,
      faceWidth: 36,
      arrangement: 'stepped',
      stages: 3,
      stagger: 1,
      filler: 'web',
      webThickness: 14,
      rimWidth: 12,
      bore: 20,
      hubDiameter: 44,
    },
  },
]
