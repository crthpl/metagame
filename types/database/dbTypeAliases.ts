import { Tables, TablesInsert, TablesUpdate } from "@/types/database/supabase.types";

export type DbSession = Tables<"sessions">;
export type DbSessionInsert = TablesInsert<"sessions">;
export type DbSessionUpdate = TablesUpdate<"sessions">;
export type DbSessionView = Tables<"sessions_view">;

export type DbLocation = Tables<"locations">;
export type DbLocationInsert = TablesInsert<"locations">;
export type DbLocationUpdate = TablesUpdate<"locations">;

export type DbTicket = Tables<"tickets">;
export type DbTicketInsert = TablesInsert<"tickets">;
export type DbTicketUpdate = TablesUpdate<"tickets">;

export type DbProfile = Tables<"profiles">;
export type DbProfileInsert = TablesInsert<"profiles">;
export type DbProfileUpdate = TablesUpdate<"profiles">;

export type DbSessionRsvp = Tables<"session_rsvps">;
export type DbSessionRsvpInsert = TablesInsert<"session_rsvps">;
export type DbSessionRsvpUpdate = TablesUpdate<"session_rsvps">;
export type DbSessionRsvpView = Tables<"session_rsvps_view">;