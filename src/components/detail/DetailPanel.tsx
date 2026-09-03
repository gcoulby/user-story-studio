import type { StudioDataApi } from '@/hooks/useStudioData'
import type { StudioSelectionApi } from '@/hooks/useStudioSelection'

import { CardDetail } from './CardDetail'
import { CardEditor } from './CardEditor'

interface DetailPanelProps {
  data: StudioDataApi
  selection: StudioSelectionApi
}

// Right-hand panel. One of two states: the read-only CardDetail (on select) or
// the CardEditor (on New/Edit) — never both, and never empty markup glued
// together.
export function DetailPanel({ data, selection }: DetailPanelProps) {
  const { editor, selectedCardId } = selection
  const selectedCard =
    data.cards.find((c) => c.id === selectedCardId) ?? null
  const editingCard =
    editor.mode === 'edit'
      ? data.cards.find((c) => c.id === editor.cardId) ?? null
      : null

  const actorName = (id: string) =>
    data.actors.find((a) => a.id === id)?.name ?? 'someone'

  let content
  if (editor.mode === 'new' || editor.mode === 'edit') {
    content = (
      <CardEditor
        card={editingCard}
        actors={data.actors}
        epics={data.epics}
        onSave={(card) => {
          data.upsertCard(card)
          selection.selectCard(card.id)
        }}
        onCancel={selection.closeEditor}
        onDelete={
          editingCard
            ? () => {
                data.deleteCard(editingCard.id)
                selection.selectCard(null)
              }
            : null
        }
      />
    )
  } else if (selectedCard) {
    content = (
      <CardDetail
        card={selectedCard}
        actorLabel={actorName(selectedCard.actorId).toUpperCase()}
        epics={data.epics}
        cards={data.cards}
        relationships={data.relationships}
        onEdit={() => selection.openEditCard(selectedCard.id)}
        onDelete={() => {
          data.deleteCard(selectedCard.id)
          selection.selectCard(null)
        }}
        onAddRelationship={data.addRelationship}
        onRemoveRelationship={data.removeRelationship}
      />
    )
  } else {
    content = (
      <div className="p-6 text-sm leading-relaxed text-muted-foreground">
        Select a card to see its Card / Conversation / Confirmation detail and
        manage its relationships, or start a new one from the left rail.
      </div>
    )
  }

  return (
    <aside className="w-[340px] shrink-0 overflow-y-auto border-l border-border bg-card">
      {content}
    </aside>
  )
}
