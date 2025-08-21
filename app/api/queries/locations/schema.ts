import { z } from "zod";
import { DbLocation } from "@/types/database/dbTypeAliases";

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  campus_location: z.string().nullable(),
  capacity: z.number().nullable(),
  display_in_schedule: z.boolean(),
  image_url: z.string().nullable(),
  lh_name: z.string().nullable(),
  schedule_display_order: z.number(),
  thumbnail_url: z.string().nullable(),
}) satisfies z.ZodType<DbLocation>;

export const LocationsResponseSchema = z.array(LocationSchema);

export type LocationResponse = z.infer<typeof LocationSchema>;
export type LocationsResponse = z.infer<typeof LocationsResponseSchema>;
