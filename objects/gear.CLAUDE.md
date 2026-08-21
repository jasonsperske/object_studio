# Gear

A toothed wheel, drawn from the numbers a gear is actually specified by: a module, a tooth count
and a pressure angle. One tooth is drawn as a flat outline, repeated round the circle and pushed
through the face width; the rim, the web or spokes, the hub and the flange are rings pushed
through the same thickness. A helical tooth is that extrusion turned as it goes, and a herringbone
is the turn reversed halfway across.

## When to reach for it

Any toothed wheel that turns about one axis: spur and helical gears, pinions, internal ring gears,
sprockets, ratchet wheels, clock wheels, toothed belt pulleys. Size is a parameter rather than a
different generator — a 12 mm brass clock wheel and a 900 mm cast iron wheel are both `gear`.

## Sizing one

**Diameters are the output, not the input.** A gear is specified by its module — the tooth size —
and how many of them there are, because that is what decides whether two gears will run together.
Everything else follows and is reported in the metrics.

| If you are given | Do this |
| --- | --- |
| a tooth count | set `teeth`; leave `module` at 3 unless the size matters |
| a diameter and a tooth count | `module` = diameter ÷ teeth |
| a diameter only | pick a module of about diameter ÷ 25, then `teeth` = diameter ÷ module |
| a ratio | two gears at the same module, tooth counts in that ratio |

Two gears only mesh if their `module` and `pressureAngle` are the same. A pair meets at centres of
`module × (teeth + teeth) ÷ 2`, both facing +Z.

## What matters most

`teeth` and `module` are the gear. `faceWidth` is how thick it is. After that, `toothShape` for
what kind of wheel it is, `arrangement` for how the tooth runs across the face, and `filler` for
what fills the middle — those three carry most of the look. `material` sets the colour and the
density the mass is worked out from.

## Worked examples

- **"a gear"** → the defaults: a 24-tooth module 3 steel spur gear
- **"a gear 200 mm across with 50 teeth"** → `{ teeth: 50, module: 4 }`
- **"a helical pinion, 15 teeth, module 2, 25 mm wide"** → `{ teeth: 15, module: 2, faceWidth: 25, arrangement: 'helical', helixAngle: 20, profileShift: 0.35 }`
- **"a herringbone gear"** → the `Herringbone gear` preset
- **"a big cast iron gear with curved spokes"** → the `Cast iron spoked wheel` preset
- **"the ring gear of a planetary set"** → the `Planetary ring gear` preset
- **"a brass clock wheel"** → the `Clock wheel` preset
- **"a ratchet wheel that locks the other way"** → `{ toothShape: 'ratchet', ratchetDirection: 'ccw', teeth: 24, faceWidth: 5, bore: 8 }`
- **"a toothed belt pulley with flanges"** → the `Toothed belt pulley` preset
- **"a sprocket"** → the `Sprocket` preset
- **"a nylon gear on a hex shaft"** → `{ material: 'nylon', boreStyle: 'hex', bore: 10, filler: 'web' }`

## Drawing a pair that meshes

Tooth zero is centred on **+X**, so two gears placed at the right centres line up tooth to tooth —
which is exactly wrong. The second one needs a space where the first has a tooth: turn it by half a
pitch (180° ÷ its tooth count) if its tooth count is **even**, and leave it as it is if the count is
**odd**. A helical pair needs one right-hand gear and one left-hand one, at the same helix angle.

## Things worth knowing

- **A small pinion needs a profile shift.** Below about 17 teeth at 20° the cutter digs into the
  root of its own flank. `profileShift` around 0.3–0.5 moves the tooth out far enough to clear it,
  and the undercut metric works out how much is needed.
- **Raking the teeth only buys something if the face is wide enough to use it.** A helix has to
  advance a full pitch across the face to have a second tooth in mesh; the overlap ratio says
  whether it does. A 20° helix on a narrow gear is decoration.
- **`arrangement` is the only thing that changes across the face.** Everything else — the blank,
  the hub, the lip — is a ring, so any tooth shape combines with any arrangement and any middle.
- **An internal gear is only a ring.** Picking it hides the blank, hub and bore: the teeth point
  inwards from the rim and there is nothing in the middle to fill.
- **On a solid blank the bore may come up under the teeth.** On any other blank it is held back to
  leave the rim standing, and the metrics say when that has happened.

## Check the metrics

They are the difference between a gear and a picture of one, and most of them are advisory design
aids rather than a substitute for a proper gear calculation:

- **Undercut** — too few teeth for the pressure angle, with the profile shift that would fix it
- **Tip land** — the tooth running to a point, usually from too much addendum or shift
- **Contact ratio** — how many teeth are in mesh at once; under 1 the pair stops driving
- **Overlap ratio** and **axial thrust** — whether the helix earns its keep, and what it costs
- **Rim backup ratio** — a thin rim cracks through instead of losing a tooth
- **Hub wall**, **bore** and **keyway** — whether there is metal left round the shaft
- **Mass** — rings and teeth added up, near enough to tell a hand-held wheel from a lift

## What it will not do

