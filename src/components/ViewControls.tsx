import type { DisplayOptions, Projection, ViewName } from '../lib/studioScene'

interface Props {
  projection: Projection
  onProjection: (projection: Projection) => void
  display: DisplayOptions
  onDisplay: (display: DisplayOptions) => void
  onView: (view: ViewName) => void
  onFit: () => void
}

const VIEW_BUTTONS: { id: ViewName; label: string; title: string }[] = [
  { id: 'front', label: 'Front', title: 'Front elevation (looking along −Z)' },
  { id: 'back', label: 'Back', title: 'Back elevation' },
  { id: 'left', label: 'Left', title: 'Left elevation' },
  { id: 'right', label: 'Right', title: 'Right elevation' },
  { id: 'top', label: 'Top', title: 'Plan view' },
  { id: 'bottom', label: 'Bottom', title: 'Reflected plan' },
  { id: 'iso', label: 'Iso', title: 'Isometric three-quarter view' },
]

const TOGGLES: { key: keyof DisplayOptions; label: string }[] = [
  { key: 'grid', label: 'Grid' },
  { key: 'edges', label: 'Edges' },
  { key: 'wireframe', label: 'Wireframe' },
  { key: 'shadows', label: 'Shadows' },
]

export default function ViewControls({
  projection,
  onProjection,
  display,
  onDisplay,
  onView,
  onFit,
}: Props) {
  return (
    <div className="view-controls">
      <div className="control-group" role="group" aria-label="Standard views">
        {VIEW_BUTTONS.map((view) => (
          <button key={view.id} type="button" title={view.title} onClick={() => onView(view.id)}>
            {view.label}
          </button>
        ))}
        <button type="button" title="Zoom to fit" onClick={onFit}>
          Fit
        </button>
      </div>

      <div className="control-group" role="group" aria-label="Projection">
        <button
          type="button"
          className={projection === 'perspective' ? 'active' : ''}
          onClick={() => onProjection('perspective')}
          title="Perspective camera"
        >
          Perspective
        </button>
        <button
          type="button"
          className={projection === 'orthographic' ? 'active' : ''}
          onClick={() => onProjection('orthographic')}
          title="Orthographic camera — parallel projection, true to scale"
        >
          Orthographic
        </button>
      </div>

      <div className="control-group" role="group" aria-label="Display options">
        {TOGGLES.map((toggle) => (
          <button
            key={toggle.key}
            type="button"
            className={display[toggle.key] ? 'active' : ''}
            onClick={() => onDisplay({ ...display, [toggle.key]: !display[toggle.key] })}
          >
            {toggle.label}
          </button>
        ))}
      </div>
    </div>
  )
}
