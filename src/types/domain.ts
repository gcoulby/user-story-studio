export type ActorId = string
export type CardId = string
export type EpicId = string
export type RelationshipId = string

export interface Actor {
  id: ActorId
  name: string
  x: number
  y: number
}

export interface Epic {
  id: EpicId
  name: string
  color: string // hex, used directly as an inline style value
}

export interface AcceptanceCriterion {
  id: string
  text: string
}

export interface Card {
  id: CardId
  actorId: ActorId
  trigger: string // "when" clause
  goal: string // "I want to" clause — this is the card's headline, everywhere
  benefit: string // "so that" clause
  conversation: string
  confirmation: AcceptanceCriterion[]
  epicIds: EpicId[]
  x: number
  y: number
}

export type RelationshipType = 'includes' | 'extends' | 'precedes'

export interface Relationship {
  id: RelationshipId
  sourceId: CardId
  targetId: CardId
  type: RelationshipType
  note?: string // only meaningful for "extends" — the condition
}

export interface StudioData {
  actors: Actor[]
  epics: Epic[]
  cards: Card[]
  relationships: Relationship[]
}