- One axis only: no bevel, worm, rack, face or non-circular gears, and no crossed shafts.
- Nothing is cut away that is not a hole in a flat outline — no grub screw holes, no bolt circle
  beyond the lightening holes, no chamfer round the tooth ends, no crowning or tip relief along the
  face.
- The cycloidal flank is drawn for a six-leaf pinion; the generating circle is not a parameter.
- One gear per build. To draw a train, build each one and place it — see the pair note above.

## Parameters

<!-- generated: parameters -->
**Gear**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `teeth` | int | 4–200, step 1 | `24` | With the module, this is the whole size of the gear: pitch diameter = module × teeth. |
| `module` | number | 0.3–20 mm, step 0.1 | `3` | Tooth size. Two gears only mesh if their module and pressure angle match. |
| `pressureAngle` | number | 12–30 °, step 0.5 | `20` | 20° is the modern standard, 14.5° the older one. On a cast tooth it is the flank angle instead. |
| `faceWidth` | number | 1–300 mm, step 1 | `24` | How thick the wheel is, measured along the shaft. |
| `gearType` | select | `external`, `internal` | `"external"` | An internal gear is a ring with the teeth pointing inwards — the annulus of a planetary set. |
| `profileShift` | number | -0.6–0.6, step 0.05 | `0` | Cuts the tooth further out on the involute. Positive shift is how a small pinion avoids being undercut. Only used in some combinations. |
| `backlash` | number | 0–1 mm, step 0.02 | `0.06` | Taken off the tooth thickness, so a pair has somewhere for the oil to go. |
| `material` | select | `steel`, `castIron`, `brass`, `bronze`, `aluminium`, `nylon` | `"steel"` | Colour, and the density the mass is worked out from. |

**Teeth**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `toothShape` | select | `involute`, `cycloidal`, `trapezoidal`, `triangular`, `round`, `ratchet` | `"involute"` | Involute for anything that transmits power, cycloidal for clocks, the rest for cast, moulded and ratchet wheels. |
| `addendum` | number | 0.4–1.4, step 0.05 | `1` | Height of the tooth above the pitch circle, in modules. One is standard. |
| `dedendum` | number | 0.6–1.8, step 0.05 | `1.25` | Depth below the pitch circle, in modules. The quarter over the addendum is the root clearance. |
| `rootFillet` | number | 0–0.6, step 0.05 | `0.3` | Radius where the flank meets the root, in modules. This is where a tooth breaks, so it is never square. |
| `tipRound` | number | 0–0.4, step 0.02 | `0.06` | Takes the corner off the tip, in modules. |
| `profileSteps` | int | 3–30, step 1 | `10` | Points along each flank. The whole triangle count scales with this and the tooth count. |
| `ratchetDirection` | select | `cw`, `ccw` | `"cw"` | Which way the radial catching face points. Only used in some combinations. |

**Arrangement**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `arrangement` | select | `spur`, `helical`, `herringbone`, `doubleHelical`, `stepped` | `"spur"` | How the tooth runs across the face. Raking it puts more than one tooth in mesh at a time, which is what makes a helical gear quiet. |
| `helixAngle` | number | 5–45 °, step 1 | `20` | Measured at the pitch circle. 15–30° is usual; past that the thrust down the shaft gets expensive. Only used in some combinations. |
| `hand` | select | `right`, `left` | `"right"` | A right-hand gear runs with a left-hand one. On a V the two halves are one of each, so it is which way the apex leans. Only used in some combinations. |
| `grooveWidth` | number | 1–60 mm, step 1 | `8` | The gap between the two halves — the runout the cutter needs at the apex. Only used in some combinations. |
| `stages` | int | 2–6, step 1 | `3` | Slices of straight teeth across the face, each one turned on from the last. Only used in some combinations. |
| `stagger` | number | 0–1, step 0.05 | `1` | How far each stage is advanced, as a share of one pitch spread over all the stages. Only used in some combinations. |

**Blank**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `filler` | select | `solid`, `web`, `spokes`, `holes`, `ring` | `"solid"` | What fills the space between the rim and the hub. Only used in some combinations. |
| `rimWidth` | number | 0.5–150 mm, step 0.5 | `9` | Solid metal under the root of the tooth. Thin rims flex and crack across the root. |
| `webThickness` | number | 0.5–150 mm, step 0.5 | `8` | Thickness of the web or the spokes, centred across the face. Only used in some combinations. |
| `spokeCount` | int | 3–16, step 1 | `5` | Only used in some combinations. |
| `spokeWidth` | number | 1–120 mm, step 0.5 | `14` | Only used in some combinations. |
| `spokeShape` | select | `straight`, `tapered`, `curved` | `"tapered"` | Curved spokes are the cast-iron habit: they let the casting shrink without cracking. Only used in some combinations. |
| `holeCount` | int | 2–20, step 1 | `6` | Only used in some combinations. |
| `holeSize` | number | 0.1–0.95, step 0.05 | `0.6` | As a share of the space between the hub and the rim. Only used in some combinations. |

