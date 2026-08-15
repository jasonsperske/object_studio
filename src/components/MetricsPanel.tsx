import type { Metric } from '../types'

interface Props {
  metrics: Metric[]
  triangles: number
  size: { x: number; y: number; z: number }
}

const mm = (value: number) => `${value.toFixed(0)} mm`

export default function MetricsPanel({ metrics, triangles, size }: Props) {
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
