import { Tables } from "@/types/database/supabase.types";

export type DbSession = Tables<"sessions">;
export type DbSessionView = Tables<"sessions_view">;
export type DbLocation = Tables<"locations">;
export type DbTicket = Tables<"tickets">;
export type DbTicketView = Tables<"tickets_view">;
export type DbProfile = Tables<"profiles">;