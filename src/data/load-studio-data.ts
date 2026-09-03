import type { StudioData } from '@/types/domain'

import { seedActors } from './seed-actors'
import { seedCards } from './seed-cards'
import { seedEpics } from './seed-epics'
import { seedRelationships } from './seed-relationships'

// The bundled seed set. Used as the initial state before the IndexedDB working
// copy is hydrated, and as the starting point for a brand-new project.
export function loadStudioData(): StudioData {
  return {
    actors: seedActors,
    epics: seedEpics,
    cards: seedCards,
    relationships: seedRelationships,
  }
}

export function emptyStudioData(): StudioData {
  return { actors: [], epics: [], cards: [], relationships: [] }
}
