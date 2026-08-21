# CRT television, 1948–2008

A tube, and something built round it. The tube is the whole specification — a given diagonal in a
given aspect is a given face and a given depth — and the cabinet is that plus the moulding, the
bands the speaker and the controls need, and room behind for the chassis.

## When to reach for it

Any television with a tube in it: a 1950s console, a portable, the family set on a sideboard, a
late black box. Also serviceable as a period computer monitor if you turn the tuner fittings off —
set `aerial: 'none'` and `controls: 'none'`. For anything flat, use `flat-panel-television`. For a
tube with a *computer* in the same case, use `integrated-micro`.

## What matters most

**`cabinet` and `controls` are the decade.** Everything else is detail hung on those two. A
console with dials across the front and doors over the screen is 1958; a moulded box with a column
of knobs down one side above a speaker grille is 1975; four small buttons under the glass and a
remote on the floor is 1995. Set those two first and the rest follows.

**`tube` sizes the whole object.** `bezel` is the moulding round the glass; `depthAllowance` is the
room behind it. On a console, `cabinetMargin` is the furniture the set is buried in, and it is the
difference between a television and a sideboard with a television in it.

**The side band is shared.** `controls: 'sideDials'` and `speaker: 'side'` both live in the band
beside the screen, and when you ask for both you get the arrangement everyone remembers: the knobs
in a column with the grille under them.

**`faceCurve` is the age of the glass.** At 100 the face is domed and its corners are round, the
way a 1960s tube was. At 0 it is flat and square, the way the last of them were.

## Worked examples

- **"an old television in a wooden cabinet"** → the `1958 walnut console` preset
- **"a mid-century console on splayed legs"** → the `1966 teak console` preset
- **"a little portable with a telescopic aerial"** → the `1978 portable` preset
- **"an 80s telly with a row of tuning buttons"** → the `1983 woodgrain set` preset
- **"a 90s set, all remote"** → the `1996 black box` preset
- **"one of the last widescreen tubes"** → the `2003 widescreen tube` preset
- **"dials on the side, above the speaker"** → `{ controls: 'sideDials', speaker: 'side' }`
- **"hide the controls behind a flap"** → `{ flap: true }` — drawn hanging open, so you see both
- **"an ornate cabinet, like a radiogram"** → `{ cabinet: 'console', ornament: 5, legs: 'cabriole', grille: 'fret', doors: 'closed' }`

## What the tapered back does

`taperBack` draws the sides and the top of the moulding in toward the neck; the bottom stays flat,
because the set has to stand on something. Everything that lands on the cabinet follows that in —
the feet under it, the aerial base and the carry handle on top of it, the vents and sockets out of
the back — so a deep taper moves them rather than leaving them hanging beside it.

## Check the metrics

**Reads as** is the one to watch. Every choice here belongs to some stretch of the tube's sixty
years, and this overlaps them: a set that could have been sold gets a range of years, and one that
could not gets an `error` naming the two choices that never met — a widescreen tube on cabriole
legs, say. It also reports mass, which for a tube is mostly glass and goes up fast, and warns when
a console's screen ends up too low to watch from an armchair.

## What it will not do

No rear projection, no portable with a battery pack, no set built into anything else. The tube's
depth is a fixed fraction of its width rather than a real funnel geometry. Doors are a pair, always
the full height, and either shut or folded back — there is no half-open. The chassis, the tube neck
and the yoke are room in the case rather than modelled parts.

## Parameters

<!-- generated: parameters -->
**Tube**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `tube` | number | 5–40 ″, step 0.5 | `21` | Diagonal, corner to corner. 12″ is a portable, 21″ the family set, 32″ about as big as a tube ever sensibly got. |
| `aspect` | select | `fourThree`, `sixteenNine` | `"fourThree"` |  |
| `faceCurve` | number | 0–100 %, step 1 | `65` | A domed face with rounded corners early on, flat and square by the end. Rounds the screen corners and bulges the glass out of the moulding. |
| `screenOn` | boolean | `true`, `false` | `true` |  |
| `picture` | select | `colour`, `monochrome` | `"colour"` | Only used in some combinations. |

**Cabinet**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `cabinet` | select | `console`, `tabletop`, `portable`, `blackBox` | `"tabletop"` | What the tube is housed in. This is the decade, more than anything else here. |
| `finish` | select | `walnut`, `teak`, `oak`, `woodgrain`, `cream`, `red`, `charcoal`, `silver` | `"woodgrain"` |  |
| `bezel` | number | 8–140 mm, step 1 | `40` | Moulding between the glass and the edge of the cabinet. |
| `radius` | number | 0–90 mm, step 1 | `18` |  |
| `depthAllowance` | number | 20–320 mm, step 5 | `70` | The neck, the yoke and the chassis, and air round all three. |
| `taperBack` | boolean | `true`, `false` | `true` | The moulded back drawn in toward the neck — the sides and the top come in, the bottom stays flat because the set has to stand on it. A console hides the same tube in a square box. Only used in some combinations. |
| `vents` | boolean | `true`, `false` | `true` |  |
| `badge` | boolean | `true`, `false` | `true` |  |
| `handle` | boolean | `true`, `false` | `true` | Only used in some combinations. |

