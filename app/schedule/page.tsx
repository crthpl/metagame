import { createServiceClient } from "@/utils/supabase/service";
import Schedule from "./Schedule";
import {z} from 'zod'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
const sessionSchema = z.uuid()
const dayIndexSchema = z.coerce.number()
export default async function ScheduleDemo({searchParams}:{searchParams: SearchParams}) {
  const {session: sessionIdParam, day: dayIndexParam} = await searchParams

  const supabase = createServiceClient();
  const { data: sessions, error: sessionsError } = await supabase.from('sessions_view').select('*');
  const { data: locations, error: locationsError } = await supabase.from('locations').select('*');
  if (sessionsError || locationsError || !sessions || !locations) {
    console.error(sessionsError, locationsError);
    return <div>Error loading sessions or locations</div>;
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
        />
      </div>
    </div>
  );
} 