import { BookOpen, Table2, Workflow } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { StudioView } from '@/hooks/useStudioSelection'

interface ViewTabsProps {
  view: StudioView
  onChange: (view: StudioView) => void
}

const TABS: { value: StudioView; label: string; icon: typeof Workflow }[] = [
  { value: 'graph', label: 'Graph', icon: Workflow },
  { value: 'stories', label: 'Stories', icon: BookOpen },
  { value: 'table', label: 'Table', icon: Table2 },
]

export function ViewTabs({ view, onChange }: ViewTabsProps) {
  return (
    <div className="inline-flex gap-0.5 rounded-lg bg-muted p-1">
      {TABS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            view === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}
