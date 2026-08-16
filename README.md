# Object Studio

A JSFiddle for 3D objects. Objects are **plain JavaScript files** that export a parameter schema
and a `build` function. The studio turns the schema into a settings pane, evaluates `build` live
as you drag sliders, and exports the result as STL, OBJ, PLY or glTF.

The root URL is a gallery of the library. Open an object and the window splits into **object
properties** on the left and, on the right, a panel you flip between the **viewer** and the
**source editor** for the object itself. Edit the source, switch back, and you're looking at the
evaluated logic. Save, and it's written back to `objects/` on the server.

## URLs

| | |
| --- | --- |
| `/` | gallery of every object, with a live preview per card |
| `/{objectId}` | that object at its default properties |
| `/{objectId}/#m={hash}` | that object with saved properties |

Properties live in the hash, so editing them rewrites the current history entry rather than
stacking one up — only moving between objects adds history. The hash appears the moment a
property differs from its default and disappears again on **Reset to defaults**, so a URL you
share is as short as it can be. Links in the older `/#m={objectId+params}` form still resolve and
are rewritten to the new shape on arrival.

Paths are client-side routes, so a static deploy needs the usual SPA rewrite — serve
`index.html` for any unmatched path. `npm run dev` and `npm run preview` already do.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the bundle, object API still enabled
```

## The object contract

Everything in `objects/*.js` is an object type. There is no registry to update and no build step
— dropping a file in that directory adds it to the library.

```js
export const meta = {
  name: 'Straight staircase',   // shown in the picker
  description: 'Sits above the properties.',
  order: 1,                     // picker sort position, default 100
}

export const params = [
  { id: 'width', label: 'Width', type: 'number', min: 400, max: 2400, step: 10,
    default: 950, unit: 'mm', group: 'Flight', help: 'Clear width across the treads.' },
  { id: 'edgeStyle', label: 'Ledge profile', type: 'select', default: 'rounded',
    options: [{ value: 'square', label: 'Square' }, { value: 'rounded', label: 'Round-over' }] },
  { id: 'risers', label: 'Closed risers', type: 'boolean', default: true, group: 'Risers',
    // Hide a control unless another parameter calls for it.
    visibleWhen: (p) => bool(p, 'risers') },
]

// Receives the properties object with every value filled in. Returns parts.
export function build(p) {
  return [{ name: 'treads', geometry: merge(treads), color: 0xc79155 }]
}

// Optional. Derived measurements shown under the properties panel.
export function metrics(p) {
  return [{ label: 'Riser height', value: '180 mm', level: 'warn', note: 'Why it matters.' }]
}

// Optional. Named property sets the object ships with — part of what the object
// is, so they live here rather than in any app-level store. List only what each
// one changes; the rest comes from the defaults above.
export const presets = [
  { name: 'Pine tree', params: { apical: 0.98, branchAngle: 74, leafModel: 'needle' } },
]
```

Parameter types are `number`, `int`, `select` and `boolean`. Returning `Part[]` rather than one
geometry means each part keeps its name through OBJ groups and glTF nodes, and gets its own
preview colour.

### What's in scope

Sources are evaluated in the browser with the geometry library injected, so they need no imports.
Available as bare identifiers (and collected on a `studio` object):

| | |
| --- | --- |
| `THREE` | the three.js namespace, for anything the helpers don't cover |
| `box`, `slab`, `post`, `tube`, `strut` | primitives placed by min-corner or endpoints; `strut` tapers |
| `boardProfile` | side profile of a board: square, chamfer, rounded, bullnose, cove, ogee |
| `extrudeProfile` | extrudes a profile across a width, front- or back-facing |
| `ring`, `hull`, `roundCorners` | plan outlines: cleaned and wound, repaired, corners arced |
| `plan`, `clip`, `contains`, `supportPoint`, `perimeter` | offsetting an outline, cutting it, measuring it |
| `sweep`, `face`, `profiledBoard` | the solids you make over one |
| `edgeSection`, `beadSection` | cross-sections to sweep: a board profile read as insets, or a bead |
| `merge`, `triangleCount` | buffer merging and mesh stats |
| `num`, `str`, `bool` | typed parameter accessors |

### Plan outlines

Anything with a shaped footprint — a table top, a chair seat — is described as one closed loop of
`{x, z}` in the plan plane, wound anticlockwise, and the solid is made by working on that loop.
`sweep` runs a cross-section around it, which is how a moulded edge, an apron, a bead or a seat
frame are all the same operation; `plan` prepares it for offsetting, so an inlay band or a leg
position is the outline pulled inwards; `clip` cuts it into pieces, which is how a table leaf and
a breadboard end are the same operation too.

`edgeSection` is the bridge between the two halves of that: it reads one of the `boardProfile`
shapes back as insets from the outline, so the six profiles the stair treads use will run around a
round table top or a shaped seat. Offsetting is the fiddly part and is handled for you — a plain
miter offset turns itself inside out wherever a corner is rounded tighter than the inset, so `plan`
pushes each offset point back inside the outline and `hull` repairs what is left.

`export` is stripped before evaluation, so the files read like ES modules but run as a function
body. An explicit `return { params, build, metrics }` works too.

### Conventions

- `+X` is the run/depth direction (a staircase ascends toward +X)
- `+Y` is up, with the floor at `Y = 0`
- `+Z` is width, models centred on `Z = 0`
- Dimensions are millimetres

## Editing and saving

The **Source** button in the right-hand panel opens a CodeMirror editor on the current object.
Edits re-evaluate as you type: the properties pane rebuilds from the new schema (keeping values
you'd already set), the viewer rebuilds the mesh, and syntax or schema errors appear in a status
bar instead of breaking the app.

| Action | |
| --- | --- |
| **Save** (⌘S / Ctrl-S) | writes the source back to `objects/<id>.js` |
| **Revert** | discards unsaved edits |
| **Reset to built-in** | restores the version bundled with the project |
| **New** | scaffolds a new object type from a working starter template |
| **Delete** | removes the object and its file |

## What is stored where

| | |
| --- | --- |
| `objects/*.js` | object definitions — written on create and on every save |
| `presets.json` | property sets you save, keyed by object |
| `localStorage` | display settings only: unit system, scale and theme |

Only the display settings are per-browser. Everything that is library content lives on the
server, so it survives a reload, follows you between browsers, and can be committed.

Saving goes through a small API served by the Vite dev and preview servers. That API has write
access to the `objects/` directory, so keep it on localhost — don't put it behind a public
listener. A static build with no API still runs: the bundled sources are compiled in, the editor
works, and it tells you edits live only in that tab.

Object sources are evaluated with `new Function`. That's the point — it's a fiddle — but it does
mean an object file can run any JavaScript, so treat one you didn't write like any other script
you'd run.

## What ships in the library

| Object | Highlights |
| --- | --- |
| **Straight staircase** | Rise/going derived from floor-to-floor height and step count, six tread-nosing profiles, optional risers, cut or closed stringers, handrail with balusters |
| **Spiral staircase** | Wedge treads around a central column, adjustable sweep and winding direction, helical handrail |
| **Shelf unit** | Carcass with evenly spaced shelves, sharing the same edge profiles as the stair treads |
| **Fractal tree** | Seeded recursive branching — thickness, angle, taper, droop and apical dominance set the habit; six leaf models and five fruit/blossom models dress the outer growth |
| **Table** | Seven plan shapes, the tread edge profiles swept round any of them, banding / breadboard / lip borders, extension and drop leaves, six leg arrangements from corner legs to twin pedestal, and one fanciness dial for the ornament |
| **Chair** | Four seat shapes with the same moulded edges, seven backs from ladder to upholstered, five leg profiles including a swept cabriole, optional arms, drop-in or fully upholstered seats, and the same fanciness dial |

The table is built out of a single plan outline: the moulded edge and the apron are cross-sections
swept around it, the inlay band and the leg positions are the outline offset inwards, and the
leaves and breadboard ends are it clipped into slices. That is what lets an ogee edge run round a
round top and an arched apron follow an oval without either knowing what shape it is on. None of
that algebra belongs to the table — it is the [plan outline](#plan-outlines) helpers, the same way
the ledge profiles belong to the library rather than to the staircase. It
declares presets for a farmhouse dining table, a Georgian extending oval, a round pedestal café
table, a Pembroke drop-leaf, a trestle work table, a hairpin coffee table and an octagonal games
table.

The chair is made to sit at it and built the same way: its seat is a plan outline too, and its
back is drawn flat as boards standing in a plane and then tipped as a whole by the rake angle,
about the back edge of the seat. It borrows the table's edge and leg profiles, so a chair drawn at
the same fanciness matches rather than merely accompanies, and it measures its seat height against
the same 750 mm table the table object measures its knee clearance from. Its presets run from a
farmhouse ladderback and a Windsor to a cabriole-legged Georgian splat, a carver with arms and an
upholstered diner.

The tree declares presets for a pine, oak, silver birch, apple, cherry blossom and weeping willow
in its own source. Its randomness is seeded, so a given seed always rebuilds the same tree, and growth stops
at a limb cap so a careless slider cannot lock the tab up.

The staircases report riser height, going, pitch and the 2R+G rule as you edit, flagging values
outside common building-code limits in amber or red. Those checks are advisory design aids, not a
substitute for the code that applies to your project.

## Units

All geometry is authored in **millimetres**. The export panel scales the mesh on the way out, so
you can write mm and hand a printer inches or a game engine metres. Key metrics show both.

## Sharing and saving configurations

- **Share link** — copy the address bar; see [URLs](#urls) above.
- **Presets** belong to an object, never to the app, and the Presets tab only ever shows the
  current object's. They come from two places: the ones the object **declares in its own
  definition**, which are read-only in the UI and edited in the source; and the ones you **save**,
  which are kept per object in `presets.json`. Saving a set of properties never changes the
  object's definition — that is the point of the split. Deleting an object takes its saved
  presets with it.
- **Parameters (JSON)** — an export format that stores the recipe rather than the mesh.

## Viewport

| Key | Action |
| --- | --- |
| `1`–`7` | Front, Back, Left, Right, Top, Bottom, Iso |
| `F` | Zoom to fit |
| `P` | Toggle perspective / orthographic |

Drag to orbit, scroll to zoom, right-drag to pan. Grid, edges, wireframe and shadows toggle
independently. Switching to the source editor keeps the WebGL context and your camera position.

## Layout

```
objects/*.js               the object library — editable at runtime
presets.json               saved parameter sets
server/studioApi.ts        Vite plugin: reads and writes both of the above
src/App.tsx                owns the library and the route; gallery or studio
src/Studio.tsx             the properties + viewer/source workspace
src/components/Gallery.tsx the root gallery
src/lib/router.ts          URL scheme: parsing, building, navigation
src/lib/compile.ts         source → live object definition, plus the injected API
src/lib/geometry.ts        the geometry helpers injected into object sources
src/lib/studioScene.ts     three.js renderer, cameras, standard views
src/lib/thumbnails.ts      offscreen renders for the gallery cards
src/lib/exporters.ts       STL / OBJ / PLY / glTF / GLB, with unit scaling
src/lib/objectStore.ts     loads bundled sources, talks to the object API
```

React 18 + TypeScript + Vite, three.js r169 driven imperatively so parameter edits swap geometry
without tearing down the WebGL context. Rebuilds run through `useDeferredValue`, keeping sliders
and the editor responsive on heavy models.

## Credits

The **3D Studio DOS** theme uses *Web437 IBM VGA 8x16* from
[The Ultimate Oldschool PC Font Pack](https://int10h.org/oldschool-pc-fonts/) by VileR, licensed
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The font is bundled unmodified in
`src/fonts/` with its licence.
