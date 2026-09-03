import { MarkerType, type Edge } from '@xyflow/react'

import { ACTOR_H, ACTOR_W, CARD_H, CARD_W } from '@/config/graph'
import { RELATIONSHIP_TYPES } from '@/config/relationship-types'
import { cardEpics } from '@/lib/cards'
import type {
  StudioNode,
} from '@/components/graph/types'
import type {
  Actor,
  Card,
  Epic,
  Relationship,
} from '@/types/domain'

interface BuildNodesArgs {
  actors: Actor[]
  cards: Card[]
  epics: Epic[]
  activeEpicFilter: string | null
}

export function isCardDimmed(
  card: Card,
  activeEpicFilter: string | null,
): boolean {
  return Boolean(activeEpicFilter) && !card.epicIds.includes(activeEpicFilter!)
}

export function buildGraphNodes({
  actors,
  cards,
  epics,
  activeEpicFilter,
}: BuildNodesArgs): StudioNode[] {
  const actorNodes: StudioNode[] = actors.map((actor) => ({
    id: actor.id,
    type: 'actor',
    position: { x: actor.x, y: actor.y },
    data: { name: actor.name },
    width: ACTOR_W,
    height: ACTOR_H,
    zIndex: 1,
  }))

  const cardNodes: StudioNode[] = cards.map((card) => ({
    id: card.id,
    type: 'card',
    position: { x: card.x, y: card.y },
    data: {
      card,
      actorLabel: (
        actors.find((a) => a.id === card.actorId)?.name ?? 'someone'
      ).toUpperCase(),
      epics: cardEpics(card, epics),
      dimmed: isCardDimmed(card, activeEpicFilter),
    },
    width: CARD_W,
    height: CARD_H,
    zIndex: 1,
  }))

  return [...actorNodes, ...cardNodes]
}

interface BuildEdgesArgs {
  cards: Card[]
  relationships: Relationship[]
  activeEpicFilter: string | null
}

export function buildGraphEdges({
  cards,
  relationships,
  activeEpicFilter,
}: BuildEdgesArgs): Edge[] {
  const cardById = new Map(cards.map((c) => [c.id, c]))

  const ownershipEdges: Edge[] = cards.map((card) => ({
    id: `own-${card.id}`,
    source: card.actorId,
    target: card.id,
    type: 'ownership',
    selectable: false,
    focusable: false,
    data: { dimmed: isCardDimmed(card, activeEpicFilter) },
  }))

  const relationshipEdges: Edge[] = relationships
    .filter((r) => cardById.has(r.sourceId) && cardById.has(r.targetId))
    .map((relationship) => {
      const from = cardById.get(relationship.sourceId)!
      const to = cardById.get(relationship.targetId)!
      const dimmed =
        isCardDimmed(from, activeEpicFilter) ||
        isCardDimmed(to, activeEpicFilter)
      return {
        id: relationship.id,
        source: relationship.sourceId,
        target: relationship.targetId,
        type: 'relationship',
        selectable: false,
        focusable: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: RELATIONSHIP_TYPES[relationship.type].color,
          width: 16,
          height: 16,
        },
        data: { type: relationship.type, note: relationship.note, dimmed },
      }
    })

  return [...ownershipEdges, ...relationshipEdges]
}
