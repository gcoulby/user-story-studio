import { RELATIONSHIP_TYPES } from '@/config/relationship-types'
import { groupCardsByActor, isStretch, storySentence } from '@/lib/cards'
import { actorToMermaid, epicToMermaid, studioToMermaid } from '@/lib/mermaid'
import type { StudioData } from '@/types/domain'

// Human-readable rendering of a user story map: stories grouped by actor, each
// with its trigger, conversation notes, acceptance criteria, epics and typed
// relationships spelled out in prose.
export function studioToMarkdown(data: StudioData, title: string): string {
  const { actors, epics, cards, relationships, piVision } = data
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

  const hasExecSummary =
    piVision.highLevelVision?.trim() ||
    piVision.visionDetails?.trim() ||
    piVision.demonstrationOutline?.trim() ||
    piVision.risksAndDependencies?.trim() ||
    piVision.timeframeStart ||
    piVision.objectives.length > 0

  if (hasExecSummary) {
    lines.push('## Executive Summary', '')

    if (piVision.highLevelVision?.trim()) {
      lines.push(`**Vision:** ${piVision.highLevelVision.trim()}`, '')
    }
    if (piVision.timeframeStart || piVision.timeframeEnd) {
      lines.push(
        `**Timeframe:** ${piVision.timeframeStart ?? '?'} – ${piVision.timeframeEnd ?? '?'}`,
        '',
      )
    }

    if (piVision.objectives.length > 0) {
      lines.push('### Objectives', '')
      for (const objective of piVision.objectives) {
        const linked = objective.epicIds.map(epicName).join(', ')
        lines.push(`- ${objective.text}${linked ? ` (Epics: ${linked})` : ''}`)
      }
      lines.push('')
    }

    const prioritized = piVision.epicPriority
      .map((id) => epics.find((e) => e.id === id))
      .filter((e): e is (typeof epics)[number] => e !== undefined)
    if (prioritized.length > 0) {
      lines.push('### Epic Priority', '')
      prioritized.forEach((epic, i) => lines.push(`${i + 1}. ${epic.name}`))
      lines.push('')
    }

    if (piVision.visionDetails?.trim()) {
      lines.push('### Vision Details', '', piVision.visionDetails.trim(), '')
    }
    if (piVision.demonstrationOutline?.trim()) {
      lines.push(
        '### Demonstration Outline',
        '',
        piVision.demonstrationOutline.trim(),
        '',
      )
    }
    if (piVision.risksAndDependencies?.trim()) {
      lines.push(
        '### Risks & Dependencies',
        '',
        piVision.risksAndDependencies.trim(),
        '',
      )
    }
  }

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
      const epicDiagram = epicToMermaid(data, epic.id)
      if (epicDiagram) {
        lines.push('```mermaid', epicDiagram, '```', '')
      }
      if (members.length > 0) {
        lines.push('**Requirements**', '')
        for (const card of members) {
          const actor = actors.find((a) => a.id === card.actorId)?.name
          const stretchTag = isStretch(card) ? ' _(stretch)_' : ''
          lines.push(
            `- ${actor ? `${actor}: ` : ''}${card.goal || 'Untitled story'}${stretchTag}`,
          )
        }
        lines.push('')
      }
    }
  }

  for (const group of groupCardsByActor(cards, actors)) {
    lines.push(`## ${group.actor.name}`, '')
    const actorFields: [string, string | undefined][] = [
      ['Description', group.actor.description],
      ['Goals', group.actor.goals],
      ['Pain points', group.actor.painPoints],
      ['Context', group.actor.context],
    ]
    for (const [label, value] of actorFields) {
      if (value?.trim()) lines.push(`**${label}**`, '', value.trim(), '')
    }
    lines.push('```mermaid', actorToMermaid(data, group.actor.id), '```', '')
    for (const card of group.cards) {
      const stretchTag = isStretch(card) ? ' _(stretch)_' : ''
      lines.push(`### ${card.goal || 'Untitled story'}${stretchTag}`, '')
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
