import { Link2, Pencil, Trash2 } from 'lucide-react'

import { EpicChip } from '@/components/EpicChip'
import { Button } from '@/components/ui/button'
import { cardEpics } from '@/lib/cards'
import type { NewRelationshipInput } from '@/hooks/useStudioData'
import type { Card, Epic, Relationship } from '@/types/domain'

import { FieldBlock } from './FieldBlock'
import { RelationshipManager } from './RelationshipManager'

interface CardDetailProps {
  card: Card
  actorLabel: string
  epics: Epic[]
  cards: Card[]
  relationships: Relationship[]
  onEdit: () => void
  onDelete: () => void
  onAddRelationship: (input: NewRelationshipInput) => void
  onRemoveRelationship: (id: string) => void
}

// Read-only view shown when a card is selected. Editing is a separate explicit
// action — clicking a card must never open the editor directly.
export function CardDetail({
  card,
  actorLabel,
  epics,
  cards,
  relationships,
  onEdit,
  onDelete,
  onAddRelationship,
  onRemoveRelationship,
}: CardDetailProps) {
  const chips = cardEpics(card, epics)
  const otherCards = cards.filter((c) => c.id !== card.id)
  const related = relationships.filter(
    (r) => r.sourceId === card.id || r.targetId === card.id,
  )

  return (
    <div className="p-5 text-sm">
      <div className="flex items-start justify-between">
        <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          {actorLabel}
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onEdit}>
            <Pencil size={12} />
            Edit
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={onDelete}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      <h2 className="mb-3 mt-2 text-lg font-medium leading-snug text-foreground">
        {card.goal}
      </h2>

      {chips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {chips.map((epic) => (
            <EpicChip key={epic.id} epic={epic} />
          ))}
        </div>
      )}

      <FieldBlock label="Card">
        <div>
          <span className="text-muted-foreground">As a </span>
          {actorLabel.toLowerCase()}
        </div>
        <div>
          <span className="text-muted-foreground">when </span>
          {card.trigger || '—'}
        </div>
        <div>
          <span className="text-muted-foreground">I want to </span>
          {card.goal || '—'}
        </div>
        <div>
          <span className="text-muted-foreground">so that </span>
          {card.benefit || '—'}
        </div>
      </FieldBlock>

      <FieldBlock label="Conversation">
        <div
          className={
            card.conversation ? 'text-foreground' : 'italic text-muted-foreground'
          }
        >
          {card.conversation || 'No conversation recorded yet.'}
        </div>
      </FieldBlock>

      <FieldBlock label="Confirmation">
        {card.confirmation.length > 0 ? (
          <ul className="list-disc space-y-1 pl-4">
            {card.confirmation.map((criterion) => (
              <li key={criterion.id}>{criterion.text}</li>
            ))}
          </ul>
        ) : (
          <div className="italic text-muted-foreground">
            No acceptance criteria yet.
          </div>
        )}
      </FieldBlock>

      <FieldBlock label="Relationships" icon={<Link2 size={11} />}>
        <RelationshipManager
          card={card}
          otherCards={otherCards}
          relationships={related}
          onAdd={onAddRelationship}
          onRemove={onRemoveRelationship}
        />
      </FieldBlock>
    </div>
  )
}
