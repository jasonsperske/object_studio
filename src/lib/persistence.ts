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

// --- URL sharing ----------------------------------------------------------

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function encodeRecipe(recipe: Recipe): string {
  return toBase64Url(JSON.stringify({ ...recipe, v: 1 }))
}

export function decodeRecipe(encoded: string): Recipe | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as Recipe
    if (typeof parsed?.objectId !== 'string' || typeof parsed?.params !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

/** Reads the recipe encoded in the current location hash, if any. */
export function recipeFromLocation(): Recipe | null {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash.startsWith('m=')) return null
  return decodeRecipe(hash.slice(2))
}

export function writeRecipeToLocation(recipe: Recipe) {
  const next = `#m=${encodeRecipe(recipe)}`
  if (next !== window.location.hash) {
    window.history.replaceState(null, '', next)
  }
}

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
