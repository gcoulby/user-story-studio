import type { Actor } from '@/types/domain'

import { loadStudioData } from './load-studio-data'

export function loadActors(): Actor[] {
  return loadStudioData().actors
}
