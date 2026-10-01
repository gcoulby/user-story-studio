import { useState } from 'react'
import { ArrowDown, ArrowUp, Check, Pencil, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { PiTextField } from '@/hooks/useStudioData'
import type { Epic, PiObjective, PiVision } from '@/types/domain'

interface PiViewProps {
  piVision: PiVision
  epics: Epic[]
  onTextChange: (field: PiTextField, value: string) => void
  onTimeframeChange: (start: string, end: string) => void
  onAddObjective: (text: string) => void
  onUpdateObjective: (
    id: string,
    patch: Partial<Omit<PiObjective, 'id'>>,
  ) => void
  onRemoveObjective: (id: string) => void
  onReorderEpicPriority: (epicIds: string[]) => void
}

const TEXT_FIELDS: { key: PiTextField; label: string; placeholder: string }[] = [
  {
    key: 'highLevelVision',
    label: 'High-Level Vision',
    placeholder: 'The one or two sentences this PI is ultimately in service of',
  },
  {
    key: 'visionDetails',
    label: 'Vision Details',
    placeholder: 'Context, scope and constraints behind the headline vision',
  },
  {
    key: 'demonstrationOutline',
    label: 'Demonstration Outline',
    placeholder: 'What will be shown at the system demo, and in what order',
  },
  {
    key: 'risksAndDependencies',
    label: 'Risks & Dependencies',
    placeholder: 'Known risks, ROAM items, and cross-team dependencies',
  },
]

export function PiView({
  piVision,
  epics,
  onTextChange,
  onTimeframeChange,
  onAddObjective,
  onUpdateObjective,
  onRemoveObjective,
  onReorderEpicPriority,
}: PiViewProps) {
  const [newObjective, setNewObjective] = useState('')
  const [editingObjectiveId, setEditingObjectiveId] = useState<string | null>(
    null,
  )

  const orderedEpics = piVision.epicPriority
    .map((id) => epics.find((e) => e.id === id))
    .filter((e): e is Epic => e !== undefined)

  const moveEpic = (index: number, delta: number) => {
    const next = [...piVision.epicPriority]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onReorderEpicPriority(next)
  }

  const submitObjective = () => {
    if (!newObjective.trim()) return
    onAddObjective(newObjective)
    setNewObjective('')
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <Label>{TEXT_FIELDS[0].label}</Label>
          <Textarea
            value={piVision.highLevelVision ?? ''}
            onChange={(e) => onTextChange('highLevelVision', e.target.value)}
            rows={3}
            placeholder={TEXT_FIELDS[0].placeholder}
            className="mt-1 resize-y"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <Label>Start</Label>
              <Input
                type="date"
                value={piVision.timeframeStart ?? ''}
                onChange={(e) =>
                  onTimeframeChange(e.target.value, piVision.timeframeEnd ?? '')
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>End</Label>
              <Input
                type="date"
                value={piVision.timeframeEnd ?? ''}
                onChange={(e) =>
                  onTimeframeChange(piVision.timeframeStart ?? '', e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <Label>Objectives</Label>
          {piVision.objectives.length === 0 && (
            <div className="mt-1 text-xs italic text-muted-foreground">
              No objectives yet.
            </div>
          )}
          <ul className="mt-2 space-y-3">
            {piVision.objectives.map((objective) => (
              <li
                key={objective.id}
                className="rounded-md border border-border p-3"
              >
                <div className="flex items-start gap-2">
                  {editingObjectiveId === objective.id ? (
                    <Textarea
                      value={objective.text}
                      onChange={(e) =>
                        onUpdateObjective(objective.id, {
                          text: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          setEditingObjectiveId(null)
                        }
                      }}
                      autoFocus
                      rows={2}
                      className="flex-1 resize-y text-sm"
                    />
                  ) : (
                    <p className="flex-1 break-words text-sm leading-relaxed">
                      {objective.text}
                    </p>
                  )}
                  <button
                    onClick={() =>
                      setEditingObjectiveId((cur) =>
                        cur === objective.id ? null : objective.id,
                      )
                    }
                    className="shrink-0 text-muted-foreground/60 hover:text-foreground"
                    aria-label={
                      editingObjectiveId === objective.id
                        ? 'Done editing objective'
                        : 'Edit objective'
                    }
                  >
                    {editingObjectiveId === objective.id ? (
                      <Check size={14} />
                    ) : (
                      <Pencil size={13} />
                    )}
                  </button>
                  <button
                    onClick={() => onRemoveObjective(objective.id)}
                    className="shrink-0 text-muted-foreground/60 hover:text-foreground"
                    aria-label="Remove objective"
                  >
                    <X size={14} />
                  </button>
                </div>
                {epics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-3">
                    {epics.map((epic) => {
                      const checked = objective.epicIds.includes(epic.id)
                      return (
                        <label
                          key={epic.id}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(next) =>
                              onUpdateObjective(objective.id, {
                                epicIds: next
                                  ? [...objective.epicIds, epic.id]
                                  : objective.epicIds.filter(
                                      (id) => id !== epic.id,
                                    ),
                              })
                            }
                          />
                          {epic.name}
                        </label>
                      )
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-1.5">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitObjective()}
              placeholder="New objective…"
              className="h-8 flex-1 text-xs"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={submitObjective}
            >
              <Plus size={13} />
              Add
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <Label>Epic Priority</Label>
          {orderedEpics.length === 0 && (
            <div className="mt-1 text-xs italic text-muted-foreground">
              No epics yet. Add one from the left rail.
            </div>
          )}
          <ol className="mt-2 space-y-1.5">
            {orderedEpics.map((epic, index) => (
              <li
                key={epic.id}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2"
              >
                <span className="w-5 text-xs text-muted-foreground">
                  {index + 1}
                </span>
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: epic.color }}
                />
                <span className="flex-1 text-sm">{epic.name}</span>
                <button
                  onClick={() => moveEpic(index, -1)}
                  disabled={index === 0}
                  className="text-muted-foreground/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveEpic(index, 1)}
                  disabled={index === orderedEpics.length - 1}
                  className="text-muted-foreground/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown size={14} />
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4">
            {TEXT_FIELDS.slice(1).map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Textarea
                  value={piVision[key] ?? ''}
                  onChange={(e) => onTextChange(key, e.target.value)}
                  rows={4}
                  placeholder={placeholder}
                  className="mt-1 resize-y"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
