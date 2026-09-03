import type { ReactNode } from 'react'

interface SectionLabelProps {
  icon: ReactNode
  children: ReactNode
}

export function SectionLabel({ icon, children }: SectionLabelProps) {
  return (
    <div className="mb-2 mt-6 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
      {icon}
      {children}
    </div>
  )
}
