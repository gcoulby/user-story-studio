import type { SaveStatus as Status } from '@/lib/storage'

const LABELS: Record<Status, string> = {
  idle: 'All changes saved',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Save failed — changes are in memory only',
}

interface SaveStatusProps {
  status: Status
}

export function SaveStatus({ status }: SaveStatusProps) {
  return (
    <span
      className={
        status === 'error'
          ? 'font-mono text-xs text-destructive'
          : 'font-mono text-xs text-muted-foreground'
      }
    >
      {LABELS[status]}
    </span>
  )
}
