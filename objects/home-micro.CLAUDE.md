# Home micro, 1977–85

The machine that was a keyboard: board, power and modulator all under the keys, with the
television as the monitor. No screen, no expansion cards — what expansion there was came out of an
edge connector at the back.

## When to reach for it

Home computers of the cassette era, the ones shaped like a wedge with the keyboard built in. If
the screen is part of the machine, use `integrated-micro`.

## What matters most

**The case is sized by the keyboard**, so start there: `keyStyle`, `columns`, `rows` and `pitch`
set the width and depth, and `margin` is the plastic around them. `pitch` is the strongest signal
of what kind of machine it is — 19.05 mm is a real typewriter keyboard, 16 is cramped, 13 is a
calculator. `lip` and `slope` then shape the wedge.

## Worked examples

- **"a rubber-keyed 8-bit micro"** → the `Rubber-key micro` preset
- **"a home computer with a tape deck built in"** → `{ cassette: 'deck', keyStyle: 'typewriter' }`
- **"a cheap little micro with calculator keys"** → the `Calculator micro` preset
- **"a business-ish micro with a numeric keypad"** → `{ keypad: true, pitch: 19.05, columns: 17, rows: 6 }`

## What it will not do

No screen, no disk drives, no expansion cards — none of those belong to this generation, which is
the point of it being its own object. A cartridge slot and a cassette deck are the only storage.

## Parameters

<!-- generated: parameters -->
**Keyboard**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `keyStyle` | select | `calculator`, `chiclet`, `rubber`, `typewriter` | `"chiclet"` |  |
| `columns` | int | 10–20, step 1 | `15` | Keys across the main block. Ten was a calculator; fifteen took a full alphabet row. |
| `rows` | int | 3–6, step 1 | `5` |  |
| `pitch` | number | 12–20 mm, step 0.05 | `17.5` | Centre to centre. A typewriter is 19.05; below about 16 you are hunting and pecking. |
| `keypad` | boolean | `true`, `false` | `false` | Four more columns on the right, and a wider case to hold them. |
| `keyColour` | select | `matching`, `dark`, `light`, `grey` | `"matching"` |  |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `margin` | number | 8–90 mm, step 1 | `26` | Plastic between the key block and the edge of the case. |
| `lip` | number | 12–70 mm, step 1 | `26` | How thick the case is at the front edge, where your wrists rest. |
| `slope` | number | 0–22 °, step 0.5 | `9` | The rake of the top. The back is as tall as this makes it. |
| `radius` | number | 0–60 mm, step 1 | `16` |  |
| `finish` | select | `cream`, `beige`, `brown`, `charcoal` | `"cream"` |  |
| `ribs` | boolean | `true`, `false` | `true` | The ridges across the back of the top, hiding the vents and stiffening the lid. |
| `badge` | boolean | `true`, `false` | `true` |  |

**Storage**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `cassette` | select | `none`, `port`, `deck` | `"port"` | Tape was the storage. Either a deck moulded into the case or a socket for one on a lead. |
| `cartridge` | boolean | `true`, `false` | `true` | A letterbox in the back for a ROM cartridge. |

**Back**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `edgeConnector` | boolean | `true`, `false` | `true` | The bare fingers of the board, brought out through a slot. Everything hung off this. |
| `joystickPorts` | int | 0–2, step 1 | `2` |  |
| `videoOut` | select | `rf`, `composite`, `both` | `"rf"` |  |

**Presets** — worked examples; each lists only what it changes.

- **Chiclet micro** — `{"keyStyle":"chiclet","columns":13,"rows":4,"pitch":16,"keypad":false,"margin":30,"lip":24,"slope":8,"radius":18,"finish":"cream","cassette":"port","cartridge":true,"edgeConnector":true,"joystickPorts":2,"videoOut":"rf","ribs":true}`
- **Rubber-key micro** — `{"keyStyle":"rubber","columns":10,"rows":4,"pitch":17,"keypad":false,"margin":22,"lip":20,"slope":6,"radius":12,"finish":"charcoal","keyColour":"grey","cassette":"port","cartridge":false,"edgeConnector":true,"joystickPorts":0,"videoOut":"rf","ribs":false}`
- **Cartridge micro** — `{"keyStyle":"typewriter","columns":15,"rows":5,"pitch":17.5,"keypad":false,"margin":26,"lip":26,"slope":9,"radius":16,"finish":"beige","cassette":"port","cartridge":true,"edgeConnector":true,"joystickPorts":2,"videoOut":"both","ribs":true}`
- **Built-in tape micro** — `{"keyStyle":"typewriter","columns":15,"rows":5,"pitch":18,"keypad":false,"margin":24,"lip":28,"slope":10,"radius":14,"finish":"brown","keyColour":"light","cassette":"deck","cartridge":false,"edgeConnector":true,"joystickPorts":1,"videoOut":"composite","ribs":true}`
- **Business-minded micro** — `{"keyStyle":"typewriter","columns":17,"rows":6,"pitch":19.05,"keypad":true,"margin":34,"lip":30,"slope":11,"radius":10,"finish":"beige","keyColour":"light","cassette":"port","cartridge":false,"edgeConnector":true,"joystickPorts":0,"videoOut":"composite","ribs":false,"badge":true}`
- **Calculator micro** — `{"keyStyle":"calculator","columns":10,"rows":3,"pitch":13,"keypad":false,"margin":16,"lip":18,"slope":5,"radius":10,"finish":"charcoal","keyColour":"light","cassette":"port","cartridge":false,"edgeConnector":true,"joystickPorts":0,"videoOut":"rf","ribs":false,"badge":false}`
<!-- /generated: parameters -->
