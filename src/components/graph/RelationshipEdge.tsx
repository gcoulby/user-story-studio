import { BaseEdge, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react'

import { RELATIONSHIP_TYPES } from '@/config/relationship-types'

import type { RelationshipEdgeData } from './types'
import { useFloatingPath } from './useFloatingPath'

// Typed card-to-card relationship edge. Colour and dash pattern come from
// relationship-types config; an `extends` note is rendered on the label.
export function RelationshipEdge({
  id,
  source,
  target,
  markerEnd,
  data,
}: EdgeProps & { data?: RelationshipEdgeData }) {
  const floating = useFloatingPath(source, target)
  if (!floating || !data) return null

  const display = RELATIONSHIP_TYPES[data.type]
  const labelText = data.note
    ? `${display.label} · ${data.note}`
    : display.label

  // Push the label off the line, opposite ways for the two directions of a pair.
  const nudge = source < target ? 9 : -9
  const labelX = floating.labelX + floating.perp.x * nudge
  const labelY = floating.labelY + floating.perp.y * nudge

  return (
    <g opacity={data.dimmed ? 0.15 : 1}>
      <BaseEdge
        path={floating.path}
        markerEnd={markerEnd}
        style={{
          stroke: display.color,
          strokeWidth: 1.6,
          strokeDasharray: display.dash,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="pointer-events-none absolute rounded bg-background/90 px-1 font-mono text-[10.5px]"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            color: display.color,
            opacity: data.dimmed ? 0.15 : 1,
          }}
          data-edge-id={id}
        >
          {labelText}
        </div>
      </EdgeLabelRenderer>
    </g>
  )
}
