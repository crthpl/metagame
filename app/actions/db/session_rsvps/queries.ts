import { createServiceClient } from "@/utils/supabase/service";
import { getCurrentUserId } from "../users/queries";

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