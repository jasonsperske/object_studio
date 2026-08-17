# Shelf unit

A carcass with two sides, a fixed top and bottom, and evenly spaced shelves between them. It
shares the stair treads' edge profiles, which is why it exists in this library at all.

## When to reach for it

Bookcases, open shelving, storage units. It is the simplest object here and a good first choice
for anything box-shaped with horizontal divisions.

## What matters most

`width`, `height` and `depth` are the outside dimensions. `shelves` counts only the intermediate
ones — the top and bottom are always there — so a five-shelf bookcase is `shelves: 3`. `toeKick`
lifts the bottom shelf off the floor.

## Worked examples

- **"a bookcase about 1.8 m tall"** → `{ width: 800, height: 1800, depth: 320, shelves: 4 }`
- **"low wide shelving under a window"** → `{ width: 1600, height: 700, depth: 300, shelves: 1 }`
- **"a deep shelf unit with no back"** → `{ depth: 600, back: false, shelves: 5 }`

## Check the metrics

It reports the clear bay height and the shelf span, warning past 750 mm and erroring past 900,
because a span that wide sags in any timber. Widen the unit and it will tell you.

## What it will not do

No doors, no drawers, no adjustable shelf pins, no dividers. Shelves are evenly spaced — you
cannot ask for one taller bay.

## Parameters

<!-- generated: parameters -->
**Carcass**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `width` | number | 200–2400 mm, step 10 | `800` |  |
| `height` | number | 200–2600 mm, step 10 | `1800` |  |
| `depth` | number | 100–800 mm, step 5 | `320` |  |
| `shelves` | int | 0–12, step 1 | `4` |  |
| `toeKick` | number | 0–250 mm, step 5 | `80` |  |

**Boards**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `shelfThickness` | number | 8–80 mm, step 1 | `22` |  |
| `sideThickness` | number | 8–80 mm, step 1 | `22` |  |
| `edgeStyle` | select | `square`, `chamfer`, `rounded`, `bullnose`, `cove`, `ogee` | `"bullnose"` |  |
| `edgeSize` | number | 0–25 mm, step 0.5 | `8` | Only used in some combinations. |

**Back**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `back` | boolean | `true`, `false` | `true` |  |
| `backThickness` | number | 3–40 mm, step 1 | `9` | Only used in some combinations. |
<!-- /generated: parameters -->
