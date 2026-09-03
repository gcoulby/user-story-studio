import type { Relationship } from '@/types/domain'

export const seedRelationships: Relationship[] = [
  { id: 'r1', sourceId: 'c1', targetId: 'c2', type: 'includes' },
  {
    id: 'r2',
    sourceId: 'c2',
    targetId: 'c3',
    type: 'extends',
    note: 'if documents missing',
  },
  {
    id: 'r3',
    sourceId: 'c2',
    targetId: 'c4',
    type: 'extends',
    note: 'if tier = high',
  },
  { id: 'r4', sourceId: 'c3', targetId: 'c2', type: 'precedes' },
]
