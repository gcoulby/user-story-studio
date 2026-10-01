import { useCallback, useState } from 'react'

import { emptyStudioData } from '@/data/load-studio-data'
import { newId } from '@/lib/id'
import { normalizePiVision } from '@/lib/pi-vision'
import { nextEpicColor } from '@/config/palette'
import type {
  Actor,
  ActorTextField,
  Card,
  CardCommitment,
  CardPriority,
  Epic,
  EpicTextField,
  PiObjective,
  PiVision,
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

export type PiTextField =
  | 'highLevelVision'
  | 'visionDetails'
  | 'demonstrationOutline'
  | 'risksAndDependencies'

export interface StudioDataApi {
  actors: Actor[]
  epics: Epic[]
  cards: Card[]
  relationships: Relationship[]
  piVision: PiVision
  addActor: (name: string) => void
  addEpic: (name: string) => void
  renameActor: (id: string, name: string) => void
  renameEpic: (id: string, name: string) => void
  recolorEpic: (id: string, color: string) => void
  setActorText: (id: string, field: ActorTextField, value: string) => void
  setEpicText: (id: string, field: EpicTextField, value: string) => void
  deleteActor: (id: string) => void
  deleteEpic: (id: string) => void
  upsertCard: (card: Card) => void
  toggleCardEpic: (id: string, epicId: string) => void
  setCardPriority: (id: string, priority: CardPriority) => void
  setCardCommitment: (id: string, commitment: CardCommitment) => void
  deleteCard: (id: string) => void
  moveCard: (id: string, x: number, y: number) => void
  moveActor: (id: string, x: number, y: number) => void
  addRelationship: (input: NewRelationshipInput) => void
  removeRelationship: (id: string) => void
  setPiText: (field: PiTextField, value: string) => void
  setPiTimeframe: (start: string, end: string) => void
  addPiObjective: (text: string) => void
  updatePiObjective: (id: string, patch: Partial<Omit<PiObjective, 'id'>>) => void
  removePiObjective: (id: string) => void
  reorderEpicPriority: (epicIds: string[]) => void
  replaceAll: (data: StudioData) => void
  snapshot: () => StudioData
}

export function useStudioData(): StudioDataApi {
  const [initial] = useState(emptyStudioData)
  const [actors, setActors] = useState<Actor[]>(initial.actors)
  const [epics, setEpics] = useState<Epic[]>(initial.epics)
  const [cards, setCards] = useState<Card[]>(initial.cards)
  const [relationships, setRelationships] = useState<Relationship[]>(
    initial.relationships,
  )
  const [piVision, setPiVision] = useState<PiVision>(initial.piVision)

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
    const id = newId('e')
    setEpics((prev) => [
      ...prev,
      { id, name: trimmed, color: nextEpicColor(prev.length) },
    ])
    setPiVision((prev) => ({
      ...prev,
      epicPriority: [...prev.epicPriority, id],
    }))
  }, [])

  const renameActor = useCallback((id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setActors((prev) => prev.map((a) => (a.id === id ? { ...a, name: trimmed } : a)))
  }, [])

  const renameEpic = useCallback((id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setEpics((prev) => prev.map((e) => (e.id === id ? { ...e, name: trimmed } : e)))
  }, [])

  const recolorEpic = useCallback((id: string, color: string) => {
    setEpics((prev) => prev.map((e) => (e.id === id ? { ...e, color } : e)))
  }, [])

  const setActorText = useCallback(
    (id: string, field: ActorTextField, value: string) => {
      setActors((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
      )
    },
    [],
  )

  const setEpicText = useCallback(
    (id: string, field: EpicTextField, value: string) => {
      setEpics((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
      )
    },
    [],
  )

  const deleteActor = useCallback((id: string) => {
    setActors((prev) => prev.filter((a) => a.id !== id))
    setCards((prev) =>
      prev.map((c) => (c.actorId === id ? { ...c, actorId: '' } : c)),
    )
  }, [])

  const deleteEpic = useCallback((id: string) => {
    setEpics((prev) => prev.filter((e) => e.id !== id))
    setCards((prev) =>
      prev.map((c) =>
        c.epicIds.includes(id)
          ? { ...c, epicIds: c.epicIds.filter((e) => e !== id) }
          : c,
      ),
    )
    setPiVision((prev) => ({
      ...prev,
      epicPriority: prev.epicPriority.filter((e) => e !== id),
      objectives: prev.objectives.map((o) =>
        o.epicIds.includes(id)
          ? { ...o, epicIds: o.epicIds.filter((e) => e !== id) }
          : o,
      ),
    }))
  }, [])

  const upsertCard = useCallback((card: Card) => {
    setCards((prev) =>
      prev.some((c) => c.id === card.id)
        ? prev.map((c) => (c.id === card.id ? card : c))
        : [...prev, card],
    )
  }, [])

  const patchCard = useCallback((id: string, patch: Partial<Card>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    )
  }, [])

  const toggleCardEpic = useCallback((id: string, epicId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              epicIds: c.epicIds.includes(epicId)
                ? c.epicIds.filter((e) => e !== epicId)
                : [...c.epicIds, epicId],
            }
          : c,
      ),
    )
  }, [])

  const setCardPriority = useCallback(
    (id: string, priority: CardPriority) => patchCard(id, { priority }),
    [patchCard],
  )

  const setCardCommitment = useCallback(
    (id: string, commitment: CardCommitment) => patchCard(id, { commitment }),
    [patchCard],
  )

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

  const setPiText = useCallback((field: PiTextField, value: string) => {
    setPiVision((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setPiTimeframe = useCallback((start: string, end: string) => {
    setPiVision((prev) => ({
      ...prev,
      timeframeStart: start || undefined,
      timeframeEnd: end || undefined,
    }))
  }, [])

  const addPiObjective = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setPiVision((prev) => ({
      ...prev,
      objectives: [
        ...prev.objectives,
        { id: newId('obj'), text: trimmed, epicIds: [] },
      ],
    }))
  }, [])

  const updatePiObjective = useCallback(
    (id: string, patch: Partial<Omit<PiObjective, 'id'>>) => {
      setPiVision((prev) => ({
        ...prev,
        objectives: prev.objectives.map((o) =>
          o.id === id ? { ...o, ...patch } : o,
        ),
      }))
    },
    [],
  )

  const removePiObjective = useCallback((id: string) => {
    setPiVision((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((o) => o.id !== id),
    }))
  }, [])

  const reorderEpicPriority = useCallback((epicIds: string[]) => {
    setPiVision((prev) => ({ ...prev, epicPriority: epicIds }))
  }, [])

  const replaceAll = useCallback((data: StudioData) => {
    setActors(data.actors)
    setEpics(data.epics)
    setCards(data.cards)
    setRelationships(data.relationships)
    const loadedPiVision = normalizePiVision(data.piVision)
    const epicIds = data.epics.map((e) => e.id)
    // Keep epicPriority a permutation of the loaded epics: drop stale ids
    // (deleted epics) and append any epic missing from it (older saves
    // predate this field, or an epic was added before it existed).
    const epicPriority = [
      ...loadedPiVision.epicPriority.filter((id) => epicIds.includes(id)),
      ...epicIds.filter((id) => !loadedPiVision.epicPriority.includes(id)),
    ]
    setPiVision({ ...loadedPiVision, epicPriority })
  }, [])

  const snapshot = useCallback(
    (): StudioData => ({ actors, epics, cards, relationships, piVision }),
    [actors, epics, cards, relationships, piVision],
  )

  return {
    actors,
    epics,
    cards,
    relationships,
    piVision,
    addActor,
    addEpic,
    renameActor,
    renameEpic,
    recolorEpic,
    setActorText,
    setEpicText,
    deleteActor,
    deleteEpic,
    upsertCard,
    toggleCardEpic,
    setCardPriority,
    setCardCommitment,
    deleteCard,
    moveCard,
    moveActor,
    addRelationship,
    removeRelationship,
    setPiText,
    setPiTimeframe,
    addPiObjective,
    updatePiObjective,
    removePiObjective,
    reorderEpicPriority,
    replaceAll,
    snapshot,
  }
}
