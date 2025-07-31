'use server'
import { currentUserWrapper } from "../auth";
import { sessionsService } from "@/lib/db/sessions";

export const allSessions =  sessionsService.getAllSessions
export const getAllSessionRsvpCounts = sessionsService.getAllSessionRsvpCounts
export const getSingleSessionRsvps = sessionsService.getSingleSessionRsvps
export const getCurrentUserRsvps = currentUserWrapper(sessionsService.getUserRsvps)
export const getCurrentUserHostedSessions = currentUserWrapper(sessionsService.getUsersHostedSessions)