import type { Relationship } from '@/types/domain'

export const seedRelationships: Relationship[] = [
  { id: 'r1', sourceId: 'c3', targetId: 'c1', type: 'precedes' },
  { id: 'r2', sourceId: 'c1', targetId: 'c2', type: 'includes' },
  {
    id: 'r3',
    sourceId: 'c4',
    targetId: 'c3',
    type: 'extends',
    note: 'task goes stale',
  },
  { id: 'r4', sourceId: 'c6', targetId: 'c3', type: 'precedes' },
]
