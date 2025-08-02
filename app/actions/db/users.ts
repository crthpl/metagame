'use server'

import { usersService } from "@/lib/db/users"
import { currentUserWrapper, adminExportWrapper } from "./auth"

/* Queries */
export const getCurrentUser = usersService.getCurrentUser
export const getCurrentUserProfile = currentUserWrapper(usersService.getUserProfile)
export const adminGetAllProfiles = adminExportWrapper(usersService.getAllProfiles)
export const adminGetUserProfileByEmail = adminExportWrapper(usersService.getUserProfileByEmail)

/* Mutations */
export const updateCurrentUserProfile = currentUserWrapper(usersService.updateUserProfile)
export const setCurrentUserProfilePicture = currentUserWrapper(usersService.setUserProfilePicture)
export const deleteCurrentUserProfilePicture = currentUserWrapper(usersService.deleteUserProfilePicture)
export const fullDeleteCurrentUser = currentUserWrapper(usersService.fullDeleteUser)