import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import ExportPanel from './components/ExportPanel'
import LibraryPanel from './components/LibraryPanel'
import MetricsPanel from './components/MetricsPanel'
import PropertiesPanel from './components/PropertiesPanel'
import SourcePane from './components/SourcePane'
import ViewControls from './components/ViewControls'
import Viewport, { type ViewportHandle } from './components/Viewport'
import { ObjectSourceError, compileObject, starterSource } from './lib/compile'
import type { ExportFormat, Unit } from './lib/exporters'
import { download, exportModel } from './lib/exporters'
import { triangleCount } from './lib/geometry'
import {
  builtinSources,
  deleteObjectSource,
  loadObjectSources,
  saveObjectSource,
  slugify,
} from './lib/objectStore'
import type { Recipe, SavedItem } from './lib/persistence'
import {
  deleteFromLibrary,
  loadLibrary,
  recipeFromLocation,
  replaceLibrary,
  saveToLibrary,
  writeRecipeToLocation,
} from './lib/persistence'
import type { DisplayOptions, Projection, ViewName } from './lib/studioScene'
import type { ObjectDefinition, ParamValue, Params, Part } from './types'
import { defaultParams } from './types'

type Tab = 'properties' | 'presets' | 'export'
type Pane = 'viewer' | 'source'

interface CompiledObject {
  id: string
  definition: ObjectDefinition | null
  error: string | null
}

/** Fills in any params a stored recipe predates, or that the source just gained. */
function withDefaults(definition: ObjectDefinition, params: Params): Params {
  return { ...defaultParams(definition), ...params }
}

function compileAll(sources: Record<string, string>): CompiledObject[] {
  return Object.keys(sources)
    .map((id) => {
      try {
        return { id, definition: compileObject(id, sources[id]), error: null }
      } catch (err) {
        const message =
          err instanceof ObjectSourceError || err instanceof Error ? err.message : String(err)
        return { id, definition: null, error: message }
      }
    })
    .sort((a, b) => {
      // meta.order first, then name; objects that don't compile sort last.
      const orderA = a.definition?.order ?? 1000
      const orderB = b.definition?.order ?? 1000
      if (orderA !== orderB) return orderA - orderB
      return (a.definition?.name ?? a.id).localeCompare(b.definition?.name ?? b.id)
    })
}

/** First object in picker order — the default selection. */
function firstId(sources: Record<string, string>): string {
  return compileAll(sources)[0]?.id ?? ''
}

const VIEW_KEYS: Record<string, ViewName> = {
  '1': 'front',
  '2': 'back',
  '3': 'left',
  '4': 'right',
  '5': 'top',
  '6': 'bottom',
  '7': 'iso',
}

