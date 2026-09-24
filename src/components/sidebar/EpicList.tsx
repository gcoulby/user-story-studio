import { Trash2 } from 'lucide-react'
import type { MouseEvent } from 'react'

import { cn } from '@/lib/utils'
import type { Card, Epic } from '@/types/domain'

import { InlineName } from './InlineName'

interface EpicListProps {
  epics: Epic[]
  cards: Card[]
  activeEpicFilter: string | null
  onToggleFilter: (epicId: string) => void
  onRename: (id: string, name: string) => void
  onRecolor: (id: string, color: string) => void
  onDelete: (id: string) => void
}

// Clicking an epic here toggles the cross-view filter. This is separate from the
// graph's "show epic regions" toggle.
export function EpicList({
  epics,
  cards,
  activeEpicFilter,
  onToggleFilter,
  onRename,
  onRecolor,
  onDelete,
}: EpicListProps) {
  if (epics.length === 0) {
    return (
      <div className="py-1 text-xs italic text-muted-foreground">None yet</div>
    )
  }

  const handleDelete = (epic: Epic, e: MouseEvent) => {
    e.stopPropagation()
    if (
      window.confirm(
        `Delete epic "${epic.name}"? Cards using it will be disconnected, not deleted.`,
      )
    ) {
      onDelete(epic.id)
    }
  }

  return (
    <div>
      {epics.map((epic) => {
        const count = cards.filter((c) => c.epicIds.includes(epic.id)).length
        return (
          <div
            key={epic.id}
            onClick={() => onToggleFilter(epic.id)}
            className={cn(
              'group flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1',
              activeEpicFilter === epic.id ? 'bg-muted' : 'hover:bg-muted/60',
            )}
          >
            <input
              type="color"
              value={epic.color}
              onChange={(e) => onRecolor(epic.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Colour for ${epic.name}`}
              className="h-3 w-3 shrink-0 cursor-pointer appearance-none rounded-sm border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0"
            />
            <InlineName
              value={epic.name}
              onCommit={(name) => onRename(epic.id, name)}
            />
            <span className="text-xs text-muted-foreground">{count}</span>
            <button
              onClick={(e) => handleDelete(epic, e)}
              className="shrink-0 text-muted-foreground/50 opacity-0 hover:text-destructive group-hover:opacity-100"
              aria-label={`Delete ${epic.name}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
