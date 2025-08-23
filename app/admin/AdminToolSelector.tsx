'use client'

import { ADMIN_TOOLS, type AdminToolId } from './tools/tools'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AdminToolSelectorProps {
  selectedTool: AdminToolId | null
  onToolSelect: (tool: AdminToolId) => void
}

export function AdminToolSelector({
  selectedTool,
  onToolSelect,
}: AdminToolSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Admin Tool</label>
      <Select
        value={selectedTool || ''}
        onValueChange={(value) => onToolSelect(value as AdminToolId)}
      >
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
