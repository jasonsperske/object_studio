import type { LengthUnit, UnitSystem } from './units'
import { defaultUnitFor, unitDef } from './units'

export type ThemeId = 'studio' | 'dos'

/** Colours the 3D scene takes from the active theme. */
export interface SceneTheme {
  background: number
  gridFine: number
  gridCoarse: number
  edge: number
  edgeOpacity: number
  shadowOpacity: number
}

export interface ThemeDef {
  id: ThemeId
  name: string
  description: string
  scene: SceneTheme
}

export const THEMES: ThemeDef[] = [
  {
    id: 'studio',
    name: 'Studio',
    description: 'The default dark workspace.',
    scene: {
      background: 0x14181f,
      gridFine: 0x2b3240,
      gridCoarse: 0x3f4a5e,
      edge: 0x0b0d11,
      edgeOpacity: 0.45,
      shadowOpacity: 0.32,
    },
  },
  {
    id: 'dos',
    name: '3D Studio DOS',
    description: 'Grey viewports, teal chrome, red selection — Autodesk 3D Studio R4.',
    scene: {
      background: 0x808080,
      gridFine: 0x8d8d8d,
      gridCoarse: 0xf0f0f0,
      edge: 0xffffff,
      edgeOpacity: 0.6,
      shadowOpacity: 0.22,
    },
  },
]

export function themeDef(id: ThemeId): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

export interface Settings {
  system: UnitSystem
  unit: LengthUnit
  /** Fraction denominator used by carpentry notation. */
  fraction: number
  theme: ThemeId
}

export const DEFAULT_SETTINGS: Settings = {
  system: 'metric',
  unit: 'mm',
  fraction: 16,
  theme: 'studio',
}

const STORAGE_KEY = 'object-studio.settings.v1'

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<Settings>
    const merged = { ...DEFAULT_SETTINGS, ...parsed }
    // Guard against a stored unit that no longer belongs to its system.
    if (unitDef(merged.unit).system !== merged.system) {
      merged.unit = defaultUnitFor(merged.system)
    }
    return merged
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Private mode or a full quota shouldn't break the app.
  }
}
