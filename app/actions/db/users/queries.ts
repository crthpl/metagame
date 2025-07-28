'use server'

import { createClient } from "@/utils/supabase/server"
import { createServiceClient } from "@/utils/supabase/service"

export const getCurrentUserId = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

export const getCurrentUserEmail = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email
}

export const getUserAdminStatus = async (userId: string) => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
  if (error) {
    throw new Error(error.message)
  }
  return data?.[0]?.is_admin ?? false
}