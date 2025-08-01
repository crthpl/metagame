'use server'
import { sessionsService } from "@/lib/db/sessions"
import { currentUserWrapper } from "./auth"

/* Mutations */
export const rsvpCurrentUserToSession = currentUserWrapper(sessionsService.rsvpUserToSession)
export const unrsvpCurrentUserFromSession = currentUserWrapper(sessionsService.unrsvpUserFromSession)
export const toggleCurrentUserSessionRsvp = currentUserWrapper(sessionsService.toggleUserRsvpForSession)
export const unrsvpCurrentUserFromAllSessions = currentUserWrapper(sessionsService.unrsvpUserFromAllSessions)

/* Queries */
export const getAllSessions =  sessionsService.getAllSessions
export const getAllSessionRsvpCounts = sessionsService.getAllSessionRsvpCounts
export const getSingleSessionRsvps = sessionsService.getSingleSessionRsvps
export const getCurrentUserRsvps = currentUserWrapper(sessionsService.getUserRsvps)
export const getCurrentUserHostedSessions = currentUserWrapper(sessionsService.getUsersHostedSessions)