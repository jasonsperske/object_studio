# Integrated micro, 1977–83

A monitor and a computer in one case, with the tape or the disks built in beside or below the
tube.

## When to reach for it

The other shape the first machines took — a screen in the case rather than a keyboard on a desk.
If the machine plugs into a television, use `home-micro`; if the screen is flat, you are in the
wrong decade and want `all-in-one`.

## What matters most

**The case is sized by the tube.** `tube` is the diagonal in inches and drives the whole box;
`margin` is the moulding around it. `storage` picks what is built in — nothing, a cassette deck,
or 5¼" floppies — and `drivePlace` puts it beside the tube, stacked up the right, or below it in
a row across the front. `keyboard` decides whether the keys are on a shelf moulded into the front
or on a lead.

**The front is a recess.** The moulding stands proud all the way round and a dark mask panel sits
back inside it, carrying the tube and the drive bays; `tilt` leans the tube back within that
recess, and the moulding is made deeper to take whatever lean you ask for. So a big `tilt` on a
big tube buys you a noticeably deeper front, which is exactly what it bought the people who
moulded these.

## Worked examples

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
these machines had one port at the back and nothing else.

## Parameters

<!-- generated: parameters -->
**Tube**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `tube` | number | 5–15 ″, step 0.5 | `9` | Diagonal. Nine inches was the usual; twelve made a much bigger box. |
| `phosphor` | select | `green`, `amber`, `white`, `blue` | `"green"` |  |
| `screenOn` | boolean | `true`, `false` | `true` |  |
| `hood` | boolean | `true`, `false` | `true` | The brow moulded over the tube to keep the strip lights off it. |
| `tilt` | number | 0–16 °, step 0.5 | `6` | How far the tube leans back inside the recess. The moulding gets deeper to take it. |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `margin` | number | 20–140 mm, step 2 | `62` |  |
| `radius` | number | 0–70 mm, step 1 | `22` |  |
| `finish` | select | `cream`, `beige`, `putty`, `steel`, `charcoal` | `"cream"` |  |
| `vents` | boolean | `true`, `false` | `true` | Down the sides and across the back, because the tube ran hot. |

**Storage**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `storage` | select | `none`, `cassette`, `floppy` | `"cassette"` | What was moulded into the case beside or below the tube. |
| `floppies` | int | 1–2, step 1 | `2` | Only used in some combinations. |
| `drivePlace` | select | `beside`, `below` | `"beside"` | Only used in some combinations. |

**Keyboard**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `keyboard` | select | `shelf`, `separate`, `none` | `"shelf"` |  |
| `keyColumns` | int | 10–20, step 1 | `15` | Only used in some combinations. |
| `keyPitch` | number | 12–20 mm, step 0.05 | `17.5` | Only used in some combinations. |
| `keypad` | boolean | `true`, `false` | `true` | Only used in some combinations. |

**Back**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `parallelPort` | boolean | `true`, `false` | `true` |  |
| `expansionPort` | boolean | `true`, `false` | `true` |  |

**Presets** — worked examples; each lists only what it changes.

- **Green-screen trinity** — `{"tube":9,"phosphor":"green","screenOn":true,"margin":62,"radius":22,"finish":"cream","storage":"cassette","drivePlace":"beside","keyboard":"shelf","keyColumns":15,"keyPitch":16,"keypad":true,"hood":true,"tilt":5}`
- **Twin-floppy business micro** — `{"tube":12,"phosphor":"green","screenOn":true,"margin":70,"radius":18,"finish":"beige","storage":"floppy","floppies":2,"drivePlace":"beside","keyboard":"separate","keyColumns":17,"keyPitch":19.05,"keypad":true,"hood":true,"tilt":4}`
- **Amber office terminal** — `{"tube":12,"phosphor":"amber","screenOn":true,"margin":56,"radius":26,"finish":"putty","storage":"floppy","floppies":2,"drivePlace":"below","keyboard":"separate","keyColumns":17,"keyPitch":19.05,"keypad":true,"hood":false,"tilt":8}`
- **Pressed-steel micro** — `{"tube":9,"phosphor":"white","screenOn":false,"margin":44,"radius":8,"finish":"steel","storage":"cassette","drivePlace":"below","keyboard":"shelf","keyColumns":13,"keyPitch":17.5,"keypad":false,"hood":false,"tilt":0,"vents":true}`
- **Small classroom micro** — `{"tube":7,"phosphor":"green","screenOn":true,"margin":40,"radius":20,"finish":"cream","storage":"none","keyboard":"shelf","keyColumns":12,"keyPitch":15,"keypad":false,"hood":true,"tilt":6,"parallelPort":false,"expansionPort":true}`
<!-- /generated: parameters -->
