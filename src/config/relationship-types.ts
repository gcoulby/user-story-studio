import type { RelationshipType } from '@/types/domain'

export interface RelationshipTypeDisplay {
  label: string
  inverseLabel: string
  color: string
  dash: string
}

export const RELATIONSHIP_TYPES: Record<
  RelationshipType,
  RelationshipTypeDisplay
> = {
  includes: {
    label: 'includes',
    inverseLabel: 'is included by',
    color: '#2563eb',
    dash: '0',
  },
  extends: {
    label: 'extends',
    inverseLabel: 'is extended by',
    color: '#d97706',
    dash: '6 4',
  },
  precedes: {
    label: 'precedes',
    inverseLabel: 'is preceded by',
    color: '#a3a3a3',
    dash: '1 4',
  },
  blocks: {
    label: 'blocks',
    inverseLabel: 'is blocked by',
    color: '#dc2626',
    dash: '0',
  },
  dependsOn: {
    label: 'depends on',
    inverseLabel: 'is a dependency for',
    color: '#7c3aed',
    dash: '4 2',
  },
  relatesTo: {
    label: 'relates to',
    inverseLabel: 'relates to',
    color: '#0d9488',
    dash: '2 2',
  },
  supersedes: {
    label: 'supersedes',
    inverseLabel: 'is superseded by',
    color: '#db2777',
    dash: '0',
  },
}

export const RELATIONSHIP_TYPE_ORDER: RelationshipType[] = [
  'includes',
  'extends',
  'precedes',
  'blocks',
  'dependsOn',
  'relatesTo',
  'supersedes',
]
