# Snowflake

Use this generator for flat, radial snow-crystal decorations. The default is a
six-arm crystal standing vertically in the studio, with rectangular spines and
paired branches joined into a printable model. `diameter`, `thickness` and
`armWidth` establish the main proportions; `branches`, `branchLength` and
`branchAngle` control how dense the crystal appears.

Enable `base` for a freestanding display. Its width runs across the snowflake
and its depth supplies the front-to-back footprint. Enable `loop` for a hanging
ornament; the loop overlaps the twelve-o'clock arm and includes a through-hole.
Both mounts may be enabled together. This generator makes a regular geometric
snowflake rather than a naturalistic or randomly grown crystal. The table below
is generated from `objects/snowflake.js` — do not edit it by hand.

<!-- generated: parameters -->
**Crystal**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `diameter` | number | 30–500 mm, step 5 | `120` |  |
| `thickness` | number | 1–30 mm, step 0.5 | `4` |  |
| `arms` | int | 4–12, step 1 | `6` |  |
| `armWidth` | number | 1–30 mm, step 0.5 | `5` |  |

**Branches**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `branches` | int | 0–6, step 1 | `3` |  |
| `branchLength` | number | 2–100 mm, step 1 | `23` | Only used in some combinations. |
| `branchAngle` | number | 15–75 °, step 1 | `42` | Only used in some combinations. |

**Centre**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `centerSize` | number | 2–80 mm, step 1 | `14` |  |

**Mounting**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `base` | boolean | `true`, `false` | `false` |  |
| `baseWidth` | number | 20–250 mm, step 5 | `60` | Only used in some combinations. |
| `baseDepth` | number | 10–100 mm, step 2 | `30` | Only used in some combinations. |
| `baseHeight` | number | 2–30 mm, step 1 | `8` | Only used in some combinations. |
| `loop` | boolean | `true`, `false` | `false` |  |
| `loopDiameter` | number | 8–60 mm, step 1 | `18` | Only used in some combinations. |
| `loopWall` | number | 1–12 mm, step 0.5 | `3` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Classic six-point** — `{}`
- **Fine crystal** — `{"diameter":180,"thickness":3,"armWidth":3,"branches":5,"branchLength":28,"branchAngle":38,"centerSize":10}`
- **Bold ornament** — `{"diameter":100,"thickness":6,"armWidth":8,"branches":2,"branchLength":20,"branchAngle":48,"centerSize":20}`
- **Eight-point** — `{"arms":8,"diameter":140,"branches":3,"branchLength":20,"branchAngle":35}`
- **Christmas ornament** — `{"diameter":90,"thickness":3,"armWidth":4,"loop":true,"loopDiameter":16,"loopWall":3}`
- **Standing display** — `{"diameter":140,"thickness":5,"armWidth":7,"base":true,"baseWidth":70,"baseDepth":36,"baseHeight":10}`
<!-- /generated: parameters -->
