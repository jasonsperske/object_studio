import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { useEffect, useRef } from 'react'

interface Props {
  /** Identifies the document; changing it reloads the editor contents. */
  documentKey: string
  value: string
  onChange: (value: string) => void
  onSave: () => void
}

const theme = EditorView.theme({
  '&': { height: '100%', fontSize: '12.5px', backgroundColor: 'transparent' },
  '.cm-scroller': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    lineHeight: '1.55',
  },
  '.cm-gutters': { backgroundColor: 'transparent', borderRight: '1px solid #262e3a' },
  '&.cm-focused': { outline: 'none' },
})

/** CodeMirror wrapper. The view is created once per document and driven imperatively. */
export default function SourceEditor({ documentKey, value, onChange, onSave }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  // Held in refs so the editor never needs recreating when a handler changes.
  const onChangeRef = useRef(onChange)
  const onSaveRef = useRef(onSave)
  onChangeRef.current = onChange
  onSaveRef.current = onSave

  useEffect(() => {
    if (!hostRef.current) return
    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          javascript(),
          oneDark,
          theme,
          keymap.of([
            {
              key: 'Mod-s',
              preventDefault: true,
              run: () => {
                onSaveRef.current()
                return true
              },
            },
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current(update.state.doc.toString())
          }),
        ],
      }),
    })
    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
    // Recreated only when the edited document changes, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentKey])

  // Reflect changes made outside the editor (revert, reset to built-in).
  useEffect(() => {
    const view = viewRef.current
    if (!view || view.state.doc.toString() === value) return
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
  }, [value])

  return <div className="source-editor" ref={hostRef} />
}
