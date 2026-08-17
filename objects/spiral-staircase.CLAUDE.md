# Spiral staircase

Wedge treads winding round a central column, with a helical handrail following them up.

## When to reach for it

Stairs in a round shaft, or where a straight flight will not fit. For anything straight, use
`staircase`.

## What matters most

`outerRadius` sets the footprint, `totalRise` the floor-to-floor height, and `steps` how many
treads divide it. `sweep` is how far round it goes — 360° is one full turn — and `direction`
picks the hand. `columnDiameter` can go to zero for a flight with no newel.

## Worked examples

- **"a spiral staircase up to a mezzanine"** → `{ outerRadius: 750, totalRise: 2700, steps: 14 }`
- **"a tight spiral in a 1.2 m shaft, one and a half turns"** → `{ outerRadius: 600, sweep: 540, steps: 18 }`
- **"open spiral, no central column, anticlockwise"** → `{ columnDiameter: 0, direction: 'ccw' }`

## What it will not do

No landings, no square-plan spirals, and the sweep is uniform — treads cannot be bunched at one
end of the turn.

## Parameters

<!-- generated: parameters -->
**Flight**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `outerRadius` | number | 300–2000 mm, step 10 | `750` |  |
| `totalRise` | number | 300–5000 mm, step 10 | `2700` |  |
| `steps` | int | 3–40, step 1 | `14` |  |
| `sweep` | number | 90–1080 °, step 5 | `360` |  |
| `direction` | select | `cw`, `ccw` | `"cw"` |  |

**Tread & nosing**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `treadThickness` | number | 10–120 mm, step 1 | `45` |  |
| `treadInset` | number | 0–300 mm, step 1 | `10` |  |
| `treadGap` | number | 0–10 °, step 0.25 | `1.5` |  |
| `edgeStyle` | select | `square`, `chamfer`, `rounded` | `"rounded"` |  |
| `edgeSize` | number | 0–25 mm, step 0.5 | `6` | Only used in some combinations. |

**Column**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `columnDiameter` | number | 0–400 mm, step 5 | `120` |  |

**Handrail**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `handrail` | boolean | `true`, `false` | `true` |  |
| `railHeight` | number | 600–1200 mm, step 5 | `950` | Only used in some combinations. |
| `railDiameter` | number | 20–90 mm, step 1 | `45` | Only used in some combinations. |
| `railInset` | number | 0–300 mm, step 5 | `60` | Only used in some combinations. |
| `balusters` | boolean | `true`, `false` | `true` | Only used in some combinations. |
| `balusterDiameter` | number | 8–60 mm, step 1 | `20` | Only used in some combinations. |
<!-- /generated: parameters -->
