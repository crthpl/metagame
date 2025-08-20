import { getAllSessions, getCurrentUserRsvps } from "@/app/actions/db/sessions"
import { getUserEditPermissionsForSessions } from "./actions"
import { getOrderedScheduleLocations } from "@/app/actions/db/locations"
import { createClient } from "@/utils/supabase/server"
import Schedule from "./Schedule"

export default async function ScheduleProvider({ 
  sessionId, 
  dayIndex 
}: {
  sessionId?: string;
  dayIndex?: number;
}) {
  const maybeCurrentUserRsvps = async () => {
    try {
      return await getCurrentUserRsvps()
    } catch {
      return []
    }
  }
  const [sessions, locations, currentUserRsvps] = await Promise.all([
    getAllSessions(),
    getOrderedScheduleLocations(),
    maybeCurrentUserRsvps()
  ])

  
  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch edit permissions if user is logged in
  let editPermissions: Record<string, boolean> = {}
  if (user?.id) {
    editPermissions = await getUserEditPermissionsForSessions({
      userId: user.id,
      sessionIds: sessions.map(s => s.id).filter(Boolean) as string[]
    })
  }
  
  return (
    <Schedule 
      sessionId={sessionId} 
      dayIndex={dayIndex}
      locations={locations}
      sessions={sessions}
      editPermissions={editPermissions}
      currentUserRsvps={currentUserRsvps}
    />
  )
}
