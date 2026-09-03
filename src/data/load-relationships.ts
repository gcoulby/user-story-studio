import type { Relationship } from '@/types/domain'

import { loadStudioData } from './load-studio-data'

export function loadRelationships(): Relationship[] {
  return loadStudioData().relationships
}
