# Snowflake collection

A stable collection of 60 sixfold ornaments, numbered by family: Fern (1–10),
Crystal (11–20), Paddle (21–30), Arrow (31–40), Crown (41–50), and Fir (51–60).
Within each family the first five have two through six branch pairs per arm;
the next five have larger centers and widened terminal shoulders as well.

All designs share an exact circumscribed tip diameter and thickness. Defaults are
80 mm and 2.4 mm, with 2 mm stems. Each is extruded from one continuous outline,
with an optional hexagonal center opening, rather than overlapping separate bars.
The base is Y=0. Print flat; in Studio use Top view (5) to inspect silhouettes.
These are stylized ornaments, not a physical ice-growth simulation.

Use `presentation: 'collection'` to compare all 60 (ten per row, family per row),
or `family` for ten at a time. These are comparison layouts, not printer-bed packing.
Choose `single` and a design number for an individual STL export. Keep diameter,
thickness and stem settings the same across the batch. The stem setting does not
promise a minimum width for branch tips or notches: check extrusion paths in your
slicer and test-print before committing to the whole collection.

Run `node tools/test-snowflakes.mjs` to check all designs at default and extreme
sizes for connected, closed, consistently wound geometry and equal tip radii.

## Matching stand and orientation

The stand is built into this generator. `diameter`, `thickness` and `stem` drive
both snowflakes and slots, with `clearance` added to slot dimensions. Diameter also
sets spacing and caps insertion depth before the first branches. No dimensions
need to be copied to another object.

Use `presentation: 'assembled'` to see `design` and `secondDesign` seated in the
stand. `firstAngle` and `secondAngle` turn the upright snowflakes around their
stems and rotate their actual slots by the same amount. Zero faces forward;
90 degrees is sideways. `layoutAngle` rotates the complete assembly: zero places
the pair side by side, 90 places them front to back. All angles are degrees.
These are upright yaw rotations; the snowflakes do not tilt or lean.

`presentation: 'printSet'` lays both snowflakes flat at Y=0 with the stand beside
them, keeping the configured slot angles. Use this for printing separate parts;
`assembled` is an assembly preview and should not be exported as a fused print.
`stand` exports the matching base alone, and `coupon` exports a small test piece
with the first slot's size, angle, insertion depth and floor thickness. The stand is available only through this integrated model, keeping sizing and
orientation synchronized.

`node tools/test-snowflake-stand.mjs` validates the integrated stand, rotated
pockets, all 60 insertion envelopes at three dimension configurations, mounted
floor contact, and separation of parts in flat print layouts.

<!-- generated: parameters -->
**Collection**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `design` | int | 1–60, step 1 | `1` | Six families of ten designs. Every number is a stable recipe. |
| `presentation` | select | `single`, `family`, `collection`, `assembled`, `printSet`, `stand`, `coupon` | `"single"` |  |

**Print dimensions**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `diameter` | number | 60–140 mm, step 1 | `80` |  |
| `thickness` | number | 1.6–5 mm, step 0.2 | `2.4` |  |
| `stem` | number | 1.6–3 mm, step 0.2 | `2` | Controls the main stems, not the narrowest branch details. Print flat; no raised decoration or separate intersecting pieces. |
| `centerHole` | boolean | `true`, `false` | `true` |  |

**Stand & assembly**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `secondDesign` | int | 1–60, step 1 | `11` | Only used in some combinations. |
| `clearance` | number | 0–0.8 mm, step 0.05 | `0.25` | Added to total dimensions, not per side. Slots follow Thickness and Stem width automatically. Only used in some combinations. |
| `insertion` | number | 2–8 mm, step 0.5 | `4` | Limited to 10% of radius so branches stay above the stand. Only used in some combinations. |
| `gap` | number | 4–30 mm, step 1 | `8` | Only used in some combinations. |
| `baseDepth` | number | 24–60 mm, step 1 | `32` | Only used in some combinations. |
| `floor` | number | 2–6 mm, step 0.5 | `3` | Only used in some combinations. |

**Orientation**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `firstAngle` | number | -180–180 °, step 5 | `0` | Turn around the upright stem. Its slot rotates with it; 0° faces forward and 90° faces sideways. Only used in some combinations. |
| `secondAngle` | number | -180–180 °, step 5 | `0` | Only used in some combinations. |
| `layoutAngle` | number | -180–180 °, step 5 | `0` | Rotate the whole assembly: 0° side by side, 90° front to back. Individual angles are relative to the stand. Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Pair on matching stand** — `{"presentation":"assembled"}`
- **Angled pair** — `{"presentation":"assembled","firstAngle":-30,"secondAngle":30}`
- **Pair and stand for printing** — `{"presentation":"printSet"}`
- **Matching slot fit test** — `{"presentation":"coupon"}`
- **Fern · 1–10** — `{"design":1,"presentation":"family"}`
- **Crystal · 11–20** — `{"design":11,"presentation":"family"}`
- **Paddle · 21–30** — `{"design":21,"presentation":"family"}`
- **Arrow · 31–40** — `{"design":31,"presentation":"family"}`
- **Crown · 41–50** — `{"design":41,"presentation":"family"}`
- **Fir · 51–60** — `{"design":51,"presentation":"family"}`
<!-- /generated: parameters -->
