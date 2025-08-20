import { z } from "zod"
import { DbSession } from "@/types/database/dbTypeAliases"
import { SESSION_AGES } from "@/utils/dbUtils"

export const SessionSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  location_id: z.string().nullable(),
  location_name: z.string().nullable(),
  max_capacity: z.number().nullable(),
  min_capacity: z.number().nullable(),
  rsvp_count: z.number().nullable(),
  host_1_id: z.string().nullable(),
  host_1_email: z.string().nullable(),
  host_1_first_name: z.string().nullable(),
  host_1_last_name: z.string().nullable(),
  host_2_id: z.string().nullable(),
  host_2_email: z.string().nullable(),
  host_2_first_name: z.string().nullable(),
  host_2_last_name: z.string().nullable(),
  host_3_id: z.string().nullable(),
  host_3_email: z.string().nullable(),
  host_3_first_name: z.string().nullable(),
  host_3_last_name: z.string().nullable(),
  ages: z.enum(SESSION_AGES).nullable(),
}) satisfies z.ZodType<DbSession>

export const SessionsResponseSchema = z.array(SessionSchema)

export type SessionResponse = z.infer<typeof SessionSchema>
export type SessionsResponse = z.infer<typeof SessionsResponseSchema>
