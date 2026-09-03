import {
  FileDown,
  FilePlus2,
  FolderOpen,
  Save,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { ProjectPersistenceApi } from '@/hooks/useProjectPersistence'

interface ProjectBarProps {
  project: ProjectPersistenceApi
}

// Project file actions. The map always autosaves to the browser (IndexedDB);
// these bind it to a portable .uss file and produce a Markdown copy.
export function ProjectBar({ project }: ProjectBarProps) {
  return (
    <div className="mt-1 space-y-1.5">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        Project
      </div>
      {project.fileName && (
        <div className="truncate font-mono text-xs text-muted-foreground">
          {project.fileName}
          {!project.isBound && ' (copy)'}
        </div>
      )}
      <div className="grid grid-cols-2 gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => void project.newProject()}
        >
          <FilePlus2 size={13} />
          New
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => void project.openProject()}
        >
          <FolderOpen size={13} />
          Open
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => void project.saveProject()}
        >
          <Save size={13} />
          {project.isBound ? 'Save' : 'Save as'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={project.exportMarkdown}
        >
          <FileDown size={13} />
          Markdown
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-full text-xs text-muted-foreground"
        onClick={() => void project.openExample()}
      >
        <Sparkles size={13} />
        Open example map
      </Button>
      {project.isBound && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-full text-xs text-muted-foreground"
          onClick={() => void project.saveProjectAs()}
        >
          Save as new file…
        </Button>
      )}
      {project.error && (
        <div className="text-xs text-destructive">{project.error}</div>
      )}
    </div>
  )
}
