import ScheduleProvider from "./ScheduleProvider";
import {z} from 'zod'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
const sessionIdSchema = z.uuid()
const dayIndexSchema = z.coerce.number()

export default async function ScheduleDemo({searchParams}:{searchParams: SearchParams}) {
  const {session: sessionIdParam, day: dayIndexParam} = await searchParams


  const parsedSessionId = sessionIdSchema.safeParse(sessionIdParam)
  const parsedDayIndex = dayIndexSchema.safeParse(dayIndexParam)
  const dayIndex = parsedDayIndex.success && [0,1,2].includes(parsedDayIndex.data) ? parsedDayIndex.data : undefined
  return (
    <div className=" bg-dark-500  p-4 h-fit w-full">
      <div className="container mx-auto max-w-7xl flex flex-col border border-secondary-300 rounded-2xl overflow-hidden">
        <ScheduleProvider
          dayIndex={dayIndex}
          sessionId={parsedSessionId.success ? parsedSessionId.data : undefined}
        />
      </div>
    </div>
  );
} 
