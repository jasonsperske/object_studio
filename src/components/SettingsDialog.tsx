import { useEffect } from 'react'
import type { Settings } from '../lib/settings'
import { THEMES } from '../lib/settings'
import type { UnitSystem } from '../lib/units'
import { FRACTIONS, defaultUnitFor, formatLength, unitsFor } from '../lib/units'

interface Props {
  settings: Settings
  onChange: (settings: Settings) => void
  onClose: () => void
}

const SYSTEMS: { id: UnitSystem; label: string; hint: string }[] = [
  { id: 'metric', label: 'Metric', hint: 'Millimetres, centimetres or metres.' },
  { id: 'imperial', label: 'Imperial', hint: 'Decimal inches or feet.' },
  { id: 'carpentry', label: 'Carpentry', hint: 'Feet, inches and fractions.' },
]

/** A stair rise, shown in whatever the current selection produces. */
const SAMPLE_MM = 2700

export default function SettingsDialog({ settings, onChange, onClose }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const units = unitsFor(settings.system)

  const pickSystem = (system: UnitSystem) => {
    onChange({ ...settings, system, unit: defaultUnitFor(system) })
  }

  return (
    <div className="modal-backdrop" onPointerDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="modal-title">
          <span>Settings</span>
          <button type="button" className="icon" aria-label="Close settings" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <section className="setting">
            <h3>Units</h3>
            <div className="control-group wide" role="group" aria-label="Unit system">
              {SYSTEMS.map((system) => (
                <button
                  key={system.id}
                  type="button"
                  className={settings.system === system.id ? 'active' : ''}
                  onClick={() => pickSystem(system.id)}
                >
                  {system.label}
                </button>
              ))}
            </div>
            <p className="param-help">
              {SYSTEMS.find((s) => s.id === settings.system)?.hint}
            </p>

            <label className="field">
              <span className="field-label">Scale</span>
              <select
                value={settings.unit}
                onChange={(e) =>
                  onChange({ ...settings, unit: e.target.value as Settings['unit'] })
                }
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </label>

            {settings.system === 'carpentry' && (
              <label className="field">
                <span className="field-label">Round to</span>
                <select
                  value={settings.fraction}
                  onChange={(e) => onChange({ ...settings, fraction: Number(e.target.value) })}
                >
                  {FRACTIONS.map((denominator) => (
                    <option key={denominator} value={denominator}>
                      1/{denominator}"
                    </option>
                  ))}
                </select>
              </label>
            )}

            <p className="setting-sample">
              A 2700 mm floor-to-floor rise reads{' '}
              <strong>{formatLength(SAMPLE_MM, settings.unit, settings.fraction)}</strong>
            </p>
            <p className="param-help">
              Models are always stored in millimetres — this changes what is shown and what you
              can type.
            </p>
          </section>

          <section className="setting">
            <h3>Theme</h3>
            <div className="theme-choices">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={settings.theme === theme.id ? 'theme-choice active' : 'theme-choice'}
                  onClick={() => onChange({ ...settings, theme: theme.id })}
                >
                  <span className={`theme-swatch swatch-${theme.id}`} aria-hidden>
                    <span className="swatch-chrome" />
                    <span className="swatch-body">
                      <span className="swatch-accent" />
                    </span>
                  </span>
                  <span className="theme-name">{theme.name}</span>
                  <span className="theme-description">{theme.description}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button type="button" className="primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
