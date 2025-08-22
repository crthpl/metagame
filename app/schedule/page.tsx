import ScheduleProvider from './ScheduleProvider'
import { z } from 'zod'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
const sessionIdSchema = z.uuid()
const dayIndexSchema = z.coerce.number()

export default async function ScheduleDemo({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { session: sessionIdParam, day: dayIndexParam } = await searchParams

  const parsedSessionId = sessionIdSchema.safeParse(sessionIdParam)
  const parsedDayIndex = dayIndexSchema.safeParse(dayIndexParam)
  const dayIndex =
    parsedDayIndex.success && [0, 1, 2].includes(parsedDayIndex.data)
      ? parsedDayIndex.data
      : undefined
  return (
    <div className="bg-dark-500 h-fit w-full p-4">
      <div className="border-secondary-300 container mx-auto flex max-w-7xl flex-col overflow-hidden rounded-2xl border">
        <ScheduleProvider
          dayIndex={dayIndex}
          sessionId={parsedSessionId.success ? parsedSessionId.data : undefined}
        />
      </div>
    </div>
  )
}
