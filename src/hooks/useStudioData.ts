import { useCallback, useState } from 'react'

import { loadStudioData } from '@/data/load-studio-data'
import { newId } from '@/lib/id'
import { nextEpicColor } from '@/config/palette'
import type {
  Actor,
  Card,
  Epic,
  Relationship,
  RelationshipType,
  StudioData,
} from '@/types/domain'

export interface NewRelationshipInput {
  sourceId: string
  targetId: string
  type: RelationshipType
  note?: string
}

export interface StudioDataApi {
  actors: Actor[]
  epics: Epic[]
  cards: Card[]
  relationships: Relationship[]
  addActor: (name: string) => void
  addEpic: (name: string) => void
  upsertCard: (card: Card) => void
  deleteCard: (id: string) => void
  moveCard: (id: string, x: number, y: number) => void
  moveActor: (id: string, x: number, y: number) => void
  addRelationship: (input: NewRelationshipInput) => void
  removeRelationship: (id: string) => void
  replaceAll: (data: StudioData) => void
  snapshot: () => StudioData
}

export function useStudioData(): StudioDataApi {
  const [initial] = useState(loadStudioData)
  const [actors, setActors] = useState<Actor[]>(initial.actors)
  const [epics, setEpics] = useState<Epic[]>(initial.epics)
  const [cards, setCards] = useState<Card[]>(initial.cards)
  const [relationships, setRelationships] = useState<Relationship[]>(
    initial.relationships,
  )

  const addActor = useCallback(
    (name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      setActors((prev) => [
        ...prev,
        { id: newId('a'), name: trimmed, x: 40, y: 60 + prev.length * 200 },
      ])
    },
    [],
  )

  const addEpic = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setEpics((prev) => [
      ...prev,
      { id: newId('e'), name: trimmed, color: nextEpicColor(prev.length) },
    ])
  }, [])

  const upsertCard = useCallback((card: Card) => {
    setCards((prev) =>
      prev.some((c) => c.id === card.id)
        ? prev.map((c) => (c.id === card.id ? card : c))
        : [...prev, card],
    )
  }, [])

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
    setRelationships((prev) =>
      prev.filter((r) => r.sourceId !== id && r.targetId !== id),
    )
  }, [])

  const moveCard = useCallback((id: string, x: number, y: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)))
  }, [])

  const moveActor = useCallback((id: string, x: number, y: number) => {
    setActors((prev) => prev.map((a) => (a.id === id ? { ...a, x, y } : a)))
  }, [])

  const addRelationship = useCallback((input: NewRelationshipInput) => {
    if (!input.sourceId || !input.targetId || input.sourceId === input.targetId) {
      return
    }
    const note = input.type === 'extends' ? input.note?.trim() || undefined : undefined
    setRelationships((prev) => [
      ...prev,
      {
        id: newId('r'),
        sourceId: input.sourceId,
        targetId: input.targetId,
        type: input.type,
        note,
      },
    ])
  }, [])

  const removeRelationship = useCallback((id: string) => {
    setRelationships((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const replaceAll = useCallback((data: StudioData) => {
    setActors(data.actors)
    setEpics(data.epics)
    setCards(data.cards)
    setRelationships(data.relationships)
  }, [])

  const snapshot = useCallback(
    (): StudioData => ({ actors, epics, cards, relationships }),
    [actors, epics, cards, relationships],
  )

  return {
    actors,
    epics,
    cards,
    relationships,
    addActor,
    addEpic,
    upsertCard,
    deleteCard,
    moveCard,
    moveActor,
    addRelationship,
    removeRelationship,
    replaceAll,
    snapshot,
  }
}
