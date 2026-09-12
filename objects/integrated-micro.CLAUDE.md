# Integrated micro, 1977–83

A monitor and a computer in one case, with the tape or the disks built in beside or below the
tube. The initial defaults match the `1980 TRS-80 Model III inspired` preset: a
12-inch screen with 28 mm moulding, steel finish, twin side-mounted floppies and
an integrated keyboard.

## When to reach for it

The other shape the first machines took — a screen in the case rather than a keyboard on a desk.
If the machine plugs into a television, use `home-micro`; if the screen is flat, you are in the
wrong decade and want `all-in-one`.

## What matters most

**The case is sized by the tube, drives and keyboard.** `tube` supplies the 4:3
diagonal; `margin` adds moulding. `storage` selects no storage, a cassette deck or
full-height 5¼" drives (146 × 82.5 mm). `drivePlace` puts drives beside or below the
screen. A shelf keyboard widens the case when necessary to keep the keys and keypad
inside the deck; it also raises the screen above the sloped keyboard base.

**The front has separate recesses.** A dark, tapered surround encloses the convex CRT,
and painted dividers separate it from the drive openings. `tilt` leans the tube within
that opening; the frame grows deep enough to contain the tilted glass. `screenOn`
adds a subtle `phosphor` tint to the dark glass. The screen stays blank, with no
generated text. Turning it off removes that tint.

The keyboard now has a recessed well, tapered keycaps with procedural legends, a spacebar, a distinct Enter
key and a separated numeric block. Both the shelf and detached keyboard have a sloping
deck. Roof, side and rear vents remain exterior details controlled by `vents`.

## Worked examples

- **"a TRS-80-style all-in-one"** → the `1980 TRS-80 Model III inspired` preset
- **"an early all-in-one with a green screen"** → the `Green-screen trinity` preset
- **"a business micro with twin floppies"** → `{ tube: 12, storage: 'floppy', floppies: 2, keyboard: 'separate' }`
- **"the screen and two drives side by side"** → `{ storage: 'floppy', drivePlace: 'beside' }`
- **"a small classroom computer"** → `{ tube: 7, storage: 'none', keyboard: 'shelf', keyPitch: 15 }`

## Read the metrics

**Screen centre** reports how far below eye level the tube sits, at a 750 desk. Every one of these
machines was below it — that is what they were — so it only warns past about 30°, where you would
be craning down at the thing. More moulding under the tube, or drives below it, is what lifts it.

## What it will not do

No expansion cards, no hard disk, no colour — the phosphor choice is monochrome plus a blue, and
the rear connectors are illustrative printer, expansion and power fittings.

## Reference and compatibility

