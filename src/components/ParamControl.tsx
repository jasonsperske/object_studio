import type { ParamSpec, ParamValue } from '../types'

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
        <select
          id={`p-${spec.id}`}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
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

  const numeric = Number(value)
  const commit = (raw: string) => {
    const next = Number(raw)
    if (Number.isNaN(next)) return
    const clamped = Math.min(spec.max, Math.max(spec.min, next))
    onChange(spec.type === 'int' ? Math.round(clamped) : clamped)
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
            value={Number.isFinite(numeric) ? numeric : spec.default}
            min={spec.min}
            max={spec.max}
            step={spec.step}
            onChange={(e) => commit(e.target.value)}
          />
          {spec.unit && <span className="unit">{spec.unit}</span>}
        </div>
      </div>
      <input
        className="slider"
        type="range"
        aria-label={spec.label}
        value={Number.isFinite(numeric) ? numeric : spec.default}
        min={spec.min}
        max={spec.max}
        step={spec.step}
        onChange={(e) => commit(e.target.value)}
      />
      {spec.help && <span className="param-help">{spec.help}</span>}
    </div>
  )
}
