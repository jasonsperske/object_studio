import { useEffect, useMemo, useState } from 'react'
import { renderThumbnails } from '../lib/thumbnails'
import type { ObjectDefinition } from '../types'
import { defaultParams } from '../types'

export interface GalleryEntry {
  id: string
  definition: ObjectDefinition | null
  error: string | null
}

interface Props {
  entries: GalleryEntry[]
  writable: boolean
  onOpen: (objectId: string) => void
  onCreate: (name: string) => void
}

export default function Gallery({ entries, writable, onOpen, onCreate }: Props) {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})
  const [newName, setNewName] = useState<string | null>(null)

  // Rebuild previews whenever the library changes. Each object is built at its
  // defaults purely for the picture, then thrown away.
  const signature = useMemo(
    () => entries.map((e) => `${e.id}:${e.definition ? 'ok' : 'err'}`).join('|'),
    [entries],
  )

  useEffect(() => {
    const requests = []
    for (const entry of entries) {
      if (!entry.definition) continue
      try {
        requests.push({ id: entry.id, parts: entry.definition.build(defaultParams(entry.definition)) })
      } catch {
        // A build that throws simply has no preview; the card still renders.
      }
    }
    setThumbnails(renderThumbnails(requests))
    // `signature` stands in for the entry list so preview work is not redone on
    // every unrelated re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  return (
    <div className="gallery">
      <div className="gallery-inner">
        <header className="gallery-header">
          <div>
            <h1>Object library</h1>
            <p>
              {entries.length} parametric {entries.length === 1 ? 'object' : 'objects'}. Open one to
              set its properties, edit its source, and export a mesh.
            </p>
          </div>

          {newName === null ? (
            <button type="button" className="primary" onClick={() => setNewName('')}>
              New object
            </button>
          ) : (
            <div className="button-row gallery-new">
              <input
                autoFocus
                value={newName}
                placeholder="Name, e.g. Winder staircase"
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newName.trim()) onCreate(newName.trim())
                  if (e.key === 'Escape') setNewName(null)
                }}
              />
              <button
                type="button"
                className="primary"
                disabled={!newName.trim()}
                onClick={() => onCreate(newName.trim())}
              >
                Create
              </button>
              <button type="button" className="ghost" onClick={() => setNewName(null)}>
                Cancel
              </button>
            </div>
          )}
        </header>

        {!writable && (
          <p className="source-note">
            Running without the object API. Objects are read-only — start the app with{' '}
            <code>npm run dev</code> to save edits back to <code>objects/</code>.
          </p>
        )}

        <ul className="gallery-grid">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button type="button" className="card" onClick={() => onOpen(entry.id)}>
                <span className="card-preview">
                  {thumbnails[entry.id] ? (
                    <img src={thumbnails[entry.id]} alt="" loading="lazy" />
                  ) : (
                    <span className="card-placeholder">{entry.error ? '!' : '…'}</span>
                  )}
                </span>
                <span className="card-body">
                  <span className="card-name">{entry.definition?.name ?? entry.id}</span>
                  <span className="card-description">
                    {entry.error ?? entry.definition?.description ?? ''}
                  </span>
                  <span className="card-meta">
                    {entry.error
                      ? 'Source error — open to fix'
                      : `${entry.definition?.params.length ?? 0} properties · objects/${entry.id}.js`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
