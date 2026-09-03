import { hexWithAlpha } from '@/lib/colors'
import type { Epic } from '@/types/domain'

interface EpicRegionProps {
  epic: Epic
  width: number
  height: number
}

// Soft bounding-box region drawn behind the cards that belong to an epic. Its
// size and position are computed live from member card positions by
// EpicRegionsLayer rather than laid out, so it tracks dragging naturally.
export function EpicRegion({ epic, width, height }: EpicRegionProps) {
  return (
    <div
      className="pointer-events-none relative rounded-xl border"
      style={{
        width,
        height,
        background: hexWithAlpha(epic.color, 0x12),
        borderColor: hexWithAlpha(epic.color, 0x59),
      }}
    >
      <span
        className="absolute left-3 top-1.5 font-mono text-[11px] uppercase"
        style={{ color: epic.color }}
      >
        {epic.name}
      </span>
    </div>
  )
}
