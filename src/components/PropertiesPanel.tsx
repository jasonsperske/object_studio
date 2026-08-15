import { useMemo } from 'react'
import type { ObjectDefinition, ParamSpec, ParamValue, Params } from '../types'
import ParamControl from './ParamControl'

interface Props {
  definition: ObjectDefinition
  params: Params
  onChange: (id: string, value: ParamValue) => void
  onReset: () => void
}

/** Groups params in declaration order, keeping ungrouped ones under 'General'. */
function groupParams(specs: ParamSpec[], params: Params) {
  const groups: { name: string; specs: ParamSpec[] }[] = []
  for (const spec of specs) {
    if (spec.visibleWhen && !spec.visibleWhen(params)) continue
    const name = spec.group ?? 'General'
    const existing = groups.find((g) => g.name === name)
    if (existing) existing.specs.push(spec)
    else groups.push({ name, specs: [spec] })
  }
  return groups
}

export default function PropertiesPanel({ definition, params, onChange, onReset }: Props) {
  const groups = useMemo(() => groupParams(definition.params, params), [definition, params])

  return (
    <div className="properties">
      <p className="definition-description">{definition.description}</p>

      {groups.map((group) => (
        <fieldset key={group.name} className="param-group">
          <legend>{group.name}</legend>
          {group.specs.map((spec) => (
            <ParamControl
              key={spec.id}
              spec={spec}
              value={params[spec.id]}
              onChange={(value) => onChange(spec.id, value)}
            />
          ))}
        </fieldset>
      ))}

      <button type="button" className="ghost full" onClick={onReset}>
        Reset to defaults
      </button>
    </div>
  )
}
