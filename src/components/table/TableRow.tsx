import { EpicChip } from '@/components/EpicChip'
import { cardEpics } from '@/lib/cards'
import { cn } from '@/lib/utils'
import type { Card, Epic, Relationship } from '@/types/domain'

interface TableRowProps {
  card: Card
  actorName: string
  epics: Epic[]
  relationships: Relationship[]
  selected: boolean
  onSelect: (id: string) => void
}

export function TableRow({
  card,
  actorName,
  epics,
  relationships,
  selected,
  onSelect,
}: TableRowProps) {
  const linkCount = relationships.filter(
    (r) => r.sourceId === card.id || r.targetId === card.id,
  ).length

  return (
    <tr
      onClick={() => onSelect(card.id)}
      className={cn(
        'cursor-pointer border-t border-border/60 hover:bg-muted/50',
        selected && 'bg-muted/70',
      )}
    >
      <td className="px-2.5 py-2 font-medium text-foreground">
        {card.goal || '…'}
      </td>
      <td className="px-2.5 py-2 text-muted-foreground">{actorName}</td>
      <td className="px-2.5 py-2 text-muted-foreground">{card.benefit || '—'}</td>
      <td className="px-2.5 py-2">
        <div className="flex flex-wrap gap-1">
          {cardEpics(card, epics).map((epic) => (
            <EpicChip key={epic.id} epic={epic} />
          ))}
        </div>
      </td>
      <td className="px-2.5 py-2 text-muted-foreground">
        {card.confirmation.length}
      </td>
      <td className="px-2.5 py-2 text-muted-foreground">{linkCount}</td>
    </tr>
  )
}
