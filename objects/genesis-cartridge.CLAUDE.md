# Genesis / Mega Drive cartridge

Use `genesis-cartridge` for genesis / mega drive cartridge props from the cartridge era. Geometry is in millimetres,
front faces +Z, and the object rests on Y=0. Dimensions and PCB layout are approximate visual
references; these are scene assets, not replacement shells or circuit-board specifications.

`presentation` selects a cartridge, its box alone, a cartridge alongside its closed blank box, or separated
front/rear trays with a visible board, contacts, chips, screw bosses and removed screws.
`openGap` controls separation. Optional `battery` adds a representative save cell when open.
Shell colour is independent of the moulding; colour options also support custom scene props.

Available shell variants: Sega shell, EA tall shell • yellow tab.

Every label is blank. `cart-front` and `cart-back` are independent image slots.
Some families also expose `cart-top`; boxed copies expose `box-front`, `box-back`,
`box-spine`, `box-right`, `box-top` and `box-bottom`. Discover the slots in the current build
using `listMediaSurfaces(parts)`. Use `applySurfaceTextures(parts, { 'cart-front':
{ texture, kind: 'image' } })` from the published runtime to apply a THREE.Texture.
UVs define the intended orientation; assign a normally oriented image without rotating it.
Textures remain outside the parameter recipe and the object URL. Callers own texture disposal.

## Examples

```js
{ presentation: 'boxed' }
```

```js
{ presentation: 'open', openGap: 45, battery: true }
```

## Parameters

<!-- generated: parameters -->
**Model**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `presentation` | select | `cart`, `box`, `boxed`, `open` | `"cart"` |  |
| `openGap` | number | 20–90 mm, step 1 | `35` | Only used in some combinations. |

**Shell**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `finish` | select | `original`, `grey`, `gold`, `black`, `yellow` | `"original"` | Only used in some combinations. |
| `variant` | select | `standard`, `ea` | `"standard"` | Only used in some combinations. |

**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `battery` | boolean | `true`, `false` | `false` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Box only** — `{"presentation":"box"}`
- **Cartridge only** — `{"presentation":"cart"}`
- **Boxed copy** — `{"presentation":"boxed"}`
- **Opened cartridge** — `{"presentation":"open"}`
- **EA tall shell • yellow tab** — `{"variant":"ea"}`
<!-- /generated: parameters -->

## Reference shell

The supplied Sega USA/EUR shell photos guide the standard variant: curved side cheeks,
rounded corners, a broad blank front label reaching the top edge, and a matching-width
top continuation. Front and top remain independent image slots with a shared seam.
The rear has a shallow capsule grip recess, a blank maker panel, two inset screws at
mid-height, and a lower caution label. The connector board is recessed 8 mm into the
bottom opening. These are approximate visual dimensions. Boxed and open presentations
use the same shell; the EA tall shell keeps its separate shape and yellow tab.

The side cheeks use a quarter-ellipse cross section starting at the label border,
with smooth analytic normals and only small front-elevation corner radii. The curve
rolls almost to the shell seam while the central label plane stays flat.

Box-only presentation (`presentation: "box"`) returns only centered packaging geometry,
with six independent image-only box surfaces and no cartridge parts.
