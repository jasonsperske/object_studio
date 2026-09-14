# Field radio

A fixed photo-based model of the olive-drab transmitter-receiver in IMG_0750,
IMG_0751 and IMG_0752. Includes the recessed faceplate, large analog meter,
paired tuning wheels with spinner handles, band selectors, knurled knobs,
engraved legends, connection leads, carrying handle, canvas side slings,
pressed side ribs, and separate battery enclosure with light and fuse controls.

The cabinet dimensions are estimated at 400 × 520 × 230 mm, not measured.
The front faces +Z, width is centered on X, and the feet rest at Y = 0.
The cables and straps extend beyond the cabinet.

## Controls

The photographed controls are exposed in four property groups. Control meanings
are checked against the US Navy's *Introduction to Radio Equipment*, chapter 22,
[TBY controls, pages 300–303](https://www.maritime.org/doc/radio/chap22.php).

| Photograph label | Property and modeled action |
| --- | --- |
| POWER / lower ON–OFF | Independent toggles; both must be on for meter response |
| LIGHT | Held/released pushbutton pose; lights the powered dial (inferred from photo) |
| RECEIVER TUNING | Station frequency, 28–80 MHz; right wheel and scale cursor |
| TRANS TUNING | Left wheel and cursor, 0–100% travel |
| TRANS BAND / RECEIVER BAND | Independent four-position selectors |
| LOCK (left/right) | Rotates each clamp; hides its tuning property while locked, retaining the setting |
| TRANS ANT LOADING | Transmitter antenna-circuit adjustment knob |
| REC ANT TUNING | Receiver input-circuit adjustment knob |
| VOLUME / REGEN | Headphone level and detector feedback knobs |
| AUDIO FIL / RF FIL RHEOSTAT | Audio and RF heater adjustments; drive the corresponding illustrative meter mode |
| METER SWITCH | Left: audio voltage; center: transmitter plate current; right: RF voltage |
| CRYSTAL | Calibration-reference switch |

The lower FUSE cap and headphone/microphone/key sockets are fittings, not tuning
controls. The meter itself is an indicator. The supply toggle and LIGHT button
behavior are inferred from the photographed hardware.

Normalized percentages describe knob travel, not electrical units. Frequency is
mapped linearly to the receiver wheel. Band poses are independent: historical
band/dial calibration requires the original calibration card. Locks restrict the
studio UI, not direct programmatic parameter assignment. No RF or audio simulation
is performed. Plate current rests at zero because no transmit/send control is modeled.
The earlier 2–8 MHz approximation is corrected to 28–80 MHz; old out-of-range values
are clamped on build. Reset to defaults updates old studio settings to 38 MHz.

## Worked examples

- **Receiving at 38 MHz** → `{ power: 'on', frequency: 38, volume: 50 }`
- **Check RF heaters** → `{ meterMode: 'rf', rfFilament: 65 }`
- **Pose both selectors at band 3** → `{ transmitterBand: '3', receiverBand: '3' }`
- **Lock receiver tuning** → `{ receiverLock: 'locked', frequency: 45 }`
- **Illuminate the dial** → `{ lightPressed: true }`
- **Switch off the lower supply** → `{ supplyPower: 'off' }`

All details are procedural geometry; there are no external images or textures.
Embedded label glyphs retain their bundled font license in the generator source.

## Parameters

<!-- generated: parameters -->
**Power and lighting**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `power` | select | `on`, `off` | `"on"` |  |
| `supplyPower` | select | `on`, `off` | `"on"` | Separate ON–OFF toggle on the lower enclosure. Both power switches must be on for the simulated meter. |
| `lightPressed` | boolean | `true`, `false` | `false` | Poses the LIGHT button depressed and illuminates the dial while powered. Momentary action inferred from the photo. |

**Receiver**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `receiverBand` | select | `1`, `2`, `3`, `4` | `"1"` | RECEIVER BAND: four coarse tuning positions. Band boundaries require the original calibration card; this selector is posed independently of frequency. |
| `receiverLock` | select | `released`, `locked` | `"released"` | Right LOCK knob. Release to expose the frequency adjustment; locking retains its setting. |
| `frequency` | number | 28–80 MHz, step 0.01 | `38` | RECEIVER TUNING: moves the right tuning wheel and cursor. Linear visual mapping, not original dial calibration. Only used in some combinations. |
| `receiverAntenna` | number | 0–100 %, step 1 | `50` | REC ANT TUNING: adjustment of the receiver input circuit. |
| `volume` | number | 0–100 %, step 1 | `50` | VOLUME: headphone audio level. Changes the knob position; no audio is generated. |
| `regeneration` | number | 0–100 %, step 1 | `45` | REGEN: detector feedback adjustment. |

**Transmitter**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `transmitterBand` | select | `1`, `2`, `3`, `4` | `"1"` | TRANS BAND: four coarse tuning positions, separate from the receiver. |
| `transmitterLock` | select | `released`, `locked` | `"released"` | Left LOCK knob. Release to expose transmitter tuning. |
| `transmitterTuning` | number | 0–100 %, step 1 | `28` | TRANS TUNING: left vernier wheel. Percentage of modeled dial travel, not a calibrated frequency. Only used in some combinations. |
| `transmitterLoading` | number | 0–100 %, step 1 | `50` | TRANS ANT LOADING: adjusts the transmitter antenna circuit. |
| `crystal` | select | `on`, `off` | `"off"` | CRYSTAL: switches the internal calibration reference into the circuit. Poses the toggle; does not lock the station to a frequency. |

**Meter and filaments**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `meterMode` | select | `audio`, `plate`, `rf` | `"audio"` | Center knob below the meter: audio voltage (left), transmitter current (center), or RF voltage (right). Needle response is illustrative, not an electrical measurement. |
| `audioFilament` | number | 0–100 %, step 1 | `50` | AUDIO FIL RHEOSTAT: adjusts audio-tube heater voltage. The modeled meter follows this control in Audio mode. |
| `rfFilament` | number | 0–100 %, step 1 | `50` | RF FIL RHEOSTAT: adjusts RF-tube heater voltage. The modeled meter follows this control in RF mode. |
<!-- /generated: parameters -->

## Runtime media

The badge or meter face exposes an image-only `mediaSurface` slot.
Discover available slots with `listMediaSurfaces(parts)` and bind textures with
`applySurfaceTextures(parts, bindings)`. UVs follow the model geometry. Assignments never
enter parameters or object URLs; see the README for ownership and browser support.
