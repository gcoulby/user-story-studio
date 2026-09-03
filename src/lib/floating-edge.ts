import type { InternalNode, Node } from '@xyflow/react'

interface Point {
  x: number
  y: number
}

function nodeCenter(node: InternalNode<Node>): Point {
  const { x, y } = node.internals.positionAbsolute
  return {
    x: x + (node.measured.width ?? 0) / 2,
    y: y + (node.measured.height ?? 0) / 2,
  }
}

// Point where the straight line between two node centres crosses the border of
// the first node. Standard react-flow "floating edge" maths so edges meet node
// borders cleanly regardless of relative position.
function borderIntersection(
  node: InternalNode<Node>,
  other: InternalNode<Node>,
): Point {
  const w = (node.measured.width ?? 0) / 2
  const h = (node.measured.height ?? 0) / 2
  const center = nodeCenter(node)
  const otherCenter = nodeCenter(other)

  const x1 = otherCenter.x
  const y1 = otherCenter.y
  const x2 = center.x
  const y2 = center.y

  const xNorm = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h)
  const yNorm = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h)
  const scale = 1 / (Math.abs(xNorm) + Math.abs(yNorm) || 1)
  const xx = scale * xNorm
  const yy = scale * yNorm

  return { x: w * (xx + yy) + x2, y: h * (-xx + yy) + y2 }
}

export interface FloatingEdgeParams {
  sx: number
  sy: number
  tx: number
  ty: number
}

export function getFloatingEdgeParams(
  source: InternalNode<Node>,
  target: InternalNode<Node>,
): FloatingEdgeParams {
  const s = borderIntersection(source, target)
  const t = borderIntersection(target, source)
  return { sx: s.x, sy: s.y, tx: t.x, ty: t.y }
}
