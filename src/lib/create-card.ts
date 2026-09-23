import { NEW_CARD_OFFSET } from '@/config/graph'
import { newId } from '@/lib/id'
import type { Card } from '@/types/domain'

// New cards are placed just offset from the last card touched (clicked,
// dragged, or edited), so a run of "new card" clicks cascades outward instead
// of stacking. With nothing touched yet, fall back to a semi-random spot near
// the top-left of the canvas — there is no auto-layout in v1.
export function createEmptyCard(
  actorId: string,
  anchor?: { x: number; y: number } | null,
): Card {
  const position = anchor
    ? { x: anchor.x + NEW_CARD_OFFSET, y: anchor.y + NEW_CARD_OFFSET }
    : { x: 320 + Math.random() * 300, y: 120 + Math.random() * 260 }

  return {
    id: newId('c'),
    actorId,
    trigger: '',
    goal: '',
    benefit: '',
    conversation: '',
    confirmation: [],
    epicIds: [],
    ...position,
  }
}
