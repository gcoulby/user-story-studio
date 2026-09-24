import { useState, type MouseEvent } from 'react'
import { Pencil } from 'lucide-react'

import { Input } from '@/components/ui/input'

interface InlineNameProps {
  value: string
  onCommit: (value: string) => void
}

// Name that turns into an input on double-click or pencil click. Enter/blur
// commits, Escape cancels.
export function InlineName({ value, onCommit }: InlineNameProps) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = () => {
    if (draft !== null && draft.trim() && draft.trim() !== value) {
      onCommit(draft)
    }
    setDraft(null)
  }

  if (draft !== null) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setDraft(null)
        }}
        className="h-6 min-w-0 flex-1 px-1.5 text-xs"
      />
    )
  }

  const startEdit = (e: MouseEvent) => {
    e.stopPropagation()
    setDraft(value)
  }

  return (
    <>
      <span
        className="flex-1 text-muted-foreground"
        onDoubleClick={startEdit}
      >
        {value}
      </span>
      <button
        onClick={startEdit}
        className="shrink-0 text-muted-foreground/50 opacity-0 hover:text-foreground group-hover:opacity-100"
        aria-label={`Rename ${value}`}
      >
        <Pencil size={12} />
      </button>
    </>
  )
}
