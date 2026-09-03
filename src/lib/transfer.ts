import type { StudioData } from '@/types/domain'

export function serializeStudioData(data: StudioData): string {
  return JSON.stringify(data, null, 2)
}

export function parseStudioData(raw: string): StudioData {
  const parsed = JSON.parse(raw) as Partial<StudioData>
  if (
    !parsed ||
    !Array.isArray(parsed.actors) ||
    !Array.isArray(parsed.epics) ||
    !Array.isArray(parsed.cards) ||
    !Array.isArray(parsed.relationships)
  ) {
    throw new Error('File is not a Use Case Studio export')
  }
  return parsed as StudioData
}

export function downloadJson(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
