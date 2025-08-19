'use server'
import { sessionsService } from "@/lib/db/sessions"
import { DbSession, DbSessionUpdate } from "@/types/database/dbTypeAliases"
import { createClient } from "@/utils/supabase/server"
import { usersService } from "@/lib/db/users"
import z from "zod"
import { SessionAgesEnum } from "@/utils/dbUtils"

export async function userCanEditSession({userId, sessionId}: {userId: string, sessionId: string}) {
  console.log("userCanEditSession", userId, sessionId)
  //Admins can edit any session
  if (await usersService.getUserAdminStatus({userId})) {
    return true
  }

  const session = await sessionsService.getSessionById({sessionId})

  //Hosts can edit sessions
  if ([session.host_1_id, session.host_2_id, session.host_3_id].includes(userId)) {
    return true
  }


  return false
}

// Fields that users can update on sessions; for admins editing sessinos more generally, we use adminUpdateSession
const sessionUpdateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  min_capacity: z.number().min(1),
  max_capacity: z.number().min(1),
  ages: z.enum(SessionAgesEnum)
})
export async function userEditSession(
  {
    sessionId,
    sessionUpdate
  }:{
    sessionId: DbSession["id"],
    sessionUpdate: DbSessionUpdate
  }) {
    const supabase = await createClient()
    const {data: {user: currentUser}, error: currentUserError } = await supabase.auth.getUser()
    if (currentUserError || !currentUser) {
      return false
    }
    if (!userCanEditSession({userId: currentUser.id, sessionId})) {
      throw new Error("Unauthorized")
    }
    const validatedSessionUpdate = sessionUpdateSchema.parse(sessionUpdate)
    await sessionsService.updateSession({sessionId, payload: validatedSessionUpdate})
  }