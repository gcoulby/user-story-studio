import * as React from 'react'
import { PanelLeft, PanelLeftOpen, PanelRightOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '17rem'
const SIDEBAR_WIDTH_COLLAPSED = '2.75rem'

type SidebarState = 'expanded' | 'collapsed'

interface SidebarContextValue {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar(): SidebarContextValue {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  // Cookie key + optional ⌘/Ctrl shortcut letter that toggles this sidebar.
  storageKey?: string
  shortcut?: string
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  storageKey,
  shortcut,
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [openState, setOpenState] = React.useState(() => {
    if (typeof document === 'undefined' || !storageKey) return defaultOpen
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${storageKey}=(true|false)`),
    )
    return match ? match[1] === 'true' : defaultOpen
  })

  const open = openProp ?? openState

  const setOpen = React.useCallback(
    (value: boolean) => {
      onOpenChange?.(value)
      if (openProp === undefined) setOpenState(value)
      if (storageKey && typeof document !== 'undefined') {
        document.cookie = `${storageKey}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      }
    },
    [onOpenChange, openProp, storageKey],
  )

  const toggleSidebar = React.useCallback(() => setOpen(!open), [open, setOpen])

  React.useEffect(() => {
    if (!shortcut) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === shortcut.toLowerCase() &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [shortcut, toggleSidebar])

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      state: open ? 'expanded' : 'collapsed',
      open,
      setOpen,
      toggleSidebar,
      isMobile,
    }),
    [open, setOpen, toggleSidebar, isMobile],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

interface SidebarProps extends React.ComponentProps<'div'> {
  side?: 'left' | 'right'
  collapsible?: 'rail' | 'none'
  width?: string
}

export function Sidebar({
  side = 'left',
  collapsible = 'rail',
  width = SIDEBAR_WIDTH,
  className,
  children,
  style,
  ...props
}: SidebarProps) {
  const { state, open, setOpen, toggleSidebar, isMobile } = useSidebar()
  const collapsed = collapsible === 'rail' && state === 'collapsed'

  const border = side === 'left' ? 'border-r' : 'border-l'
  const ExpandIcon = side === 'left' ? PanelLeftOpen : PanelRightOpen

  const content = (
    <div className="flex h-full min-h-0 flex-col" style={{ width }}>
      {children}
    </div>
  )

  if (isMobile && collapsible !== 'none') {
    return (
      <>
        {open && (
          <button
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />
        )}
        <div
          data-sidebar="sidebar"
          data-state={state}
          data-side={side}
          className={cn(
            'fixed inset-y-0 z-50 flex flex-col overflow-hidden border-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-linear',
            side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
            open
              ? 'translate-x-0'
              : side === 'left'
                ? '-translate-x-full'
                : 'translate-x-full',
            className,
          )}
          style={{ width, ...style }}
          {...props}
        >
          {content}
        </div>
      </>
    )
  }

  return (
    <div
      data-sidebar="sidebar"
      data-state={state}
      data-side={side}
      data-collapsible={collapsible}
      className={cn(
        'relative flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-linear',
        border,
        className,
      )}
      style={{
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : width,
        ...style,
      }}
      {...props}
    >
      {collapsed ? (
        <div className="flex h-full flex-col items-center py-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Expand sidebar"
            className="h-8 w-8 text-muted-foreground"
            onClick={toggleSidebar}
          >
            <ExpandIcon size={16} />
          </Button>
        </div>
      ) : (
        content
      )}
    </div>
  )
}

export function SidebarInset({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative flex min-h-0 min-w-0 flex-1 flex-col', className)}
      {...props}
    />
  )
}

interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode
}

export function SidebarTrigger({
  className,
  icon,
  onClick,
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle sidebar"
      className={cn('h-8 w-8', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {icon ?? <PanelLeft size={16} />}
    </Button>
  )
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 p-3', className)} {...props} />
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-3', className)}
      {...props}
    />
  )
}

export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3',
        className,
      )}
      {...props}
    />
  )
}

export function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-1.5 py-1', className)} {...props} />
  )
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('my-1.5 h-px bg-sidebar-border', className)} {...props} />
  )
}
