import { useCallback, useEffect, useRef, useState } from 'react'
import { strToU8 } from 'fflate'

import { emptyStudioData } from '@/data/load-studio-data'
import {
  downloadBytes,
  forgetHandle,
  hasFileSystemAccess,
  pickAndReadUss,
  pickSaveHandle,
  recallHandle,
  rememberHandle,
  toUssFilename,
  verifyWritePermission,
  writeHandle,
} from '@/lib/file-access'
import { idbGet, idbSet } from '@/lib/idb'
import { studioToMarkdown } from '@/lib/markdown'
import type { SaveStatus } from '@/lib/storage'
import { packUss, unpackUss } from '@/lib/uss'
import type { StudioData } from '@/types/domain'
import {
  DEFAULT_TITLE,
  newManifest,
  type ProjectManifest,
  type StoredProject,
} from '@/types/project'

const PROJECT_KEY = 'current'
const SAVE_DEBOUNCE_MS = 800

interface DataPort {
  actors: StudioData['actors']
  epics: StudioData['epics']
  cards: StudioData['cards']
  relationships: StudioData['relationships']
  snapshot: () => StudioData
  replaceAll: (data: StudioData) => void
}

export interface ProjectPersistenceApi {
  status: SaveStatus
  hydrating: boolean
  title: string
  fileName: string | null
  isBound: boolean
  fsaSupported: boolean
  error: string | null
  clearError: () => void
  newProject: () => Promise<void>
  openProject: () => Promise<void>
  saveProject: () => Promise<void>
  saveProjectAs: () => Promise<void>
  exportMarkdown: () => void
}

function titleFromFilename(name: string): string {
  return name.replace(/\.uss$/i, '').replace(/[-_]+/g, ' ').trim() || 'Untitled'
}

