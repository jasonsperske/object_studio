# Home micro, 1977–85

The machine that was a keyboard: board, power and modulator all under the keys, with the
television as the monitor. No screen, no expansion cards — what expansion there was came out of an
edge connector at the back.

The defaults build the archetype of the class: a four-hundred-millimetre cream wedge with a
full-size sculpted keyboard, a column of function keys down the right of it, ribs moulded across
a vent band sunk into the deck, a lamp beside it and the joystick ports out of the right-hand side.

## When to reach for it

Home computers of the cassette era, the ones shaped like a wedge with the keyboard built in. If
the screen is part of the machine, use `integrated-micro`.

## What matters most

**The case is sized by the keyboard**, so start there: `keyStyle`, `columns`, `rows` and `pitch`
set the width and depth. `pitch` is the strongest signal of what kind of machine it is — 19.05 mm
is a real typewriter keyboard, 16 is cramped, 13 is a calculator.

`keyStyle` does more than change the caps. `typewriter` and `chiclet` lay the rows out the way a
sculpted keyboard was laid out — modifiers at the ends of the rows, a space bar under the letters,
cursor keys hanging off the right — while `rubber` and `calculator` are moulded as one uniform
grid, which is what those machines actually had.

Three mouldings then shape the case around it: `margin` at the sides, `frontBand` for the blank
plastic your wrists rest on, and `backDeck` for the strip behind the keys that carries the badge,
the lamp and the vent ribs. `lip` and `slope` make the wedge. `ribs` wants about 52 mm of
`backDeck` to sink its vent band into; below that it is quietly left off, and the metrics say so.

## Worked examples

- **"a breadbin home computer"** → the defaults, or the `Breadbin micro` preset
- **"a rubber-keyed 8-bit micro"** → the `Rubber-key micro` preset
- **"a home computer with a tape deck built in"** → the `Built-in tape micro` preset
- **"a cheap little micro with calculator keys"** → the `Calculator micro` preset
- **"a business-ish micro with a numeric keypad"** → `{ keypad: true, pitch: 19.05, columns: 18, rows: 6 }`
- **"the same machine, but black"** → `{ finish: 'charcoal', keyColour: 'grey' }`

## Read the metrics

Two of them are worth watching. **Key pitch** tells you what the keyboard would have been like to
use, and a `warn` there is often right — a cheap machine really was cramped. **Back panel** is not:
it adds up everything you have asked to come out of the back and compares it with the width the
case actually has. If it warns, the sockets are being squeezed to fit, and the answer is a wider
case, fewer fittings, or `portSide: 'right'` to send the joysticks and the power out of the side.

## What it will not do

No screen, no disk drives, no expansion cards — none of those belong to this generation, which is
the point of it being its own object. A cartridge slot and a cassette deck are the only storage.

## Parameters

<!-- generated: parameters -->
**Keyboard**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `keyStyle` | select | `calculator`, `chiclet`, `rubber`, `typewriter` | `"typewriter"` |  |
| `columns` | int | 10–22, step 1 | `17` | Key units across the main block. Ten was a calculator; seventeen takes a full number row. |
| `rows` | int | 3–6, step 1 | `5` |  |
| `pitch` | number | 12–20 mm, step 0.05 | `19` | Centre to centre. A typewriter is 19.05; below about 16 you are hunting and pecking. |
| `functionKeys` | int | 0–4, step 1 | `4` | A column of tall keys down the right of the block, each one two legends deep. |
| `keypad` | boolean | `true`, `false` | `false` | Four more columns on the right, and a wider case to hold them. |
| `keyColour` | select | `matching`, `dark`, `brown`, `grey`, `light` | `"brown"` | Function keys take a lighter shade of this, the way they were always picked out. |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `margin` | number | 8–60 mm, step 1 | `22` | Plastic between the key block and each end of the case. |
| `frontBand` | number | 10–90 mm, step 1 | `44` | The blank plastic your wrists rest on. |
| `backDeck` | number | 10–120 mm, step 1 | `72` | The strip behind the key well, which carried the badge, the lamp and the vent ribs. |
| `lip` | number | 12–70 mm, step 1 | `43` | How thick the case is at the front edge, where your wrists rest. |
| `slope` | number | 0–22 °, step 0.5 | `7.5` | The rake of the top. The back is as tall as this makes it. |
| `radius` | number | 0–60 mm, step 1 | `14` |  |
| `finish` | select | `cream`, `beige`, `brown`, `charcoal` | `"cream"` |  |
| `ribs` | boolean | `true`, `false` | `true` | The vent band sunk into the deck behind the keys, with the ribs standing in it. Wants about 52 mm of deck to go into. |
| `badge` | boolean | `true`, `false` | `true` |  |
| `lamp` | boolean | `true`, `false` | `true` | The one on the deck that told you it was on, because nothing else did. |

