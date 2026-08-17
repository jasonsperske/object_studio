# Table

A table, built from one plan outline: the moulded edge and the apron are cross-sections swept
around it, the leg positions are that outline offset inwards, and the leaves are it clipped into
slices. Seven plan shapes, six leg arrangements.

## When to reach for it

Any table — dining, coffee, console, work, café. Size does not change the choice: a coffee table
is this object with `height: 450`.

## What matters most

`length`, `width` and `height` carry most requests. `height` is worth thinking about, because it
is what makes a table a *kind* of table: 450 coffee, 750 dining, 900 counter, 1050 bar.
`shape` and `legArrangement` set the character, and `fancy` (0–5) is a single dial from a plain
board to turned, corbelled and moulded.

## Worked examples

- **"a 2 m farmhouse dining table"** → `{ length: 2000, width: 950, thickness: 45, legProfile: 'tapered', border: 'breadboard', fancy: 1 }`
- **"a round café table"** → `{ shape: 'round', length: 800, height: 740, legArrangement: 'pedestal', apron: false }`
- **"a coffee table with hairpin legs"** → `{ shape: 'racetrack', length: 1100, width: 600, height: 430, legArrangement: 'hairpin', apron: false, fancy: 0 }`
- **"a dining table that extends"** → `{ leafStyle: 'extension', leafCount: 2, leafWidth: 350, leafState: 'open' }`

## Check the metrics

It reports knee clearance under the apron and warns below 620 mm, which is the number that decides
whether a chair fits under it. It also counts places at 620 mm of edge each.

## What it will not do

No drawers, no stretcher-and-gate mechanisms, and the extension leaves do not model the slides
they would really run on. `width` is ignored for the shapes that have no separate width — round,
square, hexagonal and octagonal all take `length` as the measurement across.

## Parameters

<!-- generated: parameters -->
**Top**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `shape` | select | `rect`, `square`, `round`, `oval`, `racetrack`, `hex`, `octagon` | `"rect"` |  |
| `length` | number | 400–3600 mm, step 10 | `1600` | Along +X. The diameter or width across for the shapes with no separate width. |
| `width` | number | 300–1600 mm, step 10 | `900` | Only used in some combinations. |
| `height` | number | 300–1150 mm, step 5 | `750` | Floor to top surface. 450 coffee, 750 dining, 900 counter, 1050 bar. |
| `thickness` | number | 10–100 mm, step 1 | `28` |  |
| `cornerRadius` | number | 0–400 mm, step 5 | `25` | Only used in some combinations. |

**Edge & border**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `edgeStyle` | select | `square`, `chamfer`, `rounded`, `bullnose`, `cove`, `ogee` | `"rounded"` | The same profiles the stair treads and shelves use, swept around the outline. |
| `edgeSize` | number | 0–40 mm, step 0.5 | `10` | Only used in some combinations. |
| `border` | select | `none`, `banding`, `breadboard`, `lip` | `"none"` |  |
| `borderWidth` | number | 10–250 mm, step 5 | `60` | Only used in some combinations. |
| `lipHeight` | number | 3–80 mm, step 1 | `16` | Only used in some combinations. |

**Leaves**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `leafStyle` | select | `none`, `extension`, `drop` | `"none"` | Extension leaves drop into the middle and make the table longer; drop leaves are cut from the width and hinge down. |
| `leafCount` | int | 1–3, step 1 | `1` | Only used in some combinations. |
| `leafWidth` | number | 80–700 mm, step 10 | `300` | Along the length for extension leaves, across it for drop leaves. Only used in some combinations. |
| `leafState` | select | `open`, `closed` | `"open"` | Only used in some combinations. |

**Legs**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `legArrangement` | select | `corner`, `splayed`, `hairpin`, `trestle`, `pedestal`, `twin` | `"corner"` |  |
| `legProfile` | select | `square`, `tapered`, `round`, `turned`, `fluted` | `"tapered"` | Only used in some combinations. |
| `legThickness` | number | 15–200 mm, step 1 | `70` |  |
| `legInset` | number | 0–500 mm, step 5 | `45` | Only used in some combinations. |
| `legTaper` | number | 0.25–1, step 0.01 | `0.62` | Thickness left at the floor. Only used in some combinations. |
| `splay` | number | 0–30 °, step 0.5 | `12` | Only used in some combinations. |
| `stretcher` | select | `none`, `h`, `box`, `x` | `"none"` | Only used in some combinations. |
| `stretcherHeight` | number | 40–700 mm, step 5 | `200` | Only used in some combinations. |

**Apron & ornament**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `apron` | boolean | `true`, `false` | `true` | The rail running under the top between the legs. |
| `apronDepth` | number | 30–300 mm, step 5 | `90` | Only used in some combinations. |
| `apronInset` | number | 0–200 mm, step 5 | `25` | Only used in some combinations. |
| `apronThickness` | number | 10–80 mm, step 1 | `24` | Only used in some combinations. |
| `fancy` | int | 0–5, step 1 | `1` | 1 beads the apron, 2 arches it and pads the feet, 3 adds a moulding under the top, 4 corbels the legs, 5 collars the turnings and doubles the mouldings. |

**Presets** — worked examples; each lists only what it changes.

- **Farmhouse dining** — `{"shape":"rect","length":2000,"width":950,"thickness":45,"cornerRadius":0,"edgeStyle":"chamfer","edgeSize":6,"border":"breadboard","borderWidth":110,"legArrangement":"corner","legProfile":"tapered","legThickness":90,"legTaper":0.7,"apronDepth":110,"apronInset":30,"fancy":1}`
- **Georgian extending** — `{"shape":"oval","length":1700,"width":1050,"thickness":32,"edgeStyle":"ogee","edgeSize":16,"border":"banding","borderWidth":70,"leafStyle":"extension","leafCount":2,"leafWidth":350,"leafState":"open","legArrangement":"corner","legProfile":"turned","legThickness":85,"apronDepth":100,"fancy":5}`
- **Round pedestal café** — `{"shape":"round","length":800,"thickness":26,"height":740,"edgeStyle":"bullnose","border":"none","legArrangement":"pedestal","legProfile":"turned","legThickness":80,"apron":false,"fancy":3}`
- **Pembroke drop-leaf** — `{"shape":"racetrack","length":900,"width":1000,"thickness":22,"height":730,"edgeStyle":"rounded","edgeSize":8,"leafStyle":"drop","leafWidth":300,"leafState":"closed","legArrangement":"corner","legProfile":"turned","legThickness":55,"apronDepth":80,"apronInset":15,"fancy":4}`
- **Trestle work table** — `{"shape":"rect","length":2200,"width":800,"thickness":50,"cornerRadius":0,"edgeStyle":"square","border":"none","legArrangement":"trestle","legProfile":"square","legThickness":100,"legInset":300,"apron":false,"fancy":0}`
- **Hairpin coffee table** — `{"shape":"racetrack","length":1100,"width":600,"thickness":20,"height":430,"edgeStyle":"rounded","edgeSize":6,"border":"none","legArrangement":"hairpin","legThickness":60,"legInset":60,"splay":14,"apron":false,"fancy":0}`
- **Octagonal games table** — `{"shape":"octagon","length":1100,"thickness":30,"height":745,"edgeStyle":"cove","edgeSize":14,"border":"lip","borderWidth":90,"lipHeight":14,"legArrangement":"twin","legProfile":"fluted","legThickness":70,"apron":true,"apronDepth":95,"fancy":4}`
<!-- /generated: parameters -->
