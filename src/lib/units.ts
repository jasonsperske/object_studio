/**
 * Display units.
 *
 * Geometry is always authored and stored in millimetres — these functions only
 * affect what is shown and what a person may type. Parameters declared with any
 * other unit (degrees, counts) are left alone.
 */

export type UnitSystem = 'metric' | 'imperial' | 'carpentry'
export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'ftin'

export interface UnitDef {
  id: LengthUnit
  label: string
  suffix: string
  system: UnitSystem
  /** display = mm × perMm */
  perMm: number
  decimals: number
}

const MM_PER_INCH = 25.4

export const UNITS: UnitDef[] = [
  { id: 'mm', label: 'Millimetres', suffix: 'mm', system: 'metric', perMm: 1, decimals: 1 },
  { id: 'cm', label: 'Centimetres', suffix: 'cm', system: 'metric', perMm: 0.1, decimals: 2 },
  { id: 'm', label: 'Metres', suffix: 'm', system: 'metric', perMm: 0.001, decimals: 3 },
  { id: 'in', label: 'Inches', suffix: '"', system: 'imperial', perMm: 1 / MM_PER_INCH, decimals: 3 },
  { id: 'ft', label: 'Feet', suffix: 'ft', system: 'imperial', perMm: 1 / (MM_PER_INCH * 12), decimals: 4 },
  {
    id: 'ftin',
    label: 'Feet & inches',
    suffix: '',
    system: 'carpentry',
    perMm: 1 / MM_PER_INCH,
    decimals: 3,
  },
]

export const FRACTIONS = [2, 4, 8, 16, 32]

export function unitsFor(system: UnitSystem): UnitDef[] {
  return UNITS.filter((u) => u.system === system)
}

export function unitDef(id: LengthUnit): UnitDef {
  return UNITS.find((u) => u.id === id) ?? UNITS[0]
}

/** Default unit when switching systems. */
export function defaultUnitFor(system: UnitSystem): LengthUnit {
  return unitsFor(system)[0]?.id ?? 'mm'
}

// --- formatting -----------------------------------------------------------

function trimZeros(text: string): string {
  return text.includes('.') ? text.replace(/\.?0+$/, '') : text
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/**
 * Carpentry notation: whole feet, whole inches, and a reduced fraction rounded
 * to the chosen denominator — 2700 mm at sixteenths reads 8' 10 5/16".
 */
export function formatFeetInches(mm: number, denominator: number): string {
  const sign = mm < 0 ? '-' : ''
  const totalTicks = Math.round((Math.abs(mm) / MM_PER_INCH) * denominator)
  const wholeInches = Math.floor(totalTicks / denominator)
  let numerator = totalTicks % denominator
  let denom = denominator
  if (numerator > 0) {
    const divisor = gcd(numerator, denom)
    numerator /= divisor
    denom /= divisor
  }

  const feet = Math.floor(wholeInches / 12)
  const inches = wholeInches % 12
  const fraction = numerator > 0 ? `${numerator}/${denom}` : ''

  const parts: string[] = []
  if (feet) parts.push(`${feet}'`)
  if (inches || fraction || !feet) {
    parts.push(`${inches || (fraction ? '' : '0')}${fraction ? ` ${fraction}` : ''}"`.replace(/^ /, ''))
  }
  return sign + parts.join(' ')
}

/** Value only — what goes inside an input field. */
export function formatLengthValue(mm: number, unit: LengthUnit, denominator = 16): string {
  if (!Number.isFinite(mm)) return ''
  const def = unitDef(unit)
  if (def.id === 'ftin') return formatFeetInches(mm, denominator)
  return trimZeros((mm * def.perMm).toFixed(def.decimals))
}

/** Value with its unit, for read-only display. */
export function formatLength(mm: number, unit: LengthUnit, denominator = 16): string {
  const def = unitDef(unit)
  const value = formatLengthValue(mm, unit, denominator)
  if (!def.suffix) return value
  return def.suffix === '"' ? `${value}"` : `${value} ${def.suffix}`
}

// --- parsing --------------------------------------------------------------

/**
 * Feet, inches and fractions in the spellings people actually type:
 * `8' 10 5/16"`, `8'10`, `10 1/2`, `1/2`, `42`, `3 ft 6 in`.
 */
const FEET_INCHES =
  /^\s*(?:(-?\d+(?:\.\d+)?)\s*(?:'|ft\b|feet\b)\s*)?(?:(\d+(?:\.\d+)?)\s*)?(?:(\d+)\s*\/\s*(\d+)\s*)?(?:"|in\b|inch(?:es)?\b)?\s*$/i

export function parseFeetInches(text: string): number | null {
  const match = FEET_INCHES.exec(text)
  if (!match) return null
  const [, feetText, inchText, numText, denomText] = match
  if (feetText === undefined && inchText === undefined && numText === undefined) return null

  const feet = feetText ? Number(feetText) : 0
  const inches = inchText ? Number(inchText) : 0
  const fraction = numText && denomText && Number(denomText) !== 0 ? Number(numText) / Number(denomText) : 0
  const magnitude = Math.abs(feet) * 12 + inches + fraction
  return (feet < 0 ? -magnitude : magnitude) * MM_PER_INCH
}

/** Parses typed text in the given unit back to millimetres. */
export function parseLength(text: string, unit: LengthUnit): number | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  const def = unitDef(unit)
  if (def.id === 'ftin') return parseFeetInches(trimmed)
  const value = Number(trimmed)
  if (!Number.isFinite(value)) return null
  return value / def.perMm
}

/** Feet-and-inches needs a free text field; the rest can use a number input. */
export function isNumericInput(unit: LengthUnit): boolean {
  return unitDef(unit).id !== 'ftin'
}
