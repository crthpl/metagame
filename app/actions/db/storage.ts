'use server'

import { storageService } from "@/lib/db/storage"
import { currentUserWrapper } from "./auth"

/* Queries */
export const getCurrentUserProfilePictureUploadUrl = currentUserWrapper(async ({ userId }: { userId: string }) => {
  const bucket = 'public-assets'
  const path = `profile_pictures/${userId}`
  const url = await storageService.getSignedUploadUrl(bucket, path, 'image/*')
  return url
})

export const getCurrentUserProfilePictureUrl = currentUserWrapper(async ({ userId }: { userId: string }) => {
  const bucket = 'public_assets'
  const path = `profile_pictures/${userId}`
  return await storageService.getFileUrl(bucket, path)
})

/* Mutations */
export const deleteCurrentUserProfilePicture = currentUserWrapper(async ({ userId }: { userId: string }) => {
  const bucket = 'public_assets'
  const path = `profile_pictures/${userId}`
  return await storageService.deleteFile(bucket, path)
})