**Storage**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `cassette` | select | `none`, `port`, `deck` | `"port"` | Tape was the storage. Either a deck moulded into the case or a socket for one on a lead. |
| `cartridge` | boolean | `true`, `false` | `true` | A letterbox in the back for a ROM cartridge. |

**Sockets**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `edgeConnector` | boolean | `true`, `false` | `true` | The bare fingers of the board, brought out through a slot. Everything hung off this. |
| `joystickPorts` | int | 0–2, step 1 | `2` |  |
| `portSide` | select | `right`, `back` | `"right"` | Where the joystick ports, the switch and the power inlet come out. |
| `videoOut` | select | `rf`, `composite`, `both` | `"both"` |  |

**Presets** — worked examples; each lists only what it changes.

- **Breadbin micro** — `{"keyStyle":"typewriter","columns":17,"rows":5,"pitch":19,"functionKeys":4,"keypad":false,"keyColour":"brown","margin":22,"frontBand":44,"backDeck":72,"lip":43,"slope":7.5,"radius":14,"finish":"cream","ribs":true,"badge":true,"lamp":true,"cassette":"port","cartridge":true,"edgeConnector":true,"joystickPorts":2,"portSide":"right","videoOut":"both"}`
- **Chiclet micro** — `{"keyStyle":"chiclet","columns":14,"rows":4,"pitch":16,"functionKeys":0,"keypad":false,"margin":26,"frontBand":34,"backDeck":54,"lip":24,"slope":8,"radius":18,"finish":"cream","keyColour":"dark","cassette":"port","cartridge":true,"edgeConnector":false,"joystickPorts":2,"portSide":"right","videoOut":"rf","ribs":true,"lamp":false}`
- **Rubber-key micro** — `{"keyStyle":"rubber","columns":10,"rows":4,"pitch":17,"functionKeys":0,"keypad":false,"margin":16,"frontBand":22,"backDeck":26,"lip":20,"slope":6,"radius":12,"finish":"charcoal","keyColour":"grey","cassette":"port","cartridge":false,"edgeConnector":true,"joystickPorts":0,"portSide":"right","videoOut":"rf","ribs":false,"lamp":false,"badge":true}`
- **Cartridge micro** — `{"keyStyle":"typewriter","columns":15,"rows":5,"pitch":17.5,"functionKeys":4,"keypad":false,"margin":20,"frontBand":42,"backDeck":54,"lip":30,"slope":9,"radius":16,"finish":"beige","keyColour":"light","cassette":"port","cartridge":true,"edgeConnector":true,"joystickPorts":1,"portSide":"right","videoOut":"rf","ribs":true,"lamp":true}`
- **Built-in tape micro** — `{"keyStyle":"typewriter","columns":15,"rows":5,"pitch":18,"functionKeys":0,"keypad":true,"margin":20,"frontBand":34,"backDeck":56,"lip":30,"slope":8,"radius":14,"finish":"brown","keyColour":"light","cassette":"deck","cartridge":false,"edgeConnector":true,"joystickPorts":1,"portSide":"back","videoOut":"composite","ribs":true,"lamp":true}`
- **Business-minded micro** — `{"keyStyle":"typewriter","columns":18,"rows":6,"pitch":19.05,"functionKeys":4,"keypad":true,"margin":26,"frontBand":40,"backDeck":46,"lip":32,"slope":11,"radius":10,"finish":"beige","keyColour":"light","cassette":"port","cartridge":false,"edgeConnector":true,"joystickPorts":0,"portSide":"back","videoOut":"composite","ribs":false,"badge":true,"lamp":true}`
- **Calculator micro** — `{"keyStyle":"calculator","columns":10,"rows":4,"pitch":13,"functionKeys":0,"keypad":false,"margin":22,"frontBand":16,"backDeck":20,"lip":18,"slope":5,"radius":10,"finish":"charcoal","keyColour":"light","cassette":"port","cartridge":false,"edgeConnector":true,"joystickPorts":0,"portSide":"right","videoOut":"rf","ribs":false,"badge":false,"lamp":false}`
<!-- /generated: parameters -->
