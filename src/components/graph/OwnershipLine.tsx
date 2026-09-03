import { BaseEdge, type EdgeProps } from '@xyflow/react'

import type { OwnershipEdgeData } from './types'
import { useFloatingPath } from './useFloatingPath'

// Plain, low-emphasis line linking an actor to a card it owns. Deliberately
// quieter than a relationship edge so it does not compete for attention.
export function OwnershipLine({
  source,
  target,
  data,
}: EdgeProps & { data?: OwnershipEdgeData }) {
  const floating = useFloatingPath(source, target)
  if (!floating) return null

  return (
    <BaseEdge
      path={floating.path}
      style={{
        stroke: 'hsl(var(--graph-ownership))',
        strokeWidth: 1.3,
        opacity: data?.dimmed ? 0.15 : 0.9,
      }}
    />
  )
}
