import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Actor, Card, Epic, EpicTextField } from '@/types/domain'

interface EpicsViewProps {
  epics: Epic[]
  cards: Card[]
  actors: Actor[]
  activeEpicFilter: string | null
  selectedCardId: string | null
  onSelectCard: (id: string) => void
  onRename: (id: string, name: string) => void
  onRecolor: (id: string, color: string) => void
  onTextChange: (id: string, field: EpicTextField, value: string) => void
}

const TEXT_FIELDS: {
  field: EpicTextField
  label: string
  placeholder: string
}[] = [
  {
    field: 'benefitHypothesis',
    label: 'Benefit hypothesis',
    placeholder: 'We believe that … will result in … We will know we have succeeded when …',
  },
  {
    field: 'businessNeed',
    label: 'Business need',
    placeholder: 'Why this epic matters to the business',
  },
  {
    field: 'deliverables',
    label: 'Deliverables',
    placeholder: 'What will be delivered',
  },
  {
    field: 'dependencies',
    label: 'Dependencies',
    placeholder: 'Teams, systems or epics this relies on',
  },
]

export function EpicsView({
  epics,
  cards,
  actors,
  activeEpicFilter,
  selectedCardId,
  onSelectCard,
  onRename,
  onRecolor,
  onTextChange,
}: EpicsViewProps) {
  const visible = activeEpicFilter
    ? epics.filter((e) => e.id === activeEpicFilter)
    : epics

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-3xl space-y-6">
        {visible.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No epics yet. Add one from the left rail.
          </div>
        )}
        {visible.map((epic) => (
          <EpicSection
            key={epic.id}
            epic={epic}
            stories={cards.filter((c) => c.epicIds.includes(epic.id))}
            actors={actors}
            selectedCardId={selectedCardId}
            onSelectCard={onSelectCard}
            onRename={onRename}
            onRecolor={onRecolor}
            onTextChange={onTextChange}
          />
        ))}
      </div>
    </div>
  )
}

interface EpicSectionProps {
  epic: Epic
  stories: Card[]
  actors: Actor[]
  selectedCardId: string | null
  onSelectCard: (id: string) => void
  onRename: (id: string, name: string) => void
  onRecolor: (id: string, color: string) => void
  onTextChange: (id: string, field: EpicTextField, value: string) => void
}

function EpicSection({
  epic,
  stories,
  actors,
  selectedCardId,
  onSelectCard,
  onRename,
  onRecolor,
  onTextChange,
}: EpicSectionProps) {
  // Title edits commit on blur/Enter so an empty draft never reaches the data.
  const [title, setTitle] = useState(epic.name)
  const [prevName, setPrevName] = useState(epic.name)
  if (epic.name !== prevName) {
    setPrevName(epic.name)
    setTitle(epic.name)
  }

  const commitTitle = () => {
    if (title.trim()) onRename(epic.id, title)
    else setTitle(epic.name)
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <input
          type="color"
          value={epic.color}
          onChange={(e) => onRecolor(epic.id, e.target.value)}
          aria-label={`Colour for ${epic.name}`}
          className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0"
        />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          aria-label="Epic title"
          className="h-9 border-transparent bg-transparent text-base font-semibold shadow-none hover:border-border"
        />
      </div>

      <div className="space-y-3.5">
        {TEXT_FIELDS.map(({ field, label, placeholder }) => (
          <div key={field}>
            <Label>{label}</Label>
            <Textarea
              value={epic[field] ?? ''}
              onChange={(e) => onTextChange(epic.id, field, e.target.value)}
              rows={2}
              placeholder={placeholder}
              className="mt-1 resize-y"
            />
          </div>
        ))}

        <div>
          <Label>Requirements</Label>
          {stories.length === 0 ? (
            <div className="mt-1 text-xs italic text-muted-foreground">
              No stories in this epic yet. Tag a story with it to list it here.
            </div>
          ) : (
            <ul className="mt-1 space-y-1">
              {stories.map((card) => {
                const actor = actors.find((a) => a.id === card.actorId)
                return (
                  <li key={card.id}>
                    <button
                      onClick={() => onSelectCard(card.id)}
                      className={cn(
                        'w-full rounded-md border px-3 py-2 text-left text-[13px] transition-colors hover:bg-muted/60',
                        selectedCardId === card.id
                          ? 'border-foreground bg-muted/60'
                          : 'border-border',
                      )}
                    >
                      <span className="font-mono text-[9.5px] uppercase tracking-wide text-muted-foreground">
                        {actor?.name ?? 'no actor'}
                      </span>
                      <div>
                        <span className="text-muted-foreground">I want to </span>
                        {card.goal || '…'}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
