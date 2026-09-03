import { idbDelete, idbGet, idbSet } from '@/lib/idb'

const HANDLE_KEY = 'current'
export const USS_EXTENSION = '.uss'
const USS_PICKER_TYPE: FilePickerAcceptType = {
  description: 'User Story Studio project',
  accept: { 'application/zip': [USS_EXTENSION] },
}

export function hasFileSystemAccess(): boolean {
  return (
    typeof window !== 'undefined' &&
    'showOpenFilePicker' in window &&
    'showSaveFilePicker' in window
  )
}

export interface OpenedFile {
  handle: FileSystemFileHandle | null
  bytes: Uint8Array
  name: string
}

export async function pickAndReadUss(): Promise<OpenedFile | null> {
  if (hasFileSystemAccess()) {
    try {
      const [handle] = await window.showOpenFilePicker!({
        types: [USS_PICKER_TYPE],
        multiple: false,
      })
      if (!handle) return null
      const file = await (
        handle as unknown as { getFile: () => Promise<File> }
      ).getFile()
      return {
        handle,
        bytes: new Uint8Array(await file.arrayBuffer()),
        name: file.name,
      }
    } catch (err) {
      if (isAbortError(err)) return null
      // picker unavailable at runtime — fall through to the input element
    }
  }

  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = USS_EXTENSION
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      resolve({
        handle: null,
        bytes: new Uint8Array(await file.arrayBuffer()),
        name: file.name,
      })
    }
    input.click()
  })
}

export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

// Returns a handle, or null if the user cancelled. Throws if the picker itself
// is unavailable at runtime, so the caller can fall back to a plain download.
export async function pickSaveHandle(
  suggestedName: string,
): Promise<FileSystemFileHandle | null> {
  try {
    return await window.showSaveFilePicker!({
      suggestedName,
      types: [USS_PICKER_TYPE],
    })
  } catch (err) {
    if (isAbortError(err)) return null
    throw err
  }
}

export async function verifyWritePermission(
  handle: FileSystemFileHandle,
): Promise<boolean> {
  const descriptor: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' }
  if (handle.queryPermission) {
    if ((await handle.queryPermission(descriptor)) === 'granted') return true
  }
  if (handle.requestPermission) {
    return (await handle.requestPermission(descriptor)) === 'granted'
  }
  return false
}

export async function writeHandle(
  handle: FileSystemFileHandle,
  bytes: Uint8Array,
): Promise<void> {
  const writable = await (
    handle as unknown as {
      createWritable: () => Promise<{
        write: (data: Blob) => Promise<void>
        close: () => Promise<void>
      }>
    }
  ).createWritable()
  await writable.write(new Blob([bytes as BlobPart], { type: 'application/zip' }))
  await writable.close()
}

export function downloadBytes(
  filename: string,
  bytes: Uint8Array,
  mimeType: string,
): void {
  const blob = new Blob([bytes as BlobPart], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function toUssFilename(title: string): string {
  const slug = title.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')
  return `${slug || 'user-story-map'}${USS_EXTENSION}`
}

// ── Bound-file handle persistence ────────────────────────────────────────────

export async function rememberHandle(
  handle: FileSystemFileHandle,
): Promise<void> {
  await idbSet('handles', HANDLE_KEY, handle)
}

export async function recallHandle(): Promise<FileSystemFileHandle | null> {
  try {
    return (await idbGet<FileSystemFileHandle>('handles', HANDLE_KEY)) ?? null
  } catch {
    return null
  }
}

export async function forgetHandle(): Promise<void> {
  await idbDelete('handles', HANDLE_KEY).catch(() => undefined)
}
