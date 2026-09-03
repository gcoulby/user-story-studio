import { EPIC_PALETTE } from '@/config/palette'
import type { Epic } from '@/types/domain'

export const seedEpics: Epic[] = [
  { id: 'e1', name: 'Daily Workflow', color: EPIC_PALETTE[0] },
  { id: 'e2', name: 'Workspace Setup', color: EPIC_PALETTE[1] },
]
