import type { Epic } from '@/types/domain'

import { loadExampleData } from './load-studio-data'

export function loadEpics(): Epic[] {
  return loadExampleData().epics
}
