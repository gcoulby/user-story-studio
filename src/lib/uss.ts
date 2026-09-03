import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'

import { studioToMarkdown } from '@/lib/markdown'
import type {
  Actor,
  Card,
  Epic,
  Relationship,
  StudioData,
} from '@/types/domain'
import {
  newManifest,
  USS_FORMAT,
  type Project,
  type ProjectManifest,
} from '@/types/project'

const MANIFEST = 'manifest.json'
const FILES = {
  actors: 'data/actors.json',
  epics: 'data/epics.json',
  cards: 'data/cards.json',
  relationships: 'data/relationships.json',
} as const
const STORIES_MD = 'stories.md'

function json(value: unknown): Uint8Array {
  return strToU8(JSON.stringify(value, null, 2))
}

function parseArray<T>(files: Record<string, Uint8Array>, path: string): T[] {
  const entry = files[path]
  if (!entry) return []
  const parsed = JSON.parse(strFromU8(entry)) as unknown
  return Array.isArray(parsed) ? (parsed as T[]) : []
}

// Packs a project into a .uss archive: a zip of the manifest, one JSON file per
// entity, and a generated human-readable stories.md.
export function packUss(project: Project): Uint8Array {
  const manifest: ProjectManifest = {
    ...project.manifest,
    modified: new Date().toISOString(),
  }
  const { data } = project
  return zipSync(
    {
      [MANIFEST]: json(manifest),
      [FILES.actors]: json(data.actors),
      [FILES.epics]: json(data.epics),
      [FILES.cards]: json(data.cards),
      [FILES.relationships]: json(data.relationships),
      [STORIES_MD]: strToU8(studioToMarkdown(data, manifest.title)),
    },
    { level: 6 },
  )
}

export function unpackUss(bytes: Uint8Array): Project {
  const files = unzipSync(bytes)

  const manifestEntry = files[MANIFEST]
  if (!manifestEntry) {
    throw new Error('Not a User Story Studio file: manifest.json is missing')
  }
  const manifest = JSON.parse(strFromU8(manifestEntry)) as ProjectManifest
  if (manifest.format !== USS_FORMAT) {
    throw new Error('Not a User Story Studio file')
  }

  const data: StudioData = {
    actors: parseArray<Actor>(files, FILES.actors),
    epics: parseArray<Epic>(files, FILES.epics),
    cards: parseArray<Card>(files, FILES.cards),
    relationships: parseArray<Relationship>(files, FILES.relationships),
  }

  return { manifest: { ...newManifest(manifest.title), ...manifest }, data }
}