export default function App() {
  const initialRecipe = useMemo(() => recipeFromLocation(), [])

  // Bundled sources render the first frame; the server's copies replace them
  // as soon as the object API answers.
  const [sources, setSources] = useState<Record<string, string>>(() => ({ ...builtinSources }))
  const [savedSources, setSavedSources] = useState<Record<string, string>>(() => ({
    ...builtinSources,
  }))
  const [writable, setWritable] = useState(false)

  const [objectId, setObjectId] = useState(
    () => initialRecipe?.objectId ?? firstId(builtinSources),
  )
  const [params, setParams] = useState<Params>(() => initialRecipe?.params ?? {})
  const [tab, setTab] = useState<Tab>('properties')
  const [pane, setPane] = useState<Pane>('viewer')
  const [projection, setProjection] = useState<Projection>('perspective')
  const [display, setDisplay] = useState<DisplayOptions>({
    wireframe: false,
    edges: true,
    grid: true,
    shadows: true,
  })
  const [library, setLibrary] = useState<SavedItem[]>(() => loadLibrary())
  const [panelWidth, setPanelWidth] = useState(360)
  const [fitToken, setFitToken] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const viewportRef = useRef<ViewportHandle>(null)

  useEffect(() => {
    let cancelled = false
    void loadObjectSources().then((loaded) => {
      if (cancelled) return
      setSources(loaded.sources)
      setSavedSources(loaded.sources)
      setWritable(loaded.writable)
      setObjectId((current) => (loaded.sources[current] ? current : firstId(loaded.sources)))
    })
    return () => {
      cancelled = true
    }
  }, [])

  const compiled = useMemo(() => compileAll(sources), [sources])
  const entry = useMemo(
    () => compiled.find((c) => c.id === objectId) ?? compiled[0],
    [compiled, objectId],
  )
  const definition = entry?.definition ?? null

  // Params are merged with the definition's defaults on the way out, so editing
  // the source to add a parameter takes effect without resetting the others.
  const effectiveParams = useMemo(
    () => (definition ? withDefaults(definition, params) : params),
    [definition, params],
  )

  // Geometry rebuilds are deferred so typing and dragging never block. The
  // definition, params and pending fit travel as one value: splitting them
  // would let React pair a new object with the previous object's parameters.
  const model = useMemo(
    () => ({ definition, params: effectiveParams, fitToken }),
    [definition, effectiveParams, fitToken],
  )
  const deferred = useDeferredValue(model)

  const built = useMemo((): { parts: Part[]; error: string | null } => {
    if (!deferred.definition) return { parts: [], error: null }
    try {
      return { parts: deferred.definition.build(deferred.params), error: null }
    } catch (err) {
      return { parts: [], error: err instanceof Error ? err.message : String(err) }
    }
  }, [deferred])
  const parts = built.parts
  const viewerError = entry?.error ?? built.error

  const metrics = useMemo(() => {
    if (!deferred.definition?.metrics) return []
    try {
      return deferred.definition.metrics(deferred.params) ?? []
    } catch {
      return []
    }
  }, [deferred])

  const stats = useMemo(() => {
    const box = new THREE.Box3()
    let triangles = 0
    for (const part of parts) {
      triangles += triangleCount(part.geometry)
      part.geometry.computeBoundingBox()
      if (part.geometry.boundingBox) box.union(part.geometry.boundingBox)
    }
    const size = box.isEmpty() ? new THREE.Vector3() : box.getSize(new THREE.Vector3())
    return { triangles, size: { x: size.x, y: size.y, z: size.z } }
  }, [parts])

  const recipe: Recipe = useMemo(
    () => ({ objectId, params: effectiveParams }),
    [objectId, effectiveParams],
  )

  useEffect(() => {
    writeRecipeToLocation(recipe)
  }, [recipe])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const selectObject = useCallback((id: string) => {
    setObjectId(id)
    setParams({})
    setFitToken((token) => token + 1)
  }, [])

  const updateParam = useCallback((id: string, value: ParamValue) => {
    setParams((current) => ({ ...current, [id]: value }))
  }, [])

  const loadRecipe = useCallback((next: Recipe) => {
    setObjectId(next.objectId)
    setParams(next.params)
    setFitToken((token) => token + 1)
  }, [])

  // Pasting a different share link into the address bar swaps the model without
  // a reload. writeRecipeToLocation uses replaceState, which fires no event, so
  // this only responds to genuine navigation.
  useEffect(() => {
    const onHashChange = () => {
      const incoming = recipeFromLocation()
      if (incoming) loadRecipe(incoming)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [loadRecipe])

  // --- source editing ------------------------------------------------------

  const source = sources[objectId] ?? ''
  const dirty = source !== (savedSources[objectId] ?? '')

  const updateSource = useCallback(
    (next: string) => {
      setSources((current) => ({ ...current, [objectId]: next }))
    },
    [objectId],
  )

  const saveSource = useCallback(async () => {
    if (!writable || !dirty) return
    setSaving(true)
    try {
      await saveObjectSource(objectId, source)
      setSavedSources((current) => ({ ...current, [objectId]: source }))
      setToast(`Saved objects/${objectId}.js`)
    } catch (err) {
      setToast(`Save failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSaving(false)
    }
  }, [writable, dirty, objectId, source])

  const newObject = useCallback(
    (name: string) => {
      const id = slugify(name)
      if (!id) {
        setToast('That name has no usable letters or digits.')
        return
      }
      if (sources[id]) {
        setToast(`An object called “${id}” already exists.`)
        return
      }
      setSources((current) => ({ ...current, [id]: starterSource(name) }))
      setObjectId(id)
      setParams({})
      setPane('source')
      setFitToken((token) => token + 1)
      setToast(writable ? `Created ${id} — save it to write objects/${id}.js` : `Created ${id}`)
    },
    [sources, writable],
  )

  const removeObject = useCallback(async () => {
    if (Object.keys(sources).length <= 1) {
      setToast('The library needs at least one object.')
      return
    }
    try {
      if (savedSources[objectId] !== undefined) await deleteObjectSource(objectId)
      const remaining = { ...sources }
      delete remaining[objectId]
      const remainingSaved = { ...savedSources }
      delete remainingSaved[objectId]
      setSources(remaining)
      setSavedSources(remainingSaved)
      setObjectId(firstId(remaining))
      setParams({})
      setPane('viewer')
      setFitToken((token) => token + 1)
      setToast(`Deleted ${objectId}`)
    } catch (err) {
      setToast(`Delete failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [objectId, sources, savedSources])

  // --- export --------------------------------------------------------------

  const handleExport = useCallback(
    async (format: ExportFormat, unit: Unit, filename: string) => {
      const result = await exportModel(parts, format, unit, {
        ...recipe,
        object: definition?.name ?? objectId,
        units: 'mm',
      })
      download(result.blob, `${filename}.${result.extension}`)
      setToast(`Downloaded ${filename}.${result.extension}`)
    },
    [parts, recipe, definition, objectId],
  )

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setToast('Share link copied to clipboard')
    } catch {
      setToast('Could not copy — the link is in the address bar')
    }
  }, [])

  const savePng = useCallback(() => {
    const dataUrl = viewportRef.current?.snapshot()
    if (!dataUrl) return
    const binary = atob(dataUrl.split(',')[1])
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    download(new Blob([bytes], { type: 'image/png' }), `${objectId}.png`)
    setToast('Saved view as PNG')
  }, [objectId])

  // --- layout / input ------------------------------------------------------

  const startResize = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    const move = (e: PointerEvent) => setPanelWidth(Math.min(640, Math.max(280, e.clientX)))
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }, [])

  // View shortcuts, ignored while typing or editing source.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) return
      if (target?.closest('.cm-editor')) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const view = VIEW_KEYS[event.key]
      if (view) viewportRef.current?.setView(view)
      else if (event.key === 'f') viewportRef.current?.fit()
      else if (event.key === 'p') {
        setProjection((current) => (current === 'perspective' ? 'orthographic' : 'perspective'))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden />
          <span>
            Object <strong>Studio</strong>
          </span>
        </div>

        <label className="object-picker">
          <span className="sr-only">Object</span>
          <select value={objectId} onChange={(e) => selectObject(e.target.value)}>
            {compiled.map((item) => (
              <option key={item.id} value={item.id}>
                {item.definition?.name ?? `${item.id} (error)`}
              </option>
            ))}
          </select>
        </label>

        <nav className="tabs" role="tablist">
          {(['properties', 'presets', 'export'] as Tab[]).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={tab === id ? 'active' : ''}
              onClick={() => setTab(id)}
            >
              {id[0].toUpperCase() + id.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      <div className="workspace">
        <aside className="panel" style={{ width: panelWidth }}>
          <div className="panel-body">
            {tab === 'properties' &&
              (definition ? (
                <PropertiesPanel
                  definition={definition}
                  params={effectiveParams}
                  onChange={updateParam}
                  onReset={() => setParams({})}
                />
              ) : (
                <p className="empty">
                  This object’s source doesn’t compile, so it has no properties yet. Open the
                  source editor to fix it.
                </p>
              ))}
            {tab === 'presets' && (
              <LibraryPanel
                items={library}
                suggestedName={definition?.name ?? objectId}
                objectName={(id) => compiled.find((c) => c.id === id)?.definition?.name ?? id}
                onSave={(name) => {
                  setLibrary(saveToLibrary(recipe, name))
                  setToast(`Saved “${name}” to your presets`)
                }}
                onLoad={loadRecipe}
                onDelete={(id) => setLibrary(deleteFromLibrary(id))}
                onImport={(items) => {
                  setLibrary(replaceLibrary([...items, ...library]))
                  setToast(`Imported ${items.length} preset${items.length === 1 ? '' : 's'}`)
                }}
                onExportAll={() =>
                  download(
                    new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' }),
                    'object-studio-presets.json',
                  )
                }
              />
            )}
            {tab === 'export' && (
              <ExportPanel
                defaultName={objectId}
                onExport={handleExport}
                onCopyLink={copyLink}
                onSnapshot={savePng}
                triangles={stats.triangles}
              />
            )}
          </div>

          <div className="panel-footer">
            <MetricsPanel metrics={metrics} triangles={stats.triangles} size={stats.size} />
          </div>
        </aside>

        <div
          className="splitter"
          role="separator"
          aria-orientation="vertical"
          onPointerDown={startResize}
        />

        <main className="stage">
          <div className="pane-switch control-group" role="group" aria-label="Right panel">
            <button
              type="button"
              className={pane === 'viewer' ? 'active' : ''}
              onClick={() => setPane('viewer')}
            >
              Viewer
            </button>
            <button
              type="button"
              className={pane === 'source' ? 'active' : ''}
              onClick={() => setPane('source')}
            >
              Source{dirty ? ' •' : ''}
            </button>
          </div>

          <div className={pane === 'viewer' ? 'pane' : 'pane hidden'}>
            <ViewControls
              projection={projection}
              onProjection={setProjection}
              display={display}
              onDisplay={setDisplay}
              onView={(view) => viewportRef.current?.setView(view)}
              onFit={() => viewportRef.current?.fit()}
            />
            <Viewport
              ref={viewportRef}
              parts={parts}
              projection={projection}
              display={display}
              fitToken={deferred.fitToken}
            />
            {viewerError && (
              <div className="build-error">
                <strong>{entry?.error ? 'Source error' : 'Build failed'}</strong> {viewerError}
              </div>
            )}
            <footer className="stage-footer">
              <span>Drag to orbit · scroll to zoom · right-drag to pan</span>
              <span>1–7 standard views · F fit · P projection</span>
            </footer>
          </div>

          <div className={pane === 'source' ? 'pane' : 'pane hidden'}>
            <SourcePane
              objectId={objectId}
              source={source}
              dirty={dirty}
              writable={writable}
              error={entry?.error ?? null}
              saving={saving}
              hasBuiltin={builtinSources[objectId] !== undefined}
              canDelete={Object.keys(sources).length > 1}
              onChange={updateSource}
              onSave={() => void saveSource()}
              onRevert={() => updateSource(savedSources[objectId] ?? '')}
              onResetBuiltin={() => updateSource(builtinSources[objectId] ?? '')}
              onNew={newObject}
              onDelete={() => void removeObject()}
            />
          </div>
        </main>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
