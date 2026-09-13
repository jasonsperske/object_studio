# SNES / Super Famicom cartridge

Use `snes-cartridge` for snes / super famicom cartridge props from the cartridge era. Geometry is in millimetres,
front faces +Z, and the object rests on Y=0. Dimensions and PCB layout are approximate visual
references; these are scene assets, not replacement shells or circuit-board specifications.

`presentation` selects a cartridge, a cartridge alongside its closed blank box, or separated
front/rear trays with a visible board, contacts, chips, screw bosses and removed screws.
`openGap` controls separation. Optional `battery` adds a representative save cell when open.
Shell colour is independent of the moulding; colour options also support custom scene props.

Available shell variants: North American SNES, Super Famicom / PAL.

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
| `variant` | select | `standard`, `sfc` | `"standard"` |  |

**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `battery` | boolean | `true`, `false` | `false` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Cartridge only** — `{"presentation":"cart"}`
- **Boxed copy** — `{"presentation":"boxed"}`
- **Opened cartridge** — `{"presentation":"open"}`
- **Super Famicom / PAL** — `{"variant":"sfc"}`
<!-- /generated: parameters -->

## Reference notes

The [M+ Museum discussion of regional cartridges](https://www.mplus.org.hk/en/magazine/region-locking-really-hertz/)
documents the physical cartridge/slot differences. This generator separates the stepped North
American silhouette from the rounded Super Famicom / PAL silhouette and rear key recesses.
