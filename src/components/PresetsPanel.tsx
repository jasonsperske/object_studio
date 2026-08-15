import { useRef, useState } from 'react'
import type { SavedItem } from '../lib/persistence'
import type { ObjectPreset, Params } from '../types'

interface Props {
  objectId: string
  /** Declared in the object's own source — read-only here. */
  builtIn: ObjectPreset[]
  /** Saved for this object, on the server. */
  saved: SavedItem[]
  writable: boolean
  suggestedName: string
  onApply: (params: Params) => void
  onSave: (name: string) => void
  onDelete: (id: string) => void
  onImport: (items: SavedItem[]) => void
  onExportAll: () => void
}

/**
 * Presets belong to the object on screen, so this only ever shows one object's.
 * Saving a set of properties never touches the definition; it is kept apart
 * from the source deliberately.
 */
export default function PresetsPanel({
  objectId,
  builtIn,
  saved,
  writable,
  suggestedName,
  onApply,
  onSave,
  onDelete,
  onImport,
  onExportAll,
}: Props) {
  const [name, setName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const commit = () => {
    onSave(name.trim() || suggestedName)
    setName('')
  }

  const handleFile = async (file: File) => {
    setError(null)
    try {
      const parsed = JSON.parse(await file.text())
      const list = Array.isArray(parsed) ? parsed : [parsed]
      const valid = list.filter((item) => item && typeof item.params === 'object')
      if (!valid.length) throw new Error('No presets found in that file.')
      onImport(
        valid.map((item, index) => ({
          ...item,
          objectId,
          id: item.id ?? `${objectId}-import-${index}`,
          name: item.name ?? `Imported ${index + 1}`,
          savedAt: item.savedAt ?? Date.now(),
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="library">
      {builtIn.length > 0 && (
        <section className="preset-group">
          <h3>In this definition</h3>
          <ul className="saved-list">
            {builtIn.map((preset) => (
              <li key={preset.name}>
                <button type="button" className="saved-load" onClick={() => onApply(preset.params)}>
                  <span className="saved-name">{preset.name}</span>
                  <span className="saved-meta">
                    {Object.keys(preset.params).length} properties set
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="param-help">
            Declared in <code>objects/{objectId}.js</code>. Edit them in the source editor.
          </p>
        </section>
      )}

      <section className="preset-group">
        <h3>Saved</h3>
        <div className="button-row">
          <input
            value={name}
            placeholder={suggestedName}
            disabled={!writable}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
            }}
          />
          <button type="button" className="primary" onClick={commit} disabled={!writable}>
            Save properties
          </button>
        </div>
        <p className="param-help">
          Stores the properties you have set now. It does not change the object’s definition.
        </p>

        {saved.length === 0 ? (
          <p className="empty">Nothing saved for this object yet.</p>
        ) : (
          <ul className="saved-list">
            {saved.map((item) => (
              <li key={item.id}>
                <button type="button" className="saved-load" onClick={() => onApply(item.params)}>
                  <span className="saved-name">{item.name}</span>
                  <span className="saved-meta">{new Date(item.savedAt).toLocaleDateString()}</span>
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
          <button type="button" className="ghost" onClick={() => fileRef.current?.click()} disabled={!writable}>
            Import JSON
          </button>
          <button type="button" className="ghost" onClick={onExportAll} disabled={!saved.length}>
            Export saved
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
      </section>
    </div>
  )
}
