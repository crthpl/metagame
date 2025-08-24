'use client'

import { ADMIN_TOOLS, type AdminToolId } from './tools/tools'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AdminToolSelectorProps {
  selectedTool: AdminToolId | undefined
}

export function AdminToolSelector({ selectedTool }: AdminToolSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleToolSelect = (toolId: AdminToolId) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tool', toolId)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Admin Tool</label>
      <Select value={selectedTool || ''} onValueChange={handleToolSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose an admin tool..." />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ADMIN_TOOLS).map(([toolKey, tool]) => {
            return (
              <SelectItem key={toolKey} value={toolKey}>
                <span className="font-medium">
                  {tool.label} - {tool.menuDescription}
                </span>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
