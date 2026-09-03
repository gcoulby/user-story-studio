import type { StudioData } from './domain'

export const USS_FORMAT = 'user-story-studio'
export const USS_VERSION = 1
export const DEFAULT_TITLE = 'Untitled user story map'

export interface ProjectManifest {
  format: typeof USS_FORMAT
  version: number
  title: string
  created: string
  modified: string
}

export interface Project {
  manifest: ProjectManifest
  data: StudioData
}

// What the IndexedDB working copy holds.
export interface StoredProject extends Project {
  savedAt: string
}

export function newManifest(title = DEFAULT_TITLE): ProjectManifest {
  const now = new Date().toISOString()
  return {
    format: USS_FORMAT,
    version: USS_VERSION,
    title,
    created: now,
    modified: now,
  }
}
