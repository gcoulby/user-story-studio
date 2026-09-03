import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onNewCard: () => void
  onOpenExample: () => void
}

export function EmptyState({ onNewCard, onOpenExample }: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-sm text-center">
        <h2 className="text-lg font-medium text-foreground">
          Start your story map
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Capture a use case as Card / Conversation / Confirmation, then relate
          it to the others. Add actors and epics from the left rail.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={onNewCard}>New card</Button>
          <Button variant="outline" onClick={onOpenExample}>
            <Sparkles size={14} />
            Open example
          </Button>
        </div>
      </div>
    </div>
  )
}
