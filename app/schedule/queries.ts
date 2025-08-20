import { SessionsResponse, SessionsResponseSchema } from "@/app/api/queries/sessions/schema"
import { RsvpsResponse, RsvpsResponseSchema } from "@/app/api/queries/rsvps/schema"
import { LocationsResponse, LocationsResponseSchema } from "@/app/api/queries/locations/schema"
import { ProfilesResponse, ProfilesResponseSchema } from "@/app/api/queries/profiles/schema"
import { SessionResponse, SessionSchema } from "@/app/api/queries/sessions/schema"

// Utility function to handle API errors with detailed information
const handleApiError = async (response: Response, defaultMessage: string): Promise<never> => {
  let errorDetails = defaultMessage
  try {
    const errorData = await response.json()
    errorDetails = errorData.message || errorData.error || errorDetails
    if (errorData.details) {
      console.error('API Error Details:', errorData.details)
    }
  } catch {
    // If we can't parse the error response, use the status text
    errorDetails = `${errorDetails}: ${response.status} ${response.statusText}`
  }
  throw new Error(errorDetails)
}

export const fetchSessions = async (): Promise<SessionsResponse> => {
  const response = await fetch('/api/queries/sessions')
  if (!response.ok) {
    await handleApiError(response, 'Failed to fetch sessions')
  }
  
  const data = await response.json()
  return SessionsResponseSchema.parse(data)
}

export const fetchCurrentUserRsvps = async (): Promise<RsvpsResponse> => {
  const response = await fetch('/api/queries/rsvps')
  if (!response.ok) {
    await handleApiError(response, 'Failed to fetch RSVPs')
  }
  
  const data = await response.json()
  return RsvpsResponseSchema.parse(data)
}

export const fetchLocations = async (): Promise<LocationsResponse> => {
  const response = await fetch('/api/queries/locations')
  if (!response.ok) {
    await handleApiError(response, 'Failed to fetch locations')
  }
  
  const data = await response.json()
  return LocationsResponseSchema.parse(data)
}

export const fetchProfiles = async (): Promise<ProfilesResponse> => {
  const response = await fetch('/api/queries/profiles')
  if (!response.ok) {
    await handleApiError(response, 'Failed to fetch profiles')
  }
  
  const data = await response.json()
  return ProfilesResponseSchema.parse(data)
}

export const fetchSessionById = async (sessionId: string): Promise<SessionResponse> => {
  const response = await fetch(`/api/queries/sessions/${sessionId}`)
  if (!response.ok) {
    await handleApiError(response, 'Failed to fetch session')
  }
  
  const data = await response.json()
  return SessionSchema.parse(data)
}
