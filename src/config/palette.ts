// Epic colours. Hex values used directly as inline style values on the graph
// (epic region fill/stroke) and derived (with alpha) for epic chips.
export const EPIC_PALETTE = [
  '#b45309',
  '#166534',
  '#6d28d9',
  '#0369a1',
  '#be123c',
  '#0f766e',
]

export function nextEpicColor(existingCount: number): string {
  return EPIC_PALETTE[existingCount % EPIC_PALETTE.length]
}
