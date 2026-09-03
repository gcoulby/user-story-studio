import { useCallback, useEffect, useMemo } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type ColorMode,
  type Edge,
  type EdgeTypes,
  type NodeChange,
  type NodeMouseHandler,
  type NodeTypes,
  type OnNodeDrag,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

import { buildGraphEdges, buildGraphNodes } from '@/lib/graph'
import type { StudioDataApi } from '@/hooks/useStudioData'
import type { StudioSelectionApi } from '@/hooks/useStudioSelection'

import { ActorNode } from './ActorNode'
import { CardNode } from './CardNode'
import { EpicRegionsLayer } from './EpicRegionsLayer'
import { OwnershipLine } from './OwnershipLine'
import { RelationshipEdge } from './RelationshipEdge'
import type { StudioNode } from './types'

const nodeTypes: NodeTypes = {
  actor: ActorNode,
  card: CardNode,
}

const edgeTypes: EdgeTypes = {
  ownership: OwnershipLine,
  relationship: RelationshipEdge,
}

interface GraphViewProps {
  data: StudioDataApi
  selection: StudioSelectionApi
  colorMode: ColorMode
}

function GraphCanvas({ data, selection, colorMode }: GraphViewProps) {
  const { actors, cards, epics, relationships } = data
  const { activeEpicFilter, selectedCardId, showEpicRegions } = selection

  const derivedNodes = useMemo<StudioNode[]>(
    () =>
      buildGraphNodes({ actors, cards, epics, activeEpicFilter }).map((node) => ({
        ...node,
        selected: node.id === selectedCardId,
      })),
    [actors, cards, epics, activeEpicFilter, selectedCardId],
  )

  const derivedEdges = useMemo<Edge[]>(
    () => buildGraphEdges({ cards, relationships, activeEpicFilter }),
    [cards, relationships, activeEpicFilter],
  )

  const [nodes, setNodes, onNodesChangeRaw] =
    useNodesState<StudioNode>(derivedNodes)
  const [edges, setEdges] = useEdgesState<Edge>(derivedEdges)

  useEffect(() => {
    setNodes(derivedNodes)
  }, [derivedNodes, setNodes])

  useEffect(() => {
    setEdges(derivedEdges)
  }, [derivedEdges, setEdges])

  // Let react-flow own drag/dimension changes; selection is driven by our hook.
  const onNodesChange = useCallback(
    (changes: NodeChange<StudioNode>[]) => {
      onNodesChangeRaw(changes.filter((change) => change.type !== 'select'))
    },
    [onNodesChangeRaw],
  )

  const commitPosition = useCallback<OnNodeDrag<StudioNode>>(
    (_event, node) => {
      if (node.type === 'card') {
        data.moveCard(node.id, node.position.x, node.position.y)
      } else if (node.type === 'actor') {
        data.moveActor(node.id, node.position.x, node.position.y)
      }
    },
    [data],
  )

  const onNodeClick = useCallback<NodeMouseHandler<StudioNode>>(
    (_event, node) => {
      if (node.type === 'card') selection.selectCard(node.id)
    },
    [selection],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onNodeDragStop={commitPosition}
      onNodeClick={onNodeClick}
      onPaneClick={() => selection.selectCard(null)}
      nodesConnectable={false}
      edgesFocusable={false}
      colorMode={colorMode}
      style={{ background: 'hsl(var(--surface))' }}
      proOptions={{ hideAttribution: true }}
      fitView
      fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
      minZoom={0.2}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={22}
        size={1.4}
        color="hsl(var(--graph-dots))"
      />
      <Controls showInteractive={false} />
      {showEpicRegions && <EpicRegionsLayer cards={cards} epics={epics} />}
    </ReactFlow>
  )
}

export function GraphView(props: GraphViewProps) {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <GraphCanvas {...props} />
      </ReactFlowProvider>
    </div>
  )
}
