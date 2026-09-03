import type { StudioData } from '@/types/domain'

export const STORAGE_KEYS = {
  domain: 'use-case-studio:domain',
  preferences: 'use-case-studio:preferences',
} as const

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface StudioPreferences {
  view: 'graph' | 'stories' | 'table'
  activeEpicFilter: string | null
  selectedCardId: string | null
  showEpicRegions: boolean
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function readDomainData(): StudioData | null {
  const data = readJson<Partial<StudioData>>(STORAGE_KEYS.domain)
  if (
    !data ||
    !Array.isArray(data.actors) ||
    !Array.isArray(data.epics) ||
    !Array.isArray(data.cards) ||
    !Array.isArray(data.relationships)
  ) {
    return null
  }
  return data as StudioData
}

export function writeDomainData(data: StudioData): boolean {
  return writeJson(STORAGE_KEYS.domain, data)
}

export function readPreferences(): Partial<StudioPreferences> | null {
  return readJson<Partial<StudioPreferences>>(STORAGE_KEYS.preferences)
}

export function writePreferences(prefs: StudioPreferences): boolean {
  return writeJson(STORAGE_KEYS.preferences, prefs)
}
