import { createServiceClient } from "@/utils/supabase/service";

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