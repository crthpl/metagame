import { Tables } from "@/types/database/supabase.types";

export type DbSession = Tables<"sessions">;
export type DbSessionUpdate = Partial<DbSession>;
export type DbSessionView = Tables<"sessions_view">;
export type DbLocation = Tables<"locations">;
export type DbLocationUpdate = Partial<DbLocation>;
export type DbTicket = Tables<"tickets">;
export type DbTicketUpdate = Partial<DbTicket>;
export type DbTicketView = Tables<"tickets_view">;
export type DbProfile = Tables<"profiles">;
export type DbProfileUpdate = Partial<DbProfile>;
export type DbSessionRsvp = Tables<"session_rsvps">;
export type DbSessionRsvpUpdate = Partial<DbSessionRsvp>;
export type DbSessionRsvpView = Tables<"session_rsvps_view">;