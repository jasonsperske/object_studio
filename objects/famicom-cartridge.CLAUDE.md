# Famicom cartridge

Use `famicom-cartridge` for famicom cartridge props from the cartridge era. Geometry is in millimetres,
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

The supplied yellow blank-cartridge reference (Shutterstock image 1898052385, linked from
[the supplied search page](https://www.shutterstock.com/search/famicom-cartridge)) guides this
shell: a thin rectangular body with small top corner radii, four narrow horizontal grip ribs,
a broad rounded-corner label recess and stepped lower connector shoulders. The default is pale
yellow; other finishes remain selectable. The nominal depth is 14 mm and the front label is
92 × 47 mm. Dimensions are visual estimates from the reference, not measured manufacturing data.
This family exposes front and rear labels; the ribbed top has no separate label slot.

Box-only presentation (`presentation: "box"`) returns only centered packaging geometry,
with six independent image-only box surfaces and no cartridge parts.
