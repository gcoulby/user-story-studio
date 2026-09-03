import type { SaveStatus as Status } from '@/lib/storage'

const LABELS: Record<Status, string> = {
  idle: 'Saved',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Save failed',
}

interface SaveStatusProps {
  status: Status
  fileName: string | null
}

export function SaveStatus({ status, fileName }: SaveStatusProps) {
  return (
    <span
      className={
        status === 'error'
          ? 'font-mono text-xs text-destructive'
          : 'font-mono text-xs text-muted-foreground'
      }
    >
      {fileName ? `${fileName} · ` : ''}
      {LABELS[status]}
    </span>
  )
}
