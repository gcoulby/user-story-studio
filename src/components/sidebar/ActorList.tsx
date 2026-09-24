import { Trash2 } from 'lucide-react'
import type { MouseEvent } from 'react'

import { cn } from '@/lib/utils'
import type { Actor } from '@/types/domain'

import { InlineName } from './InlineName'

interface ActorListProps {
  actors: Actor[]
  activeActorId: string | null
  onToggle: (id: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function ActorList({ actors, activeActorId, onToggle, onRename, onDelete }: ActorListProps) {
  if (actors.length === 0) {
    return <div className="py-1 text-xs italic text-muted-foreground">None yet</div>
  }

  const handleDelete = (actor: Actor, e: MouseEvent) => {
    e.stopPropagation()
    if (
      window.confirm(
        `Delete actor "${actor.name}"? Cards using it will be disconnected, not deleted.`,
      )
    ) {
      onDelete(actor.id)
    }
  }

  return (
    <div>
      {actors.map((actor) => (
        <div
          key={actor.id}
          onClick={() => onToggle(actor.id)}
          className={cn(
            'group flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1',
            activeActorId === actor.id ? 'bg-muted' : 'hover:bg-muted/60',
          )}
        >
          <InlineName
            value={actor.name}
            onCommit={(name) => onRename(actor.id, name)}
          />
          <button
            onClick={(e) => handleDelete(actor, e)}
            className="shrink-0 text-muted-foreground/50 opacity-0 hover:text-destructive group-hover:opacity-100"
            aria-label={`Delete ${actor.name}`}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
