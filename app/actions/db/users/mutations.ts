import { deleteFile, upsertToStorage } from "../storage/storage"
import { getCurrentUserId } from "./queries"

import { createServiceClient } from "@/utils/supabase/service"
import { DbProfileUpdate } from "@/types/database/dbTypeAliases"

export const updateUserProfile = async ({userId, data}: {userId: string, data: DbProfileUpdate}) => {
  const supabase = createServiceClient()
  const {data: updatedData, error} = await supabase.from('profiles').update(data).eq('id', userId)
  if (error) {
    throw new Error(error.message)
  }
  return updatedData
}

export const updateCurrentUserProfile = async (data: DbProfileUpdate) => {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  return updateUserProfile({userId, data})
}

export const setUserProfilePicture = async ({image, userId}: {image: File, userId: string}) => {
  const bucket = 'public_assets'
  const path = `profile_pictures/${userId}`
  const { id, path: fullPath } = await upsertToStorage(image, bucket, path)
  return { id, path: fullPath }
}

export const setCurrentUserProfilePicture = async (image: File) => {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  return setUserProfilePicture({image, userId})
}

export const deleteUserProfilePicture = async (userId: string) => {
  const bucket = 'public_assets'
  const path = `profile_pictures/${userId}`
  await deleteFile(bucket, path)
}

export const fullDeleteUser = async (userId: string) => {
  const supabase = createServiceClient()
  await deleteUserProfilePicture(userId)
  const {data, error} = await supabase.auth.admin.deleteUser(userId)
  if (error) {
    throw new Error(error.message)
  }
  return data
}