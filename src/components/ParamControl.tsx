import { useRef, useState } from 'react'
import type { NumberParam, ParamSpec, ParamValue } from '../types'

interface Props {
  spec: ParamSpec
  value: ParamValue
  onChange: (value: ParamValue) => void
}

export default function ParamControl({ spec, value, onChange }: Props) {
  if (spec.type === 'boolean') {
    return (
      <label className="param param-boolean">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="switch" aria-hidden />
        <span className="param-label">{spec.label}</span>
        {spec.help && <span className="param-help">{spec.help}</span>}
      </label>
    )
  }

  if (spec.type === 'select') {
    return (
      <div className="param">
        <label className="param-label" htmlFor={`p-${spec.id}`}>
          {spec.label}
        </label>
        <select id={`p-${spec.id}`} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {spec.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {spec.help && <span className="param-help">{spec.help}</span>}
      </div>
    )
  }

  // A separate component so its state hook is never reached conditionally —
  // editing a source can change a parameter's type under a stable id.
  return <NumberControl spec={spec} value={value} onChange={onChange} />
}

function NumberControl({
  spec,
  value,
  onChange,
}: {
  spec: NumberParam
  value: ParamValue
  onChange: (value: ParamValue) => void
}) {
  const numeric = Number(value)
  const settled = Number.isFinite(numeric) ? numeric : spec.default
  const round = (n: number) => (spec.type === 'int' ? Math.round(n) : n)

  /**
   * While the field has focus its text is held here, so a half-typed number is
   * never rewritten underneath the caret. Clearing it hands display back to the
   * committed value.
   */
  const [draft, setDraft] = useState<string | null>(null)
  // What the value was when editing began. Typing commits live, so this is the
  // only record of the pre-edit value for Escape to restore.
  const valueOnFocus = useRef(settled)

  // Typing reports the value as-is — out of range is allowed mid-edit, because
  // clamping each keystroke turns "12" into 22 in a field whose minimum is 2.
  const handleType = (raw: string) => {
    setDraft(raw)
    const parsed = Number(raw)
    if (raw.trim() === '' || !Number.isFinite(parsed)) return
    onChange(round(parsed))
  }

  // Leaving the field is what settles it: clamp, round, and drop the draft. An
  // empty or unparseable field falls back to the last committed value.
  const handleBlur = () => {
    const parsed = Number(draft ?? '')
    const base = draft !== null && draft.trim() !== '' && Number.isFinite(parsed) ? parsed : settled
    onChange(round(Math.min(spec.max, Math.max(spec.min, base))))
    setDraft(null)
  }

  const fromSlider = (raw: string) => {
    setDraft(null)
    onChange(round(Number(raw)))
  }

  return (
    <div className="param">
      <div className="param-row">
        <label className="param-label" htmlFor={`p-${spec.id}`}>
          {spec.label}
        </label>
        <div className="param-value">
          <input
            id={`p-${spec.id}`}
            type="number"
            value={draft ?? settled}
            min={spec.min}
            max={spec.max}
            step={spec.step}
            onChange={(e) => handleType(e.target.value)}
            onFocus={() => {
              valueOnFocus.current = settled
            }}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
              if (e.key === 'Escape') {
                // Stay focused: the subsequent blur then settles the restored
                // value rather than re-committing what was abandoned.
                setDraft(null)
                onChange(valueOnFocus.current)
              }
            }}
          />
          {spec.unit && <span className="unit">{spec.unit}</span>}
        </div>
      </div>
      <input
        className="slider"
        type="range"
        aria-label={spec.label}
        value={Math.min(spec.max, Math.max(spec.min, settled))}
        min={spec.min}
        max={spec.max}
        step={spec.step}
        onChange={(e) => fromSlider(e.target.value)}
      />
      {spec.help && <span className="param-help">{spec.help}</span>}
    </div>
  )
}
