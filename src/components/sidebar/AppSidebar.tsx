import { Layers, PanelLeftClose, Users } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import type { ProjectPersistenceApi } from '@/hooks/useProjectPersistence'
import type { StudioDataApi } from '@/hooks/useStudioData'
import type { StudioSelectionApi } from '@/hooks/useStudioSelection'

import { ActorList } from './ActorList'
import { AddInlineForm } from './AddInlineForm'
import { EpicList } from './EpicList'
import { NewCardButton } from './NewCardButton'
import { ProjectBar } from './ProjectBar'

interface AppSidebarProps {
  data: StudioDataApi
  selection: StudioSelectionApi
  project: ProjectPersistenceApi
}

export function AppSidebar({ data, selection, project }: AppSidebarProps) {
  return (
    <Sidebar side="left" className="elevation-0 z-10 text-sm">
      <SidebarHeader className="flex-row items-center gap-2">
        <NewCardButton onClick={selection.openNewCard} />
        <SidebarTrigger
          className="shrink-0 text-muted-foreground"
          icon={<PanelLeftClose size={16} />}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Users size={12} />
            Actors
          </SidebarGroupLabel>
          <ActorList actors={data.actors} />
          <AddInlineForm placeholder="Add actor…" onAdd={data.addActor} />
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>
            <Layers size={12} />
            Epics
          </SidebarGroupLabel>
          <EpicList
            epics={data.epics}
            cards={data.cards}
            activeEpicFilter={selection.activeEpicFilter}
            onToggleFilter={selection.toggleEpicFilter}
          />
          <AddInlineForm placeholder="Add epic…" onAdd={data.addEpic} />
          {selection.activeEpicFilter && (
            <button
              onClick={selection.clearEpicFilter}
              className="mt-1 self-start text-xs text-blue-600 hover:underline"
            >
              clear filter ×
            </button>
          )}
        </SidebarGroup>

        {selection.view === 'graph' && (
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-muted-foreground">
            <Checkbox
              checked={selection.showEpicRegions}
              onCheckedChange={selection.setShowEpicRegions}
            />
            Show epic regions
          </label>
        )}
      </SidebarContent>

      <SidebarFooter>
        <ProjectBar project={project} />
      </SidebarFooter>
    </Sidebar>
  )
}
