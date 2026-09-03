import type { Actor, Card, Epic } from '@/types/domain'

export function filterCardsByEpic(
  cards: Card[],
  activeEpicFilter: string | null,
): Card[] {
  if (!activeEpicFilter) return cards
  return cards.filter((c) => c.epicIds.includes(activeEpicFilter))
}

export function cardEpics(card: Card, epics: Epic[]): Epic[] {
  return card.epicIds
    .map((id) => epics.find((e) => e.id === id))
    .filter((e): e is Epic => Boolean(e))
}

export interface ActorGroup {
  actor: Actor
  cards: Card[]
}

export function groupCardsByActor(
  cards: Card[],
  actors: Actor[],
): ActorGroup[] {
  return actors
    .map((actor) => ({
      actor,
      cards: cards.filter((c) => c.actorId === actor.id),
    }))
    .filter((group) => group.cards.length > 0)
}

export function storySentence(card: Card, actorName: string): string {
  const goal = card.goal || '…'
  const base = `As a ${actorName}, I want to ${goal}`
  return card.benefit ? `${base}, so that ${card.benefit}.` : `${base}.`
}
