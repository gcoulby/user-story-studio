// Stable unique ids for entities created at runtime.
export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`
}
