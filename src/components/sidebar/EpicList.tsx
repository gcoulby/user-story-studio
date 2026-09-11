import { Trash2 } from 'lucide-react'
import type { MouseEvent } from 'react'

import { cn } from '@/lib/utils'
import type { Card, Epic } from '@/types/domain'

interface EpicListProps {
  epics: Epic[]
  cards: Card[]
  activeEpicFilter: string | null
  onToggleFilter: (epicId: string) => void
  onDelete: (id: string) => void
}

// Clicking an epic here toggles the cross-view filter. This is separate from the
// graph's "show epic regions" toggle.
export function EpicList({
  epics,
  cards,
  activeEpicFilter,
  onToggleFilter,
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
            <span
              className="h-2 w-2 shrink-0 rounded-sm"
              style={{ background: epic.color }}
            />
            <span className="flex-1 text-muted-foreground">{epic.name}</span>
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
