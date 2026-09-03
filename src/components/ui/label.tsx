import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  emphasis?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, emphasis, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-[10.5px] uppercase tracking-wide peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      emphasis
        ? 'font-semibold text-foreground/80'
        : 'font-medium text-muted-foreground',
      className,
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
