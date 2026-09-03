import { GraphView } from '@/components/graph/GraphView'
import { DetailPanel } from '@/components/detail/DetailPanel'
import { SaveStatus } from '@/components/SaveStatus'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { StoriesView } from '@/components/stories/StoriesView'
import { TableView } from '@/components/table/TableView'
import { ViewTabs } from '@/components/ViewTabs'
import { useStudioData } from '@/hooks/useStudioData'
import { useStudioSelection } from '@/hooks/useStudioSelection'

export default function App() {
  const data = useStudioData()
  const selection = useStudioSelection()

  return (
    <div className="flex h-full flex-col bg-background font-sans text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-3.5">
        <div>
          <div className="text-base font-semibold tracking-tight">
            Use Case Studio
          </div>
          <div className="mt-0.5 font-mono text-xs text-muted-foreground">
            Card → Conversation → Confirmation, captured once, related everywhere
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SaveStatus status={data.saveStatus} />
          <ViewTabs view={selection.view} onChange={selection.setView} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <Sidebar data={data} selection={selection} />

        <main className="relative min-w-0 flex-1 bg-background">
          {selection.view === 'graph' && (
            <GraphView data={data} selection={selection} />
          )}
          {selection.view === 'stories' && (
            <StoriesView
              cards={data.cards}
              actors={data.actors}
              epics={data.epics}
              activeEpicFilter={selection.activeEpicFilter}
              selectedCardId={selection.selectedCardId}
              onSelect={selection.selectCard}
            />
          )}
          {selection.view === 'table' && (
            <TableView
              cards={data.cards}
              actors={data.actors}
              epics={data.epics}
              relationships={data.relationships}
              activeEpicFilter={selection.activeEpicFilter}
              selectedCardId={selection.selectedCardId}
              onSelect={selection.selectCard}
            />
          )}
        </main>

        <DetailPanel data={data} selection={selection} />
      </div>
    </div>
  )
}
