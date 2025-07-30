'use server'
import { createServiceClient } from "@/utils/supabase/service";
import { getCurrentUserId, getUserAdminStatus } from "../users/queries";

export const getAllLocations = async () => {
  console.log('getAllLocations')
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('locations')
    .select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const getOrderedScheduleLocations = async () => {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('display_in_schedule', true)
    .order('schedule_display_order', { ascending: true })
  if (error) {
    throw new Error(error.message)
  }
  return data
}