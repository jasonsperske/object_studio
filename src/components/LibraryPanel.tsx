import { useRef, useState } from 'react'
import type { SavedItem } from '../lib/persistence'

interface Props {
  items: SavedItem[]
  suggestedName: string
  /** Resolves an object id to its display name, for the saved-item subtitles. */
  objectName: (id: string) => string
  onSave: (name: string) => void
  onLoad: (item: SavedItem) => void
  onDelete: (id: string) => void
  onImport: (items: SavedItem[]) => void
  onExportAll: () => void
}

export default function LibraryPanel({
  items,
  suggestedName,
  objectName,
  onSave,
  onLoad,
  onDelete,
  onImport,
  onExportAll,
}: Props) {
  const [name, setName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    try {
      const parsed = JSON.parse(await file.text())
      const list = Array.isArray(parsed) ? parsed : [parsed]
      const valid = list.filter(
        (item) => item && typeof item.objectId === 'string' && typeof item.params === 'object',
      )
      if (!valid.length) throw new Error('No saved objects found in that file.')
      onImport(
        valid.map((item, index) => ({
          ...item,
          id: item.id ?? `${item.objectId}-import-${index}`,
          name: item.name ?? objectName(item.objectId),
          savedAt: item.savedAt ?? Date.now(),
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="library">
      <div className="field">
        <span className="field-label">Save current object</span>
        <div className="button-row">
          <input
            value={name}
            placeholder={suggestedName}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSave(name.trim() || suggestedName)
                setName('')
              }
            }}
          />
          <button
            type="button"
            className="primary"
            onClick={() => {
              onSave(name.trim() || suggestedName)
              setName('')
            }}
          >
            Save
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="empty">
          Nothing saved yet. Dial in an object, give it a name, and it will be stored in this
          browser.
        </p>
      ) : (
        <ul className="saved-list">
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className="saved-load" onClick={() => onLoad(item)}>
                <span className="saved-name">{item.name}</span>
                <span className="saved-meta">
                  {objectName(item.objectId)} · {new Date(item.savedAt).toLocaleDateString()}
                </span>
              </button>
              <button
                type="button"
                className="icon danger"
                aria-label={`Delete ${item.name}`}
                title="Delete"
                onClick={() => onDelete(item.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="button-row">
        <button type="button" className="ghost" onClick={() => fileRef.current?.click()}>
          Import JSON
        </button>
        <button type="button" className="ghost" onClick={onExportAll} disabled={!items.length}>
          Export library
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />
      {error && <p className="error">{error}</p>}
    </div>
  )
}
