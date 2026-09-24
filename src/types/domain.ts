export type ActorId = string
export type CardId = string
export type EpicId = string
export type RelationshipId = string

export interface Actor {
  id: ActorId
  name: string
  x: number
  y: number
  // Free-text persona metadata.
  description?: string
  goals?: string
  painPoints?: string
  context?: string
}

export type ActorTextField = 'description' | 'goals' | 'painPoints' | 'context'

export interface Epic {
  id: EpicId
  name: string
  color: string // hex, used directly as an inline style value
  // Free-text planning fields. Requirements are not stored: they are the
  // stories (cards) that belong to the epic.
  benefitHypothesis?: string
  businessNeed?: string
  deliverables?: string
  dependencies?: string
}

export type EpicTextField =
  | 'benefitHypothesis'
  | 'businessNeed'
  | 'deliverables'
  | 'dependencies'

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
