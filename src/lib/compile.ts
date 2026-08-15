import * as THREE from 'three'
import {
  box,
  boardProfile,
  extrudeProfile,
  merge,
  post,
  slab,
  triangleCount,
  tube,
} from './geometry'
import type { LengthUnit } from './units'
import { formatLength as formatLengthIn } from './units'
import type { ObjectDefinition, ParamSpec } from '../types'
import { bool, num, str } from '../types'

/**
 * The display unit object sources see. Held at module level because sources are
 * compiled once but must follow the setting without being recompiled.
 */
let displayUnit: LengthUnit = 'mm'
let displayFraction = 16

export function setDisplayUnits(unit: LengthUnit, fraction: number) {
  displayUnit = unit
  displayFraction = fraction
}

/** Formats a millimetre length in the reader's chosen unit. */
function formatLength(mm: number): string {
  return formatLengthIn(mm, displayUnit, displayFraction)
}

/**
 * Object definitions are plain JavaScript that the studio evaluates at runtime,
 * so they can be edited in the browser. Rather than making authors import
 * anything, the geometry helpers are passed in as arguments and are therefore
 * simply in scope. `studio` holds the same set, for code that prefers a
 * namespace.
 */
const HELPERS = {
  box,
  slab,
  post,
  tube,
  boardProfile,
  extrudeProfile,
  merge,
  triangleCount,
  num,
  str,
  bool,
  formatLength,
}

const HELPER_NAMES = Object.keys(HELPERS)
const HELPER_VALUES = Object.values(HELPERS)

/** Names an author can define. Deliberately excludes `name`, which is a global. */
export const EXPORT_NAMES = ['meta', 'params', 'build', 'metrics'] as const

export const STUDIO_API = { THREE, ...HELPERS }

/**
 * Collects the author's declarations. An explicit `return` in the source wins,
 * because it runs before this ever does.
 */
const EPILOGUE = `
;return {
  meta: typeof meta !== 'undefined' ? meta : undefined,
  params: typeof params !== 'undefined' ? params : undefined,
  build: typeof build !== 'undefined' ? build : undefined,
  metrics: typeof metrics !== 'undefined' ? metrics : undefined,
};`

/**
 * Sources are written to look like ES modules, but are evaluated as a function
 * body so the helpers can be injected. Stripping `export` off top-level
 * declarations is the whole of that translation.
 */
function stripExports(source: string): string {
  return source.replace(
    /^([ \t]*)export[ \t]+(?=(?:const|let|var|function|async[ \t]+function|class)\b)/gm,
    '$1',
  )
}

export class ObjectSourceError extends Error {}

function assertParams(params: unknown): asserts params is ParamSpec[] {
  if (!Array.isArray(params)) {
    throw new ObjectSourceError('`params` must be an array of parameter specs.')
  }
  for (const [index, spec] of params.entries()) {
    const where = `params[${index}]`
    if (!spec || typeof spec !== 'object') {
      throw new ObjectSourceError(`${where} is not an object.`)
    }
    const p = spec as Partial<ParamSpec>
    if (typeof p.id !== 'string' || !p.id) {
      throw new ObjectSourceError(`${where} needs a non-empty string \`id\`.`)
    }
    if (typeof p.label !== 'string') {
      throw new ObjectSourceError(`${where} ("${p.id}") needs a string \`label\`.`)
    }
    if (!['number', 'int', 'select', 'boolean'].includes(String(p.type))) {
      throw new ObjectSourceError(
        `${where} ("${p.id}") has type "${p.type}"; expected number, int, select or boolean.`,
      )
    }
    if (p.type === 'select' && !Array.isArray((p as { options?: unknown }).options)) {
      throw new ObjectSourceError(`${where} ("${p.id}") is a select and needs \`options\`.`)
    }
    if (p.default === undefined) {
      throw new ObjectSourceError(`${where} ("${p.id}") needs a \`default\`.`)
    }
  }
}

/**
 * Evaluates object source into a definition. Throws ObjectSourceError with a
 * readable message for syntax errors, missing exports and malformed params —
 * callers surface these in the editor rather than treating them as crashes.
 */
export function compileObject(id: string, source: string): ObjectDefinition {
  let factory: (...args: unknown[]) => Record<string, unknown>
  try {
    factory = new Function(
      'THREE',
      'studio',
      ...HELPER_NAMES,
      `"use strict";\n${stripExports(source)}\n${EPILOGUE}`,
    ) as typeof factory
  } catch (err) {
    throw new ObjectSourceError(
      `Syntax error: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  let result: Record<string, unknown>
  try {
    result = factory(THREE, STUDIO_API, ...HELPER_VALUES)
  } catch (err) {
    throw new ObjectSourceError(
      `Error while evaluating the module: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  if (typeof result?.build !== 'function') {
    throw new ObjectSourceError('No `build` function exported. Add `export function build(p) {…}`.')
  }
  assertParams(result?.params)

  const meta = (result.meta ?? {}) as { name?: string; description?: string; order?: number }

  return {
    id,
    name: typeof meta.name === 'string' && meta.name ? meta.name : id,
    description: typeof meta.description === 'string' ? meta.description : '',
    order: Number.isFinite(meta.order) ? Number(meta.order) : 100,
    params: result.params,
    build: result.build as ObjectDefinition['build'],
    metrics: typeof result.metrics === 'function'
      ? (result.metrics as ObjectDefinition['metrics'])
      : undefined,
  }
}

/** Starting point for a brand new object type. */
export function starterSource(name: string): string {
  return `// ${name}
//
// In scope: THREE, and the studio helpers — ${HELPER_NAMES.join(', ')}.
// Units are millimetres. +X is depth, +Y is up, +Z is width centred on zero.

export const meta = {
  name: ${JSON.stringify(name)},
  description: 'Describe the object here.',
}

export const params = [
  { id: 'width', label: 'Width', type: 'number', min: 10, max: 2000, step: 5,
    default: 400, unit: 'mm', group: 'Body' },
  { id: 'height', label: 'Height', type: 'number', min: 10, max: 2000, step: 5,
    default: 600, unit: 'mm', group: 'Body' },
  { id: 'depth', label: 'Depth', type: 'number', min: 10, max: 2000, step: 5,
    default: 300, unit: 'mm', group: 'Body' },
  { id: 'edgeStyle', label: 'Edge profile', type: 'select', default: 'rounded',
    group: 'Body',
    options: [
      { value: 'square', label: 'Square' },
      { value: 'chamfer', label: 'Chamfer' },
      { value: 'rounded', label: 'Round-over' },
      { value: 'bullnose', label: 'Bullnose' },
    ] },
]

// Return an array of parts. Each part keeps its name through OBJ groups and
// glTF nodes, and gets its own colour in the preview.
export function build(p) {
  const profile = boardProfile(num(p, 'depth'), num(p, 'height'), str(p, 'edgeStyle'), 20)
  return [
    {
      name: 'body',
      geometry: extrudeProfile(profile, num(p, 'width'), 0, 0, 'front'),
      color: 0xc79155,
    },
  ]
}

// Optional. Values shown under the properties panel; level can be
// 'ok', 'warn' or 'error'.
export function metrics(p) {
  const volume = (num(p, 'width') * num(p, 'height') * num(p, 'depth')) / 1e9
  return [{ label: 'Bounding volume', value: volume.toFixed(3) + ' m³' }]
}
`
}
