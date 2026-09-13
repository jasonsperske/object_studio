# Master System cartridge

Use `master-system-cartridge` for master system cartridge props from the cartridge era. Geometry is in millimetres,
front faces +Z, and the object rests on Y=0. Dimensions and PCB layout are approximate visual
references; these are scene assets, not replacement shells or circuit-board specifications.

`presentation` selects a cartridge, a cartridge alongside its closed blank box, or separated
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
| `presentation` | select | `cart`, `boxed`, `open` | `"cart"` |  |
| `openGap` | number | 20–90 mm, step 1 | `35` | Only used in some combinations. |

**Shell**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `finish` | select | `original`, `grey`, `gold`, `black`, `yellow` | `"original"` |  |

**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `battery` | boolean | `true`, `false` | `false` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Cartridge only** — `{"presentation":"cart"}`
- **Boxed copy** — `{"presentation":"boxed"}`
- **Opened cartridge** — `{"presentation":"open"}`
<!-- /generated: parameters -->

## Reference shell

The supplied front, rear and connector photographs guide this shell. Its full-width front
has a narrow 100 × 17 mm recessed title band near the top, three horizontal grip rails
continuing onto the sides, and an uninterrupted lower panel. The rear has two recessed
screw heads flanking the caution-label area, an upper moulded band, and keyed lower-edge
notches. The edge connector sits 8 mm inside the open bottom mouth. Dimensions are approximate
visual references. All label surfaces stay blank: `cart-front` is the upper title band,
`cart-top` is its independently textured top continuation, and `cart-back` is the rear label.
Boxed and open presentations use the same revised shell.
