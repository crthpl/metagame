'use server'
import { sessionsService } from "@/lib/db/sessions"
import { currentUserWrapper } from "../auth"


export const rsvpCurrentUserToSession = currentUserWrapper(sessionsService.rsvpUserToSession)
export const unrsvpCurrentUserFromSession = currentUserWrapper(sessionsService.unrsvpUserFromSession)
export const toggleCurrentUserSessionRsvp = currentUserWrapper(sessionsService.toggleUserRsvpForSession)
export const unrsvpCurrentUserFromAllSessions = currentUserWrapper(sessionsService.unrsvpUserFromAllSessions)