# Silvertone rocket radio

A procedural interpretation of the Silvertone (Sears) Model 6110 "Rocket" radio,
from reference photos IMG_0809–IMG_0811 and IMG_0820–IMG_0824. The domed tuning
nose faces +Z, width is centred on X, and the base rests at Y=0.

The museum label gives 7 × 11.5 × 6.5 in, read as height, depth and width:
178 × 292 × 165 mm. The pushbutton bank stands 10 mm above that. The card
dates the set c.1920s, but its own text places the design in the 1930s, and
the model is generally dated to about 1938. Slat count, dome depth and small
fittings are estimated from the photos, not measured.

The body is a horizontal Bakelite cylinder. Its upper part shows above a
stacked-slat grille base of ten plates over dark cloth. Each slat ends in a
small raised tab on either side. A notched rear centre panel carries the power
interlock pins. The base plate and the lowest slat run forward under the nose.

The nose is a glossy black dome behind a collar, sitting just above those
plates. Everything on it is taken from a straight-on photograph:

- SILVERTONE spans nine o'clock over the top to three o'clock, letters standing
  with their tops to the rim.
- A scale of straight ticks runs in from the rim, from 55 at about eight
  o'clock round to 170 at three o'clock. Major ticks are numbered 55, 60, 70,
  80, 90, 110, 130, 150 and 170, with unlabelled ticks between. The numerals
  are printed along the tick line.
- A round hub at the apex carries a raised grip bar.

A fixed pointer rises from the lowest slat at six o'clock. There are no lamps
or lights. Six station pushbuttons with blank gold label windows sit two across
and three deep on the crown, just behind the collar.

**Tuning turns the whole dome.** `frequency` rotates the nose so that station
sits over the pointer. Between ticks the angle is interpolated. Across
550–1700 kHz the dome turns from −54° to +78°. The default, 750 kHz, is the
pose in the photographs.

`pushbutton` holds one key 4.5 mm down and overrides `frequency` with that
key's nominal station: 640, 790, 880, 1020, 1170 and 1340 kHz, front pair
first. The real buttons were set by the owner, so these are placeholders. No
electrical or audio simulation is done, and no size controls are exposed.

## Worked examples

- **As photographed** → `{ frequency: 750 }`
- **Tune to 1340 kHz by hand** → `{ frequency: 1340 }`
- **Third preset pressed** → `{ pushbutton: '3' }` (dome swings to 880 kHz)

The body, slats and pointer are identical for every setting. Only the dome
parts (`Rotating dial dome`, `Dome lettering`, `Dial scale`, `Dial numerals`,
`Dial hub`, `Dial hub rim`, `Dial grip bar`) and `Pushbuttons` change, so a
caller can reuse the rest.

Label glyphs retain the bundled Helvetiker font licence in the source.

## Parameters

<!-- generated: parameters -->
**Radio controls**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `frequency` | number | 550–1700 kHz, step 10 | `750` | Turns the domed nose so this station sits over the fixed pointer at six o'clock. Ignored while a pushbutton is down. |
| `pushbutton` | select | `none`, `1`, `2`, `3`, `4`, `5`, `6` | `"none"` | Holds one key down and swings the dome to that key's preset station. |

**Presets** — worked examples; each lists only what it changes.

- **As photographed** — `{"frequency":750,"pushbutton":"none"}`
- **Bottom of the dial** — `{"frequency":550,"pushbutton":"none"}`
- **Preset 3 pressed** — `{"pushbutton":"3"}`
<!-- /generated: parameters -->
