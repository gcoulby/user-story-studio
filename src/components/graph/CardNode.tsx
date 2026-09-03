import { Handle, Position, type NodeProps } from '@xyflow/react'

import { CARD_H, CARD_W } from '@/config/graph'
import { cn } from '@/lib/utils'

import type { CardNodeType } from './types'

const HANDLE_CLASS = '!h-1 !w-1 !border-0 !bg-transparent'

// Draggable graph node for a card. Clicking (not dragging) selects the card —
// react-flow's own onNodeClick handles the click-vs-drag distinction.
export function CardNode({ data, selected }: NodeProps<CardNodeType>) {
  const { card, actorLabel, epics, dimmed } = data

  return (
    <div
      className={cn(
        'rounded-lg border bg-card px-3.5 py-3 text-left shadow-sm transition-opacity',
        selected ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-border',
      )}
      style={{ width: CARD_W, minHeight: CARD_H, opacity: dimmed ? 0.25 : 1 }}
    >
      <div className="font-mono text-[9.5px] uppercase tracking-wide text-muted-foreground">
        {actorLabel}
      </div>
      <div className="mt-1 text-[13px] leading-snug text-foreground">
        <span className="text-muted-foreground">I want to </span>
        {card.goal || '…'}
      </div>
      {epics.length > 0 && (
        <div className="mt-2 flex gap-1">
          {epics.map((epic) => (
            <span
              key={epic.id}
              className="h-2 w-2 rounded-sm"
              style={{ background: epic.color }}
            />
          ))}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className={HANDLE_CLASS}
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className={HANDLE_CLASS}
      />
    </div>
  )
}
