import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface NewCardButtonProps {
  onClick: () => void
}

export function NewCardButton({ onClick }: NewCardButtonProps) {
  return (
    <Button onClick={onClick} className="w-full">
      <Plus size={14} />
      New card
    </Button>
  )
}
