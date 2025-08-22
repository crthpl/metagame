'use server'

import { storageService } from '@/lib/db/storage'
import { currentUserWrapper } from './auth'

/* Queries */
export const getCurrentUserProfilePictureUploadUrl = currentUserWrapper(
  async ({
    userId,
    fileExtension,
  }: {
    userId: string
    fileExtension: string | null
  }) => {
    const bucket = 'public-assets'
    const extension = fileExtension ? `.${fileExtension}` : ''
    const path = `profile_pictures/${userId}${extension}`
    const url = await storageService.getSignedUploadUrl(bucket, path, 'image/*')
    return {
      signedUrl: url.signedUrl,
      storageUrl:
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        '/storage/v1/object/public/' +
        bucket +
        '/' +
        path,
    }
  },
)

export const getCurrentUserProfilePictureUrl = currentUserWrapper(
  async ({ userId }: { userId: string }) => {
    const bucket = 'public-assets'
    const path = `profile_pictures/${userId}`
    return await storageService.getFileUrl(bucket, path)
  },
)

/* Mutations */
export const deleteCurrentUserProfilePicture = currentUserWrapper(
  async ({ userId }: { userId: string }) => {
    const bucket = 'public-assets'
    const path = `profile_pictures/${userId}`
    return await storageService.deleteFile(bucket, path)
  },
)
