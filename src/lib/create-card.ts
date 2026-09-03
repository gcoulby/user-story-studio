import { newId } from '@/lib/id'
import type { Card } from '@/types/domain'

// New cards get a semi-random position near the top-left of the canvas; there is
// no auto-layout in v1, arrangement is manual drag.
export function createEmptyCard(actorId: string): Card {
  return {
    id: newId('c'),
    actorId,
    trigger: '',
    goal: '',
    benefit: '',
    conversation: '',
    confirmation: [],
    epicIds: [],
    x: 320 + Math.random() * 300,
    y: 120 + Math.random() * 260,
  }
}
