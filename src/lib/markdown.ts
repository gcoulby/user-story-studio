import { RELATIONSHIP_TYPES } from '@/config/relationship-types'
import { groupCardsByActor, storySentence } from '@/lib/cards'
import { studioToMermaid } from '@/lib/mermaid'
import type { StudioData } from '@/types/domain'

// Human-readable rendering of a user story map: stories grouped by actor, each
// with its trigger, conversation notes, acceptance criteria, epics and typed
// relationships spelled out in prose.
export function studioToMarkdown(data: StudioData, title: string): string {
  const { actors, epics, cards, relationships } = data
  const epicName = (id: string) => epics.find((e) => e.id === id)?.name ?? id
  const cardGoal = (id: string) =>
    cards.find((c) => c.id === id)?.goal ?? '(deleted card)'

  const lines: string[] = [`# ${title}`, '']

  lines.push(
    `_${cards.length} ${plural(cards.length, 'story', 'stories')}, ` +
      `${actors.length} ${plural(actors.length, 'actor')}, ` +
      `${epics.length} ${plural(epics.length, 'epic')}._`,
    '',
  )

  const diagram = studioToMermaid(data)
  if (diagram) {
    lines.push('## Diagram', '', '```mermaid', diagram, '```', '')
  }

  if (epics.length > 0) {
    lines.push('## Epics', '')
    for (const epic of epics) {
      lines.push(`### ${epic.name}`, '')
      const fields: [string, string | undefined][] = [
        ['Benefit hypothesis', epic.benefitHypothesis],
        ['Business need', epic.businessNeed],
        ['Deliverables', epic.deliverables],
        ['Dependencies', epic.dependencies],
      ]
      for (const [label, value] of fields) {
        if (value?.trim()) lines.push(`**${label}**`, '', value.trim(), '')
      }
      const members = cards.filter((c) => c.epicIds.includes(epic.id))
      if (members.length > 0) {
        lines.push('**Requirements**', '')
        for (const card of members) {
          const actor = actors.find((a) => a.id === card.actorId)?.name
          lines.push(`- ${actor ? `${actor}: ` : ''}${card.goal || 'Untitled story'}`)
        }
        lines.push('')
      }
    }
  }

  for (const group of groupCardsByActor(cards, actors)) {
    lines.push(`## ${group.actor.name}`, '')
    for (const card of group.cards) {
      lines.push(`### ${card.goal || 'Untitled story'}`, '')
      lines.push(`> ${storySentence(card, group.actor.name)}`, '')

      if (card.trigger) lines.push(`- **When:** ${card.trigger}`)
      if (card.epicIds.length > 0) {
        lines.push(`- **Epics:** ${card.epicIds.map(epicName).join(', ')}`)
      }

      const related = relationships.filter((r) => r.sourceId === card.id)
      for (const rel of related) {
        const label = RELATIONSHIP_TYPES[rel.type].label
        const note = rel.note ? ` (${rel.note})` : ''
        lines.push(`- **${label}:** ${cardGoal(rel.targetId)}${note}`)
      }
      if (card.trigger || card.epicIds.length > 0 || related.length > 0) {
        lines.push('')
      }

      if (card.conversation) {
        lines.push('**Conversation**', '', card.conversation, '')
      }

      if (card.confirmation.length > 0) {
        lines.push('**Confirmation**', '')
        for (const criterion of card.confirmation) {
          lines.push(`- [ ] ${criterion.text}`)
        }
        lines.push('')
      }
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

function plural(count: number, one: string, many = `${one}s`): string {
  return count === 1 ? one : many
}
