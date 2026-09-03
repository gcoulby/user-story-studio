import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddInlineFormProps {
  placeholder: string
  onAdd: (value: string) => void
}

// Shared inline "type a name, press enter or +" row used to add actors and epics.
export function AddInlineForm({ placeholder, onAdd }: AddInlineFormProps) {
  const [value, setValue] = useState('')

  const submit = () => {
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

  return (
    <div className="mt-1.5 flex gap-1.5">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        className="h-7 min-w-0 flex-1 text-xs"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={submit}
      >
        <Plus size={13} />
      </Button>
    </div>
  )
}
