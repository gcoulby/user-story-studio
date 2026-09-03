import { hexWithAlpha } from '@/lib/colors'
import { cn } from '@/lib/utils'
import type { Epic } from '@/types/domain'

interface EpicChipProps {
  epic: Epic
  selected?: boolean
  onClick?: () => void
  className?: string
}

// The coloured epic pill. Single source of truth for epic-chip styling, reused
// in the sidebar, the card editor's picker, the detail panel, the story view
// and the table.
export function EpicChip({ epic, selected, onClick, className }: EpicChipProps) {
  const interactive = typeof onClick === 'function'
  return (
    <span
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium leading-none',
        interactive && 'cursor-pointer transition-colors',
        className,
      )}
      style={{
        background: selected ? epic.color : hexWithAlpha(epic.color, 0x1a),
        color: selected ? '#ffffff' : epic.color,
      }}
    >
      {epic.name}
    </span>
  )
}
