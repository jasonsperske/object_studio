import type { Settings } from '../lib/settings'
import { formatLength } from '../lib/units'
import type { Metric } from '../types'

interface Props {
  metrics: Metric[]
  triangles: number
  size: { x: number; y: number; z: number }
  settings: Settings
}

export default function MetricsPanel({ metrics, triangles, size, settings }: Props) {
  const mm = (value: number) => formatLength(value, settings.unit, settings.fraction)

  return (
    <div className="metrics">
      <div className="metric">
        <span className="metric-label">Bounding box</span>
        <span className="metric-value">
          {mm(size.x)} × {mm(size.y)} × {mm(size.z)}
        </span>
      </div>
      <div className="metric">
        <span className="metric-label">Triangles</span>
        <span className="metric-value">{triangles.toLocaleString()}</span>
      </div>

      {metrics.map((metric) => (
        <div key={metric.label} className={`metric level-${metric.level ?? 'ok'}`}>
          <span className="metric-label">{metric.label}</span>
          <span className="metric-value">{metric.value}</span>
          {metric.note && <span className="metric-note">{metric.note}</span>}
        </div>
      ))}
    </div>
  )
}
