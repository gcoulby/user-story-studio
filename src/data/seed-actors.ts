import type { Actor } from '@/types/domain'

// Example data — a team task-board app ("Taskboard"). Loaded on demand via
// "Open example", never as the default state.
export const seedActors: Actor[] = [
  { id: 'a1', name: 'Team Member', x: 40, y: 60 },
  { id: 'a2', name: 'Project Lead', x: 40, y: 280 },
  { id: 'a3', name: 'Workspace Admin', x: 40, y: 500 },
]
