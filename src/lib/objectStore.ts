/**
 * Loads and persists object sources.
 *
 * The files in /objects are bundled as raw text so the studio still works as a
 * static build with no server. When the dev/preview API is reachable it takes
 * over as the source of truth and edits can be saved back to disk.
 *
 * Without it — a static deploy — edits are kept in localStorage instead, so a
 * reload does not throw your work away. That store is only ever consulted in
 * that case: with the API running, disk is the truth and a stale local edit
 * would silently shadow a file someone had changed underneath it.
 */

/** Where the API lives, relative to wherever the app is deployed. */
const API = `${import.meta.env.BASE_URL.replace(/\/+$/, '')}/api`

/** Edits made with no API to save them to, keyed by object id. */
const LOCAL_EDITS = 'object-studio.sources.v1'

function readLocalEdits(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LOCAL_EDITS)
    const parsed = raw ? (JSON.parse(raw) as unknown) : null
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([, value]) => typeof value === 'string',
      ),
    ) as Record<string, string>
  } catch {
    return {}
  }
}

function writeLocalEdits(edits: Record<string, string>): void {
  try {
    if (Object.keys(edits).length === 0) localStorage.removeItem(LOCAL_EDITS)
    else localStorage.setItem(LOCAL_EDITS, JSON.stringify(edits))
  } catch {
    // A full or blocked store is not worth breaking the editor over.
  }
}

/** Remembers an edit made without the API. Matching the built-in forgets it. */
export function storeLocalEdit(id: string, source: string): void {
  const edits = readLocalEdits()
  if (source === builtinSources[id]) delete edits[id]
  else edits[id] = source
  writeLocalEdits(edits)
}

/** Forgets a locally stored edit, leaving whatever the build shipped. */
export function forgetLocalEdit(id: string): void {
  const edits = readLocalEdits()
  delete edits[id]
  writeLocalEdits(edits)
}

const BUILTIN_SOURCES = import.meta.glob('../../objects/*.js', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function idFromPath(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.js$/, '')
}

export const builtinSources: Record<string, string> = Object.fromEntries(
  Object.entries(BUILTIN_SOURCES).map(([path, source]) => [idFromPath(path), source]),
)

export interface LoadedLibrary {
  sources: Record<string, string>
  /** True when the object API answered, meaning edits can be saved to disk. */
  writable: boolean
  /** Ids restored from localStorage, which only happens when read-only. */
  restored: string[]
}

/** The bundled library with any local edits laid over it. */
function withLocalEdits(): LoadedLibrary {
  const edits = readLocalEdits()
  const sources = { ...builtinSources }
  const restored: string[] = []
  for (const [id, source] of Object.entries(edits)) {
    sources[id] = source
    restored.push(id)
  }
  return { sources, writable: false, restored }
}

export async function loadObjectSources(): Promise<LoadedLibrary> {
  try {
    const response = await fetch(`${API}/objects`)
    if (!response.ok) throw new Error(String(response.status))
    const body = (await response.json()) as {
      writable?: boolean
      objects?: { id: string; source: string }[]
    }
    const objects = body.objects ?? []
    if (!objects.length) return withLocalEdits()
    return {
      sources: Object.fromEntries(objects.map((o) => [o.id, o.source])),
      writable: Boolean(body.writable),
      restored: [],
    }
  } catch {
    // Static hosting, or the plugin isn't running. Read-only is still useful,
    // and anything edited here before is still where it was left.
    return withLocalEdits()
  }
}

async function request(id: string, init: RequestInit): Promise<void> {
  const response = await fetch(`${API}/objects/${encodeURIComponent(id)}`, init)
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed (${response.status})`)
  }
}

export function saveObjectSource(id: string, source: string): Promise<void> {
  return request(id, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    body: source,
  })
}

export function deleteObjectSource(id: string): Promise<void> {
  return request(id, { method: 'DELETE' })
}

/** Turns a display name into a usable file id. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}
