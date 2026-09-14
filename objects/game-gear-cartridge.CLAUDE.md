# Game Gear cartridge

Use `game-gear-cartridge` for game gear cartridge props from the cartridge era. Geometry is in millimetres,
front faces +Z, and the object rests on Y=0. Dimensions and PCB layout are approximate visual
references; these are scene assets, not replacement shells or circuit-board specifications.

`presentation` selects a cartridge, its box alone, a cartridge alongside its closed blank box, or separated
front/rear trays with a visible board, contacts, chips, screw bosses and removed screws.
`openGap` controls separation. Optional `battery` adds a representative save cell when open.
Shell colour is independent of the moulding; colour options also support custom scene props.

This generator represents the standard shell family.

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

**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `battery` | boolean | `true`, `false` | `false` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Box only** — `{"presentation":"box"}`
- **Cartridge only** — `{"presentation":"cart"}`
- **Boxed copy** — `{"presentation":"boxed"}`
- **Opened cartridge** — `{"presentation":"open"}`
<!-- /generated: parameters -->

## Reference shell

The supplied production-cart photos guide the nearly square 67 × 68 mm shell,
raised upper arch with short side arms, two fine horizontal grip lines, and large
label recess with rounded upper corners. The lower oval badge stays blank and has
its own image slot alongside the main front label. The rear has a molded panel and
one inset screw, with no rear or top sticker. The 8.5 mm body and 2.5 mm raised arch
produce about 11 mm total depth (plus the fine grip lines). The flash-cart photo informs overall proportions;
its custom top cutout and transparent finish are not part of the standard shell.
Boxed and open versions share the revised shell; internal electronics remain representative.

Box-only presentation (`presentation: "box"`) returns only centered packaging geometry,
with six independent image-only box surfaces and no cartridge parts.
