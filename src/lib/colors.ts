// Appends an 8-bit alpha channel to a #rrggbb hex string.
export function hexWithAlpha(hex: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(255, Math.round(alpha)))
  return `${hex}${clamped.toString(16).padStart(2, '0')}`
}
