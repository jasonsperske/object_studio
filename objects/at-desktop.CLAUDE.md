# AT desktop, 1984–93

The beige box with the monitor sat on top. Full-height or half-height 5¼" openings across the
front, ISA cards at the back, and a big keyboard in front.

## When to reach for it

Business and home PCs of the ISA era. For the tower that followed it, use `multimedia-pc`.

## What matters most

**The case size is not a free choice — it comes from the board.** `board` picks PC/XT, AT or
Baby-AT, and the footprint follows; `bayColumns` and `bayHeight` set how much of the front is
drive openings and how tall the case has to be. Then fill them: `floppies`, `smallFloppy`,
`hardDisk`, `tapeDrive`. `display` puts a monochrome or colour monitor on top, and `cutaway` takes
the lid off to show the board, cards, supply and drive cage.

## Worked examples

- **"an original IBM PC-style machine with two floppies"** → the `1983 twin-floppy XT` preset
- **"an AT with a hard disk and an amber screen"** → the `1984 AT with a hard disk` preset
- **"a late-80s clone with a turbo button"** → the `1988 clone, turbo` preset
- **"the same machine with the lid off"** → add `{ cutaway: true }` to any of them

## Check the metrics

It reports openings used against openings available, and warns when more drives have been asked
for than the front will take. Adding a bay column widens the case by 160 mm — that is the real
trade and the metric makes it visible.

## What it will not do

No PCI, no CD-ROM, no 3½" bays of its own — a 3½" floppy goes in a frame that fills a 5¼" opening,
as it did. Anything later belongs to `multimedia-pc`.

## Parameters

<!-- generated: parameters -->
**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `board` | select | `xt`, `at`, `babyAt` | `"at"` | The standard the case is built around. Everything else follows from it. |
| `slots` | int | 3–8, step 1 | `8` |  |
| `cards` | int | 0–8, step 1 | `4` | Video, disk controller, serial and parallel, and whatever else the machine needed. |
| `cutaway` | boolean | `true`, `false` | `false` | Takes the lid and the near side away, and builds the board, the cards, the supply and the drive cage. |

**Drives**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `bayHeight` | select | `full`, `half` | `"half"` | Full height is the early one: two of them filled the front. Half height came in around 1985 and doubled what would fit. |
| `bayColumns` | int | 1–2, step 1 | `2` | Side by side across the front. Each column widens the case by 158 mm. |
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

- **1983 twin-floppy XT** — `{"board":"xt","slots":8,"cards":3,"bayHeight":"full","bayColumns":2,"floppies":2,"smallFloppy":false,"hardDisk":false,"tapeDrive":false,"finish":"oatmeal","keyLock":false,"turboButton":false,"display":"green","monitorSize":12,"keyboard":true}`
- **1984 AT with a hard disk** — `{"board":"at","slots":8,"cards":4,"bayHeight":"full","bayColumns":2,"floppies":1,"smallFloppy":false,"hardDisk":true,"tapeDrive":false,"finish":"oatmeal","keyLock":true,"turboButton":false,"display":"amber","monitorSize":12,"keyboard":true}`
- **1988 clone, turbo** — `{"board":"babyAt","slots":8,"cards":5,"bayHeight":"half","bayColumns":2,"floppies":2,"smallFloppy":true,"hardDisk":true,"tapeDrive":false,"finish":"beige","keyLock":true,"turboButton":true,"display":"colour","monitorSize":14,"keyboard":true}`
- **1990 office machine, lid off** — `{"board":"babyAt","slots":8,"cards":4,"bayHeight":"half","bayColumns":2,"floppies":1,"smallFloppy":true,"hardDisk":true,"tapeDrive":true,"finish":"putty","cutaway":true,"keyLock":true,"turboButton":false,"display":"none","keyboard":true}`
- **1992 grey box** — `{"board":"babyAt","slots":6,"cards":3,"bayHeight":"half","bayColumns":1,"floppies":1,"smallFloppy":true,"hardDisk":true,"tapeDrive":false,"finish":"grey","keyLock":false,"turboButton":true,"display":"colour","monitorSize":14,"screenOn":true,"keyboard":true}`
<!-- /generated: parameters -->
