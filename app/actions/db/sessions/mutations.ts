'use server'
import { createServiceClient } from "@/utils/supabase/service"
import { getCurrentUserId } from "../users/queries"

/**
 * RSVP the current user to a session
 */
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

/**
 * Un-RSVP the current user from a session
 */
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

/**
 * Toggle the current user's RSVP status for a session
 */
export const toggleCurrentUserSessionRsvp = async (data: { sessionId: string; action: 'add' | 'remove' }) => {
  if (data.action === 'add') {
    return await rsvpCurrentUserToSession(data.sessionId)
  } else {
    return await unrsvpCurrentUserFromSession(data.sessionId)
  }
}

/**
 * Un-RSVP the current user from all sessions
 */
export const unrsvpCurrentUserFromAllSessions = async () => {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('session_rsvps')
    .delete()
    .eq('user_id', userId)
    .select('session_id') // Return the session IDs that were removed
  if (error) {
    throw new Error(error.message)
  }
  return data 
}