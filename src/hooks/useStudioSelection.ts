import { useCallback, useEffect, useState } from 'react'

import {
  readPreferences,
  writePreferences,
  type StudioPreferences,
} from '@/lib/storage'

export type StudioView = 'graph' | 'stories' | 'table'
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
  editor: EditorState
  openNewCard: () => void
  openEditCard: (id: string) => void
  closeEditor: () => void
  activeEpicFilter: string | null
  toggleEpicFilter: (epicId: string) => void
  clearEpicFilter: () => void
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
  const [editor, setEditor] = useState<EditorState>({ mode: 'closed' })
  const [activeEpicFilter, setActiveEpicFilter] = useState<string | null>(
    stored?.activeEpicFilter ?? DEFAULTS.activeEpicFilter,
  )
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
    setEditor({ mode: 'closed' })
  }, [])

  const openNewCard = useCallback(() => {
    setSelectedCardId(null)
    setEditor({ mode: 'new' })
  }, [])

  const openEditCard = useCallback((id: string) => {
    setSelectedCardId(id)
    setEditor({ mode: 'edit', cardId: id })
  }, [])

  const closeEditor = useCallback(() => setEditor({ mode: 'closed' }), [])

  const toggleEpicFilter = useCallback((epicId: string) => {
    setActiveEpicFilter((cur) => (cur === epicId ? null : epicId))
  }, [])

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
    editor,
    openNewCard,
    openEditCard,
    closeEditor,
    activeEpicFilter,
    toggleEpicFilter,
    clearEpicFilter,
    showEpicRegions,
    setShowEpicRegions,
  }
}
