import type { Actor } from '@/types/domain'

import { loadExampleData } from './load-studio-data'

export function loadActors(): Actor[] {
  return loadExampleData().actors
}
