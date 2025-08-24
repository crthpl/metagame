import { AdminToolCard } from './AdminToolCard'
import { AdminToolSelector } from './AdminToolSelector'
import { type AdminToolId } from './tools/tools'

interface AdminPageProps {
  searchParams: Promise<{ tool?: string; [key: string]: string | undefined }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams
  const selectedTool = params.tool as AdminToolId | undefined

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Select a tool from the dropdown below to perform admin actions.
        </p>
      </div>

      <div className="space-y-6">
        <AdminToolSelector selectedTool={selectedTool} />

        {selectedTool && (
          <AdminToolCard
            toolId={selectedTool}
            searchParams={Promise.resolve(params)}
          />
        )}
      </div>
    </div>
  )
}
