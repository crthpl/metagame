import { createServiceClient } from "@/utils/supabase/service"

export const storageService = {
  /** Get a signed URL for uploading a file */
  getSignedUploadUrl: async (bucket: string, path: string, fileType: string) => {
    console.log('getSignedUploadUrl', bucket, path, fileType)
    const supabase = createServiceClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path)
    
    if (error) {
      throw new Error(error.message)
    }
    return data
  },

  /** Delete a file from storage */
  deleteFile: async (bucket: string, path: string) => {
    const supabase = createServiceClient()
    const { data, error } = await supabase.storage.from(bucket).remove([path])
    if (error) {
      throw new Error(error.message)
    }
    return data
  },

  /** Get the public URL for a file */
  getFileUrl: async (bucket: string, path: string) => {
    const supabase = createServiceClient()
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },

  
} 