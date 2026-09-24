import { useState, type ReactNode } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Card } from '@/types/domain'

export interface MetaField<K extends string> {
  key: K
  label: string
  placeholder: string
  value: string
}

interface MetaSectionProps<K extends string> {
  title: string
  swatch?: ReactNode
  onRename: (name: string) => void
  fields: MetaField<K>[]
  onFieldChange: (key: K, value: string) => void
  storiesLabel: string
  stories: Card[]
  emptyStories: string
  eyebrow: (card: Card) => string | null
  selectedCardId: string | null
  onSelectCard: (id: string) => void
}

// One full-width page-style section: an editable title, free-text metadata
// fields, and the stories linked to the entity (with their "so that").
export function MetaSection<K extends string>({
  title,
  swatch,
  onRename,
  fields,
  onFieldChange,
  storiesLabel,
  stories,
  emptyStories,
  eyebrow,
  selectedCardId,
  onSelectCard,
}: MetaSectionProps<K>) {
  // Title edits commit on blur/Enter so an empty draft never reaches the data.
  const [draft, setDraft] = useState(title)
  const [prevTitle, setPrevTitle] = useState(title)
  if (title !== prevTitle) {
    setPrevTitle(title)
    setDraft(title)
  }

  const commitTitle = () => {
    if (draft.trim()) onRename(draft)
    else setDraft(title)
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2.5">
        {swatch}
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          aria-label="Title"
          className="h-9 border-transparent bg-transparent text-base font-semibold shadow-none hover:border-border"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {fields.map(({ key, label, placeholder, value }) => (
          <div key={key}>
            <Label>{label}</Label>
            <Textarea
              value={value}
              onChange={(e) => onFieldChange(key, e.target.value)}
              rows={4}
              placeholder={placeholder}
              className="mt-1 resize-y"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Label>{storiesLabel}</Label>
        {stories.length === 0 ? (
          <div className="mt-1 text-xs italic text-muted-foreground">
            {emptyStories}
          </div>
        ) : (
          <ul className="mt-1 space-y-1.5">
            {stories.map((card) => {
              const label = eyebrow(card)
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
                    {label && (
                      <div className="font-mono text-[9.5px] uppercase tracking-wide text-muted-foreground">
                        {label}
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">I want to </span>
                      {card.goal || '…'}
                    </div>
                    {card.benefit && (
                      <div className="text-muted-foreground">
                        so that {card.benefit}
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
