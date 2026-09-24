import { MetaSection, type MetaField } from '@/components/meta/MetaSection'
import type { Actor, Card, Epic, EpicTextField } from '@/types/domain'

interface EpicsViewProps {
  epics: Epic[]
  cards: Card[]
  actors: Actor[]
  activeEpicFilter: string | null
  selectedCardId: string | null
  onSelectCard: (id: string) => void
  onRename: (id: string, name: string) => void
  onRecolor: (id: string, color: string) => void
  onTextChange: (id: string, field: EpicTextField, value: string) => void
}

const FIELDS: Omit<MetaField<EpicTextField>, 'value'>[] = [
  {
    key: 'benefitHypothesis',
    label: 'Benefit hypothesis',
    placeholder:
      'We believe that … will result in … We will know we have succeeded when …',
  },
  {
    key: 'businessNeed',
    label: 'Business need',
    placeholder: 'Why this epic matters to the business',
  },
  {
    key: 'deliverables',
    label: 'Deliverables',
    placeholder: 'What will be delivered',
  },
  {
    key: 'dependencies',
    label: 'Dependencies',
    placeholder: 'Teams, systems or epics this relies on',
  },
]

export function EpicsView({
  epics,
  cards,
  actors,
  activeEpicFilter,
  selectedCardId,
  onSelectCard,
  onRename,
  onRecolor,
  onTextChange,
}: EpicsViewProps) {
  const visible = activeEpicFilter
    ? epics.filter((e) => e.id === activeEpicFilter)
    : epics

  return (
    <div className="h-full overflow-auto p-6">
      <div className="space-y-6">
        {visible.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No epics yet. Add one from the left rail.
          </div>
        )}
        {visible.map((epic) => (
          <MetaSection
            key={epic.id}
            title={epic.name}
            swatch={
              <input
                type="color"
                value={epic.color}
                onChange={(e) => onRecolor(epic.id, e.target.value)}
                aria-label={`Colour for ${epic.name}`}
                className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0"
              />
            }
            onRename={(name) => onRename(epic.id, name)}
            fields={FIELDS.map((f) => ({ ...f, value: epic[f.key] ?? '' }))}
            onFieldChange={(key, value) => onTextChange(epic.id, key, value)}
            storiesLabel="Requirements (Linked Stories)"
            stories={cards.filter((c) => c.epicIds.includes(epic.id))}
            emptyStories="No stories in this epic yet. Tag a story with it to list it here."
            eyebrow={(card) =>
              actors.find((a) => a.id === card.actorId)?.name ?? 'no actor'
            }
            selectedCardId={selectedCardId}
            onSelectCard={onSelectCard}
          />
        ))}
      </div>
    </div>
  )
}
