import { useCallback, useEffect, useMemo, useState } from 'react'
import Gallery from './components/Gallery'
import SettingsDialog from './components/SettingsDialog'
import Studio from './Studio'
import type { Settings } from './lib/settings'
import { loadSettings, saveSettings } from './lib/settings'
import { setDisplayUnits } from './lib/compile'
import { ObjectSourceError, compileObject, starterSource } from './lib/compile'
import {
  builtinSources,
  deleteObjectSource,
  loadObjectSources,
  saveObjectSource,
  slugify,
} from './lib/objectStore'
import type { PresetStore, SavedItem } from './lib/persistence'
import { addPreset, loadPresets, removePreset, saveObjectPresets } from './lib/persistence'
import type { Route } from './lib/router'
import { galleryUrl, navigateTo, objectUrl, parseLocation } from './lib/router'
import type { ObjectDefinition } from './types'

interface CompiledObject {
  id: string
  definition: ObjectDefinition | null
  error: string | null
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

/**
 * Owns the object library and the route; renders either the gallery or the
 * studio. Sources live here because the gallery needs them for its cards and
 * the studio needs them for the editor.
 */
export default function App() {
  // Bundled sources render the first frame; the server's copies replace them
  // as soon as the object API answers.
  const [sources, setSources] = useState<Record<string, string>>(() => ({ ...builtinSources }))
  const [savedSources, setSavedSources] = useState<Record<string, string>>(() => ({
    ...builtinSources,
  }))
  const [writable, setWritable] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [route, setRoute] = useState<Route>(() => parseLocation())
  /** Bumped per navigation, so arriving at the object you are already on with
      different properties still re-seeds the studio. */
  const [navSeq, setNavSeq] = useState(0)
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [settingsOpen, setSettingsOpen] = useState(false)
  /** Set by createObject so the studio opens on the editor for a new object. */
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [presets, setPresets] = useState<PresetStore>({})
  const [presetsWritable, setPresetsWritable] = useState(false)

  // Object sources call formatLength() during their own metrics(), which runs
  // while children render — so the unit has to be in place before that, not in
  // an effect afterwards. useMemo gives us that ordering.
  useMemo(() => setDisplayUnits(settings.unit, settings.fraction), [settings.unit, settings.fraction])

  // The theme is a data attribute on the root so CSS can swap the whole token set.
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
    saveSettings(settings)
  }, [settings])

  // popstate covers in-app navigation and Back/Forward; hashchange covers a
  // share link pasted into the address bar while already on that object, which
  // changes only the fragment and so fires neither a load nor a popstate.
  useEffect(() => {
    const onNavigate = () => {
      setRoute(parseLocation())
      setNavSeq((seq) => seq + 1)
    }
    window.addEventListener('popstate', onNavigate)
    window.addEventListener('hashchange', onNavigate)
    return () => {
      window.removeEventListener('popstate', onNavigate)
      window.removeEventListener('hashchange', onNavigate)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void loadObjectSources().then((loaded) => {
      if (cancelled) return
      setSources(loaded.sources)
      setSavedSources(loaded.sources)
      setWritable(loaded.writable)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void loadPresets().then((loaded) => {
      if (cancelled) return
      setPresets(loaded.presets)
      setPresetsWritable(loaded.writable)
      if (loaded.migrated) {
        setToast(`Moved ${loaded.migrated} preset${loaded.migrated === 1 ? '' : 's'} to the server`)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const compiled = useMemo(() => compileAll(sources), [sources])
  // --- source mutations ----------------------------------------------------

  const activeId = route.kind === 'object' ? route.objectId : null

  const updateSource = useCallback(
    (next: string) => {
      if (!activeId) return
      setSources((current) => ({ ...current, [activeId]: next }))
    },
    [activeId],
  )

  const saveSource = useCallback(async () => {
    if (!activeId || !writable) return
    const source = sources[activeId] ?? ''
    if (source === savedSources[activeId]) return
    setSaving(true)
    try {
      await saveObjectSource(activeId, source)
      setSavedSources((current) => ({ ...current, [activeId]: source }))
      setToast(`Saved objects/${activeId}.js`)
    } catch (err) {
      setToast(`Save failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSaving(false)
    }
  }, [activeId, writable, sources, savedSources])

  // A new object is written to the server straight away, so it survives a
  // reload without the author having to notice the Save button first.
  const createObject = useCallback(
    async (name: string) => {
      const id = slugify(name)
      if (!id) {
        setToast('That name has no usable letters or digits.')
        return
      }
      if (sources[id]) {
        setToast(`An object called “${id}” already exists.`)
        return
      }

      const source = starterSource(name)
      setSources((current) => ({ ...current, [id]: source }))
      setCreatedId(id)
      navigateTo(objectUrl(id))

      if (!writable) {
        setToast(`Created ${id} — read-only, so it lives in this tab only`)
        return
      }
      try {
        await saveObjectSource(id, source)
        setSavedSources((current) => ({ ...current, [id]: source }))
        setToast(`Created objects/${id}.js`)
      } catch (err) {
        setToast(`Created ${id}, but saving failed: ${err instanceof Error ? err.message : String(err)}`)
      }
    },
    [sources, writable],
  )

  const deleteObject = useCallback(async () => {
    if (!activeId) return
    if (Object.keys(sources).length <= 1) {
      setToast('The library needs at least one object.')
      return
    }
    try {
      if (savedSources[activeId] !== undefined) await deleteObjectSource(activeId)
      const remaining = { ...sources }
      delete remaining[activeId]
      const remainingSaved = { ...savedSources }
      delete remainingSaved[activeId]
      setSources(remaining)
      setSavedSources(remainingSaved)
      // Presets belong to the object, so they go with it.
      if (presets[activeId]?.length) {
        await saveObjectPresets(activeId, []).catch(() => {})
        setPresets((current) => {
          const next = { ...current }
          delete next[activeId]
          return next
        })
      }
      navigateTo(galleryUrl())
      setToast(`Deleted ${activeId}`)
    } catch (err) {
      setToast(`Delete failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [activeId, sources, savedSources, presets])

  // --- presets -------------------------------------------------------------

  /**
   * Writes one object's saved presets, rolling back on failure. Scoped per
   * object so two objects' presets can never clobber each other.
   */
  const commitPresets = useCallback(
    async (objectId: string, next: SavedItem[], done: string) => {
      if (!presetsWritable) {
        setToast('Presets are read-only without the studio API.')
        return
      }
      const previous = presets
      setPresets({ ...previous, [objectId]: next })
      try {
        await saveObjectPresets(objectId, next)
        setToast(done)
      } catch (err) {
        setPresets(previous)
        setToast(`Could not save presets: ${err instanceof Error ? err.message : String(err)}`)
      }
    },
    [presets, presetsWritable],
  )

  // --- render --------------------------------------------------------------

  const entry = activeId ? compiled.find((c) => c.id === activeId) : undefined

  // An id that isn't in the library — a stale link, or a delete from another
  // tab. Say so rather than silently bouncing to the gallery.
  const missing = route.kind === 'object' && !entry

  return (
    <>
      {route.kind === 'gallery' && (
        <Gallery
          entries={compiled}
          writable={writable}
          onOpen={(id) => navigateTo(objectUrl(id))}
          onCreate={(name) => void createObject(name)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      {route.kind === 'object' && missing && (
        <div className="gallery">
          <div className="gallery-inner">
            <header className="gallery-header">
              <div>
                <h1>No object called “{route.objectId}”</h1>
                <p>It may have been renamed or deleted. The library has {compiled.length} objects.</p>
              </div>
              <button type="button" className="primary" onClick={() => navigateTo(galleryUrl())}>
                Back to library
              </button>
            </header>
          </div>
        </div>
      )}

      {route.kind === 'object' && entry && (
        <Studio
          // Remounting per navigation keeps parameter state from leaking
          // across them, including Back, Forward and a pasted share link.
          key={`${entry.id}:${navSeq}`}
          objectId={entry.id}
          definition={entry.definition}
          compileError={entry.error}
          initialParams={route.params}
          initialPane={createdId === entry.id ? 'source' : 'viewer'}
          source={sources[entry.id] ?? ''}
          savedSource={savedSources[entry.id] ?? ''}
          builtinSource={builtinSources[entry.id]}
          writable={writable}
          saving={saving}
          canDelete={Object.keys(sources).length > 1}
          settings={settings}
          presets={presets[entry.id] ?? []}
          presetsWritable={presetsWritable}
          onSavePreset={(recipe, name) =>
            void commitPresets(
              entry.id,
              addPreset(presets[entry.id] ?? [], recipe, name),
              `Saved “${name}”`,
            )
          }
          onDeletePreset={(id) =>
            void commitPresets(entry.id, removePreset(presets[entry.id] ?? [], id), 'Preset deleted')
          }
          onImportPresets={(items) =>
            void commitPresets(
              entry.id,
              [...items, ...(presets[entry.id] ?? [])],
              `Imported ${items.length} preset${items.length === 1 ? '' : 's'}`,
            )
          }
          onOpenSettings={() => setSettingsOpen(true)}
          onSourceChange={updateSource}
          onSave={() => void saveSource()}
          onCreateObject={(name) => void createObject(name)}
          onDeleteObject={() => void deleteObject()}
          notify={setToast}
        />
      )}

      {settingsOpen && (
        <SettingsDialog
          settings={settings}
          onChange={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
