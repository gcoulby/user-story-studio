import { RELATIONSHIP_TYPES } from '@/config/relationship-types'
import type { StudioData } from '@/types/domain'

// Mermaid node ids must be alphanumeric/underscore; entity ids may contain
// hyphens and UUID punctuation.
function nodeId(prefix: string, id: string): string {
  return `${prefix}_${id.replace(/[^a-zA-Z0-9]/g, '_')}`
}

// Text that is safe inside a quoted Mermaid label.
function label(text: string, max = 68): string {
  const clean = (text || '…')
    .replace(/\s+/g, ' ')
    .replace(/["|<>]/g, '')
    .trim()
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean
}

// A Mermaid flowchart of the map: actors, cards grouped into epic subgraphs,
// plain actor→card ownership lines, and typed card→card relationship edges.
export function studioToMermaid(data: StudioData): string {
  const { actors, epics, cards, relationships } = data
  if (cards.length === 0) return ''

  const cardById = new Map(cards.map((c) => [c.id, c]))
  const lines: string[] = ['flowchart TD']

  // Actors — stadium shape, mirroring the app's actor pills.
  for (const actor of actors) {
    lines.push(`  ${nodeId('a', actor.id)}(["${label(actor.name)}"])`)
  }

  // Cards, grouped under the first epic they belong to.
  const emitted = new Set<string>()
  const cardNode = (id: string) =>
    `${nodeId('c', id)}["${label(cardById.get(id)?.goal ?? 'Untitled story')}"]`

  for (const epic of epics) {
    const members = cards.filter(
      (c) => c.epicIds[0] === epic.id && !emitted.has(c.id),
    )
    if (members.length === 0) continue
    lines.push(`  subgraph ${nodeId('e', epic.id)} ["${label(epic.name)}"]`)
    for (const card of members) {
      lines.push(`    ${cardNode(card.id)}`)
      emitted.add(card.id)
    }
    lines.push('  end')
  }

  for (const card of cards) {
    if (!emitted.has(card.id)) {
      lines.push(`  ${cardNode(card.id)}`)
      emitted.add(card.id)
    }
  }

  // Ownership: plain undirected line from an actor to each card it owns.
  for (const card of cards) {
    if (actors.some((a) => a.id === card.actorId)) {
      lines.push(`  ${nodeId('a', card.actorId)} --- ${nodeId('c', card.id)}`)
    }
  }

  // Typed relationships.
  for (const rel of relationships) {
    if (!cardById.has(rel.sourceId) || !cardById.has(rel.targetId)) continue
    const text = rel.note
      ? `${RELATIONSHIP_TYPES[rel.type].label}: ${rel.note}`
      : RELATIONSHIP_TYPES[rel.type].label
    lines.push(
      `  ${nodeId('c', rel.sourceId)} -->|"${label(text, 40)}"| ${nodeId('c', rel.targetId)}`,
    )
  }

  if (actors.length > 0) {
    lines.push(
      '  classDef actor fill:#1f2937,color:#f9fafb,stroke:#111827;',
      `  class ${actors.map((a) => nodeId('a', a.id)).join(',')} actor;`,
    )
  }

  return lines.join('\n')
}