**Console**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `cabinetMargin` | number | 0–600 mm, step 10 | `220` | How far the cabinet runs past the tube each side — the room the speakers, the record deck and the drinks went in. Only used in some combinations. |
| `ornament` | int | 0–5, step 1 | `2` | A plain box at 0. A base moulding at 1, a cornice at 2, corner pilasters at 3, fluting at 4, and a beaded frame round the grille at 5. Only used in some combinations. |
| `legs` | select | `tapered`, `turned`, `cabriole`, `bracket`, `plinth`, `none` | `"tapered"` | Only used in some combinations. |
| `legHeight` | number | 20–420 mm, step 5 | `200` | Only used in some combinations. |
| `legThickness` | number | 20–120 mm, step 2 | `46` | Only used in some combinations. |
| `splay` | number | 0–20 °, step 1 | `8` | Only used in some combinations. |
| `doors` | select | `none`, `open`, `closed` | `"none"` | The pair that shut the television away and left you a sideboard. Only used in some combinations. |

**Controls**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `controls` | select | `sideDials`, `frontDials`, `pushButtons`, `discreet`, `none` | `"sideDials"` | Where the things you turn or press actually are. The single most dating detail on a television. |
| `dials` | int | 1–6, step 1 | `3` | Channel and volume at two; add fine tune, brightness, contrast and hold as it climbs. Only used in some combinations. |
| `dialSize` | number | 14–80 mm, step 1 | `38` | Only used in some combinations. |
| `buttons` | int | 2–14, step 1 | `6` | Only used in some combinations. |
| `flap` | boolean | `true`, `false` | `false` | Hinged along the bottom and drawn hanging open, so you can see both it and what it hides. Only used in some combinations. |
| `standby` | boolean | `true`, `false` | `true` |  |
| `remote` | boolean | `true`, `false` | `false` | A handset lying in front of the set. |

**Speaker**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `speaker` | select | `side`, `below`, `both`, `none` | `"side"` |  |
| `grille` | select | `cloth`, `perforated`, `slots`, `fret` | `"cloth"` | Only used in some combinations. |

**Aerial**

| Parameter | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `aerial` | select | `none`, `telescopic`, `rabbitEars`, `loopAndDipole` | `"rabbitEars"` |  |
| `aerialLength` | number | 150–1400 mm, step 10 | `700` | Fully extended. Telescopic rods came in at about a fifth of this. Only used in some combinations. |
| `aerialSpread` | number | 0–80 °, step 1 | `45` | Only used in some combinations. |

**Presets** — worked examples; each lists only what it changes.

- **1958 walnut console** — `{"tube":21,"aspect":"fourThree","faceCurve":100,"screenOn":true,"picture":"monochrome","cabinet":"console","finish":"walnut","bezel":62,"radius":26,"depthAllowance":150,"cabinetMargin":210,"ornament":4,"legs":"turned","legHeight":230,"legThickness":54,"doors":"open","controls":"frontDials","dials":4,"dialSize":44,"speaker":"below","grille":"fret","aerial":"rabbitEars","aerialLength":800,"badge":true}`
- **1966 teak console** — `{"tube":23,"aspect":"fourThree","faceCurve":85,"screenOn":true,"picture":"colour","cabinet":"console","finish":"teak","bezel":54,"radius":22,"depthAllowance":130,"cabinetMargin":220,"ornament":1,"legs":"tapered","legHeight":230,"legThickness":44,"splay":12,"doors":"none","controls":"sideDials","dials":4,"dialSize":40,"speaker":"side","grille":"cloth","aerial":"none","badge":true}`
- **1978 portable** — `{"tube":12,"aspect":"fourThree","faceCurve":80,"screenOn":true,"picture":"monochrome","cabinet":"portable","finish":"cream","bezel":26,"radius":34,"depthAllowance":55,"taperBack":true,"handle":true,"controls":"sideDials","dials":3,"dialSize":26,"speaker":"side","grille":"perforated","aerial":"telescopic","aerialLength":420,"badge":true,"standby":false}`
- **1983 woodgrain set** — `{"tube":22,"aspect":"fourThree","faceCurve":60,"screenOn":true,"picture":"colour","cabinet":"tabletop","finish":"woodgrain","bezel":44,"radius":16,"depthAllowance":80,"taperBack":true,"controls":"pushButtons","buttons":8,"flap":true,"speaker":"side","grille":"slots","aerial":"loopAndDipole","aerialLength":620,"remote":false,"badge":true}`
- **1996 black box** — `{"tube":25,"aspect":"fourThree","faceCurve":25,"screenOn":true,"picture":"colour","cabinet":"blackBox","finish":"charcoal","bezel":30,"radius":14,"depthAllowance":90,"taperBack":true,"controls":"discreet","buttons":5,"speaker":"below","grille":"slots","aerial":"none","remote":true,"badge":true,"standby":true}`
- **2003 widescreen tube** — `{"tube":32,"aspect":"sixteenNine","faceCurve":0,"screenOn":true,"picture":"colour","cabinet":"blackBox","finish":"silver","bezel":26,"radius":12,"depthAllowance":110,"taperBack":true,"controls":"none","speaker":"below","grille":"perforated","aerial":"none","remote":true,"badge":false,"standby":true}`
<!-- /generated: parameters -->
