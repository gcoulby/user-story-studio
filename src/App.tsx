import { GraphView } from '@/components/graph/GraphView'
import { DetailPanel } from '@/components/detail/DetailPanel'
import { SaveStatus } from '@/components/SaveStatus'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { StoriesView } from '@/components/stories/StoriesView'
import { TableView } from '@/components/table/TableView'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ViewTabs } from '@/components/ViewTabs'
import { useProjectPersistence } from '@/hooks/useProjectPersistence'
import { useStudioData } from '@/hooks/useStudioData'
import { useStudioSelection } from '@/hooks/useStudioSelection'
import { useTheme } from '@/hooks/useTheme'

export default function App() {
  const data = useStudioData()
  const selection = useStudioSelection()
  const project = useProjectPersistence(data)
  const theme = useTheme()

  return (
    <div className="flex h-full flex-col bg-background font-sans text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-3.5">
        <div>
          <div className="text-base font-semibold tracking-tight">
            User Story Studio
          </div>
          <div className="mt-0.5 font-mono text-xs text-muted-foreground">
            Card → Conversation → Confirmation, captured once, related everywhere
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={project.status} fileName={project.fileName} />
          <ViewTabs view={selection.view} onChange={selection.setView} />
          <ThemeToggle theme={theme.theme} onCycle={theme.cycleTheme} />
        </div>
      </header>

      {project.hydrating ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading your map…
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <Sidebar data={data} selection={selection} project={project} />

          <main className="relative min-w-0 flex-1 bg-background">
            {selection.view === 'graph' && (
              <GraphView
                data={data}
                selection={selection}
                colorMode={theme.resolvedTheme}
              />
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
      )}
    </div>
  )
}
