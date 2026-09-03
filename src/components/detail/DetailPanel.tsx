import { PanelRightClose } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import type { StudioDataApi } from '@/hooks/useStudioData'
import type { StudioSelectionApi } from '@/hooks/useStudioSelection'

import { CardDetail } from './CardDetail'
import { CardEditor } from './CardEditor'

interface DetailPanelProps {
  data: StudioDataApi
  selection: StudioSelectionApi
}

// Right-hand collapsible sidebar. One of two states: the read-only CardDetail
// (on select) or the CardEditor (on New/Edit) — never both, and never empty
// markup glued together.
export function DetailPanel({ data, selection }: DetailPanelProps) {
  const { editor, selectedCardId } = selection
  const selectedCard = data.cards.find((c) => c.id === selectedCardId) ?? null
  const editingCard =
    editor.mode === 'edit'
      ? (data.cards.find((c) => c.id === editor.cardId) ?? null)
      : null

  const actorName = (id: string) =>
    data.actors.find((a) => a.id === id)?.name ?? 'someone'

  let body
  if (editor.mode === 'new' || editor.mode === 'edit') {
    body = (
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
    body = (
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
    body = (
      <div className="p-6 text-sm leading-relaxed text-muted-foreground">
        Select a card to see its Card / Conversation / Confirmation detail and
        manage its relationships, or start a new one from the left rail.
      </div>
    )
  }

  return (
    <Sidebar side="right" width="21.25rem" className="elevation-0 z-10">
      <SidebarHeader className="flex-row items-center justify-between border-b border-sidebar-border py-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Detail
        </span>
        <SidebarTrigger
          className="text-muted-foreground"
          icon={<PanelRightClose size={16} />}
        />
      </SidebarHeader>
      <SidebarContent className="p-0">{body}</SidebarContent>
    </Sidebar>
  )
}