**Hub & bore**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `bore` | number | 0–400 mm, step 0.5 | `16` | The hole the shaft goes through. Zero leaves the centre solid. Only used in some combinations. |
| `boreStyle` | select | `plain`, `keyway`, `dFlat`, `hex`, `square`, `splined` | `"plain"` | How the wheel is stopped from turning on its shaft. Only used in some combinations. |
| `keyWidth` | number | 1–40 mm, step 0.5 | `5` | Only used in some combinations. |
| `keyDepth` | number | 0.2–20 mm, step 0.1 | `2.3` | Measured out from the bore, the way a shaft keyway is. Only used in some combinations. |
| `flatDepth` | number | 0.2–30 mm, step 0.1 | `1.5` | Only used in some combinations. |
| `splineCount` | int | 4–40, step 1 | `12` | Only used in some combinations. |
| `hubDiameter` | number | 0–500 mm, step 1 | `40` | The boss around the bore. Below the bore it is ignored. Only used in some combinations. |
| `hub` | select | `none`, `front`, `back`, `both` | `"none"` | A long boss is what a grub screw and a narrow gear need to stay square on the shaft. Only used in some combinations. |
| `hubProjection` | number | 1–200 mm, step 1 | `12` | How far it stands out of each face it is on. Only used in some combinations. |

**Lip**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `lip` | select | `none`, `front`, `back`, `both` | `"none"` | A flange standing off the face, past the tips — what keeps a belt or a chain on a toothed pulley. |
| `lipRise` | number | 0.5–60 mm, step 0.5 | `5` | How far it stands past the tip circle. Only used in some combinations. |
| `lipThickness` | number | 0.5–40 mm, step 0.5 | `4` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Steel pinion** — `{"teeth":13,"module":2,"faceWidth":20,"profileShift":0.4,"filler":"solid","rimWidth":6,"bore":10,"boreStyle":"keyway","keyWidth":3,"keyDepth":1.4,"hubDiameter":22,"hub":"both","hubProjection":10}`
- **Helical reduction gear** — `{"teeth":47,"module":3,"faceWidth":32,"arrangement":"helical","helixAngle":20,"filler":"web","webThickness":12,"rimWidth":12,"bore":25,"boreStyle":"keyway","hubDiameter":55,"hub":"both","hubProjection":10}`
- **Herringbone gear** — `{"teeth":36,"module":4,"faceWidth":64,"arrangement":"herringbone","helixAngle":30,"filler":"holes","holeCount":6,"holeSize":0.7,"webThickness":16,"rimWidth":16,"bore":30,"hubDiameter":70}`
- **Double helical, relieved** — `{"teeth":42,"module":5,"faceWidth":90,"arrangement":"doubleHelical","helixAngle":28,"grooveWidth":14,"filler":"web","webThickness":22,"rimWidth":20,"bore":45,"boreStyle":"keyway","keyWidth":12,"keyDepth":5,"hubDiameter":95,"hub":"both","hubProjection":24}`
- **Cast iron spoked wheel** — `{"teeth":72,"module":6,"faceWidth":45,"material":"castIron","filler":"spokes","spokeCount":6,"spokeWidth":22,"spokeShape":"curved","webThickness":26,"rimWidth":24,"bore":40,"boreStyle":"keyway","keyWidth":12,"keyDepth":5,"hubDiameter":100,"hub":"both","hubProjection":28}`
- **Clock wheel** — `{"teeth":60,"module":0.8,"faceWidth":2,"toothShape":"cycloidal","addendum":0.95,"dedendum":1.05,"material":"brass","filler":"spokes","spokeCount":5,"spokeWidth":3.5,"spokeShape":"tapered","webThickness":2,"rimWidth":2.2,"bore":3,"hubDiameter":8}`
- **Ratchet wheel** — `{"teeth":30,"module":2,"faceWidth":5,"toothShape":"ratchet","addendum":1.2,"dedendum":1.2,"filler":"solid","rimWidth":8,"bore":8,"boreStyle":"dFlat","hubDiameter":18}`
- **Toothed belt pulley** — `{"teeth":20,"module":2.5,"toothShape":"trapezoidal","pressureAngle":25,"addendum":0.7,"faceWidth":16,"material":"aluminium","lip":"both","lipRise":5,"lipThickness":3,"filler":"solid","rimWidth":7,"bore":12,"boreStyle":"dFlat","hubDiameter":26,"hub":"back","hubProjection":14}`
- **Sprocket** — `{"teeth":17,"module":4,"toothShape":"round","faceWidth":6,"filler":"holes","holeCount":5,"holeSize":0.8,"webThickness":6,"rimWidth":11,"bore":16,"hubDiameter":24}`
- **Planetary ring gear** — `{"gearType":"internal","teeth":60,"module":1.5,"faceWidth":12,"rimWidth":8,"material":"nylon"}`
- **Stepped spur gear** — `{"teeth":30,"module":3,"faceWidth":36,"arrangement":"stepped","stages":3,"stagger":1,"filler":"web","webThickness":14,"rimWidth":12,"bore":20,"hubDiameter":44}`
<!-- /generated: parameters -->
