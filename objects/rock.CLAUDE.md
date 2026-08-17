# Rock

A stone, from a 15 mm pebble to a 3 m boulder. The whole object is one function: for every
direction out of its middle there is a distance to its surface. Freshly broken, that distance is
the nearest of the flat planes it fractured along; erosion pulls it toward a smooth blob.

## When to reach for it

Rocks, boulders, pebbles, stones, geodes, scree. One generator covers the lot — size is a slider,
not a different object.

## What matters most

`size` is the longest axis in millimetres and does most of the work. `erosion` is the other big
one and is genuinely physical: 0 is freshly fractured and all corners, 1 is river-tumbled and
smooth. `stone` sets the colour and the density used for the weight. `seed` changes the stone
without changing anything else, which is how you offer someone a handful of different ones.

## Worked examples

- **"a pebble"** → the `River pebble` preset
- **"a big mossy boulder"** → the `Mossy boulder` preset, or `{ size: 1100, erosion: 0.45, moss: 0.75 }`
- **"a sharp piece of broken flint"** → `{ size: 120, stone: 'flint', erosion: 0.02 }`
- **"a geode cracked open with purple crystals"** → the `Amethyst geode, cracked` preset
- **"a geode just being opened"** → `{ geode: true, crack: 0.3 }`

## Three things worth knowing

- **The hollow is only built when it can be seen.** `geode: true` with `crack: 0` produces a solid
  stone and the metrics say so. Set `crack` above 0 to open it.
- **`crack` is a slider, not a switch.** 0.3 reads as a geode being prised apart; 1 lays the two
  halves side by side with the cut faces up.
- **Moss only grows on what faces the sky**, and it is worked out before the stone is split, so a
  cracked half carries whatever was on that side of it.

## Check the metrics

It grades the stone on the Wentworth scale — pebble under 64 mm, cobble under 256, boulder above —
and integrates its own radius to give a volume and a mass, then says whether that is one hand, two
people or a machine. Useful for sanity-checking "a rock someone could carry".

## What it will not do

No texture, no wetness, no stratified colour banding on the outside — `bedding` cuts ledges into
the shape but the stone is one colour. No scattering: this is one rock, not a pile of them.

## Parameters

<!-- generated: parameters -->
**Stone**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `size` | number | 15–3000 mm, step 5 | `320` | Longest axis. Under 64 is a pebble, over 256 a boulder. |
| `stone` | select | `granite`, `basalt`, `sandstone`, `limestone`, `flint`, `slate` | `"granite"` | Colour, density, and how the stuff breaks — flint into few sharp faces, sandstone into many blunt ones. |
| `seed` | int | 1–9999, step 1 | `7` | Same seed, same stone. |
| `detail` | int | 1–12, step 1 | `6` | How finely each face of the icosahedron it starts from is divided: 20 × (detail + 1)² faces, so six is 980 and twelve is 3,380. |
| `flatness` | number | 0.25–1, step 0.01 | `0.72` | How squat it is. Few stones are round. |
| `elongation` | number | 0.5–1.6, step 0.01 | `1.15` | Stretched along one axis. |

**Erosion**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `erosion` | number | 0–1, step 0.01 | `0.35` | None is freshly fractured, all corners and flats. Full is river-tumbled: the corners go first and the fine detail with them. |
| `lumpiness` | number | 0–1, step 0.01 | `0.4` | The slow swell of the surface. |
| `pitting` | number | 0–1, step 0.01 | `0.35` | Fine roughness. Erosion wears this off first. |
| `bedding` | number | 0–1, step 0.01 | `0` | Sedimentary layers, cut as ledges around the stone. |
| `beds` | int | 2–14, step 1 | `6` | Only used in some combinations. |

**Inside**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `crack` | number | 0–1, step 0.01 | `0` | Splits it in two and opens the halves like a book. Nothing inside is built while it is shut. |
| `geode` | boolean | `true`, `false` | `false` | A hollow lined with crystals. You only find out by breaking it. |
| `cavity` | number | 0.15–0.75, step 0.01 | `0.45` | How much of the stone is hollow. Only used in some combinations. |
| `crystalSize` | number | 0.02–0.3, step 0.005 | `0.1` | As a share of the cavity. Only used in some combinations. |
| `crystals` | number | 0–1, step 0.01 | `0.6` | Only used in some combinations. |
| `crystalColour` | select | `amethyst`, `quartz`, `citrine`, `rose`, `smoky`, `emerald` | `"amethyst"` | Only used in some combinations. |
| `banding` | boolean | `true`, `false` | `true` | The agate rings between the shell and the hollow, which is how a geode fills in. Only used in some combinations. |

**Moss**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `moss` | number | 0–1, step 0.01 | `0.3` | How much of the stone it has taken. It only grows on what faces the sky. |
| `mossReach` | number | 0–1, step 0.01 | `0.35` | How far past the top it creeps. Only used in some combinations. |
| `mossDepth` | number | 0.5–12 mm, step 0.5 | `3` | Only used in some combinations. |
| `mossColour` | select | `moss`, `lichen`, `rust`, `grey` | `"moss"` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **River pebble** — `{"size":48,"stone":"flint","seed":12,"detail":3,"flatness":0.55,"elongation":1.3,"erosion":0.95,"lumpiness":0.25,"pitting":0.05,"bedding":0,"moss":0}`
- **Beach cobble** — `{"size":140,"stone":"granite","seed":44,"detail":3,"flatness":0.62,"elongation":1.15,"erosion":0.8,"lumpiness":0.35,"pitting":0.15,"bedding":0,"moss":0}`
- **Freshly split flint** — `{"size":120,"stone":"flint","seed":91,"detail":3,"flatness":0.8,"elongation":1.05,"erosion":0.02,"lumpiness":0.15,"pitting":0.1,"bedding":0,"moss":0}`
- **Mossy boulder** — `{"size":1100,"stone":"granite","seed":3,"detail":4,"flatness":0.72,"elongation":1.2,"erosion":0.45,"lumpiness":0.5,"pitting":0.4,"bedding":0,"moss":0.75,"mossReach":0.5,"mossDepth":8,"mossColour":"moss"}`
- **Bedded sandstone block** — `{"size":700,"stone":"sandstone","seed":21,"detail":3,"flatness":0.85,"elongation":1.25,"erosion":0.2,"lumpiness":0.3,"pitting":0.3,"bedding":0.8,"beds":7,"moss":0.2,"mossReach":0.25,"mossColour":"rust"}`
- **Amethyst geode, cracked** — `{"size":260,"stone":"limestone","seed":5,"detail":4,"flatness":0.8,"elongation":1.05,"erosion":0.6,"lumpiness":0.3,"pitting":0.2,"crack":1,"geode":true,"cavity":0.55,"crystalSize":0.12,"crystals":0.7,"crystalColour":"amethyst","banding":true,"moss":0}`
- **Geode, just opening** — `{"size":200,"stone":"limestone","seed":33,"detail":4,"flatness":0.86,"elongation":1,"erosion":0.7,"lumpiness":0.25,"pitting":0.15,"crack":0.28,"geode":true,"cavity":0.5,"crystalSize":0.1,"crystals":0.55,"crystalColour":"quartz","banding":true,"moss":0.1}`
- **Lichened slate** — `{"size":420,"stone":"slate","seed":66,"detail":3,"flatness":0.32,"elongation":1.45,"erosion":0.25,"lumpiness":0.25,"pitting":0.2,"bedding":0.45,"beds":11,"moss":0.4,"mossReach":0.2,"mossDepth":2,"mossColour":"grey"}`
<!-- /generated: parameters -->
