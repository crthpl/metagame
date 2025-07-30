'use server'

import { createClient } from "@/utils/supabase/server"
import { createServiceClient } from "@/utils/supabase/service"

export const getCurrentUserId = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export const getCurrentUserEmail = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email
}

export const getCurrentUser = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserAdminStatus = async (userId: string) => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data?.is_admin ?? false
}

export const getUserProfile = async (userId: string) => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const getCurrentUserProfile = async () => {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  return getUserProfile(userId)
}