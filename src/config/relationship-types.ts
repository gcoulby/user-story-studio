import type { RelationshipType } from '@/types/domain'

export interface RelationshipTypeDisplay {
  label: string
  color: string
  dash: string
}

export const RELATIONSHIP_TYPES: Record<
  RelationshipType,
  RelationshipTypeDisplay
> = {
  includes: { label: 'includes', color: '#2563eb', dash: '0' },
  extends: { label: 'extends', color: '#d97706', dash: '6 4' },
  precedes: { label: 'precedes', color: '#a3a3a3', dash: '1 4' },
}

export const RELATIONSHIP_TYPE_ORDER: RelationshipType[] = [
  'includes',
  'extends',
  'precedes',
]
