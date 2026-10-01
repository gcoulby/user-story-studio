import { newId } from '@/lib/id'
import type { PiObjective, PiVision } from '@/types/domain'

const EMPTY: PiVision = { epicPriority: [], objectives: [] }

function normalizeObjective(raw: unknown): PiObjective | null {
  if (typeof raw === 'string') {
    const text = raw.trim()
    return text ? { id: newId('obj'), text, epicIds: [] } : null
  }
  if (raw && typeof raw === 'object') {
    const o = raw as Partial<PiObjective>
    const text = typeof o.text === 'string' ? o.text.trim() : ''
    if (!text) return null
    return {
      id: typeof o.id === 'string' && o.id ? o.id : newId('obj'),
      text,
      epicIds: Array.isArray(o.epicIds)
        ? o.epicIds.filter((id): id is string => typeof id === 'string')
        : [],
    }
  }
  return null
}

// Tolerates hand-edited or pre-schema .uss/IndexedDB data: string objectives,
// missing epicIds, non-string entries in epicPriority, or a missing object
// altogether all coerce to a well-formed PiVision instead of crashing.
export function normalizePiVision(raw: unknown): PiVision {
  if (!raw || typeof raw !== 'object') return { ...EMPTY }
  const r = raw as Partial<PiVision> & { objectives?: unknown[] }

  const objectives = Array.isArray(r.objectives)
    ? r.objectives
        .map(normalizeObjective)
        .filter((o): o is PiObjective => o !== null)
    : []

  const epicPriority = Array.isArray(r.epicPriority)
    ? r.epicPriority.filter((id): id is string => typeof id === 'string')
    : []

  return {
    highLevelVision: r.highLevelVision,
    visionDetails: r.visionDetails,
    demonstrationOutline: r.demonstrationOutline,
    risksAndDependencies: r.risksAndDependencies,
    timeframeStart: r.timeframeStart,
    timeframeEnd: r.timeframeEnd,
    epicPriority,
    objectives,
  }
}
