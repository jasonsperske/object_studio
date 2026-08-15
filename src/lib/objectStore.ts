/**
 * Loads and persists object sources.
 *
 * The files in /objects are bundled as raw text so the studio still works as a
 * static build with no server. When the dev/preview API is reachable it takes
 * over as the source of truth and edits can be saved back to disk.
 */

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
}

export async function loadObjectSources(): Promise<LoadedLibrary> {
  try {
    const response = await fetch('/api/objects')
    if (!response.ok) throw new Error(String(response.status))
    const body = (await response.json()) as {
      writable?: boolean
      objects?: { id: string; source: string }[]
    }
    const objects = body.objects ?? []
    if (!objects.length) return { sources: { ...builtinSources }, writable: false }
    return {
      sources: Object.fromEntries(objects.map((o) => [o.id, o.source])),
      writable: Boolean(body.writable),
    }
  } catch {
    // Static hosting, or the plugin isn't running. Read-only is still useful.
    return { sources: { ...builtinSources }, writable: false }
  }
}

async function request(id: string, init: RequestInit): Promise<void> {
  const response = await fetch(`/api/objects/${encodeURIComponent(id)}`, init)
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
