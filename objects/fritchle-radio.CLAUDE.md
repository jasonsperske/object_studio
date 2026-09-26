# Fritchle radio

A procedural interpretation of Oliver P. Fritchle's c.1931 tuned radio frequency
(TRF) radio, in the cabinet he patented in 1928. Built from reference photos
IMG_0826–IMG_0833. The grille faces +Z, width is centred on X, and the feet rest
at Y=0.

The museum label gives 5′ ⅝″ × 22″ × 13.5″, read as height, width and depth:
1540 × 559 × 343 mm. The heights of the stand, the control compartment and the
speaker case are proportioned from the photographs, not measured.

From the floor up:

- **Stand:** four cabriole legs with carved pad feet, under an apron with a
  beaded lower edge. The edge arches up from each knee and dips to a small drop
  at the centre.
- **Control compartment:** canted front corners, a moulded sill and a top rail.
  Behind them is an open recess with angled cheeks and a walnut control panel.
  The panel carries a brass cartouche escutcheon and three knobs. The
  escutcheon has a drum-dial window, two screws and a small shield.
- **Speaker case:** a bell-waisted walnut shell, round on top, with concave
  sides that flare out to a base moulding. A bead runs down each side of the
  waist.
- **Grille:** a thick round bezel frames the pierced fretwork, backed by tan
  cloth. The fretwork is a fan of 13 petals radiating from a point below the
  centre, with round openings between the petal tips. Below it are crescents
  along the rim, scroll eyes and slots either side of a central stem. The
  carving is a simplified geometric reading of the photos, not a tracing.

The back is open, as in the rear photograph. The case back has a round opening
that shows the speaker cone and magnet, and the compartment shows the chassis
with five shielded tubes and a power transformer. There are no lamps; nothing
lights.

**Controls.** `dial` (0–100) turns the large centre knob and scrolls the drum
numbers and ticks behind the escutcheon window past a fixed red hairline.
`volume` turns the left knob. `power` sets the right knob to its off or on
detent. Which knob does what is inferred from typical TRF sets of the period.
No station calibration, electrical behaviour or audio is modelled, and no size
controls are exposed.

## Worked examples

- **As displayed** → `{ power: 'off', dial: 40, volume: 50 }`
- **Playing, dial at 62** → `{ power: 'on', dial: 62, volume: 70 }`
- **Top of the drum** → `{ dial: 100 }`

Only the knobs (`Tuning knob index`, `Volume knob index`, `Power knob index`)
and the drum (`Drum numerals`, `Drum ticks`) change with the controls. Every
cabinet part is identical across settings.

Label glyphs retain the bundled Helvetiker font licence in the source.

## Parameters

<!-- generated: parameters -->
**Radio controls**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `dial` | number | 0–100, step 1 | `40` | Turns the centre knob and scrolls the numbered drum behind the escutcheon window. |
| `volume` | number | 0–100 %, step 1 | `50` | Rotates the left knob. Control assignment is inferred from a typical TRF set; no audio is generated. |
| `power` | select | `on`, `off` | `"off"` | Turns the right knob between its off and on detents. The set has no lamps, so nothing lights. |

**Presets** — worked examples; each lists only what it changes.

- **As displayed** — `{"power":"off","dial":40,"volume":50}`
- **Evening listening** — `{"power":"on","dial":62,"volume":70}`
<!-- /generated: parameters -->
