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

## Reference shell

The supplied North American SNES references guide the standard shell: a shallow stepped
top, six broad side bands, a recessed upper label, and a separate lower front pocket
with a central tab. Two recessed screws sit low on the front wings. The rear has a
higher caution-label area, lower band and bottom key openings. Open presentations
include a compact low board, narrower connector tongue and internal support ribs.
Dimensions and board components remain visual approximations. The Super Famicom
variant retains its separate rounded shell. All label artwork remains blank.

## Super Famicom reference shell

The supplied Super Famicom photographs guide the sfc variant independently:
a rounded rectangular perimeter, five short grooves on each upper side, a wide
rounded label recess, and a lower central panel with a capsule grip recess and
internal ribs. Two inset front screws sit at the bottom corners. Cart, open and
boxed presentations share these details. Artwork remains blank and dimensions
are approximate visual references.

The Super Famicom front shell and lower grip panel have rounded molded edge profiles.
This variant exposes no cart-top sticker slot; its cartridge labels are front and rear only.
