import { useCallback, useEffect, useState } from 'react'

import {
  readPreferences,
  writePreferences,
  type StudioPreferences,
} from '@/lib/storage'

export type StudioView = 'graph' | 'stories' | 'table' | 'epics' | 'actors'
export type EditorState =
  | { mode: 'closed' }
  | { mode: 'new' }
  | { mode: 'edit'; cardId: string }

const DEFAULTS: StudioPreferences = {
  view: 'graph',
  activeEpicFilter: null,
  selectedCardId: null,
  showEpicRegions: true,
}

export interface StudioSelectionApi {
  view: StudioView
  setView: (view: StudioView) => void
  selectedCardId: string | null
  selectCard: (id: string | null) => void
  lastTouchedCardId: string | null
  touchCard: (id: string) => void
  editor: EditorState
  openNewCard: () => void
  openEditCard: (id: string) => void
  closeEditor: () => void
  activeEpicFilter: string | null
  toggleEpicFilter: (epicId: string) => void
  clearEpicFilter: () => void
  activeActorId: string | null
  toggleActor: (actorId: string) => void
  clearActor: () => void
  showEpicRegions: boolean
  setShowEpicRegions: (value: boolean) => void
}

// Cross-cutting UI state: active view, selection, editor mode, epic filter,
// graph region toggle. Persisted under its own preferences key — losing it is a
// non-event and it can never corrupt domain data.
export function useStudioSelection(): StudioSelectionApi {
  const [stored] = useState(readPreferences)
  const [view, setViewState] = useState<StudioView>(
    stored?.view ?? DEFAULTS.view,
  )
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    stored?.selectedCardId ?? DEFAULTS.selectedCardId,
  )
  // The last card clicked, dragged, or edited — kept even after the selection
  // is cleared (pane click), so a new card can be placed near it.
  const [lastTouchedCardId, setLastTouchedCardId] = useState<string | null>(
    stored?.selectedCardId ?? DEFAULTS.selectedCardId,
  )
  const [editor, setEditor] = useState<EditorState>({ mode: 'closed' })
  const [activeEpicFilter, setActiveEpicFilter] = useState<string | null>(
    stored?.activeEpicFilter ?? DEFAULTS.activeEpicFilter,
  )
  // Which actor the Actors view shows; null lists them all.
  const [activeActorId, setActiveActorId] = useState<string | null>(null)
  const [showEpicRegions, setShowEpicRegionsState] = useState<boolean>(
    stored?.showEpicRegions ?? DEFAULTS.showEpicRegions,
  )

  useEffect(() => {
    writePreferences({
      view,
      activeEpicFilter,
      selectedCardId,
      showEpicRegions,
    })
  }, [view, activeEpicFilter, selectedCardId, showEpicRegions])

  const setView = useCallback((next: StudioView) => setViewState(next), [])

  const selectCard = useCallback((id: string | null) => {
    setSelectedCardId(id)
    if (id) setLastTouchedCardId(id)
    setEditor({ mode: 'closed' })
  }, [])

  const touchCard = useCallback((id: string) => {
    setLastTouchedCardId(id)
  }, [])

  const openNewCard = useCallback(() => {
    setSelectedCardId(null)
    setEditor({ mode: 'new' })
  }, [])

  const openEditCard = useCallback((id: string) => {
    setSelectedCardId(id)
    setLastTouchedCardId(id)
    setEditor({ mode: 'edit', cardId: id })
  }, [])

  const closeEditor = useCallback(() => setEditor({ mode: 'closed' }), [])

  const toggleEpicFilter = useCallback((epicId: string) => {
    setActiveEpicFilter((cur) => (cur === epicId ? null : epicId))
  }, [])

  const toggleActor = useCallback((actorId: string) => {
    setActiveActorId((cur) => (cur === actorId ? null : actorId))
  }, [])

  const clearActor = useCallback(() => setActiveActorId(null), [])

  const clearEpicFilter = useCallback(() => setActiveEpicFilter(null), [])

  const setShowEpicRegions = useCallback(
    (value: boolean) => setShowEpicRegionsState(value),
    [],
  )

  return {
    view,
    setView,
    selectedCardId,
    selectCard,
    lastTouchedCardId,
    touchCard,
    editor,
    openNewCard,
    openEditCard,
    closeEditor,
    activeEpicFilter,
    toggleEpicFilter,
    clearEpicFilter,
    activeActorId,
    toggleActor,
    clearActor,
    showEpicRegions,
    setShowEpicRegions,
  }
}
