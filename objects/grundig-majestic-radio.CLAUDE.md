# Grundig Majestic radio

A procedural interpretation of the photographed 1960s Grundig Majestic tabletop
radio. The front faces +Z, width is centered on X, and the feet rest at Y=0.

The model follows the supplied views: a dark veneered cabinet with rounded front
edges, cream recessed fascia, full-width striped speaker cloth, brass trim,
multi-band glass tuning scale, two large dark controls, ivory piano keys, side
speaker grilles, and a perforated hardboard rear cover. The small crest and 2120
badge are simplified geometric interpretations. The clear acrylic museum label
resting on the top in several photographs is display furniture and is not modeled.
The front speaker grille is raked inward by about 30 mm from top to bottom, based
on the supplied right-side photograph rather than a direct measurement. The dial
panel reverses that rake from the grille's recessed lower seam, and the piano-key
shelf continues outward toward its bottom edge. These joined planes sit inside a
hollow full-depth cabinet shell rather than floating in front of a solid box.

Cabinet dimensions are estimated at 650 × 410 × 285 mm from photographic
proportions, not measured. Fine dial calibration and rear connector placement are
also approximate. All surfaces and legends are procedural geometry; no supplied
photograph is embedded in the object.

## Controls

The radio exposes only period-appropriate mechanical controls:

- **Piano-key function** depresses OFF, PU (phono pickup), BC (broadcast AM), SW,
  or FM. Selecting OFF extinguishes the warm scale illumination.
- **Tuning** rotates the right-hand knob and moves the mechanical pointer across
  the selected scale. The frequency metric is an illustrative interpolation,
  not service-manual calibration.
- **Volume** rotates the left-hand control. The object does not generate audio.
- **Tone key** poses either flanking TONE key for warm or bright response, or
  leaves both released for neutral response.

There is no digital display, LED, touchscreen, wireless input, or other
post-1960s technology. PU represents the wired record-player input visible on
sets of this period.

## Worked examples

- **Museum display** → `{ mode: 'off', tuning: 58, volume: 42, tone: 'neutral' }`
- **Evening FM** → `{ mode: 'fm', tuning: 68, volume: 32, tone: 'warm' }`
- **Shortwave listening** → `{ mode: 'shortwave', tuning: 37, volume: 55, tone: 'bright' }`

## Parameters

<!-- generated: parameters -->
**Radio controls**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `mode` | select | `off`, `phono`, `am`, `shortwave`, `fm` | `"fm"` | Depresses the corresponding mechanical selector key. OFF extinguishes the scale lamps; PU selects the period phono input. |
| `tuning` | number | 0–100 %, step 1 | `58` | Turns the right tuning knob and moves the mechanical pointer. The displayed frequency depends on the selected band. |
| `volume` | number | 0–100 %, step 1 | `42` | Turns the left volume control. No audio is generated. |
| `tone` | select | `warm`, `neutral`, `bright` | `"neutral"` | Poses the flanking tone keys, following the photographed TONE controls. |

**Presets** — worked examples; each lists only what it changes.

- **Museum display** — `{"mode":"off","tuning":58,"volume":42,"tone":"neutral"}`
- **Evening FM** — `{"mode":"fm","tuning":68,"volume":32,"tone":"warm"}`
- **Shortwave listening** — `{"mode":"shortwave","tuning":37,"volume":55,"tone":"bright"}`
<!-- /generated: parameters -->
