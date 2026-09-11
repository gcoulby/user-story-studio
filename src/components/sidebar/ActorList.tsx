import { Trash2 } from 'lucide-react'

import type { Actor } from '@/types/domain'

interface ActorListProps {
  actors: Actor[]
  onDelete: (id: string) => void
}

export function ActorList({ actors, onDelete }: ActorListProps) {
  if (actors.length === 0) {
    return <div className="py-1 text-xs italic text-muted-foreground">None yet</div>
  }

  const handleDelete = (actor: Actor) => {
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
          className="group flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted/60"
        >
          <span className="flex-1 text-muted-foreground">{actor.name}</span>
          <button
            onClick={() => handleDelete(actor)}
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
