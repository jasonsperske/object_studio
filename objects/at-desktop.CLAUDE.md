# AT desktop, 1981–93

The beige box with the monitor sat on top. Full-height or half-height 5¼" openings across the
front, ISA cards at the back, and a big keyboard in front.

## When to reach for it

Business and home PCs of the ISA era. For the tower that followed it, use `multimedia-pc`.

## What matters most

**The case size is not a free choice — it comes from the board.** `board` picks IBM PC 5150, PC/XT, AT or
Baby-AT, and the footprint follows; `bayColumns` and `bayHeight` set how much of the front is
drive openings and how tall the case has to be. Then fill them: `floppies`, `smallFloppy`,
`hardDisk`, `tapeDrive`. `display` puts a monochrome or colour monitor on top, and `cutaway` takes
the lid off to show the board, cards, supply and drive cage.

## Worked examples

- **"an original IBM PC-style machine with two floppies"** → the `1981 IBM PC 5150` preset
- **"an AT with a hard disk and an amber screen"** → the `1984 AT with a hard disk` preset
- **"a late-80s clone with a turbo button"** → the `1988 clone, turbo` preset
- **"the same machine with the lid off"** → add `{ cutaway: true }` to any of them

## Check the metrics

It reports openings used against openings available, and warns when more drives have been asked
for than the front will take. Adding a bay column widens the case by 160 mm — that is the real
trade and the metric makes it visible.

## What it will not do

The 5150 preset is a visual reconstruction, not an electrically exact replica.
No PCI, no CD-ROM, no 3½" bays of its own — a 3½" floppy goes in a frame that fills a 5¼" opening,
as it did. Anything later belongs to `multimedia-pc`.

## Geometry and level of detail contract

Existing parameter IDs, defaults, XT/AT presets and aggregate part names remain available.
`board: "pc"` adds a 216 × 279.4 mm board and caps expansion slots at five. With two
bay columns its case is 508 × 410 × 152.4 mm; one column is a narrower custom variant.
The 5150 preset selects full-height black drive faces, no keyboard lock or turbo controls,
and a green monitor. The shell has sharper sheet-metal edges, a left ventilation bank,
a badge above it and a red side power paddle. Rear fittings sit outside the rear panel.
The keyboard is period-inspired, not an exact 83-key reproduction.

Closed cases use a single 12-triangle opaque box for the enclosure. Internal boards,
packages, contacts, drive bodies and supply are generated only with `cutaway: true`.
The open case keeps its floor, rear and far side; use `display: "none"` to inspect it.

`boards` contains the PCB substrates. Additional stable names are
`motherboard-{traces,pads,silkscreen,chips,pins}` and
`card-N-{traces,pads,silkscreen,chips,pins}` (N starts at 1).
DIP packages and metal pins stay raised geometry. Copper routes, solder/contact pads
and silkscreen outlines are separate coplanar color layers, each carrying
`lod: { surface: "y" }` for the motherboard or `lod: { surface: "x" }` for cards.
Axes describe the positive surface normal in the **returned, rotated model coordinates**.
`front-vent-slits` similarly uses `lod: { surface: "z" }`.

Consumers should preserve each part's `lod` metadata and use the updated
`src/lib/lod.ts`: below full detail, the `textures` strategy bakes these layers into
transparent planes. No textures are fetched. Geometry-only reduction retains marked
layers, and mesh-only exports use the geometry fallback; glTF/GLB retain textures.
Older consumers supporting only `surface: "z"` must leave X/Y layers as geometry.
These are illustrative circuit patterns, not schematic or PCB manufacturing data.

The monitor uses matched rounded-rectangle sections with 12 segments per corner,
smooth indexed normals, a recessed screen reveal, and a gradual taper into a rounded,
closed rear panel. Each section has an independent radius to avoid self-intersecting
corner offsets. Housing stays in `case` and glass in `screen`; `monitor-rear-vents`
and `monitor-rear-panel` are additional exterior parts, omitted with `display: "none"`.
The size range (9–16 inches) and existing monitor parameters are unchanged.

