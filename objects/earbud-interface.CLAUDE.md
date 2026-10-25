# Earbud interface

Photo-derived fit prototype of a plastic insert for a silicone ear tip.
One bottom flange, a plain open cylinder at the top, and three bottom sector
openings separated by a central three-way web. One closed manifold mesh.
Axis is +Y and the flange bottom sits on Y=0 in Object Studio.

## Measurement evidence

| Photo | Readout, mm | Feature |
| --- | ---: | --- |
| IMG_0947 | 4.52 | Cylinder outside diameter |
| IMG_0948 | 6.01 | Bottom flange outside diameter |
| IMG_0949 / IMG_0951 | 7.77 | Overall length |
| IMG_0952 | 2.00 | Bottom flange height; user confirmed |
| IMG_0953 | 1.02 | Cylinder radial wall thickness; user confirmed |
| IMG_0954 | 6.00 | Bottom flange diameter, repeated; shows three bottom openings |

The cylinder inside diameter is derived as 4.52 − 2 × 1.02 = 2.48 mm,
assuming a concentric uniform wall. There is no upper flange or projecting lip.
The bottom ports connect through the perforated floor into the common cylinder
bore. The three ports are modeled as equal sectors, 120 degrees apart.

Unmeasured defaults: web thickness 0.60 mm, port outer rim 0.12 mm,
port inner tip radius 0.25 mm, port opening angle 88 degrees, and external
edge chamfer 0.15 mm. These describe a photo-based approximation, not measured
port geometry. Confirm with the original before a final replacement print.

Adjust outsideAllowance and boreAllowance independently after a fit print.
Run `node tools/export-earbud.mjs` to validate and refresh the default STL.
Studio exports reflect the current interactive parameters instead.

## Parameters

<!-- generated: parameters -->
**Dimensions**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `length` | number | 3–20 mm, step 0.01 | `7.77` | IMG_0949 / IMG_0951: 7.77 mm. |
| `waistDiameter` | number | 2–10 mm, step 0.01 | `4.52` | IMG_0947: 4.52 mm; feature assignment provisional. |
| `baseDiameter` | number | 3–12 mm, step 0.01 | `6.01` | IMG_0948: 6.01 mm. |
| `baseThickness` | number | 0.3–4 mm, step 0.01 | `2` | IMG_0952: 2.00 mm bottom flange thickness, confirmed by user. |
| `boreDiameter` | number | 0.5–8 mm, step 0.01 | `2.48` | Derived from 4.52 mm cylinder OD minus twice the confirmed 1.02 mm wall thickness. |
| `webThickness` | number | 0.2–1.5 mm, step 0.01 | `0.6` | Unmeasured thickness of the perforated floor inside the bottom flange. |
| `portRim` | number | 0.05–0.4 mm, step 0.01 | `0.12` | Material between port outer arcs and the cylinder bore. |
| `portAngle` | number | 40–105 °, step 0.01 | `88` | Three equal sector openings, 120 degrees apart. Degrees, not millimetres. |
| `portHub` | number | 0.1–0.6 mm, step 0.01 | `0.25` | Inner tip radius of each opening; leaves a central three-way web. |
| `edgeChamfer` | number | 0–0.5 mm, step 0.01 | `0.15` | Small estimated lead-in on exposed flange and bore edges. |
| `outsideAllowance` | number | -0.5–0.5 mm, step 0.01 | `0` | Adds to cylinder and flange outside diameters; zero reproduces nominal measurements. |
| `boreAllowance` | number | -0.5–0.5 mm, step 0.01 | `0` | Adds to bore diameter independently; positive opens the hole. |
<!-- /generated: parameters -->
