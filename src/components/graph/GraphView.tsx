import { useCallback, useEffect, useMemo, useState } from 'react'
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
  type OnSelectionChangeFunc,
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

  // Multi-select (box-select / cmd|ctrl-click) is tracked separately from the
  // single `selectedCardId` that drives the detail panel, so a group of nodes
  // can be selected and dragged together without disturbing the detail view.
  const [multiSelectedIds, setMultiSelectedIds] = useState<Set<string>>(
    () => new Set(),
  )

  const derivedNodes = useMemo<StudioNode[]>(
    () => buildGraphNodes({ actors, cards, epics, activeEpicFilter }),
    [actors, cards, epics, activeEpicFilter],
  )

  const derivedEdges = useMemo<Edge[]>(
    () => buildGraphEdges({ cards, relationships, activeEpicFilter }),
    [cards, relationships, activeEpicFilter],
  )

  const [nodes, setNodes, onNodesChangeRaw] =
    useNodesState<StudioNode>(derivedNodes)
  const [edges, setEdges] = useEdgesState<Edge>(derivedEdges)

  // Structural sync only — selection is applied separately below so that
  // selecting a card doesn't rebuild every node and re-trigger react-flow's
  // own selection-change sync, which caused an update-depth loop.
  useEffect(() => {
    setNodes(derivedNodes)
  }, [derivedNodes, setNodes])

  useEffect(() => {
    setEdges(derivedEdges)
  }, [derivedEdges, setEdges])

  // Applies the `selected` flag without touching nodes whose selection state
  // didn't change, so this settles in one pass instead of looping with
  // react-flow's internal selection sync.
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const isSelected =
          node.id === selectedCardId || multiSelectedIds.has(node.id)
        return node.selected === isSelected
          ? node
          : { ...node, selected: isSelected }
      }),
    )
  }, [selectedCardId, multiSelectedIds, setNodes])

  // Let react-flow own drag/dimension changes; selection is driven by our hook.
  const onNodesChange = useCallback(
    (changes: NodeChange<StudioNode>[]) => {
      onNodesChangeRaw(changes.filter((change) => change.type !== 'select'))
    },
    [onNodesChangeRaw],
  )

  const commitPosition = useCallback<OnNodeDrag<StudioNode>>(
    (_event, node, draggedNodes) => {
      // draggedNodes covers every node moved together (the full multi-select),
      // falling back to the single dragged node when nothing else is selected.
      const moved = draggedNodes.length > 0 ? draggedNodes : [node]
      for (const moving of moved) {
        if (moving.type === 'card') {
          data.moveCard(moving.id, moving.position.x, moving.position.y)
        } else if (moving.type === 'actor') {
          data.moveActor(moving.id, moving.position.x, moving.position.y)
        }
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

  const onSelectionChange = useCallback<OnSelectionChangeFunc>(
    ({ nodes: selectedNodes }) => {
      setMultiSelectedIds((prev) => {
        const nextIds = selectedNodes.map((n) => n.id)
        const isSame =
          nextIds.length === prev.size && nextIds.every((id) => prev.has(id))
        return isSame ? prev : new Set(nextIds)
      })
    },
    [],
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
      onSelectionChange={onSelectionChange}
      onPaneClick={() => {
        selection.selectCard(null)
        setMultiSelectedIds(new Set())
      }}
      multiSelectionKeyCode={['Meta', 'Control']}
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
