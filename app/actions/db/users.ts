'use server'

import { adminExportWrapper, currentUserWrapper } from './auth'

import { usersService } from '@/lib/db/users'

import { DbProfileUpdate } from '@/types/database/dbTypeAliases'

/* Queries */
export const getCurrentUser = usersService.getCurrentUser
export const getCurrentUserProfile = currentUserWrapper(
  usersService.getUserProfile,
)
export const getCurrentUserAdminStatus = async () =>
  currentUserWrapper(usersService.getUserAdminStatus)({})
export const adminGetAllProfiles = adminExportWrapper(
  usersService.getAllProfiles,
)
export const adminGetUserProfileByEmail = adminExportWrapper(
  usersService.getUserProfileByEmail,
)

/* Mutations */
export const updateCurrentUserProfile = async ({
  data,
}: {
  data: DbProfileUpdate
}) => {
  const wrappedFunction = currentUserWrapper(usersService.updateUserProfile)
  const wrappedAdminCheck = currentUserWrapper(usersService.getUserAdminStatus)

  // If trying to update team, check if user is admin
  if (data.team !== undefined) {
    const isAdmin = await wrappedAdminCheck({})
    if (!isAdmin) {
      throw new Error('Only administrators can change team assignments')
    }
  }

  return wrappedFunction({ data })
}
export const deleteCurrentUserProfilePicture = async () => {
  await currentUserWrapper(usersService.deleteUserProfilePicture)({})
  await currentUserWrapper(usersService.updateUserProfile)({
    data: {
      profile_pictures_url: null,
    },
  })
}
export const fullDeleteCurrentUser = async () =>
  currentUserWrapper(usersService.fullDeleteUser)({})
