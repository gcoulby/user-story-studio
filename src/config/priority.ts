import type { CardPriority } from '@/types/domain'

export interface PriorityDisplay {
  label: string
  color: string
}

export const PRIORITIES: Record<CardPriority, PriorityDisplay> = {
  low: { label: 'Low', color: '#6b7280' },
  medium: { label: 'Medium', color: '#2563eb' },
  high: { label: 'High', color: '#d97706' },
  critical: { label: 'Critical', color: '#dc2626' },
}

export const PRIORITY_ORDER: CardPriority[] = [
  'low',
  'medium',
  'high',
  'critical',
]

export const DEFAULT_PRIORITY: CardPriority = 'medium'
