# Flat panel television, 1998–present

The set after the tube. There is no cabinet left to design: a panel, the boards behind it, and
something holding it up — so the panel is the whole specification, which is exactly how these have
always been sold.

## When to reach for it

Any flat television: plasma, LCD, OLED, on a stand or on a wall. At a push, any large bare panel —
a display, a signage screen — with `speakers: 'none'` and `badge: false`. For a tube, use
`crt-television`. For a computer behind a panel, use `all-in-one`.

## What matters most

**`panel`, `aspect`, `bezel` and `chin` give you the whole outline** and nothing else changes the
size. A 40 mm bezel and a deep chin reads as 2007; 3 mm and almost no chin reads as 2020.

**`tech` is not a finish.** It is the one honest constraint in here: plasma will not go under about
58 mm, LCD under about 22, OLED under about 6, and the metrics say so. It also drives the mass —
plasma is roughly three times an LCD of the same size.

**`profile` is how the depth is spent.** `slab` is the same all over. `tapered` thins toward the
edge. `stepped` is the modern shape: the technology's own thickness at the edge, with a box across
the bottom of the back holding the boards, which is how a 65″ OLED measures 8 mm at the rim and
48 mm at its deepest.

**`stand` and `standHeight` decide the footprint.** `feet` want a unit nearly as wide as the set,
and the metrics report how wide; `pedestal` and `plate` do not. `none` is a wall mount, with a
`bracket` behind it.

## Worked examples

- **"a 55-inch television"** → the defaults
- **"a plasma from about 2008"** → the `2008 plasma` preset
- **"an early flat screen on a pedestal"** → the `2011 edge-lit LCD` preset
- **"a curved 4K set"** → the `2016 curved 4K` preset
- **"a big OLED"** → the `2019 OLED on a plate` preset
- **"a 75-inch on the wall, with a soundbar"** → the `2022 wall-mounted 75″` preset
- **"a small one for a kitchen"** → the `Small kitchen set` preset
- **"hang it on the wall"** → `{ stand: 'none', bracket: true }`
- **"the thinnest set you can honestly draw"** → `{ tech: 'oled', thickness: 8, profile: 'slab', bezel: 2, chin: 6 }`

## Check the metrics

**Thickness** is the one that bites: it reports what the set measures at its edge and at its
deepest, and it errors when the technology you asked for will not fit in the depth you gave it. It
also reports the screen-to-body ratio, the mass the wall bracket has to take, how far back to sit,
and — like `crt-television` — a **Reads as** range, so a 21:9 panel with a 40 mm bezel is flagged
rather than quietly built.

## What it will not do

No screen content, no cable management, no articulated wall arm, no rollable or transparent panel.
A curved screen is a single cylindrical bend about a vertical axis; there is no flexing one flat
again. The pop-up camera is only ever drawn popped up. Ports are openings in the back, not
connectors.

## Parameters

<!-- generated: parameters -->
**Panel**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `panel` | number | 13–98 ″, step 0.5 | `55` | The diagonal. Everything else on this set follows from it. |
| `aspect` | select | `sixteenNine`, `sixteenTen`, `twentyOneNine` | `"sixteenNine"` |  |
| `tech` | select | `plasma`, `lcd`, `oled` | `"lcd"` | Not a finish. This is what sets how thin the set can honestly be and how much of the back is boxed. |
| `bezel` | number | 1–60 mm, step 0.5 | `10` | Round the sides and the top. Forty millimetres reads as 2007, two as 2020. |
| `chin` | number | 2–140 mm, step 1 | `22` | The deeper band under the picture, where the badge, the lamp and the infrared window went. |
| `screenOn` | boolean | `true`, `false` | `true` |  |

**Body**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `thickness` | number | 4–140 mm, step 1 | `58` | At the thickest point. The metrics will say if the technology you picked cannot fit inside it. |
| `profile` | select | `slab`, `tapered`, `stepped` | `"stepped"` |  |
| `radius` | number | 0–40 mm, step 1 | `8` |  |
| `finish` | select | `black`, `glossBlack`, `gunmetal`, `silver`, `aluminium`, `white` | `"black"` |  |
| `curved` | boolean | `true`, `false` | `false` | The 2014–17 idea: the whole set wrapped round a vertical cylinder, concave toward the room. |
| `curveRadius` | number | 1500–8000 mm, step 100 | `4000` | Quoted as 4000R and so on. Smaller is more bent. Only used in some combinations. |

**Fittings**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `badge` | boolean | `true`, `false` | `true` |  |
| `standby` | boolean | `true`, `false` | `true` |  |
| `speakers` | select | `downFiring`, `grille`, `soundbar`, `none` | `"downFiring"` |  |
| `ports` | int | 0–12, step 1 | `7` |  |
| `camera` | boolean | `true`, `false` | `false` | The one the smart sets grew for a few years and then quietly dropped. |

**Stand**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `stand` | select | `pedestal`, `feet`, `plate`, `easel`, `none` | `"feet"` |  |
| `standHeight` | number | 10–400 mm, step 5 | `70` | Only used in some combinations. |
| `footSpread` | number | 20–100 %, step 1 | `78` | As a share of the width. Wide feet want a wide table, which is the complaint everyone had about them. Only used in some combinations. |
| `tilt` | number | -4–16 °, step 1 | `3` | Only used in some combinations. |
| `bracket` | boolean | `true`, `false` | `true` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **2008 plasma** — `{"panel":42,"aspect":"sixteenNine","tech":"plasma","bezel":34,"chin":62,"screenOn":true,"thickness":92,"profile":"tapered","radius":12,"finish":"glossBlack","speakers":"grille","stand":"pedestal","standHeight":90,"tilt":0,"ports":6,"badge":true}`
- **2011 edge-lit LCD** — `{"panel":40,"aspect":"sixteenNine","tech":"lcd","bezel":18,"chin":34,"screenOn":true,"thickness":34,"profile":"tapered","radius":8,"finish":"black","speakers":"downFiring","stand":"pedestal","standHeight":80,"tilt":2,"ports":8,"badge":true}`
- **2016 curved 4K** — `{"panel":55,"aspect":"sixteenNine","tech":"lcd","bezel":8,"chin":18,"screenOn":true,"thickness":42,"profile":"stepped","radius":6,"finish":"gunmetal","curved":true,"curveRadius":4200,"speakers":"downFiring","stand":"feet","footSpread":82,"standHeight":60,"tilt":2,"ports":8,"camera":false,"badge":true}`
- **2019 OLED on a plate** — `{"panel":65,"aspect":"sixteenNine","tech":"oled","bezel":4,"chin":10,"screenOn":true,"thickness":48,"profile":"stepped","radius":4,"finish":"gunmetal","speakers":"downFiring","stand":"plate","standHeight":46,"tilt":0,"ports":9,"badge":false,"standby":true}`
- **2022 wall-mounted 75″** — `{"panel":75,"aspect":"sixteenNine","tech":"lcd","bezel":3,"chin":8,"screenOn":true,"thickness":30,"profile":"stepped","radius":4,"finish":"black","speakers":"soundbar","stand":"none","bracket":true,"ports":10,"badge":false}`
- **Small kitchen set** — `{"panel":24,"aspect":"sixteenNine","tech":"lcd","bezel":12,"chin":22,"screenOn":true,"thickness":40,"profile":"slab","radius":6,"finish":"white","speakers":"grille","stand":"easel","standHeight":30,"tilt":6,"ports":3,"badge":true}`
<!-- /generated: parameters -->
