# NES cartridge

Use `nes-cartridge` for nes cartridge props from the cartridge era. Geometry is in millimetres,
front faces +Z, and the object rests on Y=0. Dimensions and PCB layout are approximate visual
references; these are scene assets, not replacement shells or circuit-board specifications.

`presentation` selects a cartridge, its box alone, a cartridge alongside its closed blank box, or separated
front/rear trays with a visible board, contacts, chips, screw bosses and removed screws.
`openGap` controls separation. Optional `battery` adds a representative save cell when open.
Shell colour is independent of the moulding; colour options also support custom scene props.

Available shell variants: Retail shell, NWC 1990 • DIP switch opening.

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
| `variant` | select | `standard`, `nwc1990` | `"standard"` | Only used in some combinations. |
| `screws` | select | `3`, `5` | `"3"` | Only used in some combinations. |

**Board**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `battery` | boolean | `true`, `false` | `false` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **Box only** — `{"presentation":"box"}`
- **Cartridge only** — `{"presentation":"cart"}`
- **Boxed copy** — `{"presentation":"boxed"}`
- **Opened cartridge** — `{"presentation":"open"}`
- **Gold five-screw** — `{"finish":"gold","screws":"5"}`
- **NWC 1990 grey** — `{"variant":"nwc1990","finish":"grey","screws":"3"}`
- **NWC 1990 gold** — `{"variant":"nwc1990","finish":"gold","screws":"3"}`
<!-- /generated: parameters -->

## Reference notes

The [NWC 1990 cartridge reference](https://www.atarihq.com/tsr/nes/nwc/nwc.html)
describes the exposed four-switch timer bank. This model cuts an aperture in the front shell
and places that bank on the board; the `nwc1990` variation changes geometry independently
of grey or gold colour. Boxed NWC presets represent a display box, not original retail packaging.

## Blank-shell front geometry

The front uses proportions measured from the supplied straight-on blank-shell photograph.
The **left** grip has forty fine lands and a deeper five-rib thumb pocket at its top. That
pocket is backed by the rear shell, rather than cut through the whole cartridge. Both outer
top rails have shallow notches. The upper-right label recess is about 57.2 × 91.1 mm, with
rounded lower corners and a shallow insertion arrow below. The shoulders step inward about
6.3 mm at 24.7 mm above the base. A smooth, rounded-top grip foot reaches the lower edge.
Grip lands and the label floor sit below the surrounding front face. Grey/gold and
three/five-screw variants retain this front layout; NWC has its separate switch aperture.

## Rear screw layout

The supplied rear-view diagram locates the shared center screw just above the caution label
and the shared lower pair near the outside edges, just above the insertion shoulders. At
the nominal 120 × 133 mm size these are `(0, 77.1)` and `(±54, 34.6)` in XY. The five-screw
revision adds the upper corners at `(±51.6, 125)`. These are approximate placements measured
from the photograph. Internal bosses use the same axes. The rear label sits between the
center screw and lower row, so an assigned image cannot cover the screw heads.

## Gold finish

Gold NES shells use a glossy metallic material and deterministic fine moulded grain via
`Part.normalMap`. Labels remain smooth and independently image-texturable. The preview uses
studio reflections; consuming projects should provide environment lighting and pass
`normalMap`, `metalness` and `roughness` to their material. glTF/GLB carries the material and
normal texture. The grain is generated from a fixed seed, with no external asset or URL data.

Box-only presentation (`presentation: "box"`) returns only centered packaging geometry,
with six independent image-only box surfaces and no cartridge parts.
