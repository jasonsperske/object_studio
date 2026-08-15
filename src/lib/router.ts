import type { Params } from '../types'

/**
 * URL scheme
 *
 *   /                       gallery of every object in the library
 *   /{objectId}             that object with its default properties
 *   /{objectId}/#m={hash}   that object with saved properties
 *
 * Properties live in the hash so that editing them never touches the server or
 * the history stack — only navigating between objects pushes an entry.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '')

export type Route = { kind: 'gallery' } | { kind: 'object'; objectId: string; params: Params | null }

// --- base64url ------------------------------------------------------------

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

interface HashPayload {
  /** Only present in v1 links, which carried the object id in the hash. */
  objectId?: string
  params: Params
}

function decodeHash(hash: string): HashPayload | null {
  const raw = hash.replace(/^#/, '')
  if (!raw.startsWith('m=')) return null
  try {
    const parsed = JSON.parse(fromBase64Url(raw.slice(2))) as {
      objectId?: unknown
      params?: unknown
    }
    if (!parsed?.params || typeof parsed.params !== 'object') return null
    return {
      objectId: typeof parsed.objectId === 'string' ? parsed.objectId : undefined,
      params: parsed.params as Params,
    }
  } catch {
    return null
  }
}

export function encodeParams(params: Params): string {
  return toBase64Url(JSON.stringify({ v: 2, params }))
}

// --- parsing --------------------------------------------------------------

export function parseLocation(): Route {
  let path = window.location.pathname
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length)
  const segment = path.replace(/^\/+|\/+$/g, '').split('/')[0]
  const hash = decodeHash(window.location.hash)

  if (!segment) {
    // A v1 link — /#m={objectId + params} — still resolves to its object.
    if (hash?.objectId) return { kind: 'object', objectId: hash.objectId, params: hash.params }
    return { kind: 'gallery' }
  }
  return { kind: 'object', objectId: decodeURIComponent(segment), params: hash?.params ?? null }
}

// --- building -------------------------------------------------------------

export function galleryUrl(): string {
  return `${BASE}/`
}

/**
 * `/{objectId}` for defaults, `/{objectId}/#m=…` once properties are attached.
 * Both spellings parse, so the trailing slash is cosmetic.
 */
export function objectUrl(objectId: string, params?: Params | null): string {
  const path = `${BASE}/${encodeURIComponent(objectId)}`
  return params ? `${path}/#m=${encodeParams(params)}` : path
}

/** Adds a history entry — used when moving between objects. */
export function navigateTo(url: string) {
  if (url === window.location.pathname + window.location.hash) return
  window.history.pushState(null, '', url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/** Rewrites the current entry — used when properties change. */
export function replaceUrl(url: string) {
  if (url === window.location.pathname + window.location.hash) return
  window.history.replaceState(null, '', url)
}
