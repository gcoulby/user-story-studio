import { Badge } from '@/components/ui/badge'
import { PRIORITIES } from '@/config/priority'
import { cn } from '@/lib/utils'
import type { CardPriority } from '@/types/domain'

interface PriorityBadgeProps {
  priority: CardPriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const display = PRIORITIES[priority]
  return (
    <Badge
      variant="outline"
      className={cn('gap-1 border-current', className)}
      style={{ color: display.color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: display.color }}
      />
      {display.label}
    </Badge>
  )
}
