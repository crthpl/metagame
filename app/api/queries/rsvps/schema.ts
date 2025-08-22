import { z } from 'zod'
import { DbSessionRsvp } from '@/types/database/dbTypeAliases'

export const RsvpSchema = z.object({
  session_id: z.string(),
  user_id: z.string(),
  on_waitlist: z.boolean(),
  created_at: z.string(),
}) satisfies z.ZodType<DbSessionRsvp>

export const RsvpsResponseSchema = z.array(RsvpSchema)

export type RsvpResponse = z.infer<typeof RsvpSchema>
export type RsvpsResponse = z.infer<typeof RsvpsResponseSchema>
