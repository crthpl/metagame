'use server'
import { createServiceClient } from "@/utils/supabase/service";
import { getCurrentUserId } from "../users/queries";

export const getAllSessions = async () => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('sessions_view')
    .select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data
}

/**
 * Get all session RSVP counts
 */
export const getAllSessionRsvpCounts = async () => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('sessions_view')
    .select('id, rsvp_count')
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const getSingleSessionRsvps = async (sessionId: string) => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('session_rsvps')
    .select('*')
    .eq('session_id', sessionId)
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const getCurrentUserRsvps = async () => {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('session_rsvps')
    .select('*')
    .eq('user_id', userId)
    .select('session_id')
  if (error) {
    throw new Error(error.message)
  }
  return data.map((rsvp) => rsvp.session_id)
}

export const getUsersHostedSessions = async (userId: string) => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('sessions_view')
    .select('*')
    .eq('host_1_id', userId)
    .or(`host_2_id.eq.${userId},host_3_id.eq.${userId}`)
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const getCurrentUserHostedSessions = async () => {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  return getUsersHostedSessions(userId)
}