import type { Node } from '@xyflow/react'

import type { Card, Epic, RelationshipType } from '@/types/domain'

export type ActorNodeData = {
  name: string
}

export type CardNodeData = {
  card: Card
  actorLabel: string
  epics: Epic[]
  dimmed: boolean
}

export type ActorNodeType = Node<ActorNodeData, 'actor'>
export type CardNodeType = Node<CardNodeData, 'card'>

export type StudioNode = ActorNodeType | CardNodeType

export type RelationshipEdgeData = {
  type: RelationshipType
  note?: string
  dimmed: boolean
}

export type OwnershipEdgeData = {
  dimmed: boolean
}
