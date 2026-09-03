import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  downloadJson,
  parseStudioData,
  serializeStudioData,
} from '@/lib/transfer'
import type { StudioData } from '@/types/domain'

interface DataTransferProps {
  exportData: () => StudioData
  onImport: (data: StudioData) => void
}

export function DataTransfer({ exportData, onImport }: DataTransferProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10)
    downloadJson(
      `use-case-studio-${stamp}.json`,
      serializeStudioData(exportData()),
    )
  }

  const handleFile = async (file: File) => {
    setError(null)
    try {
      onImport(parseStudioData(await file.text()))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that file')
    }
  }

  return (
    <div className="mt-6 space-y-1.5">
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 text-xs"
          onClick={handleExport}
        >
          <Download size={13} />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 text-xs"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={13} />
          Import
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  )
}
