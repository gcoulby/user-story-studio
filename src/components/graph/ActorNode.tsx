import { Handle, Position, type NodeProps } from '@xyflow/react'

import { ACTOR_H, ACTOR_W } from '@/config/graph'

import type { ActorNodeType } from './types'

// First-class graph node for an actor. Draggable; its ownership lines to owned
// cards originate here.
export function ActorNode({ data }: NodeProps<ActorNodeType>) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-foreground px-3 text-center text-[12.5px] font-medium text-background"
      style={{ width: ACTOR_W, height: ACTOR_H }}
    >
      {data.name}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="!h-1 !w-1 !border-0 !bg-transparent"
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="!h-1 !w-1 !border-0 !bg-transparent"
      />
    </div>
  )
}
