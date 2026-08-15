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
 * Presets live on the server in presets.json, alongside the object library —
 * only display settings belong to the browser. The whole list is read and
 * written as one document, because every operation (save, delete, import) is a
 * change to the list rather than to one entry.
 */

/** Where presets used to live. Read once, to carry them over. */
const LEGACY_KEY = 'object-studio.library.v1'

export interface LoadedPresets {
  presets: SavedItem[]
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

export async function loadPresets(): Promise<LoadedPresets> {
  let presets: SavedItem[] = []
  try {
    const response = await fetch('/api/presets')
    if (!response.ok) throw new Error(String(response.status))
    const body = (await response.json()) as { presets?: SavedItem[] }
    presets = Array.isArray(body.presets) ? body.presets : []
  } catch {
    // No API — fall back to whatever the browser still holds, read-only.
    return { presets: readLegacy(), writable: false, migrated: 0 }
  }

  // One-time carry-over: anything saved before presets moved to the server.
  const legacy = readLegacy()
  if (legacy.length && !presets.length) {
    try {
      await savePresets(legacy)
      localStorage.removeItem(LEGACY_KEY)
      return { presets: legacy, writable: true, migrated: legacy.length }
    } catch {
      return { presets: legacy, writable: true, migrated: 0 }
    }
  }
  if (legacy.length) localStorage.removeItem(LEGACY_KEY)

  return { presets, writable: true, migrated: 0 }
}

export async function savePresets(items: SavedItem[]): Promise<void> {
  const response = await fetch('/api/presets', {
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
