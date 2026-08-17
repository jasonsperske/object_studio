# Gaming tower, 2002–12

Black steel and acrylic, built around a graphics card that had grown into the biggest single thing
in the case. The floppy has gone, the supply has moved to the floor of it, and the fans are the
point.

## When to reach for it

Desktop PCs of the PCI Express era, and any request with the word "gaming" in it. Beige and
earlier is `multimedia-pc`.

## What matters most

`board` sets the footprint and the slot count; `graphicsCard` is on by default and takes two of
those slots. `bays525` and `hardDisks` drive the height. `window`, `frontMesh`, `finish` and the
three fan toggles carry most of the character — a windowed black case with three 140 mm fans reads
as a gaming machine without any other change.

## Worked examples

- **"a mid-2000s gaming PC"** → the `2006 windowed rig` preset
- **"a quiet build with big fans, opened up"** → the `2009 quiet build, open` preset
- **"a small form factor machine that still takes a graphics card"** → the `2011 small form factor` preset
- **"a black tower with red trim and a 27-inch monitor"** → `{ finish: 'red', display: 'wide27' }`

## Check the metrics

It reports slots used against the board's own count — a double-height graphics card plus three
other cards will not fit a microATX board, and it says so — and warns if you have fitted no fans
at all.

## What it will not do

No liquid cooling, no RGB lighting, no cable management to look at. The window is a flat panel, not
tinted glass.

## Parameters

<!-- generated: parameters -->
**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `board` | select | `atx`, `microAtx`, `miniItx` | `"atx"` | Sets the footprint, the height of the case and how many slots there are. |
| `graphicsCard` | boolean | `true`, `false` | `true` | Double height with its own cooler, and it takes two slots. |
| `cards` | int | 0–5, step 1 | `1` | Sound, network, capture, or a second graphics card. |
| `cutaway` | boolean | `true`, `false` | `false` |  |

**Drives**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `bays525` | int | 0–4, step 1 | `2` | 41.3 mm of case height each. |
| `optical` | int | 0–2, step 1 | `1` | DVD, then Blu-ray. The same tray from the outside. |
| `fanController` | boolean | `true`, `false` | `false` | In a 5¼" opening, with dials and a temperature readout. |
| `cardReader` | boolean | `true`, `false` | `true` | In the 3½" opening the floppy used to have. |
| `hardDisks` | int | 0–6, step 1 | `2` | In the internal cage — 26 mm of height each. |
| `ssd` | boolean | `true`, `false` | `false` | A 2½" drive on a bracket. The late fitment. |

**Cooling**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `frontFan` | boolean | `true`, `false` | `true` |  |
| `rearFan` | boolean | `true`, `false` | `true` |  |
| `topFan` | boolean | `true`, `false` | `false` |  |
| `fanSize` | number | 80–140 mm, step 20 | `120` |  |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `finish` | select | `black`, `gunmetal`, `silver`, `red` | `"black"` |  |
| `window` | boolean | `true`, `false` | `true` | Only used in some combinations. |
| `frontMesh` | boolean | `true`, `false` | `true` |  |
| `frontPorts` | boolean | `true`, `false` | `true` |  |

**Desk**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `display` | select | `none`, `crt19`, `wide19`, `wide22`, `wide27` | `"wide22"` |  |
| `screenOn` | boolean | `true`, `false` | `false` | Only used in some combinations. |
| `keyboard` | boolean | `true`, `false` | `true` |  |

**Presets** — worked examples; each lists only what it changes.

- **2003 first build** — `{"board":"atx","graphicsCard":true,"cards":2,"bays525":3,"optical":2,"cardReader":false,"hardDisks":1,"finish":"silver","window":false,"frontMesh":false,"frontPorts":false,"frontFan":true,"rearFan":true,"fanSize":80,"display":"crt19","keyboard":true}`
- **2006 windowed rig** — `{"board":"atx","graphicsCard":true,"cards":1,"bays525":2,"optical":1,"fanController":true,"cardReader":true,"hardDisks":2,"finish":"black","window":true,"frontMesh":true,"frontPorts":true,"frontFan":true,"rearFan":true,"topFan":true,"fanSize":120,"display":"wide22","screenOn":true,"keyboard":true}`
- **2009 quiet build, open** — `{"board":"atx","graphicsCard":true,"cards":0,"bays525":2,"optical":1,"cardReader":true,"hardDisks":3,"ssd":false,"finish":"gunmetal","cutaway":true,"frontMesh":true,"frontFan":true,"rearFan":true,"fanSize":140,"display":"none","keyboard":false}`
- **2011 small form factor** — `{"board":"microAtx","graphicsCard":true,"cards":0,"bays525":1,"optical":1,"cardReader":true,"hardDisks":1,"ssd":true,"finish":"black","window":false,"frontMesh":true,"frontPorts":true,"frontFan":true,"rearFan":true,"fanSize":120,"display":"wide22","keyboard":true}`
- **2012 red-trim tower** — `{"board":"atx","graphicsCard":true,"cards":2,"bays525":3,"optical":1,"fanController":true,"cardReader":true,"hardDisks":4,"ssd":true,"finish":"red","window":true,"frontMesh":true,"frontPorts":true,"frontFan":true,"rearFan":true,"topFan":true,"fanSize":140,"display":"wide27","screenOn":true,"keyboard":true}`
<!-- /generated: parameters -->
