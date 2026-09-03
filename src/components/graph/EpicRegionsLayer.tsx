import { useMemo } from 'react'
import { useNodes, ViewportPortal } from '@xyflow/react'

import {
  CARD_H,
  CARD_W,
  EPIC_REGION_LABEL_OFFSET,
  EPIC_REGION_PAD,
} from '@/config/graph'
import type { Card, Epic } from '@/types/domain'

import { EpicRegion } from './EpicRegion'

interface EpicRegionsLayerProps {
  cards: Card[]
  epics: Epic[]
}

interface RegionBox {
  epic: Epic
  x: number
  y: number
  width: number
  height: number
}

// Renders epic bounding-box regions in flow coordinates using react-flow's live
// node positions, so the box tracks a card while it is being dragged rather than
// only on drop.
export function EpicRegionsLayer({ cards, epics }: EpicRegionsLayerProps) {
  const nodes = useNodes()

  const livePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>()
    for (const node of nodes) {
      if (node.type === 'card') map.set(node.id, node.position)
    }
    return map
  }, [nodes])

  const regions = useMemo<RegionBox[]>(() => {
    return epics
      .map((epic): RegionBox | null => {
        const members = cards
          .filter((c) => c.epicIds.includes(epic.id))
          .map((c) => livePositions.get(c.id) ?? { x: c.x, y: c.y })
        if (members.length === 0) return null

        const xs = members.map((m) => m.x)
        const ys = members.map((m) => m.y)
        const minX = Math.min(...xs) - EPIC_REGION_PAD
        const minY = Math.min(...ys) - EPIC_REGION_PAD - EPIC_REGION_LABEL_OFFSET
        return {
          epic,
          x: minX,
          y: minY,
          width: Math.max(...xs) + CARD_W + EPIC_REGION_PAD - minX,
          height: Math.max(...ys) + CARD_H + EPIC_REGION_PAD - minY,
        }
      })
      .filter((r): r is RegionBox => r !== null)
  }, [epics, cards, livePositions])

  return (
    <ViewportPortal>
      {regions.map((region) => (
        <div
          key={region.epic.id}
          className="absolute"
          style={{
            left: region.x,
            top: region.y,
            transform: 'translate(0, 0)',
            zIndex: 0,
          }}
        >
          <EpicRegion
            epic={region.epic}
            width={region.width}
            height={region.height}
          />
        </div>
      ))}
    </ViewportPortal>
  )
}
