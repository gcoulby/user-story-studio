import { GraphView } from '@/components/graph/GraphView'
import { DetailPanel } from '@/components/detail/DetailPanel'
import { EmptyState } from '@/components/EmptyState'
import { SaveStatus } from '@/components/SaveStatus'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import { StoriesView } from '@/components/stories/StoriesView'
import { TableView } from '@/components/table/TableView'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
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

  const hasCards = data.cards.length > 0

  return (
    <div className="flex h-full flex-col bg-background font-sans text-foreground">
      <SidebarProvider storageKey="uss:sidebar:left" shortcut="b">
        <div className="flex min-h-0 flex-1">
          <AppSidebar data={data} selection={selection} project={project} />

          <SidebarInset>
            <header className="elevation-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="text-muted-foreground" />
                <div>
                  <div className="text-base font-semibold tracking-tight">
                    User Story Studio
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                    Card → Conversation → Confirmation, captured once, related
                    everywhere
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SaveStatus
                  status={project.status}
                  fileName={project.fileName}
                />
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
                <main className="relative min-w-0 flex-1 bg-surface">
                  {!hasCards && (
                    <EmptyState
                      onNewCard={selection.openNewCard}
                      onOpenExample={() => void project.openExample()}
                    />
                  )}
                  {hasCards && selection.view === 'graph' && (
                    <GraphView
                      data={data}
                      selection={selection}
                      colorMode={theme.resolvedTheme}
                    />
                  )}
                  {hasCards && selection.view === 'stories' && (
                    <StoriesView
                      cards={data.cards}
                      actors={data.actors}
                      epics={data.epics}
                      activeEpicFilter={selection.activeEpicFilter}
                      selectedCardId={selection.selectedCardId}
                      onSelect={selection.selectCard}
                    />
                  )}
                  {hasCards && selection.view === 'table' && (
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

                <SidebarProvider
                  storageKey="uss:sidebar:right"
                  shortcut="e"
                >
                  <DetailPanel data={data} selection={selection} />
                </SidebarProvider>
              </div>
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
