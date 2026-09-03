import type { Card } from '@/types/domain'

import { loadStudioData } from './load-studio-data'

export function loadCards(): Card[] {
  return loadStudioData().cards
}
