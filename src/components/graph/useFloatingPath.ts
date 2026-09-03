import { getStraightPath, useInternalNode } from '@xyflow/react'

import { getFloatingEdgeParams } from '@/lib/floating-edge'

export interface FloatingPath {
  path: string
  labelX: number
  labelY: number
  // Perpendicular unit vector, for nudging edge labels apart when two edges
  // connect the same pair of nodes in opposite directions.
  perp: { x: number; y: number }
}

// Resolves a straight edge path whose endpoints sit on the source and target
// node borders, following each node as it is dragged.
export function useFloatingPath(
  sourceId: string,
  targetId: string,
): FloatingPath | null {
  const source = useInternalNode(sourceId)
  const target = useInternalNode(targetId)
  if (!source || !target) return null

  const { sx, sy, tx, ty } = getFloatingEdgeParams(source, target)
  const [path, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  })
  const dx = tx - sx
  const dy = ty - sy
  const len = Math.hypot(dx, dy) || 1
  return { path, labelX, labelY, perp: { x: -dy / len, y: dx / len } }
}
