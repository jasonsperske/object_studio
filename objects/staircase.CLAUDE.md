# Straight staircase

A straight flight: treads, optional risers, stringers either side, and a handrail with balusters.
The rise and going are derived — you give the floor-to-floor height and the number of steps, and
the riser height falls out of the division.

## When to reach for it

Any run of stairs that goes in a straight line. If the space is round or too tight for a straight
flight, use `spiral-staircase` instead.

## What matters most

`totalRise` is the floor-to-floor height and is nearly always what a request is really about;
`steps` divides it. `going` is the depth of each tread, `width` the clear width across. Everything
else is finish: `edgeStyle` shapes the nosing, `stringers` picks how the sides are closed, and the
handrail group turns the rail and balusters on and off.

## Worked examples

- **"stairs to the first floor of a house"** → `{ totalRise: 2700, steps: 15, width: 950 }`
- **"a wide open-tread staircase, no risers"** → `{ width: 1400, risers: false, stringers: 'cut', topTread: true }`
- **"steep loft stairs"** → `{ totalRise: 2900, steps: 12, going: 220, width: 700, handrail: 'both' }`

## Check the metrics

This one reports riser height, going, pitch and the 2R+G rule, flagging anything outside common
building-code limits in amber or red. If a request produces a warning, add a step or lengthen the
going rather than shipping it. Those checks are design aids, not the code that applies to any
particular project.

## What it will not do

No winders, no landings, no curved flights, and no cut string with brackets. One straight run.

## Parameters

<!-- generated: parameters -->
**Flight**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `width` | number | 400–2400 mm, step 10 | `950` | Clear width across the treads. |
| `totalRise` | number | 300–5000 mm, step 10 | `2700` |  |
| `steps` | int | 2–30, step 1 | `15` | Riser height = rise ÷ steps. |
| `going` | number | 150–450 mm, step 5 | `280` | Horizontal run of one step. |
| `topTread` | boolean | `true`, `false` | `false` | Off when the upper floor itself forms the last step. |

**Tread & nosing**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `treadThickness` | number | 10–120 mm, step 1 | `42` |  |
| `nosing` | number | 0–80 mm, step 1 | `25` |  |
| `edgeStyle` | select | `square`, `chamfer`, `rounded`, `bullnose`, `cove`, `ogee` | `"rounded"` |  |
| `edgeSize` | number | 0–40 mm, step 0.5 | `12` | Only used in some combinations. |

**Risers**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `risers` | boolean | `true`, `false` | `true` |  |
| `riserThickness` | number | 5–80 mm, step 1 | `20` | Only used in some combinations. |

**Stringers**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `stringers` | select | `none`, `cut`, `closed` | `"closed"` |  |
| `stringerThickness` | number | 15–100 mm, step 1 | `38` | Only used in some combinations. |
| `stringerDepth` | number | 60–500 mm, step 5 | `260` | Measured vertically below the pitch line. Only used in some combinations. |

**Handrail**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `handrail` | select | `none`, `left`, `right`, `both` | `"right"` |  |
| `railHeight` | number | 600–1200 mm, step 5 | `900` | Vertical distance above the nosing line. Only used in some combinations. |
| `railDiameter` | number | 20–90 mm, step 1 | `48` | Only used in some combinations. |
| `balusters` | boolean | `true`, `false` | `true` | Only used in some combinations. |
| `balusterDiameter` | number | 8–60 mm, step 1 | `22` | Only used in some combinations. |
| `balustersPerStep` | int | 1–3, step 1 | `2` | Only used in some combinations. |
<!-- /generated: parameters -->
