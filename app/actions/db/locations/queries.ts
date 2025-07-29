'use server'
import { createServiceClient } from "@/utils/supabase/service";

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