import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StretchBadgeProps {
  className?: string
}

// Marks a story as stretch/uncommitted — shown wherever a stretch card
// appears, so it reads as "not promised" at a glance.
export function StretchBadge({ className }: StretchBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-dashed text-muted-foreground',
        className,
      )}
    >
      Stretch
    </Badge>
  )
}
