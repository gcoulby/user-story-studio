import type { Epic } from '@/types/domain'

import { loadStudioData } from './load-studio-data'

export function loadEpics(): Epic[] {
  return loadStudioData().epics
}
