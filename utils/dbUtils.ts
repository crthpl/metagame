import { DbSessionView, DbSessionAges, DbTicketType } from "@/types/database/dbTypeAliases";

export const dbGetHostsFromSession = (session: DbSessionView) => {
  const host1Name = (session.host_1_first_name ?? "") + " " + (session.host_1_last_name  ?? "")
  const host2Name = (session.host_2_first_name ?? "") + " " + (session.host_2_last_name  ?? "")
  const host3Name = (session.host_3_first_name ?? "") + " " + (session.host_3_last_name  ?? "")
  return [host1Name, host2Name, host3Name].filter(name => name !== " ")
}

export const getAgesDisplayText = (ages: DbSessionAges | null): string => {
  switch (ages) {
    case 'ALL':
      return 'All Ages';
    case 'ADULTS':
      return '18+';
    case 'KIDS':
      return 'Great for Kids';
    default:
      return 'All Ages';
  }
}

export const SESSION_AGES = {
  ALL: 'ALL' as const,
  ADULTS: 'ADULTS' as const,
  KIDS: 'KIDS' as const,
} as const;

export const SessionAgesEnum = Object.values(SESSION_AGES) as DbSessionAges[];

export const TICKET_TYPES: Record<Uppercase<DbTicketType>, DbTicketType> = {
  NPC: 'npc' as const,
  PLAYER: 'player' as const,
  SUPPORTER: 'supporter' as const,
  STUDENT: 'student' as const,
  FRIDAY: 'friday' as const,
  SATURDAY: 'saturday' as const,
  SUNDAY: 'sunday' as const,
} as const;

export const TICKET_TYPES_ENUM = Object.values(TICKET_TYPES) as DbTicketType[];

