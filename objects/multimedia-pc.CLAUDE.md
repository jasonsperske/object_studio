# Multimedia PC, 1995–2001

The beige mini tower that came with a sound card, a CD-ROM and a pair of speakers. Two buses at
once, because the ISA cards people already owned had to keep working while PCI took over.

## When to reach for it

Home and office PCs of the CD-ROM era. Earlier is `at-desktop`; blacker, later and with a graphics
card is `gaming-tower`.

## What matters most

`board` — Baby-AT, ATX or microATX — sets the footprint and how many slots there are of each kind.
`bays525` and `bays35` are openings, and each one is real case height: a fourth 5¼" bay is another
41.3 mm of tower whether anything goes in it or not. Then `optical`, `floppy` and `hardDisks` fill
them. `speakers` and `display` dress the desk around it.

**The speakers say as much as the case does.** `compact` is the pair that came in the box — a drum
leaning back off a base with the volume, bass and treble on one of the two. `tower` is the plastic
columns that flanked a monitor. `monitors` is the pair somebody chose for themselves: a cabinet
with a mesh disc in a moulded ring and a row of controls along the bottom of each. The desk is laid
out from the middle outwards — monitor, a speaker either side, then the tower beyond the lot — so
picking bigger speakers moves the tower over rather than putting it through them.

## Worked examples

- **"a mid-90s family PC with a CD-ROM"** → the `1995 multimedia bundle` preset
- **"an office ATX machine"** → the `1997 office ATX` preset
- **"the same machine but with proper speakers"** → `{ speakers: 'monitors' }`
- **"a tower with a CD burner and two hard disks"** → `{ bays525: 3, optical: 2, hardDisks: 2 }`
- **"show me inside it"** → `{ cutaway: true }`

## Check the metrics

It reports openings used and cards against the slots the chosen board actually has, and warns when
you have asked for more of either than will fit.

## What it will not do

No PCI Express, no graphics card with its own cooler, no front USB — those are `gaming-tower`. The
tower always stands beside its monitor rather than under the desk.

## Parameters

<!-- generated: parameters -->
**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `board` | select | `babyAt`, `atx`, `microAtx` | `"atx"` | Sets the footprint, how tall the case has to be, and how many slots there are to fill. |
| `isaCards` | int | 0–4, step 1 | `1` | The sound card usually, and a modem if it was old enough. |
| `pciCards` | int | 0–5, step 1 | `2` | Graphics, network, SCSI, or the sound card once it moved over. |
| `cutaway` | boolean | `true`, `false` | `false` | Builds the board, the cards, the drive cage and the supply. |

**Drives**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `bays525` | int | 1–4, step 1 | `2` | Each one is 41.3 mm of case height. |
| `optical` | int | 0–2, step 1 | `1` |  |
| `tapeDrive` | boolean | `true`, `false` | `false` |  |
| `bays35` | int | 0–2, step 1 | `1` | 25.4 mm each. The floppy went in one of these. |
| `floppy` | boolean | `true`, `false` | `true` |  |
| `hardDisks` | int | 0–3, step 1 | `1` | In the internal cage, which adds 26 mm of height each. |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `finish` | select | `beige`, `putty`, `white`, `charcoal` | `"beige"` |  |
| `resetButton` | boolean | `true`, `false` | `true` |  |
| `badge` | boolean | `true`, `false` | `true` |  |
| `feet` | boolean | `true`, `false` | `true` |  |

**Desk**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `speakers` | select | `none`, `compact`, `tower`, `monitors` | `"compact"` | One either side of the monitor. What they are says as much about the machine as the case does. |
| `display` | select | `none`, `crt14`, `crt15`, `crt17` | `"crt15"` |  |
| `screenOn` | boolean | `true`, `false` | `false` | Only used in some combinations. |
| `keyboard` | boolean | `true`, `false` | `true` |  |

**Presets** — worked examples; each lists only what it changes.

- **1995 multimedia bundle** — `{"board":"babyAt","isaCards":2,"pciCards":1,"bays525":2,"optical":1,"bays35":1,"floppy":true,"hardDisks":1,"finish":"beige","speakers":"compact","display":"crt14","keyboard":true,"resetButton":true}`
- **1997 office ATX** — `{"board":"atx","isaCards":1,"pciCards":2,"bays525":2,"optical":1,"bays35":1,"floppy":true,"hardDisks":1,"finish":"putty","speakers":"tower","display":"crt15","keyboard":true}`
- **1999 CD-burner tower** — `{"board":"atx","isaCards":1,"pciCards":4,"bays525":3,"optical":2,"tapeDrive":false,"bays35":1,"floppy":true,"hardDisks":2,"finish":"white","speakers":"monitors","display":"crt17","screenOn":true,"keyboard":true}`
- **2000 small footprint** — `{"board":"microAtx","isaCards":0,"pciCards":2,"bays525":1,"optical":1,"bays35":1,"floppy":true,"hardDisks":1,"finish":"putty","speakers":"none","display":"crt15","keyboard":true,"badge":false}`
- **1998 workshop machine, open** — `{"board":"atx","isaCards":2,"pciCards":3,"bays525":3,"optical":1,"tapeDrive":true,"bays35":2,"floppy":true,"hardDisks":3,"finish":"beige","cutaway":true,"speakers":"none","display":"none","keyboard":false}`
<!-- /generated: parameters -->
