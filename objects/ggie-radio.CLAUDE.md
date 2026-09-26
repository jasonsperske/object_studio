# GGIE radio

A procedural interpretation of the 1939 RCA Victor Golden Gate International
Exposition radio in reference photos IMG_0780–IMG_0785. The front faces +Z,
width is centered on X, and the feet rest at Y=0.

The museum label lists 6 × 9.25 × 5.75 inches, interpreted as cabinet height,
width and depth: 152.4 × 234.95 × 146.05 mm. Handle, knobs and molding extend
beyond that envelope. Smaller dimensions, relief sculpture and internal valve
silhouettes are estimated, not measured reproductions. Photos remain external
references; no photograph, museum string/tag or QR instruction is embedded.

Includes a walnut cabinet and rigid trapezoidal handle, stepped feet, woven
speaker grille, Tower of the Sun and pavilion relief, suspension bridge with
lattice towers, water bands, amber art-deco dial, two fluted ivory knobs, and a
rear hardboard panel with ten open vents, screws, inspection seal, phono socket
and antenna terminal. The relief is a simplified geometric interpretation.

The left knob is inferred to combine power and volume; the right controls tuning.
The set has no dial lamp, so the dial never lights and looks the same whether
the power is on or off. Power only poses the left knob at an off detent. Frequency moves the
needle and right knob even when off. Dial markings are transcribed from the photo
(55–170, interpreted as 550–1700 kHz); the pointer interpolates between them.
No electrical or audio simulation is performed. No cabinet sizing controls are
exposed. Use the studio Detail tab to reduce geometry.

## Worked examples

- **Museum display** → `{ power: 'off', frequency: 900, volume: 45 }`
- **Tune to 1050 kHz** → `{ power: 'on', frequency: 1050, volume: 65 }`
- **Lowest marked station** → `{ frequency: 550 }`

Full-detail geometry uses adaptive sampling for curved strands and relief,
checking chord error against 0.05 mm or half the strand radius, whichever is
smaller. Circular fittings use 24 segments; fine rings use 32. This reduces the
default mesh from 157,424 to 92,368 triangles without removing any parts, grille
stitches or lettering. The cabinet and relief profiles remain unchanged.

All surfaces are procedural geometry. Label glyphs retain the bundled font
license in the source. Fine printed legends are marked for texture baking in
the studio's level-of-detail workflow.

## Parameters

<!-- generated: parameters -->
**Radio controls**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `power` | select | `on`, `off` | `"on"` | Poses the left knob at its off detent. The set has no dial lamp, so the dial looks the same on or off. |
| `frequency` | number | 550–1700 kHz, step 10 | `900` | Moves the dial pointer and right tuning knob. Scale follows the photographed markings; intermediate calibration is approximate. |
| `volume` | number | 0–100 %, step 1 | `45` | Rotates the left knob while powered. Control assignment is inferred; no audio is generated. |

**Presets** — worked examples; each lists only what it changes.

- **On display** — `{"power":"off","frequency":900,"volume":45}`
- **Evening broadcast** — `{"power":"on","frequency":1050,"volume":65}`
<!-- /generated: parameters -->
