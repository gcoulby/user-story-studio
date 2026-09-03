import { readDomainData } from '@/lib/storage'
import type { StudioData } from '@/types/domain'

import { seedActors } from './seed-actors'
import { seedCards } from './seed-cards'
import { seedEpics } from './seed-epics'
import { seedRelationships } from './seed-relationships'

function seedData(): StudioData {
  return {
    actors: seedActors,
    epics: seedEpics,
    cards: seedCards,
    relationships: seedRelationships,
  }
}

let resolved: StudioData | null = null

// Resolves persisted domain data if present, otherwise the bundled seed set.
// Memoised so the individual load-* functions agree on one source per session.
function resolveStudioData(): StudioData {
  if (!resolved) {
    resolved = readDomainData() ?? seedData()
  }
  return resolved
}

export function loadStudioData(): StudioData {
  return resolveStudioData()
}
