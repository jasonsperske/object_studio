# All-in-one, 2007–18

The machine that went back into the screen once the screen stopped being a tube. A panel, a laptop
board behind it, and a stand.

## When to reach for it

Modern all-in-ones and, at a push, any bare flat panel on a stand — set `thickness` low and turn
the optical drive off. For a tube with a computer in it, use `integrated-micro`.

## What matters most

**The panel is the whole specification.** `panel`, `aspect`, `bezel` and `chin` give you the
outline, and nothing else changes the size. `thickness` and `taper` shape the back — a tapered one
is full size at the glass and drawn in toward the back — `stand` picks a foot, an arm, an easel leg
or nothing, and `finish` does the rest: white plastic and a deep chin reads as 2007, aluminium and
a thin bezel as 2015.

**The stands do different things.** A `foot` or an `arm` lifts the panel, so `standHeight` says how
far. An `easel` is a kickstand: the panel's own bottom edge rests on the desk and the leg props it
from behind, so `standHeight` does not apply and the screen sits low — which is what a machine like
that is. `tilt` leans the panel back about its bottom edge, and whichever stand is fitted follows
it there.

## Worked examples

- **"an early white all-in-one"** → the `2007 white all-in-one` preset
- **"a 27-inch aluminium desktop"** → the `2010 aluminium 27″` preset
- **"a thin modern all-in-one, no optical drive"** → the `2015 thin bezel` preset
- **"a wall-mounted screen"** → `{ stand: 'none', tilt: 0 }`

## Check the metrics

It reports the screen-to-body ratio and warns when the thing is mostly bezel and chin, and it
checks that a slot- or tray-loading drive actually fits the thickness you asked for. Screen centre
is measured off the desk for anything on a stand; on a wall mount it just tells you where the
middle of the screen is up the machine, since the wall decides the rest.

## What it will not do

No touchscreen hinge, no articulated arm that folds flat, no ports worth counting. A wall mount is
modelled as no stand rather than as a bracket. The optical slot runs up the side rather than across
the machine, because that is the way a disc goes into one of these and the only way a forty-
millimetre edge has room for it.

## Parameters

<!-- generated: parameters -->
**Panel**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `panel` | number | 17–34 ″, step 0.5 | `24` | The diagonal. Everything else on this machine follows from it. |
| `aspect` | select | `sixteenTen`, `sixteenNine` | `"sixteenNine"` |  |
| `bezel` | number | 4–40 mm, step 1 | `18` | Round the sides and the top. It got thinner every year. |
| `chin` | number | 8–120 mm, step 1 | `52` | The deeper band under the panel, where the board and the badge went. |
| `screenOn` | boolean | `true`, `false` | `true` |  |
| `webcam` | boolean | `true`, `false` | `true` |  |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `thickness` | number | 12–90 mm, step 1 | `42` | At the thickest point. A slot-loading drive needs about 30. |
| `taper` | boolean | `true`, `false` | `true` | Thick in the middle where the board is, thin at the edges. |
| `finish` | select | `white`, `silver`, `aluminium`, `black`, `glassBlack` | `"aluminium"` |  |
| `radius` | number | 0–40 mm, step 1 | `14` |  |
| `badge` | boolean | `true`, `false` | `true` |  |

**Fittings**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `optical` | select | `none`, `slot`, `tray` | `"slot"` |  |
| `cardReader` | boolean | `true`, `false` | `true` |  |
| `ports` | int | 2–8, step 1 | `6` |  |
| `speakerGrille` | boolean | `true`, `false` | `true` |  |

**Stand**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `stand` | select | `foot`, `arm`, `easel`, `none` | `"foot"` |  |
| `standHeight` | number | 40–260 mm, step 5 | `120` | A foot or an arm lifts the panel. An easel does not — it rests on the desk and the leg props it. Only used in some combinations. |
| `tilt` | number | -5–25 °, step 1 | `8` |  |

**Desk**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `keyboard` | boolean | `true`, `false` | `true` | The slim wireless pair these came with. |

**Presets** — worked examples; each lists only what it changes.

- **2007 white all-in-one** — `{"panel":20,"aspect":"sixteenTen","bezel":26,"chin":62,"thickness":60,"taper":true,"finish":"white","radius":20,"optical":"slot","cardReader":false,"stand":"foot","standHeight":110,"tilt":10,"keyboard":true}`
- **2010 aluminium 27″** — `{"panel":27,"aspect":"sixteenNine","bezel":22,"chin":56,"thickness":54,"taper":true,"finish":"aluminium","radius":12,"optical":"slot","cardReader":true,"stand":"foot","standHeight":140,"tilt":6,"ports":8,"keyboard":true}`
- **2012 office 21″** — `{"panel":21.5,"aspect":"sixteenNine","bezel":16,"chin":44,"thickness":46,"taper":false,"finish":"black","radius":8,"optical":"tray","cardReader":true,"stand":"arm","standHeight":130,"tilt":8,"ports":6,"keyboard":true}`
- **2015 thin bezel** — `{"panel":24,"aspect":"sixteenNine","bezel":8,"chin":26,"thickness":24,"taper":true,"finish":"silver","radius":8,"optical":"none","cardReader":true,"stand":"easel","standHeight":90,"tilt":12,"ports":5,"speakerGrille":true,"keyboard":true}`
- **2018 wall-mounted** — `{"panel":27,"aspect":"sixteenNine","bezel":6,"chin":14,"thickness":18,"taper":false,"finish":"glassBlack","radius":6,"optical":"none","cardReader":false,"stand":"none","tilt":0,"ports":4,"badge":false,"keyboard":false}`
<!-- /generated: parameters -->
