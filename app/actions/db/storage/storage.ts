import { createServiceClient } from "@/utils/supabase/service"

export const upsertToStorage = async (file: File, bucket: string, path: string) => {
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const deleteFile = async (bucket: string, path: string) => {
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage.from(bucket).remove([path])
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const getFileUrl = async (bucket: string, path: string) => {
  const supabase = createServiceClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}