// UI preferences live in localStorage under their own key. Losing them is a
// non-event and they can never corrupt the domain data, which is persisted
// separately in IndexedDB (see useProjectPersistence).

export const PREFERENCES_KEY = 'user-story-studio:preferences'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface StudioPreferences {
  view: 'graph' | 'stories' | 'table'
  activeEpicFilter: string | null
  selectedCardId: string | null
  showEpicRegions: boolean
}

export function readPreferences(): Partial<StudioPreferences> | null {
  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY)
    return raw ? (JSON.parse(raw) as Partial<StudioPreferences>) : null
  } catch {
    return null
  }
}

export function writePreferences(prefs: StudioPreferences): boolean {
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs))
    return true
  } catch {
    return false
  }
}
