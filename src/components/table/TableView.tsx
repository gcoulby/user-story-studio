import { filterCardsByEpic } from '@/lib/cards'
import type { Actor, Card, Epic, Relationship } from '@/types/domain'

import { TableRow } from './TableRow'

interface TableViewProps {
  cards: Card[]
  actors: Actor[]
  epics: Epic[]
  relationships: Relationship[]
  activeEpicFilter: string | null
  selectedCardId: string | null
  onSelect: (id: string) => void
}

const HEADINGS = ['I want to', 'Actor', 'So that', 'Epics', 'Criteria', 'Links']

export function TableView({
  cards,
  actors,
  epics,
  relationships,
  activeEpicFilter,
  selectedCardId,
  onSelect,
}: TableViewProps) {
  const visible = filterCardsByEpic(cards, activeEpicFilter)
  const actorName = (id: string) =>
    actors.find((a) => a.id === id)?.name ?? '—'

  return (
    <div className="h-full overflow-auto p-5 text-sm">
      {visible.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No cards match this filter.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              {HEADINGS.map((heading) => (
                <th key={heading} className="px-2.5 py-1.5 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((card) => (
              <TableRow
                key={card.id}
                card={card}
                actorName={actorName(card.actorId)}
                epics={epics}
                relationships={relationships}
                selected={selectedCardId === card.id}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
