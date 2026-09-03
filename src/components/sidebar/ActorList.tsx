import type { Actor } from '@/types/domain'

interface ActorListProps {
  actors: Actor[]
}

export function ActorList({ actors }: ActorListProps) {
  if (actors.length === 0) {
    return <div className="py-1 text-xs italic text-muted-foreground">None yet</div>
  }
  return (
    <div>
      {actors.map((actor) => (
        <div key={actor.id} className="py-1 text-muted-foreground">
          {actor.name}
        </div>
      ))}
    </div>
  )
}
