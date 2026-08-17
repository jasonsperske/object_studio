# Fractal tree

A seeded recursive tree. Every limb spawns a ring of children, each shorter, thinner and angled
away from its parent; six leaf models and five fruit or blossom models dress the outer growth.

## When to reach for it

Trees, saplings, shrubs — anything branching. Randomness is seeded, so a given `seed` always
rebuilds the same tree, and you can offer someone several by changing only that.

## What matters most

The habit comes from four parameters, and they matter more than size: `apical` is how strongly
the leader carries straight on — high makes a conifer, low a spreading crown; `branchAngle` is how
wide the side branches sit; `droop` weeps the branches down at positive values and sweeps them up
at negative; `levels` is the depth of recursion and the main cost. `height` is the trunk length,
not the height of the finished tree, which comes out taller.

## Worked examples

- **"a young oak"** → the `Oak tree` preset
- **"a pine about 4 m"** → `Pine tree` preset with `height: 2400`
- **"a bare winter tree"** → `{ leafModel: 'none', fruitModel: 'none', irregularity: 0.5 }`
- **"a cherry in blossom"** → the `Cherry blossom` preset

## Start from a preset

This one has the strongest presets in the library: pine, oak, silver birch, apple, cherry blossom
and weeping willow. Almost any tree request is one of those plus a size change.

## What it will not do

No roots, no bark texture, no ground. Growth stops at a limb cap, so very high `levels` with high
`branches` quietly stops adding limbs rather than locking up.

## Parameters

<!-- generated: parameters -->
**Trunk & branches**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `height` | number | 200–6000 mm, step 20 | `1400` | Length of the first limb; the tree ends up taller than this. |
| `thickness` | number | 8–500 mm, step 2 | `110` | Diameter at the base of the trunk. |
| `taper` | number | 0.4–0.95, step 0.01 | `0.72` | Thickness kept at each split. |
| `levels` | int | 1–8, step 1 | `5` | Depth of recursion. |
| `branches` | int | 1–5, step 1 | `3` | Side branches at each split. |
| `branchAngle` | number | 5–85 °, step 1 | `38` |  |
| `lengthRatio` | number | 0.4–0.95, step 0.01 | `0.74` | Length kept at each split. |
| `apical` | number | 0–1, step 0.05 | `0.3` | How strongly a leader carries straight on. High makes a conifer, low a spreading crown. |
| `twist` | number | 0–180 °, step 0.5 | `137.5` | Rotation between successive whorls. 137.5° is the golden angle. |
| `droop` | number | -50–50 °, step 1 | `0` | Positive weeps down, negative sweeps up. |
| `irregularity` | number | 0–1, step 0.05 | `0.3` |  |
| `seed` | int | 1–9999, step 1 | `7` | Same seed, same tree. |

**Foliage**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `leafModel` | select | `none`, `blade`, `lobed`, `round`, `heart`, `needle` | `"blade"` |  |
| `leafSize` | number | 5–400 mm, step 1 | `90` | Only used in some combinations. |
| `leafDensity` | number | 0–100 %, step 1 | `70` | Only used in some combinations. |
| `leafLevels` | int | 1–4, step 1 | `2` | How many of the outermost levels carry leaves. Only used in some combinations. |
| `foliageColor` | select | `green`, `deep`, `olive`, `blue`, `autumn`, `copper` | `"green"` | Only used in some combinations. |

**Fruit & flowers**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `fruitModel` | select | `none`, `berry`, `apple`, `acorn`, `cone`, `blossom` | `"none"` |  |
| `fruitSize` | number | 4–250 mm, step 1 | `55` | Only used in some combinations. |
| `fruitFrequency` | number | 0–100 %, step 1 | `30` | Only used in some combinations. |
| `fruitColor` | select | `red`, `gold`, `purple`, `white`, `pink`, `brown` | `"red"` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Pine tree** — `{"height":1800,"thickness":160,"taper":0.82,"branches":4,"branchAngle":74,"lengthRatio":0.5,"apical":0.98,"twist":90,"droop":22,"irregularity":0.22,"seed":21,"leafModel":"needle","leafSize":210,"leafDensity":100,"foliageColor":"deep","fruitModel":"cone","fruitSize":110,"fruitFrequency":22,"fruitColor":"brown"}`
- **Oak tree** — `{"height":1500,"thickness":300,"taper":0.7,"branchAngle":46,"lengthRatio":0.76,"apical":0.12,"droop":-4,"irregularity":0.5,"seed":4,"leafModel":"lobed","leafSize":150,"leafDensity":85,"fruitModel":"acorn","fruitSize":60,"fruitFrequency":25,"fruitColor":"brown"}`
- **Silver birch** — `{"height":1900,"thickness":90,"taper":0.76,"branches":2,"branchAngle":32,"lengthRatio":0.78,"apical":0.65,"droop":20,"irregularity":0.35,"seed":12,"leafModel":"heart","leafSize":80,"leafDensity":80,"foliageColor":"olive","fruitFrequency":0,"fruitColor":"gold"}`
- **Apple tree** — `{"height":900,"thickness":160,"taper":0.68,"branchAngle":52,"apical":0.1,"droop":10,"irregularity":0.5,"seed":33,"leafSize":95,"leafDensity":80,"fruitModel":"apple","fruitSize":75,"fruitFrequency":35}`
- **Cherry blossom** — `{"height":1200,"thickness":180,"taper":0.7,"branchAngle":48,"lengthRatio":0.76,"apical":0.18,"droop":16,"irregularity":0.4,"seed":58,"leafSize":65,"leafDensity":30,"foliageColor":"olive","fruitModel":"blossom","fruitSize":70,"fruitFrequency":90,"fruitColor":"pink"}`
- **Weeping willow** — `{"height":1700,"thickness":200,"taper":0.74,"branchAngle":42,"lengthRatio":0.82,"apical":0.4,"droop":45,"irregularity":0.4,"seed":77,"leafSize":120,"leafDensity":90,"leafLevels":3,"foliageColor":"olive","fruitFrequency":0,"fruitColor":"gold"}`
<!-- /generated: parameters -->
