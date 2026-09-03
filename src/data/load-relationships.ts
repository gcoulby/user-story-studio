import type { Relationship } from '@/types/domain'

import { loadExampleData } from './load-studio-data'

export function loadRelationships(): Relationship[] {
  return loadExampleData().relationships
}
