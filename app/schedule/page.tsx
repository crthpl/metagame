import Schedule from "./Schedule";
import {z} from 'zod'
import { getAllLocations } from "../actions/db/locations/queries";
import { getAllSessions } from "../actions/db/sessions/queries";
import { DbLocation, DbSessionView } from "@/types/database/dbTypeAliases";
import { getCurrentUserRsvps } from "../actions/db/session_rsvps/queries";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
const sessionSchema = z.uuid()
const dayIndexSchema = z.coerce.number()

export default async function ScheduleDemo({searchParams}:{searchParams: SearchParams}) {
  const {session: sessionIdParam, day: dayIndexParam} = await searchParams

  let sessions: DbSessionView[] = []
  let locations: DbLocation[] = []
  let currentUserRsvps: string[] = []
  try {
    sessions = await getAllSessions()
    locations = await getAllLocations()
  } catch (error) {
    console.error(error)
    return <div>Error loading sessions or locations: {error instanceof Error ? error.message : 'Unknown error'}</div>
  }
  try {
    currentUserRsvps = await getCurrentUserRsvps()
  } catch (error) {
    //If no one is logged in we can still show the schedule
    console.error(error)
  }

  const parsedSessionId = sessionSchema.safeParse(sessionIdParam)
  const sessionId = parsedSessionId.success && sessions.some(session => session.id === parsedSessionId.data) ? parsedSessionId.data : undefined
  //This lets you scroll to a day that doesnt include the session you link to but oh well
  const parsedDayIndex = dayIndexSchema.safeParse(dayIndexParam)
  const dayIndex = parsedDayIndex.success && [0,1,2].includes(parsedDayIndex.data) ? parsedDayIndex.data : undefined
  return (
    <div className="h-[calc(100vh-80px)] bg-dark-900 p-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl h-full flex flex-col">
        <Schedule
          sessions={sessions || []}
          locations={locations || []}
          dayIndex={dayIndex}
          sessionId={sessionId}
          currentUserRsvps={currentUserRsvps}
        />
      </div>
    </div>
  );
} 