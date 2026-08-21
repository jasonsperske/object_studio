# Object Studio, for agents

This library exists to be driven by something other than a person with a mouse. Each object in
`objects/` is a **parametric shape generator**: a plain JavaScript file that declares a parameter
schema and a `build` function, and returns named 3D parts. Give it a set of parameter values and
it returns a mesh. Nothing is hand-modelled, nothing is fetched, and the same parameters always
give the same shape.

If you are an agent asked for "a 2 metre farmhouse dining table" or "a mossy boulder about knee
height", the job is to **pick the generator and set its parameters**. This file tells you what is
here and how to drive it. Each generator then has its own `objects/<id>.CLAUDE.md` with the
detail: what it makes, when to reach for it, and worked examples of requests turned into
parameters.

Everything in this repository is CC0.

## What you can generate

| id | Makes | Reach for it when |
| --- | --- | --- |
| `staircase` | A straight flight of stairs | Stairs between two floors, any rise and going |
| `spiral-staircase` | A spiral flight round a column | Stairs in a round shaft, or a space too tight for a straight flight |
| `shelf-unit` | A shelving carcass | Bookcases, shelving, open storage |
| `fractal-tree` | A seeded recursive tree | Trees, shrubs, anything branching. Six leaf models, five fruit and blossom models |
| `table` | A table, seven plan shapes | Any table: dining, coffee, console, work. Extension and drop leaves |
| `chair` | A chair, seven back styles | Any chair: dining, side, carver, upholstered |
| `home-micro` | A 1977–85 wedge home computer | The keyboard-with-a-computer-in-it era |
| `integrated-micro` | A 1977–83 all-in-one with a tube | Early machines with the screen built into the case |
| `at-desktop` | A 1984–93 desktop and monitor | The beige box with the monitor sat on top |
| `multimedia-pc` | A 1995–2001 beige mini tower | The CD-ROM-and-sound-card era, with speakers |
| `gaming-tower` | A 2002–12 black ATX tower | Later towers: graphics card, window, fans |
| `notebook` | A 1995–2008 clamshell laptop | Laptops from before they got thin |
| `all-in-one` | A 2007–18 machine behind a panel | Modern all-in-ones |
| `rock` | A stone, pebble to boulder | Rocks, boulders, geodes. Erosion, moss, cracking open |
| `crt-television` | A 1948–2008 tube television | Any television with a tube: console, portable, tabletop, late black box |
| `flat-panel-television` | A 1998– flat television | Any flat television: plasma, LCD, OLED, on a stand or a wall |
| `gear` | A toothed wheel | Any gear, sprocket, ratchet wheel or toothed pulley |

Pick by what the thing **is**, not by size — a coffee table and a dining table are both `table`,
a pebble and a boulder are both `rock`, and a clock wheel and a mill gear are both `gear`. The
exceptions are split by technology rather than by size: the seven computers, because a 1977 machine
and a 2013 one share nothing, and the two televisions, because a tube and a panel are not the same
object with a thickness dial. Each carries only the fittings its own years had.

## Driving a generator

Every generator declares `params`: an array of specs, each with an `id`, a `type`, a `default`,
and — for numbers — `min`, `max` and `step`. **You only need to send the parameters you want to
change.** Anything you leave out takes its default, so a request that only cares about length is
one parameter, not thirty.

```js
// "a 2 metre farmhouse dining table"
{ length: 2000, width: 950, thickness: 45, legProfile: 'tapered', border: 'breadboard' }
```

Four types, and the rules for each:

- `number` — clamp to `min`/`max`. **Millimetres**, unless the spec says otherwise (`unit`).
- `int` — same, whole numbers.
- `select` — must be one of the listed `value` strings. Never invent one.
- `boolean` — `true` or `false`.

Some parameters carry `conditional: true` in the bundle. That means the studio's own UI hides
them in some combinations — a leg taper is meaningless on a turned leg. Setting one that is not
in play is harmless: it is simply not read.

### Start from a preset

Most generators ship `presets`: named parameter sets that are known-good starting points, each
listing only what it changes. If a request is close to one, **start there and adjust**, rather
than setting thirty parameters from nothing. "A Georgian dining table, but round" is the
`Georgian extending` preset with `shape: 'round'`.

### Read the metrics before you commit

Most generators export `metrics(params)`: derived measurements with a `level` of `ok`, `warn` or
`error`. These are the generator telling you the thing you have described is wrong — a chair with
598 mm of knee clearance, a case with more drives than bays, a 1970s machine with an optical
drive. If a metric comes back `warn` or `error`, adjust the parameters rather than shipping it.

## Conventions

Every object in the library agrees on these, so meshes compose:

- **Millimetres.** A 2 m table is `length: 2000`.
- **+Y is up**, and **objects sit on `Y = 0`.** The floor, the desk, the ground — whatever it
  stands on is zero, so a generated mesh can be placed at a point without hunting for its base.
- **Anything with a front faces `+Z`** — a television, a computer, a chair, a shelf unit, a
  staircase. `+Z` is where the studio's Front view looks from, so the front view shows the front:
  the face of a set, the open side of a shelf, the bottom of a flight looking up it. Depth runs
  back along `-Z` from that face, width runs along `X`, and the model is centred on `X = 0`.
- **Anything without a front runs along `+X`** — a table's length lies along it — with width on
  `+Z`, centred on `Z = 0`. The Front view then gives the long side, which is the useful view of a
  table.
- Two objects placed at the origin therefore face the same way, and a chair drawn beside a table
  looks across its long side rather than along it.
- `build` returns `Part[]` — `{ name, geometry, color }`. Names survive into OBJ groups and glTF
  nodes, so a caller can address the moss on a rock or the keys on a keyboard separately.

## Consuming this library over HTTP

A build publishes `dist/agent/`, which is everything an agent needs and needs no server:

```
dist/agent/index.json     every object: id, name, description, parameters, presets
dist/agent/<id>.js        the generator source, as it is evaluated
dist/agent/<id>.md        that generator's guide, the same file as objects/<id>.CLAUDE.md
dist/agent/CLAUDE.md      this file
```

`index.json` carries `format: 1`. If you read a format you do not know, say so rather than
guessing at it.

To turn a generator into geometry, evaluate the source with the studio's geometry helpers in
scope and call `build(params)`. `src/lib/compile.ts` is the reference implementation of that
step — it strips `export`, evaluates the file as a function body with the helpers passed in as
arguments, and validates what comes back. The helpers are listed in `README.md` under *What's in
scope*; the important thing is that a generator imports nothing, so you supply the whole
environment.

Two properties make this safe to automate against: **the sources are pure** — no network, no
filesystem, no clock, no randomness that is not seeded — and **the same parameters always give
the same mesh**, so output can be cached against a hash of `(id, params)`.

Object sources are evaluated with `new Function`. They are this repository's own code and contain
no I/O, but if you are running them somewhere that matters, treat them like any other script you
did not write.

## Opening one in the studio

Handy for showing a person what you generated:

```
/{objectId}                 the object at its defaults
/{objectId}/#m={hash}       with parameters — base64url of {"v":2,"params":{…}}
```

The hash holds only what differs from the defaults.

## Adding a generator

Drop a `.js` file in `objects/`. There is no registry to update. The contract is in `README.md`
under *The object contract*, and the shortest path is to copy the nearest existing object. Then
run `npm run agent-bundle`, which writes the parameter table into `objects/<id>.CLAUDE.md` and
refreshes `dist/agent/` — the prose around the table is yours to write.

`npm run agent-bundle -- --check` fails if any doc has drifted from the code it documents, which
is what keeps this file and its neighbours worth trusting.
