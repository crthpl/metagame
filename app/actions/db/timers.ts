'use server'

import { timersService } from '@/lib/db/timers/service'

import { DbTimerUpdate } from '@/types/database/dbTypeAliases'

/* Public timer actions - anyone can read/update timers since they're shared resources */

/** Get a timer by name */
export const getTimerByName = async ({ name }: { name: string }) => {
  return timersService.getTimerByName({ name })
}

/** Get all timers */
export const getAllTimers = async () => {
  return timersService.getAllTimers()
}

/** Get current timer state with real-time calculations */
export const getCurrentTimerState = async ({ name }: { name: string }) => {
  return timersService.getCurrentTimerState({ name })
}

/** Update a timer (with user team validation for certain actions) */
export const updateTimer = async ({
  name,
  data,
  userTeam,
}: {
  name: string
  data: DbTimerUpdate
  userTeam?: 'orange' | 'purple' | null
}) => {
  // If switching turns, validate that user is on the team that's currently active
  if (data.active_team !== undefined && userTeam) {
    const currentTimer = await timersService.getCurrentTimerState({ name })

    // When clicking to end your turn, you must be on the currently active team
    // or if no active team (starting game), you must be on a team
    if (currentTimer.active_team && currentTimer.active_team !== userTeam) {
      throw new Error(
        "You can only control the timer when it's your team's turn",
      )
    }
  }

  return timersService.updateTimer({ name, data })
}

/** Reset a timer to initial state */
export const resetTimer = async ({ name }: { name: string }) => {
  return timersService.resetTimer({ name })
}

/** Pause/unpause a timer */
export const pauseTimer = async ({ name }: { name: string }) => {
  return timersService.updateTimer({
    name,
    data: {
      is_paused: true,
      active_team: null,
    },
  })
}

/** Start/resume timer for a specific team */
export const startTimerForTeam = async ({
  name,
  team,
  userTeam,
}: {
  name: string
  team: 'orange' | 'purple'
  userTeam?: 'orange' | 'purple' | null
}) => {
  // Validate user is on the team they're trying to start
  if (userTeam && userTeam !== team) {
    throw new Error('You can only start the timer for your own team')
  }

  return timersService.updateTimer({
    name,
    data: {
      active_team: team,
      is_paused: false,
    },
  })
}

/** Switch timer to the other team (called when current team ends their turn) */
export const switchTimer = async ({
  name,
  userTeam,
}: {
  name: string
  userTeam?: 'orange' | 'purple' | null
}) => {
  const currentTimer = await timersService.getCurrentTimerState({ name })

  // Determine which team should be next
  let nextTeam: 'orange' | 'purple' | null = null

  if (!currentTimer.active_team) {
    // If no active team, start with the user's team
    nextTeam = userTeam || null
  } else {
    // Switch to the other team
    nextTeam = currentTimer.active_team === 'orange' ? 'purple' : 'orange'
  }

  return timersService.updateTimer({
    name,
    data: {
      active_team: nextTeam,
      is_paused: false,
    },
  })
}
