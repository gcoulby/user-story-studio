import { EPIC_PALETTE } from '@/config/palette'
import type { Epic } from '@/types/domain'

export const seedEpics: Epic[] = [
  { id: 'e1', name: 'Claims Intake', color: EPIC_PALETTE[0] },
  { id: 'e2', name: 'Risk Review', color: EPIC_PALETTE[1] },
]
