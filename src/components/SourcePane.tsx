import { useEffect, useState } from 'react'
import SourceEditor from './SourceEditor'

interface Props {
  objectId: string
  source: string
  dirty: boolean
  writable: boolean
  /** Present when the current source failed to compile. */
  error: string | null
  saving: boolean
  hasBuiltin: boolean
  canDelete: boolean
  onChange: (source: string) => void
  onSave: () => void
  onRevert: () => void
  onResetBuiltin: () => void
  onNew: (name: string) => void
  onDelete: () => void
}

export default function SourcePane({
  objectId,
  source,
  dirty,
  writable,
  error,
  saving,
  hasBuiltin,
  canDelete,
  onChange,
  onSave,
  onRevert,
  onResetBuiltin,
  onNew,
  onDelete,
}: Props) {
  const [newName, setNewName] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Never carry a half-finished create or a primed delete across objects.
  useEffect(() => {
    setNewName(null)
    setConfirmingDelete(false)
  }, [objectId])

  if (newName !== null) {
    return (
      <div className="source-pane">
        <div className="source-toolbar">
          <span className="source-file">New object type</span>
          <input
            autoFocus
            value={newName}
            placeholder="Name, e.g. Winder staircase"
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newName.trim()) onNew(newName.trim())
              if (e.key === 'Escape') setNewName(null)
            }}
          />
          <button
            type="button"
            className="primary"
            disabled={!newName.trim()}
            onClick={() => onNew(newName.trim())}
          >
            Create
          </button>
          <button type="button" className="ghost" onClick={() => setNewName(null)}>
            Cancel
          </button>
        </div>
        <SourceEditor documentKey={objectId} value={source} onChange={onChange} onSave={onSave} />
        <div className="source-status ok">Naming a new object type…</div>
      </div>
    )
  }

  return (
    <div className="source-pane">
      <div className="source-toolbar">
        <span className="source-file">
          objects/{objectId}.js
          {dirty && <span className="dot" title="Unsaved changes" />}
        </span>

        <div className="control-group">
          <button type="button" onClick={() => setNewName('')} title="Create a new object type">
            New
          </button>
          {confirmingDelete ? (
            <>
              <button type="button" className="danger-text" onClick={onDelete}>
                Delete {objectId}?
              </button>
              <button type="button" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={!canDelete}
              title={canDelete ? 'Delete this object type' : 'The library needs at least one object'}
            >
              Delete
            </button>
          )}
        </div>

        <div className="control-group">
          <button type="button" onClick={onRevert} disabled={!dirty} title="Discard unsaved edits">
            Revert
          </button>
          <button
            type="button"
            onClick={onResetBuiltin}
            disabled={!hasBuiltin}
            title="Replace with the version this project shipped with"
          >
            Reset to built-in
          </button>
        </div>

        <button
          type="button"
          className="primary"
          onClick={onSave}
          disabled={!writable || !dirty || saving}
          title={writable ? 'Save to objects/ on the server (⌘S / Ctrl-S)' : undefined}
        >
          {saving ? 'Saving…' : dirty ? 'Save' : 'Saved'}
        </button>
      </div>

      {!writable && (
        <p className="source-note">
          Running without the object API, so edits stay in this tab only. Start the app with{' '}
          <code>npm run dev</code> to save changes back to <code>objects/</code>.
        </p>
      )}

      <SourceEditor documentKey={objectId} value={source} onChange={onChange} onSave={onSave} />

      <div className={error ? 'source-status error' : 'source-status ok'}>
        {error ?? 'Compiles cleanly — switch to the viewer to see it evaluated.'}
      </div>
    </div>
  )
}
