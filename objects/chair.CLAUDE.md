# Chair

A chair. The seat is a plan outline like the table top, so it takes the same moulded edges; the
back is drawn flat and then tipped by the rake angle about the back edge of the seat.

## When to reach for it

Any chair — dining, side, carver, occasional. Stools and benches are not covered.

## What matters most

`backStyle` does most of the work of saying what kind of chair it is: ladder, spindle, splat,
cross, panel or upholstered. `legProfile` seconds it — a cabriole leg and a splat back is a
Georgian chair without setting anything else. `seatHeight` decides what it can sit at, and
`fancy` (0–5) matches the table's dial, so a chair drawn at the same setting matches the table.

## Worked examples

- **"a farmhouse kitchen chair"** → the `Farmhouse ladderback` preset
- **"a chair to go with a Georgian dining table"** → the `Georgian splat` preset
- **"an upholstered dining chair in charcoal"** → `{ backStyle: 'upholstered', seatPad: 'full', padColor: 'charcoal' }`
- **"a carver at the head of the table"** → the `Carver armchair` preset

## Check the metrics

It reports the seat height and, more usefully, the gap under a 750 mm table — thighs want
280–300 mm, and it warns outside that. If you are generating a chair for a table you have already
made, check this against that table's knee clearance.

## What it will not do

No stools, no benches, no rockers, no swivel or castor bases. The arms are a single open style.

## Parameters

<!-- generated: parameters -->
**Seat**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `seatShape` | select | `square`, `trapezoid`, `bowfront`, `round` | `"trapezoid"` |  |
| `seatWidth` | number | 260–700 mm, step 5 | `450` | Across the front, shoulder to shoulder. |
| `seatDepth` | number | 260–700 mm, step 5 | `430` |  |
| `seatHeight` | number | 250–800 mm, step 5 | `460` | Floor to the top of the seat. 450 sits at a 750 table. |
| `seatThickness` | number | 12–90 mm, step 1 | `34` |  |
| `seatTaper` | number | 0–200 mm, step 5 | `60` | Only used in some combinations. |
| `cornerRadius` | number | 0–150 mm, step 1 | `30` | Only used in some combinations. |
| `edgeStyle` | select | `square`, `chamfer`, `rounded`, `bullnose`, `cove`, `ogee` | `"rounded"` | The same profiles the table edge and the stair treads use. |
| `edgeSize` | number | 0–30 mm, step 0.5 | `8` | Only used in some combinations. |

**Back**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `backStyle` | select | `open`, `ladder`, `spindle`, `splat`, `cross`, `panel`, `upholstered` | `"ladder"` |  |
| `backHeight` | number | 100–900 mm, step 5 | `470` | Above the seat. |
| `backRake` | number | 0–22 °, step 0.5 | `8` | How far the back leans away from vertical. |
| `backFill` | int | 1–11, step 1 | `4` | Only used in some combinations. |
| `crestStyle` | select | `straight`, `arched`, `yoke` | `"arched"` |  |

**Legs**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `legProfile` | select | `square`, `tapered`, `round`, `turned`, `cabriole` | `"tapered"` |  |
| `legThickness` | number | 16–90 mm, step 1 | `38` |  |
| `legTaper` | number | 0.3–1, step 0.01 | `0.7` | Only used in some combinations. |
| `splay` | number | 0–18 °, step 0.5 | `4` | How far the feet stand outside the seat. |
| `rearPost` | boolean | `true`, `false` | `true` | Off puts the back posts on the seat instead, as a Windsor does. |
| `stretcher` | select | `none`, `h`, `box`, `double` | `"h"` |  |
| `stretcherHeight` | number | 40–400 mm, step 5 | `170` | Only used in some combinations. |

**Arms**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `arms` | boolean | `true`, `false` | `false` |  |
| `armHeight` | number | 100–350 mm, step 5 | `210` | Above the seat. Only used in some combinations. |

**Upholstery & ornament**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `seatPad` | select | `none`, `over`, `dropIn`, `full` | `"none"` |  |
| `padThickness` | number | 10–140 mm, step 2 | `46` | Only used in some combinations. |
| `padColor` | select | `linen`, `sage`, `oxblood`, `charcoal`, `teal` | `"sage"` | Only used in some combinations. |
| `fancy` | int | 0–5, step 1 | `1` | 1 beads the seat edge, 2 shapes the back boards and pads the feet, 3 adds corbels and scrolls the arms, 4 turns finials and rings, 5 carves the crest and buttons the upholstery. |

**Presets** — worked examples; each lists only what it changes.

- **Farmhouse ladderback** — `{"seatShape":"trapezoid","seatWidth":450,"seatDepth":420,"seatHeight":455,"seatThickness":30,"edgeStyle":"chamfer","edgeSize":5,"backStyle":"ladder","backHeight":520,"backFill":4,"crestStyle":"arched","backRake":7,"legProfile":"tapered","legThickness":42,"stretcher":"h","fancy":1}`
- **Windsor spindle** — `{"seatShape":"bowfront","seatWidth":460,"seatDepth":430,"seatHeight":450,"seatThickness":42,"seatTaper":90,"edgeStyle":"bullnose","backStyle":"spindle","backHeight":560,"backFill":7,"crestStyle":"arched","backRake":13,"legProfile":"turned","legThickness":44,"splay":13,"rearPost":false,"stretcher":"h","stretcherHeight":190,"fancy":2}`
- **Georgian splat** — `{"seatShape":"trapezoid","seatWidth":480,"seatDepth":440,"seatHeight":470,"seatThickness":26,"seatTaper":110,"cornerRadius":45,"edgeStyle":"ogee","edgeSize":9,"backStyle":"splat","backHeight":540,"crestStyle":"yoke","backRake":10,"legProfile":"cabriole","legThickness":46,"stretcher":"none","seatPad":"dropIn","padThickness":55,"padColor":"oxblood","fancy":4}`
- **Carver armchair** — `{"seatShape":"trapezoid","seatWidth":520,"seatDepth":460,"seatHeight":460,"seatThickness":32,"backStyle":"ladder","backHeight":560,"backFill":3,"crestStyle":"yoke","backRake":9,"legProfile":"turned","legThickness":46,"stretcher":"box","arms":true,"armHeight":215,"fancy":4}`
- **Upholstered dining** — `{"seatShape":"square","seatWidth":470,"seatDepth":460,"seatHeight":450,"seatThickness":36,"cornerRadius":20,"edgeStyle":"rounded","backStyle":"upholstered","backHeight":480,"crestStyle":"straight","backRake":11,"legProfile":"square","legThickness":40,"stretcher":"none","seatPad":"full","padThickness":70,"padColor":"charcoal","fancy":2}`
- **Modern tapered** — `{"seatShape":"square","seatWidth":440,"seatDepth":430,"seatHeight":450,"seatThickness":20,"cornerRadius":60,"edgeStyle":"rounded","edgeSize":6,"backStyle":"panel","backHeight":380,"crestStyle":"straight","backRake":14,"legProfile":"round","legThickness":30,"legTaper":0.55,"splay":7,"stretcher":"none","fancy":0}`
- **Cross-back café** — `{"seatShape":"round","seatWidth":420,"seatDepth":420,"seatHeight":455,"seatThickness":24,"edgeStyle":"rounded","edgeSize":8,"backStyle":"cross","backHeight":440,"crestStyle":"straight","backRake":9,"legProfile":"round","legThickness":34,"splay":9,"stretcher":"box","stretcherHeight":150,"fancy":3}`
<!-- /generated: parameters -->
