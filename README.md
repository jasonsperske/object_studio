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
| `box`, `slab`, `post`, `tube` | primitives placed by min-corner or endpoints |
| `boardProfile` | side profile of a board: square, chamfer, rounded, bullnose, cove, ogee |
| `extrudeProfile` | extrudes a profile across a width, front- or back-facing |
| `merge`, `triangleCount` | buffer merging and mesh stats |
| `num`, `str`, `bool` | typed parameter accessors |

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

The staircases report riser height, going, pitch and the 2R+G rule as you edit, flagging values
outside common building-code limits in amber or red. Those checks are advisory design aids, not a
substitute for the code that applies to your project.

## Units

All geometry is authored in **millimetres**. The export panel scales the mesh on the way out, so
you can write mm and hand a printer inches or a game engine metres. Key metrics show both.

## Sharing and saving configurations

- **Share link** — copy the address bar; see [URLs](#urls) above.
- **Presets** — save named parameter sets to `localStorage`, then export or import them as JSON.
  Presets store parameters; `objects/*.js` stores the logic. Loading a preset for a different
  object navigates to it.
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
server/objectApi.ts        Vite plugin: GET/PUT/DELETE for those files
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