export function useProjectPersistence(data: DataPort): ProjectPersistenceApi {
  const { snapshot, replaceAll } = data

  const manifestRef = useRef<ProjectManifest>(newManifest())
  const handleRef = useRef<FileSystemFileHandle | null>(null)

  const [status, setStatus] = useState<SaveStatus>('idle')
  const [hydrating, setHydrating] = useState(true)
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [fileName, setFileName] = useState<string | null>(null)
  const [hasHandle, setHasHandle] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bindHandle = useCallback((handle: FileSystemFileHandle | null) => {
    handleRef.current = handle
    setHasHandle(handle !== null)
  }, [])

  const fsaSupported = hasFileSystemAccess()

  const persistToIdb = useCallback(async () => {
    const now = new Date().toISOString()
    manifestRef.current = { ...manifestRef.current, modified: now }
    const stored: StoredProject = {
      manifest: manifestRef.current,
      data: snapshot(),
      savedAt: now,
    }
    await idbSet('project', PROJECT_KEY, stored)
  }, [snapshot])

  const writeBoundFile = useCallback(async (): Promise<boolean> => {
    const handle = handleRef.current
    if (!handle) return false
    if (!(await verifyWritePermission(handle))) {
      bindHandle(null)
      setFileName(null)
      await forgetHandle()
      return false
    }
    await writeHandle(
      handle,
      packUss({ manifest: manifestRef.current, data: snapshot() }),
    )
    return true
  }, [bindHandle, snapshot])

  // ── Hydrate from the IndexedDB working copy + reconnect a bound file ───────
  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const stored = await idbGet<StoredProject>('project', PROJECT_KEY)
        if (!cancelled && stored?.data) {
          manifestRef.current = stored.manifest
          setTitle(stored.manifest.title)
          replaceAll(stored.data)
        }
        const handle = await recallHandle()
        if (!cancelled && handle) {
          const granted =
            !handle.queryPermission ||
            (await handle.queryPermission({ mode: 'readwrite' })) === 'granted'
          if (granted) {
            bindHandle(handle)
            const name = (handle as unknown as { name?: string }).name ?? null
            setFileName(name)
          }
        }
      } catch {
        // fall back to the seed set already in state
      } finally {
        if (!cancelled) setHydrating(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [bindHandle, replaceAll])

  // ── Debounced autosave: always to IndexedDB, plus the bound file if any ────
  const skipNextSave = useRef(true)
  useEffect(() => {
    if (hydrating) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    setStatus('saving')
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          await persistToIdb()
          await writeBoundFile()
          setStatus('saved')
        } catch {
          setStatus('error')
        }
      })()
    }, SAVE_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [
    data.actors,
    data.epics,
    data.cards,
    data.relationships,
    hydrating,
    persistToIdb,
    writeBoundFile,
  ])

  const applyLoaded = useCallback(
    async (
      manifest: ProjectManifest,
      loaded: StudioData,
      handle: FileSystemFileHandle | null,
      name: string | null,
    ) => {
      manifestRef.current = manifest
      setTitle(manifest.title)
      replaceAll(loaded)
      bindHandle(handle)
      setFileName(name)
      if (handle) await rememberHandle(handle)
      else await forgetHandle()
      skipNextSave.current = true
      await persistToIdb()
      setStatus('saved')
    },
    [bindHandle, persistToIdb, replaceAll],
  )

  const newProject = useCallback(async () => {
    if (!window.confirm('Discard the current map and start a new one?')) return
    await applyLoaded(newManifest(), emptyStudioData(), null, null)
  }, [applyLoaded])

  const openProject = useCallback(async () => {
    setError(null)
    try {
      const opened = await pickAndReadUss()
      if (!opened) return
      const project = unpackUss(opened.bytes)
      await applyLoaded(
        project.manifest,
        project.data,
        opened.handle,
        opened.name,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open that file')
    }
  }, [applyLoaded])

  const downloadCopy = useCallback(
    async (filename: string) => {
      downloadBytes(
        filename,
        packUss({ manifest: manifestRef.current, data: snapshot() }),
        'application/zip',
      )
      await persistToIdb()
      setStatus('saved')
    },
    [persistToIdb, snapshot],
  )

  const saveProjectAs = useCallback(async () => {
    setError(null)
    const suggested = toUssFilename(title)
    try {
      if (!fsaSupported) {
        await downloadCopy(suggested)
        return
      }
      let handle: FileSystemFileHandle | null
      try {
        handle = await pickSaveHandle(suggested)
      } catch {
        await downloadCopy(suggested)
        return
      }
      if (!handle) return
      const name = (handle as unknown as { name?: string }).name ?? suggested
      manifestRef.current = {
        ...manifestRef.current,
        title: titleFromFilename(name),
      }
      setTitle(manifestRef.current.title)
      bindHandle(handle)
      setFileName(name)
      await rememberHandle(handle)
      await writeBoundFile()
      await persistToIdb()
      setStatus('saved')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the file')
    }
  }, [bindHandle, downloadCopy, fsaSupported, persistToIdb, title, writeBoundFile])

  const saveProject = useCallback(async () => {
    if (!handleRef.current) return saveProjectAs()
    setError(null)
    setStatus('saving')
    try {
      const wrote = await writeBoundFile()
      await persistToIdb()
      setStatus('saved')
      if (!wrote) await saveProjectAs()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not save the file')
    }
  }, [persistToIdb, saveProjectAs, writeBoundFile])

  const exportMarkdown = useCallback(() => {
    const base = toUssFilename(title).replace(/\.uss$/i, '')
    downloadBytes(
      `${base}.md`,
      strToU8(studioToMarkdown(snapshot(), title)),
      'text/markdown',
    )
  }, [snapshot, title])

  return {
    status,
    hydrating,
    title,
    fileName,
    isBound: hasHandle,
    fsaSupported,
    error,
    clearError: () => setError(null),
    newProject,
    openProject,
    saveProject,
    saveProjectAs,
    exportMarkdown,
  }
}