Reference: [IBM's August 1981 Technical Reference](https://www.minuszerodegrees.net/manuals/IBM_5150_Technical_Reference_6025005_AUG81.pdf),
including the original board dimensions and five expansion slots.

## Parameters

<!-- generated: parameters -->
**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `board` | select | `pc`, `xt`, `at`, `babyAt` | `"at"` | The standard the case is built around. Everything else follows from it. |
| `slots` | int | 3–8, step 1 | `8` |  |
| `cards` | int | 0–8, step 1 | `4` | Video, disk controller, serial and parallel, and whatever else the machine needed. |
| `cutaway` | boolean | `true`, `false` | `false` | Takes the lid and the near side away, and builds the board, the cards, the supply and the drive cage. |

**Drives**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `bayHeight` | select | `full`, `half` | `"half"` | Full height is the early one: two of them filled the front. Half height came in around 1985 and doubled what would fit. |
| `bayColumns` | int | 1–2, step 1 | `2` | Side by side across the front. Each column widens the case by 160 mm. |
| `floppies` | int | 0–4, step 1 | `2` |  |
| `smallFloppy` | boolean | `true`, `false` | `false` | The later fitment, in a frame that filled a 5¼" opening. |
| `hardDisk` | boolean | `true`, `false` | `true` | In a bay of its own, with a lamp on the front and no opening. |
| `tapeDrive` | boolean | `true`, `false` | `false` | For the nightly backup, in the last free opening. |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `finish` | select | `oatmeal`, `beige`, `putty`, `grey` | `"oatmeal"` |  |
| `keyLock` | boolean | `true`, `false` | `true` | The barrel lock that froze the keyboard. Nobody knew where the key was. |
| `turboButton` | boolean | `true`, `false` | `false` | A clone fitment, and the number on it was decorative. |
| `badge` | boolean | `true`, `false` | `true` |  |

**Desk**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `display` | select | `none`, `green`, `amber`, `colour` | `"green"` |  |
| `monitorSize` | number | 9–16 ″, step 0.5 | `12` | Only used in some combinations. |
| `screenOn` | boolean | `true`, `false` | `false` | Only used in some combinations. |
| `keyboard` | boolean | `true`, `false` | `true` |  |

**Presets** — worked examples; each lists only what it changes.

- **1981 IBM PC 5150** — `{"board":"pc","slots":5,"cards":2,"bayHeight":"full","bayColumns":2,"floppies":2,"smallFloppy":false,"hardDisk":false,"tapeDrive":false,"finish":"oatmeal","keyLock":false,"turboButton":false,"display":"green","monitorSize":12,"keyboard":true}`
- **1983 twin-floppy XT** — `{"board":"xt","slots":8,"cards":3,"bayHeight":"full","bayColumns":2,"floppies":2,"smallFloppy":false,"hardDisk":false,"tapeDrive":false,"finish":"oatmeal","keyLock":false,"turboButton":false,"display":"green","monitorSize":12,"keyboard":true}`
- **1984 AT with a hard disk** — `{"board":"at","slots":8,"cards":4,"bayHeight":"full","bayColumns":2,"floppies":1,"smallFloppy":false,"hardDisk":true,"tapeDrive":false,"finish":"oatmeal","keyLock":true,"turboButton":false,"display":"amber","monitorSize":12,"keyboard":true}`
- **1988 clone, turbo** — `{"board":"babyAt","slots":8,"cards":5,"bayHeight":"half","bayColumns":2,"floppies":2,"smallFloppy":true,"hardDisk":true,"tapeDrive":false,"finish":"beige","keyLock":true,"turboButton":true,"display":"colour","monitorSize":14,"keyboard":true}`
- **1990 office machine, lid off** — `{"board":"babyAt","slots":8,"cards":4,"bayHeight":"half","bayColumns":2,"floppies":1,"smallFloppy":true,"hardDisk":true,"tapeDrive":true,"finish":"putty","cutaway":true,"keyLock":true,"turboButton":false,"display":"none","keyboard":true}`
- **1992 grey box** — `{"board":"babyAt","slots":6,"cards":3,"bayHeight":"half","bayColumns":1,"floppies":1,"smallFloppy":true,"hardDisk":true,"tapeDrive":false,"finish":"grey","keyLock":false,"turboButton":true,"display":"colour","monitorSize":14,"screenOn":true,"keyboard":true}`
<!-- /generated: parameters -->
