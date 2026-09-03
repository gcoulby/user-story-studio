import { Layers, Users } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import type { StudioDataApi } from '@/hooks/useStudioData'
import type { StudioSelectionApi } from '@/hooks/useStudioSelection'

import { ActorList } from './ActorList'
import { AddInlineForm } from './AddInlineForm'
import { DataTransfer } from './DataTransfer'
import { EpicList } from './EpicList'
import { NewCardButton } from './NewCardButton'
import { SectionLabel } from './SectionLabel'

interface SidebarProps {
  data: StudioDataApi
  selection: StudioSelectionApi
}

export function Sidebar({ data, selection }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 overflow-y-auto border-r border-border bg-card p-4 text-sm">
      <NewCardButton onClick={selection.openNewCard} />

      <SectionLabel icon={<Users size={12} />}>Actors</SectionLabel>
      <ActorList actors={data.actors} />
      <AddInlineForm placeholder="Add actor…" onAdd={data.addActor} />

      <SectionLabel icon={<Layers size={12} />}>Epics</SectionLabel>
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
          className="mt-2 text-xs text-blue-600 hover:underline"
        >
          clear filter ×
        </button>
      )}

      {selection.view === 'graph' && (
        <label className="mt-6 flex cursor-pointer items-center gap-2 text-muted-foreground">
          <Checkbox
            checked={selection.showEpicRegions}
            onCheckedChange={selection.setShowEpicRegions}
          />
          Show epic regions
        </label>
      )}

      <DataTransfer exportData={data.exportData} onImport={data.replaceAll} />
    </aside>
  )
}
