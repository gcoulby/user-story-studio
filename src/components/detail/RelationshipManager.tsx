import { useState } from 'react'
import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  RELATIONSHIP_TYPES,
  RELATIONSHIP_TYPE_ORDER,
} from '@/config/relationship-types'
import type { NewRelationshipInput } from '@/hooks/useStudioData'
import type { Card, Relationship, RelationshipType } from '@/types/domain'

interface RelationshipManagerProps {
  card: Card
  otherCards: Card[]
  relationships: Relationship[]
  onAdd: (input: NewRelationshipInput) => void
  onRemove: (id: string) => void
}

// Source card is implicit — always the selected card. The user picks a type,
// a target card, and (for `extends`) an optional condition note.
export function RelationshipManager({
  card,
  otherCards,
  relationships,
  onAdd,
  onRemove,
}: RelationshipManagerProps) {
  const [type, setType] = useState<RelationshipType>('includes')
  const [targetId, setTargetId] = useState('')
  const [note, setNote] = useState('')

  const submit = () => {
    if (!targetId) return
    onAdd({ sourceId: card.id, targetId, type, note })
    setTargetId('')
    setNote('')
  }

  return (
    <div>
      {relationships.length === 0 && (
        <div className="mb-2 italic text-muted-foreground">None yet.</div>
      )}
      {relationships.map((relationship) => {
        const outgoing = relationship.sourceId === card.id
        const other = otherCards.find(
          (c) =>
            c.id ===
            (outgoing ? relationship.targetId : relationship.sourceId),
        )
        const display = RELATIONSHIP_TYPES[relationship.type]
        return (
          <div key={relationship.id} className="mb-1.5 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-sm"
              style={{ background: display.color }}
            />
            <span className="text-[13px] text-foreground">
              {outgoing ? display.label : `${display.label} by`}{' '}
              <b className="font-medium">{other?.goal ?? '(deleted)'}</b>
              {relationship.note && (
                <span className="text-muted-foreground">
                  {' '}
                  · {relationship.note}
                </span>
              )}
            </span>
            <button
              onClick={() => onRemove(relationship.id)}
              className="ml-auto text-muted-foreground/60 hover:text-foreground"
            >
              <X size={12} />
            </button>
          </div>
        )
      })}

      <div className="mt-3 space-y-1.5">
        <div className="flex gap-1.5">
          <Select
            value={type}
            onValueChange={(value) => setType(value as RelationshipType)}
          >
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIP_TYPE_ORDER.map((key) => (
                <SelectItem key={key} value={key}>
                  {RELATIONSHIP_TYPES[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger className="h-8 min-w-0 flex-1 text-xs">
              <SelectValue placeholder="target card…" />
            </SelectTrigger>
            <SelectContent>
              {otherCards.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.goal || c.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {type === 'extends' && (
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="condition, e.g. if tier = high"
            className="h-8 text-xs"
          />
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full text-xs"
          onClick={submit}
        >
          <Plus size={13} />
          Add relationship
        </Button>
      </div>
    </div>
  )
}
