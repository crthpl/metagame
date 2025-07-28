'use server'
import { createServiceClient } from "@/utils/supabase/service";
import { getCurrentUserId } from "../users/queries";


export const rsvpCurrentUserToSession = async (sessionId: string) => {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('session_rsvps')
    .upsert({ user_id: userId, session_id: sessionId })
    .select()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const unrsvpCurrentUserFromSession = async (sessionId: string) => {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('session_rsvps')
    .delete()
    .eq('user_id', userId)
    .eq('session_id', sessionId)
  if (error) {
    throw new Error(error.message)
  }
}