import { Layers2, Link2, Pencil, Trash2 } from 'lucide-react'

import { EpicChip } from '@/components/EpicChip'
import { PriorityBadge } from '@/components/PriorityBadge'
import { StretchBadge } from '@/components/StretchBadge'
import { isStretch } from '@/lib/cards'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { cardEpics } from '@/lib/cards'
import { DEFAULT_PRIORITY, PRIORITIES, PRIORITY_ORDER } from '@/config/priority'
import type { NewRelationshipInput } from '@/hooks/useStudioData'
import type {
  Card,
  CardCommitment,
  CardPriority,
  Epic,
  Relationship,
} from '@/types/domain'

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
  onToggleEpic: (epicId: string) => void
  onSetPriority: (priority: CardPriority) => void
  onSetCommitment: (commitment: CardCommitment) => void
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
  onToggleEpic,
  onSetPriority,
  onSetCommitment,
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

      {(chips.length > 0 ||
        isStretch(card) ||
        (card.priority && card.priority !== 'medium')) && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {isStretch(card) && <StretchBadge />}
          {card.priority && card.priority !== 'medium' && (
            <PriorityBadge priority={card.priority} />
          )}
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
        <div className="mb-1.5">
          <span className="text-muted-foreground">when </span>
          {card.trigger || '—'}
        </div>
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

      <FieldBlock label="Planning" icon={<Layers2 size={11} />}>
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {epics.map((epic) => (
            <EpicChip
              key={epic.id}
              epic={epic}
              selected={card.epicIds.includes(epic.id)}
              onClick={() => onToggleEpic(epic.id)}
            />
          ))}
          {epics.length === 0 && (
            <span className="text-xs italic text-muted-foreground">
              No epics yet.
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Select
            value={card.priority ?? DEFAULT_PRIORITY}
            onValueChange={(value) => onSetPriority(value as CardPriority)}
          >
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_ORDER.map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITIES[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="inline-flex rounded-md border border-border p-0.5">
            {(['committed', 'stretch'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSetCommitment(option)}
                className={cn(
                  'rounded-[5px] px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                  (card.commitment ?? 'committed') === option
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
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
