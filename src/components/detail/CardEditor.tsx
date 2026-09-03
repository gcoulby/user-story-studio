import { useMemo, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'

import { EpicChip } from '@/components/EpicChip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createEmptyCard } from '@/lib/create-card'
import { newId } from '@/lib/id'
import type { Actor, Card, Epic } from '@/types/domain'

interface CardEditorProps {
  card: Card | null
  actors: Actor[]
  epics: Epic[]
  onSave: (card: Card) => void
  onCancel: () => void
  onDelete: (() => void) | null
}

export function CardEditor({
  card,
  actors,
  epics,
  onSave,
  onCancel,
  onDelete,
}: CardEditorProps) {
  const [draft, setDraft] = useState<Card>(() =>
    card
      ? {
          ...card,
          confirmation: card.confirmation.map((c) => ({ ...c })),
          epicIds: [...card.epicIds],
        }
      : createEmptyCard(actors[0]?.id ?? ''),
  )
  const [newCriterion, setNewCriterion] = useState('')

  const set = <K extends keyof Card>(key: K) => (value: Card[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const toggleEpic = (epicId: string) =>
    setDraft((d) => ({
      ...d,
      epicIds: d.epicIds.includes(epicId)
        ? d.epicIds.filter((id) => id !== epicId)
        : [...d.epicIds, epicId],
    }))

  const addCriterion = () => {
    const text = newCriterion.trim()
    if (!text) return
    setDraft((d) => ({
      ...d,
      confirmation: [...d.confirmation, { id: newId('ac'), text }],
    }))
    setNewCriterion('')
  }

  const removeCriterion = (id: string) =>
    setDraft((d) => ({
      ...d,
      confirmation: d.confirmation.filter((c) => c.id !== id),
    }))

  const canSave = useMemo(
    () => draft.goal.trim().length > 0 && draft.actorId.length > 0,
    [draft.goal, draft.actorId],
  )

  return (
    <div className="p-5 text-sm">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          {onDelete ? 'Edit card' : 'New card'}
        </div>
        {onDelete && (
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={onDelete}
          >
            <Trash2 size={13} />
          </Button>
        )}
      </div>

      <Label>Actor</Label>
      <Select
        value={draft.actorId}
        onValueChange={(value) => set('actorId')(value)}
      >
        <SelectTrigger className="mb-3 mt-1">
          <SelectValue placeholder="choose actor…" />
        </SelectTrigger>
        <SelectContent>
          {actors.map((actor) => (
            <SelectItem key={actor.id} value={actor.id}>
              {actor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>When (trigger)</Label>
      <Input
        value={draft.trigger}
        onChange={(e) => set('trigger')(e.target.value)}
        placeholder="An insured loss occurs"
        className="mb-3 mt-1"
      />

      <Label emphasis>I want to</Label>
      <Textarea
        value={draft.goal}
        onChange={(e) => set('goal')(e.target.value)}
        rows={2}
        placeholder="submit a claim online"
        className="mb-3 mt-1 resize-none"
      />

      <Label>So that</Label>
      <Input
        value={draft.benefit}
        onChange={(e) => set('benefit')(e.target.value)}
        placeholder="I don't have to call and wait"
        className="mb-3 mt-1"
      />

      <Label>Conversation notes</Label>
      <Textarea
        value={draft.conversation}
        onChange={(e) => set('conversation')(e.target.value)}
        rows={3}
        placeholder="What was actually discussed, and with whom"
        className="mb-3 mt-1 resize-y"
      />

      <Label>Confirmation (acceptance criteria)</Label>
      <div className="mb-1 mt-1 space-y-1">
        {draft.confirmation.map((criterion) => (
          <div key={criterion.id} className="flex items-center gap-2">
            <span className="flex-1 text-[13px]">{criterion.text}</span>
            <button
              onClick={() => removeCriterion(criterion.id)}
              className="text-muted-foreground/60 hover:text-foreground"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="mb-3 flex gap-1.5">
        <Input
          value={newCriterion}
          onChange={(e) => setNewCriterion(e.target.value)}
          placeholder="Given / when / then…"
          onKeyDown={(e) => e.key === 'Enter' && addCriterion()}
        />
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={addCriterion}
        >
          <Plus size={13} />
        </Button>
      </div>

      <Label>Epics</Label>
      <div className="mb-5 mt-1 flex flex-wrap gap-1.5">
        {epics.map((epic) => (
          <EpicChip
            key={epic.id}
            epic={epic}
            selected={draft.epicIds.includes(epic.id)}
            onClick={() => toggleEpic(epic.id)}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={!canSave}
          onClick={() => onSave({ ...draft, goal: draft.goal.trim() })}
        >
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