The [requested TRS-80 article](https://en.wikipedia.org/wiki/TRS-80#Model_III) covers
both the separate-monitor Model I and its integrated successors. This generator uses
the **Model III** as its visual reference, especially the silver-grey enclosure,
black CRT surround, stacked drives and sloping keyboard. The
[Centre for Computing History's Model III photograph](https://www.computinghistory.org.uk/det/2583/TRS-80-Microcomputer-System-Model-III/)
guided the front layout. The preset is an approximation, not an exact replica or a
claim of electrically functional emulation. Existing generic presets remain available.

Parameter IDs are unchanged. Defaults now match the Model III-inspired preset,
including a 28 mm margin instead of 62 mm. Previously saved explicit parameter
values still work; omitted values inherit the new defaults. Geometry intentionally changes: drive height
is corrected from 41.3 to 82.5 mm; shelf width accounts for keys; the screen is raised
to clear the keyboard; and frame depth covers the entire tilt range. Build and metrics
now use the same layout function. `radius` is limited to 60% of `margin` to protect the
front openings, so very large corner-radius requests may be constrained.

Existing part names (`case`, `mouldings`, `drive bays`, `keys`, `recess`, `lamp`, `screen`)
are retained where applicable. Additional names are `enter-key`,
`key-legends`, `drive-slot-N` (N starts at 1), and `nameplate` between a pair of side-mounted drives.
`enter-key` and `key-legends` exist only with a keyboard;
`drive-slot-N` exists only with floppy drives. No `screen-content` part is generated. Dimensions remain millimetres, +Y up,
front +Z, and the case and keyboard bottoms at Y=0.

External consumers should use the current `src/lib/compile.ts` helper scope, including
`roundedRect`, `loftRings` and `roundedHousing` from `src/lib/geometry.ts`.
All details are generated procedurally without image or font downloads.

## Parameters

<!-- generated: parameters -->
**Tube**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `tube` | number | 5–15 ″, step 0.5 | `12` | Diagonal. The default twelve-inch tube follows the TRS-80 Model III-inspired configuration. |
| `phosphor` | select | `green`, `amber`, `white`, `blue` | `"white"` |  |
| `screenOn` | boolean | `true`, `false` | `true` |  |
| `hood` | boolean | `true`, `false` | `false` | The brow moulded over the tube to keep the strip lights off it. |
| `tilt` | number | 0–16 °, step 0.5 | `4` | How far the tube leans back inside the recess. The moulding gets deeper to take it. |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `margin` | number | 20–140 mm, step 2 | `28` |  |
| `radius` | number | 0–70 mm, step 1 | `10` |  |
| `finish` | select | `cream`, `beige`, `putty`, `steel`, `charcoal` | `"steel"` |  |
| `vents` | boolean | `true`, `false` | `true` | Down the sides and across the back, because the tube ran hot. |

**Storage**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `storage` | select | `none`, `cassette`, `floppy` | `"floppy"` | What was moulded into the case beside or below the tube. |
| `floppies` | int | 1–2, step 1 | `2` | Only used in some combinations. |
| `drivePlace` | select | `beside`, `below` | `"beside"` | Only used in some combinations. |

**Keyboard**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `keyboard` | select | `shelf`, `separate`, `none` | `"shelf"` |  |
| `keyColumns` | int | 10–20, step 1 | `13` | Only used in some combinations. |
| `keyPitch` | number | 12–20 mm, step 0.05 | `19.05` | Only used in some combinations. |
| `keypad` | boolean | `true`, `false` | `true` | Only used in some combinations. |

**Back**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `parallelPort` | boolean | `true`, `false` | `true` |  |
| `expansionPort` | boolean | `true`, `false` | `true` |  |

**Presets** — worked examples; each lists only what it changes.

- **1980 TRS-80 Model III inspired** — `{"tube":12,"phosphor":"white","screenOn":true,"margin":28,"radius":10,"finish":"steel","storage":"floppy","floppies":2,"drivePlace":"beside","keyboard":"shelf","keyColumns":13,"keyPitch":19.05,"keypad":true,"hood":false,"tilt":4,"vents":true}`
- **Green-screen trinity** — `{"tube":9,"phosphor":"green","screenOn":true,"margin":62,"radius":22,"finish":"cream","storage":"cassette","drivePlace":"beside","keyboard":"shelf","keyColumns":15,"keyPitch":16,"keypad":true,"hood":true,"tilt":5}`
- **Twin-floppy business micro** — `{"tube":12,"phosphor":"green","screenOn":true,"margin":70,"radius":18,"finish":"beige","storage":"floppy","floppies":2,"drivePlace":"beside","keyboard":"separate","keyColumns":17,"keyPitch":19.05,"keypad":true,"hood":true,"tilt":4}`
- **Amber office terminal** — `{"tube":12,"phosphor":"amber","screenOn":true,"margin":56,"radius":26,"finish":"putty","storage":"floppy","floppies":2,"drivePlace":"below","keyboard":"separate","keyColumns":17,"keyPitch":19.05,"keypad":true,"hood":false,"tilt":8}`
- **Pressed-steel micro** — `{"tube":9,"phosphor":"white","screenOn":false,"margin":44,"radius":8,"finish":"steel","storage":"cassette","drivePlace":"below","keyboard":"shelf","keyColumns":13,"keyPitch":17.5,"keypad":false,"hood":false,"tilt":0,"vents":true}`
- **Small classroom micro** — `{"tube":7,"phosphor":"green","screenOn":true,"margin":40,"radius":20,"finish":"cream","storage":"none","keyboard":"shelf","keyColumns":12,"keyPitch":15,"keypad":false,"hood":true,"tilt":6,"parallelPort":false,"expansionPort":true}`
<!-- /generated: parameters -->
