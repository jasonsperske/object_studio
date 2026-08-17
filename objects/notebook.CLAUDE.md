# Notebook, 1995–2008

The clamshell, back when it was thick: a swappable drive bay in the side, a PC Card slot, and a
cylindrical battery under the back that tilted the keyboard.

## When to reach for it

Laptops from before they got thin. There is no expansion here — no cards, no bays in the sense the
towers have.

## What matters most

There was no board standard to build these around, so **the size comes from the panel and the
keyboard**: `panel` and `aspect` set the width and how far back the lid goes, `keyPitch` and
`palmrest` set the depth, and `thickness` is whatever the drive bay demanded. `bay` picks what is
in the side — floppy, CD, DVD, a second battery or nothing — and `pointing` picks a trackball, a
stick, a trackpad or both.

## Worked examples

- **"a mid-90s laptop"** → the `1995 luggable` preset
- **"a business laptop with a pointing stick"** → the `1999 business notebook` preset
- **"a thin-and-light with no optical drive"** → the `2004 thin and light` preset
- **"a widescreen consumer laptop, lid open"** → the `2007 consumer widescreen` preset

## Check the metrics

It reports the key pitch as a percentage of full size and warns below about 18 mm, and it checks
that the bay you asked for fits the thickness you asked for — a DVD wants about 30 mm of base.
It also estimates the bulk in litres and kilograms.

## What it will not do

No docking station, no ports beyond a token few, no closed-lid state that hides the keyboard
properly. `lidAngle: 0` shuts it, but the machine is not modelled as a sealed object.

## Parameters

<!-- generated: parameters -->
**Panel**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `panel` | number | 8–17 ″, step 0.1 | `14.1` | Diagonal. This is what the width of the machine comes from. |
| `aspect` | select | `fourThree`, `sixteenTen`, `sixteenNine` | `"fourThree"` |  |
| `lidBezel` | number | 8–40 mm, step 1 | `20` |  |
| `lidAngle` | number | 0–135 °, step 1 | `105` |  |
| `screenOn` | boolean | `true`, `false` | `true` |  |
| `latch` | boolean | `true`, `false` | `true` | The catch and the button that let it go. Later ones did without. |

**Keyboard**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `keyPitch` | number | 14–19.05 mm, step 0.05 | `19.05` | Full size is 19.05. Sub-notebooks went down to 16 and you noticed. |
| `keyRows` | int | 5–6, step 1 | `6` |  |
| `pointing` | select | `trackball`, `stick`, `trackpad`, `both` | `"trackpad"` |  |
| `palmrest` | number | 0–90 mm, step 1 | `52` | How much deck there is in front of the keys. This is most of the depth of the machine. |

**Bay**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `bay` | select | `none`, `floppy`, `cd`, `dvd`, `battery` | `"dvd"` | One bay in the side, and you carried whatever else you needed in the bag. |
| `batteryBulge` | boolean | `true`, `false` | `true` | The cylinder pack that lifted the back of the machine and tilted the keyboard. |
| `pcCard` | boolean | `true`, `false` | `true` |  |
| `thickness` | number | 18–60 mm, step 1 | `38` | A drive bay in the side needs about 30 mm of it. |

**Case**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `finish` | select | `charcoal`, `graphite`, `silver`, `magnesium`, `ivory` | `"charcoal"` |  |
| `radius` | number | 0–30 mm, step 1 | `8` |  |
| `statusPanel` | boolean | `true`, `false` | `true` | The little row of icons that told you the disk was busy. |
| `speakers` | boolean | `true`, `false` | `true` |  |

**Presets** — worked examples; each lists only what it changes.

- **1995 luggable** — `{"panel":10.4,"aspect":"fourThree","lidBezel":26,"keyPitch":18,"keyRows":6,"pointing":"trackball","palmrest":40,"bay":"floppy","batteryBulge":true,"pcCard":true,"thickness":55,"finish":"ivory","radius":6,"lidAngle":100}`
- **1999 business notebook** — `{"panel":13.3,"aspect":"fourThree","lidBezel":22,"keyPitch":19.05,"keyRows":6,"pointing":"stick","palmrest":48,"bay":"cd","batteryBulge":true,"pcCard":true,"thickness":44,"finish":"charcoal","radius":8,"lidAngle":105}`
- **2002 desktop replacement** — `{"panel":15.4,"aspect":"sixteenTen","lidBezel":20,"keyPitch":19.05,"keyRows":6,"pointing":"both","palmrest":60,"bay":"dvd","batteryBulge":true,"pcCard":true,"thickness":48,"finish":"graphite","radius":10,"lidAngle":110,"screenOn":true}`
- **2004 thin and light** — `{"panel":12.1,"aspect":"fourThree","lidBezel":16,"keyPitch":17.5,"keyRows":6,"pointing":"trackpad","palmrest":44,"bay":"none","batteryBulge":false,"pcCard":true,"thickness":26,"finish":"magnesium","radius":6,"lidAngle":115}`
- **2007 consumer widescreen** — `{"panel":15.6,"aspect":"sixteenNine","lidBezel":18,"keyPitch":19.05,"keyRows":6,"pointing":"trackpad","palmrest":62,"bay":"dvd","batteryBulge":false,"pcCard":false,"thickness":34,"finish":"silver","radius":10,"lidAngle":105,"screenOn":true}`
- **2006 sub-notebook** — `{"panel":10.6,"aspect":"sixteenTen","lidBezel":14,"keyPitch":16,"keyRows":5,"pointing":"trackpad","palmrest":34,"bay":"none","batteryBulge":true,"pcCard":true,"thickness":24,"finish":"magnesium","radius":5,"lidAngle":120}`
<!-- /generated: parameters -->
