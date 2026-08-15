import { useState } from 'react'
import type { ExportFormat, Unit } from '../lib/exporters'
import { FORMATS, UNIT_SCALE } from '../lib/exporters'

interface Props {
  defaultName: string
  onExport: (format: ExportFormat, unit: Unit, filename: string) => Promise<void>
  onCopyLink: () => void
  onSnapshot: () => void
  triangles: number
}

const UNITS = Object.keys(UNIT_SCALE) as Unit[]

export default function ExportPanel({
  defaultName,
  onExport,
  onCopyLink,
  onSnapshot,
  triangles,
}: Props) {
  const [format, setFormat] = useState<ExportFormat>('stl')
  const [unit, setUnit] = useState<Unit>('mm')
  const [name, setName] = useState(defaultName)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selected = FORMATS.find((f) => f.id === format)!
  const filename = (name.trim() || defaultName).replace(/[^\w.-]+/g, '-')

  const run = async () => {
    setBusy(true)
    setError(null)
    try {
      await onExport(format, unit, filename)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="export-panel">
      <label className="field">
        <span className="field-label">File name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={defaultName} />
      </label>

      <div className="field">
        <span className="field-label">Format</span>
        <div className="format-list">
          {FORMATS.map((option) => (
            <label key={option.id} className={format === option.id ? 'format selected' : 'format'}>
              <input
                type="radio"
                name="format"
                value={option.id}
                checked={format === option.id}
                onChange={() => setFormat(option.id)}
              />
              <span className="format-name">{option.label}</span>
              <span className="format-ext">.{option.ext}</span>
            </label>
          ))}
        </div>
        <p className="param-help">{selected.note}</p>
      </div>

      <label className="field">
        <span className="field-label">Units</span>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as Unit)}
          disabled={format === 'json'}
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u === 'in' ? 'inches' : u}
            </option>
          ))}
        </select>
        <span className="param-help">
          {format === 'json'
            ? 'Parameter files always store millimetres.'
            : 'Models are authored in millimetres and scaled on export.'}
        </span>
      </label>

      <button type="button" className="primary full" onClick={run} disabled={busy}>
        {busy ? 'Exporting…' : `Download ${selected.label}`}
      </button>
      {error && <p className="error">{error}</p>}

      <div className="button-row">
        <button type="button" className="ghost" onClick={onCopyLink}>
          Copy share link
        </button>
        <button type="button" className="ghost" onClick={onSnapshot}>
          Save PNG view
        </button>
      </div>

      <p className="param-help">
        Mesh contains {triangles.toLocaleString()} triangles. Curved profiles are tessellated, so
        raise the profile size for smoother nosings.
      </p>
    </div>
  )
}
