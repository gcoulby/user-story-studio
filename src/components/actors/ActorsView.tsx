import { MetaSection, type MetaField } from '@/components/meta/MetaSection'
import type { Actor, ActorTextField, Card, Epic } from '@/types/domain'

interface ActorsViewProps {
  actors: Actor[]
  cards: Card[]
  epics: Epic[]
  activeActorId: string | null
  selectedCardId: string | null
  onSelectCard: (id: string) => void
  onRename: (id: string, name: string) => void
  onTextChange: (id: string, field: ActorTextField, value: string) => void
}

const FIELDS: Omit<MetaField<ActorTextField>, 'value'>[] = [
  {
    key: 'description',
    label: 'Description',
    placeholder: 'Who they are and what their role is',
  },
  {
    key: 'goals',
    label: 'Goals & motivations',
    placeholder: 'What they are trying to achieve and why',
  },
  {
    key: 'painPoints',
    label: 'Pain points',
    placeholder: 'What frustrates or blocks them today',
  },
  {
    key: 'context',
    label: 'Context & environment',
    placeholder: 'Tools, frequency of use, technical comfort, constraints',
  },
]

export function ActorsView({
  actors,
  cards,
  epics,
  activeActorId,
  selectedCardId,
  onSelectCard,
  onRename,
  onTextChange,
}: ActorsViewProps) {
  const active = actors.find((a) => a.id === activeActorId)
  const visible = active ? [active] : actors

  return (
    <div className="h-full overflow-auto p-6">
      <div className="space-y-6">
        {visible.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No actors yet. Add one from the left rail.
          </div>
        )}
        {visible.map((actor) => (
          <MetaSection
            key={actor.id}
            title={actor.name}
            onRename={(name) => onRename(actor.id, name)}
            fields={FIELDS.map((f) => ({ ...f, value: actor[f.key] ?? '' }))}
            onFieldChange={(key, value) => onTextChange(actor.id, key, value)}
            storiesLabel="Linked Stories"
            stories={cards.filter((c) => c.actorId === actor.id)}
            emptyStories="No stories for this actor yet."
            eyebrow={(card) => {
              const names = card.epicIds
                .map((id) => epics.find((e) => e.id === id)?.name)
                .filter(Boolean)
              return names.length > 0 ? names.join(' · ') : null
            }}
            selectedCardId={selectedCardId}
            onSelectCard={onSelectCard}
          />
        ))}
      </div>
    </div>
  )
}
