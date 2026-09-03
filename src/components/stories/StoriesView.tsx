import { filterCardsByEpic, groupCardsByActor } from '@/lib/cards'
import type { Actor, Card, Epic } from '@/types/domain'

import { StoryCard } from './StoryCard'

interface StoriesViewProps {
  cards: Card[]
  actors: Actor[]
  epics: Epic[]
  activeEpicFilter: string | null
  selectedCardId: string | null
  onSelect: (id: string) => void
}

export function StoriesView({
  cards,
  actors,
  epics,
  activeEpicFilter,
  selectedCardId,
  onSelect,
}: StoriesViewProps) {
  const groups = groupCardsByActor(
    filterCardsByEpic(cards, activeEpicFilter),
    actors,
  )

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-3xl">
        {groups.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No stories match this filter.
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.actor.id} className="mb-8">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.actor.name}
              </h2>
              <div className="space-y-3">
                {group.cards.map((card) => (
                  <StoryCard
                    key={card.id}
                    card={card}
                    actorName={group.actor.name}
                    epics={epics}
                    selected={selectedCardId === card.id}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
