import { Monitor, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { ThemePreference } from '@/hooks/useTheme'

interface ThemeToggleProps {
  theme: ThemePreference
  onCycle: () => void
}

const NEXT_LABEL: Record<ThemePreference, string> = {
  light: 'Switch to dark theme',
  dark: 'Switch to system theme',
  system: 'Switch to light theme',
}

export function ThemeToggle({ theme, onCycle }: ThemeToggleProps) {
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onCycle}
      title={NEXT_LABEL[theme]}
      aria-label={NEXT_LABEL[theme]}
    >
      <Icon size={16} />
    </Button>
  )
}
