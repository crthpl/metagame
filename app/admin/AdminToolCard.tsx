import { ADMIN_TOOLS, type AdminToolId } from './tools/tools'

interface AdminToolCardProps {
  toolId: AdminToolId | null
  searchParams?: Promise<Record<string, string | undefined>>
}

export function AdminToolCard({ toolId, searchParams }: AdminToolCardProps) {
  if (!toolId) {
    return <div>No tool selected</div>
  }
  if (!ADMIN_TOOLS[toolId]) {
    return <div>Tool not found</div>
  }

  const tool = ADMIN_TOOLS[toolId]

  return (
    <div className="bg-bg-secondary border border-gray-600 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{tool.label}</h2>
        <p className="text-muted-foreground">{tool.longDescription}</p>
      </div>
      <tool.component searchParams={searchParams} />
    </div>
  )
}
