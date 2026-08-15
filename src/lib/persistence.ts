import type { Params } from '../types'

/** A saved configuration: which object, and the parameters it was built with. */
export interface Recipe {
  objectId: string
  params: Params
  name?: string
  /** Bumped if the recipe format ever changes. */
  v?: number
}

export interface SavedItem extends Recipe {
  id: string
  name: string
  savedAt: number
}

/**
 * Presets belong to an object, not to the app: an object declares its own in
 * its source, and anything you save afterwards is kept per object in
 * presets.json on the server. Only display settings belong to the browser.
 */

/** Saved sets, keyed by object id. */
export type PresetStore = Record<string, SavedItem[]>

/** Where presets used to live. Read once, to carry them over. */
const LEGACY_KEY = 'object-studio.library.v1'

export interface LoadedPresets {
  presets: PresetStore
  /** False when the studio API isn't running; presets are then read-only. */
  writable: boolean
  /** Number of presets carried over from the old localStorage store. */
  migrated: number
}

function readLegacy(): SavedItem[] {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SavedItem[]) : []
  } catch {
    return []
  }
}

function groupByObject(items: SavedItem[]): PresetStore {
  const store: PresetStore = {}
  for (const item of items) (store[item.objectId] ??= []).push(item)
  return store
}

export async function loadPresets(): Promise<LoadedPresets> {
  let presets: PresetStore = {}
  try {
    const response = await fetch('/api/presets')
    if (!response.ok) throw new Error(String(response.status))
    const body = (await response.json()) as { presets?: PresetStore }
    presets = body.presets && typeof body.presets === 'object' ? body.presets : {}
  } catch {
    // No API — fall back to whatever the browser still holds, read-only.
    return { presets: groupByObject(readLegacy()), writable: false, migrated: 0 }
  }

  // One-time carry-over from before presets moved to the server.
  const legacy = readLegacy()
  const empty = Object.keys(presets).length === 0
  if (legacy.length && empty) {
    const grouped = groupByObject(legacy)
    try {
      for (const [objectId, items] of Object.entries(grouped)) {
        await saveObjectPresets(objectId, items)
      }
      localStorage.removeItem(LEGACY_KEY)
      return { presets: grouped, writable: true, migrated: legacy.length }
    } catch {
      return { presets: grouped, writable: true, migrated: 0 }
    }
  }
  if (legacy.length) localStorage.removeItem(LEGACY_KEY)

  return { presets, writable: true, migrated: 0 }
}

/** Replaces one object's saved presets; other objects are untouched. */
export async function saveObjectPresets(objectId: string, items: SavedItem[]): Promise<void> {
  const response = await fetch(`/api/presets/${encodeURIComponent(objectId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed (${response.status})`)
  }
}

// --- list operations (pure) -----------------------------------------------

export function addPreset(items: SavedItem[], recipe: Recipe, name: string): SavedItem[] {
  const item: SavedItem = {
    ...recipe,
    id: `${recipe.objectId}-${Date.now().toString(36)}`,
    name,
    savedAt: Date.now(),
  }
  return [item, ...items]
}

export function removePreset(items: SavedItem[], id: string): SavedItem[] {
  return items.filter((item) => item.id !== id)
}
