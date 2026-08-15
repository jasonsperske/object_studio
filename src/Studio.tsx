import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import ExportPanel from './components/ExportPanel'
import GearIcon from './components/GearIcon'
import LibraryPanel from './components/LibraryPanel'
import MetricsPanel from './components/MetricsPanel'
import PropertiesPanel from './components/PropertiesPanel'
import SourcePane from './components/SourcePane'
import ViewControls from './components/ViewControls'
import Viewport, { type ViewportHandle } from './components/Viewport'
import type { ExportFormat, Unit } from './lib/exporters'
import { download, exportModel } from './lib/exporters'
import { triangleCount } from './lib/geometry'
import type { Recipe, SavedItem } from './lib/persistence'
import {
  deleteFromLibrary,
  loadLibrary,
  replaceLibrary,
  saveToLibrary,
} from './lib/persistence'
import { galleryUrl, navigateTo, objectUrl, replaceUrl } from './lib/router'
import type { Settings } from './lib/settings'
import { themeDef } from './lib/settings'
import type { LengthUnit } from './lib/units'
import type { DisplayOptions, Projection, ViewName } from './lib/studioScene'
import type { ObjectDefinition, ParamValue, Params, Part } from './types'
import { defaultParams } from './types'

type Tab = 'properties' | 'presets' | 'export'
type Pane = 'viewer' | 'source'

export interface StudioProps {
  objectId: string
  definition: ObjectDefinition | null
  compileError: string | null
  initialParams: Params | null
  source: string
  savedSource: string
  builtinSource: string | undefined
  writable: boolean
  saving: boolean
  canDelete: boolean
  /** Resolves an object id to its display name, for preset subtitles. */
  objectName: (id: string) => string
  settings: Settings
  onOpenSettings: () => void
  onSourceChange: (source: string) => void
  onSave: () => void
  onCreateObject: (name: string) => void
  onDeleteObject: () => void
  notify: (message: string) => void
}

function withDefaults(definition: ObjectDefinition, params: Params): Params {
  return { ...defaultParams(definition), ...params }
}

/** True when every value matches the definition's defaults. */
function isDefault(definition: ObjectDefinition, params: Params): boolean {
  const defaults = defaultParams(definition)
  return Object.keys(defaults).every((key) => defaults[key] === params[key])
}

const EXPORT_UNIT: Record<LengthUnit, Unit> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
  ftin: 'in',
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

export default function Studio({
  objectId,
  definition,
  compileError,
  initialParams,
  source,
  savedSource,
  builtinSource,
  writable,
  saving,
  canDelete,
  objectName,
  settings,
  onOpenSettings,
  onSourceChange,
  onSave,
  onCreateObject,
  onDeleteObject,
  notify,
}: StudioProps) {
  const [params, setParams] = useState<Params>(() => initialParams ?? {})
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

  const viewportRef = useRef<ViewportHandle>(null)

  // Seed the export dialog from the display unit. Feet-and-inches has no
  // meaning in a mesh file, so it exports as inches.
  const exportUnit: Unit = EXPORT_UNIT[settings.unit]

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
  const viewerError = compileError ?? built.error

  // Depends on the unit too: object metrics format their own lengths, so a unit
  // change has to invalidate them even though the geometry is unchanged.
  const metrics = useMemo(() => {
    if (!deferred.definition?.metrics) return []
    try {
      return deferred.definition.metrics(deferred.params) ?? []
    } catch {
      return []
    }
  }, [deferred, settings.unit, settings.fraction])

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

  // Keep the address bar in step. Defaults stay on the clean /{objectId} form;
  // the hash appears only once a property actually differs.
  useEffect(() => {
    if (!definition) return
    replaceUrl(
      isDefault(definition, effectiveParams)
        ? objectUrl(objectId)
        : objectUrl(objectId, effectiveParams),
    )
  }, [definition, objectId, effectiveParams])

  const updateParam = useCallback((id: string, value: ParamValue) => {
    setParams((current) => ({ ...current, [id]: value }))
  }, [])

  const loadPreset = useCallback(
    (item: SavedItem) => {
      if (item.objectId !== objectId) {
        navigateTo(objectUrl(item.objectId, item.params))
        return
      }
      setParams(item.params)
      setFitToken((token) => token + 1)
    },
    [objectId],
  )

  // --- export --------------------------------------------------------------

  const handleExport = useCallback(
    async (format: ExportFormat, unit: Unit, filename: string) => {
      const result = await exportModel(parts, format, unit, {
        ...recipe,
        object: definition?.name ?? objectId,
        units: 'mm',
      })
      download(result.blob, `${filename}.${result.extension}`)
      notify(`Downloaded ${filename}.${result.extension}`)
    },
    [parts, recipe, definition, objectId, notify],
  )

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      notify('Share link copied to clipboard')
    } catch {
      notify('Could not copy — the link is in the address bar')
    }
  }, [notify])

  const savePng = useCallback(() => {
    const dataUrl = viewportRef.current?.snapshot()
    if (!dataUrl) return
    const binary = atob(dataUrl.split(',')[1])
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    download(new Blob([bytes], { type: 'image/png' }), `${objectId}.png`)
    notify('Saved view as PNG')
  }, [objectId, notify])

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

  const dirty = source !== savedSource

  return (
    <div className="app">
      <header className="topbar">
        <a
          className="brand"
          href={galleryUrl()}
          onClick={(e) => {
            e.preventDefault()
            navigateTo(galleryUrl())
          }}
          title="Back to the object library"
        >
          <span className="mark" aria-hidden />
          <span>
            Object <strong>Studio</strong>
          </span>
        </a>

        <h1 className="object-name">{definition?.name ?? objectId}</h1>

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

        <button
          type="button"
          className="icon settings-button"
          onClick={onOpenSettings}
          title="Settings — units and theme"
          aria-label="Settings"
        >
          <GearIcon />
        </button>
      </header>

      <div className="workspace">
        <aside className="panel" style={{ width: panelWidth }}>
          <div className="panel-body">
            {tab === 'properties' &&
              (definition ? (
                <PropertiesPanel
                  definition={definition}
                  params={effectiveParams}
                  settings={settings}
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
                objectName={objectName}
                onSave={(name) => {
                  setLibrary(saveToLibrary(recipe, name))
                  notify(`Saved “${name}” to your presets`)
                }}
                onLoad={loadPreset}
                onDelete={(id) => setLibrary(deleteFromLibrary(id))}
                onImport={(items) => {
                  setLibrary(replaceLibrary([...items, ...library]))
                  notify(`Imported ${items.length} preset${items.length === 1 ? '' : 's'}`)
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
                defaultUnit={exportUnit}
                onExport={handleExport}
                onCopyLink={copyLink}
                onSnapshot={savePng}
                triangles={stats.triangles}
              />
            )}
          </div>

          <div className="panel-footer">
            <MetricsPanel
              metrics={metrics}
              triangles={stats.triangles}
              size={stats.size}
              settings={settings}
            />
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
              sceneTheme={themeDef(settings.theme).scene}
              projection={projection}
              display={display}
              fitToken={deferred.fitToken}
            />
            {viewerError && (
              <div className="build-error">
                <strong>{compileError ? 'Source error' : 'Build failed'}</strong> {viewerError}
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
              error={compileError}
              saving={saving}
              hasBuiltin={builtinSource !== undefined}
              canDelete={canDelete}
              onChange={onSourceChange}
              onSave={onSave}
              onRevert={() => onSourceChange(savedSource)}
              onResetBuiltin={() => onSourceChange(builtinSource ?? '')}
              onNew={onCreateObject}
              onDelete={onDeleteObject}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
