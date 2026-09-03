import type { Card } from '@/types/domain'

import { loadExampleData } from './load-studio-data'

export function loadCards(): Card[] {
  return loadExampleData().cards
}
