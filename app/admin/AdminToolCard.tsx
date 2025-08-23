'use client'

import { ADMIN_TOOLS, type AdminToolId } from './tools/tools'

export function AdminToolCard({ toolId }: { toolId: AdminToolId | null }) {
  if (!toolId) {
    return <div>No tool selected</div>
  }

  const tool = ADMIN_TOOLS[toolId]

  return (
    <div className="bg-bg-secondary border border-gray-600 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{tool.label}</h2>
        <p className="text-muted-foreground">{tool.longDescription}</p>
      </div>
      <tool.component />
    </div>
  )
}
