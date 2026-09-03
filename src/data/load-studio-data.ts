import type { StudioData } from '@/types/domain'

import { seedActors } from './seed-actors'
import { seedCards } from './seed-cards'
import { seedEpics } from './seed-epics'
import { seedRelationships } from './seed-relationships'

// A brand-new map. This is the default state on first run.
export function emptyStudioData(): StudioData {
  return { actors: [], epics: [], cards: [], relationships: [] }
}

// The bundled example ("Taskboard"), loaded on demand via "Open example".
export function loadExampleData(): StudioData {
  return {
    actors: seedActors,
    epics: seedEpics,
    cards: seedCards,
    relationships: seedRelationships,
  }
}
