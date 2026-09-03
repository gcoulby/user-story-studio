import type { ReactNode } from 'react'

interface FieldBlockProps {
  label: string
  icon?: ReactNode
  children: ReactNode
}

export function FieldBlock({ label, icon, children }: FieldBlockProps) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="leading-relaxed text-foreground">{children}</div>
    </div>
  )
}
