import { EpicChip } from '@/components/EpicChip'
import { cardEpics } from '@/lib/cards'
import { cn } from '@/lib/utils'
import type { Card, Epic } from '@/types/domain'

interface StoryCardProps {
  card: Card
  actorName: string
  epics: Epic[]
  selected: boolean
  onSelect: (id: string) => void
}

export function StoryCard({
  card,
  actorName,
  epics,
  selected,
  onSelect,
}: StoryCardProps) {
  return (
    <div
      onClick={() => onSelect(card.id)}
      className={cn(
        'cursor-pointer rounded-lg border p-4 transition-colors',
        selected
          ? 'border-primary'
          : 'border-border hover:border-muted-foreground/40',
      )}
    >
      <p className="text-[15px] leading-relaxed text-foreground">
        <span className="text-muted-foreground">As a </span>
        <b className="font-medium">{actorName}</b>
        <span className="text-muted-foreground">, I want to </span>
        {card.goal || '…'}
        {card.benefit && (
          <>
            <span className="text-muted-foreground">, so that </span>
            {card.benefit}
          </>
        )}
        <span className="text-muted-foreground">.</span>
      </p>
      {card.trigger && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          when: {card.trigger}
        </p>
      )}
      {cardEpics(card, epics).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {cardEpics(card, epics).map((epic) => (
            <EpicChip key={epic.id} epic={epic} />
          ))}
        </div>
      )}
    </div>
  )
}
