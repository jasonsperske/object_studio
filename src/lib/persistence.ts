import type { Params } from '../types'

/** A saved configuration: which object, and the parameters it was built with. */
export interface Recipe {
  objectId: string
  params: Params
  name?: string
  /** Bumped if the recipe format ever changes. */
  v?: number
}

const STORAGE_KEY = 'object-studio.library.v1'

// URL encoding lives in lib/router.ts — this module is only about presets.

// --- Local library --------------------------------------------------------

export interface SavedItem extends Recipe {
  id: string
  name: string
  savedAt: number
}

export function loadLibrary(): SavedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SavedItem[]) : []
  } catch {
    return []
  }
}

function persist(items: SavedItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Quota or private-mode failures shouldn't break the editor.
  }
}

export function saveToLibrary(recipe: Recipe, name: string): SavedItem[] {
  const items = loadLibrary()
  const item: SavedItem = {
    ...recipe,
    id: `${recipe.objectId}-${Date.now().toString(36)}`,
    name,
    savedAt: Date.now(),
  }
  const next = [item, ...items]
  persist(next)
  return next
}

export function deleteFromLibrary(id: string): SavedItem[] {
  const next = loadLibrary().filter((item) => item.id !== id)
  persist(next)
  return next
}

export function replaceLibrary(items: SavedItem[]): SavedItem[] {
  persist(items)
  return items
}
