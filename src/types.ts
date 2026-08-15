import type * as THREE from 'three'

/**
 * All internal geometry is authored in millimetres. Export-time scaling to
 * other units happens in lib/exporters.ts, so object definitions never have to
 * think about units.
 */

export type ParamValue = number | string | boolean

export interface ParamBase {
  id: string
  label: string
  /** Optional grouping header in the properties panel. */
  group?: string
  /** Short hint shown under the control. */
  help?: string
  /** Hide this param when the predicate is false (e.g. handrail sub-options). */
  visibleWhen?: (params: Params) => boolean
}

export interface NumberParam extends ParamBase {
  type: 'number' | 'int'
  min: number
  max: number
  step: number
  default: number
  unit?: string
}

export interface SelectParam extends ParamBase {
  type: 'select'
  options: { value: string; label: string }[]
  default: string
}

export interface BooleanParam extends ParamBase {
  type: 'boolean'
  default: boolean
}

export type ParamSpec = NumberParam | SelectParam | BooleanParam

export type Params = Record<string, ParamValue>

/** One named piece of the model. Parts become groups/objects in OBJ and glTF. */
export interface Part {
  name: string
  geometry: THREE.BufferGeometry
  /** Hex colour used for preview shading only. */
  color?: number
}

/** A derived measurement or code check shown in the info panel. */
export interface Metric {
  label: string
  value: string
  /** 'warn' renders amber, 'error' renders red. */
  level?: 'ok' | 'warn' | 'error'
  note?: string
}

export interface ObjectDefinition {
  id: string
  name: string
  description: string
  /** Sort position in the object picker. Lower comes first; defaults to 100. */
  order: number
  params: ParamSpec[]
  build: (params: Params) => Part[]
  /** Optional derived measurements / design-rule checks. */
  metrics?: (params: Params) => Metric[]
}

export function defaultParams(def: ObjectDefinition): Params {
  const out: Params = {}
  for (const p of def.params) out[p.id] = p.default
  return out
}

/** Numeric accessor that keeps object code free of casts. */
export function num(params: Params, id: string): number {
  return Number(params[id])
}

export function str(params: Params, id: string): string {
  return String(params[id])
}

export function bool(params: Params, id: string): boolean {
  return Boolean(params[id])
}
