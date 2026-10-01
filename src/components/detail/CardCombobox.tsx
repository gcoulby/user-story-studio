import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Card } from '@/types/domain'

interface CardComboboxProps {
  cards: Card[]
  value: string
  onChange: (id: string) => void
  placeholder?: string
  className?: string
}

// Searchable target-card picker. The text box only filters the list — the
// stored value is set exclusively by picking a `CommandItem`, so the result
// is always a real card id, never free text.
export function CardCombobox({
  cards,
  value,
  onChange,
  placeholder = 'select card…',
  className,
}: CardComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = cards.find((c) => c.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-8 min-w-0 flex-1 items-center justify-between rounded-md border border-border bg-background px-2.5 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-ring',
            className,
          )}
        >
          <span
            className={cn(
              'truncate text-left',
              !selected && 'text-muted-foreground',
            )}
          >
            {selected ? selected.goal || selected.id : placeholder}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search cards…" />
          <CommandList>
            <CommandEmpty>No matching card.</CommandEmpty>
            <CommandGroup>
              {cards.map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.goal || c.id}
                  onSelect={() => {
                    onChange(c.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-3.5 w-3.5',
                      c.id === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{c.goal || c.id}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
