import { createServiceClient } from '@/utils/supabase/service'

import { DbTimerInsert, DbTimerUpdate } from '@/types/database/dbTypeAliases'

export const timersService = {
  /** Get a timer by name */
  getTimerByName: async ({ name }: { name: string }) => {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('timers')
      .select('*')
      .eq('name', name)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  /** Get all timers */
  getAllTimers: async () => {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('timers')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  /** Create a new timer */
  createTimer: async ({ data }: { data: DbTimerInsert }) => {
    const supabase = createServiceClient()
    const { data: newTimer, error } = await supabase
      .from('timers')
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return newTimer
  },

  /** Update a timer */
  updateTimer: async ({
    name,
    data,
  }: {
    name: string
    data: DbTimerUpdate
  }) => {
    const supabase = createServiceClient()

    // Calculate the actual time remaining based on last update
    const currentTimer = await timersService.getTimerByName({ name })
    const now = new Date()
    const lastUpdate = new Date(currentTimer.last_update_time)
    const timeDelta = now.getTime() - lastUpdate.getTime()

    const updatedData = { ...data }

    // If timer is running and we're not explicitly updating times, calculate current times
    if (
      !currentTimer.is_paused &&
      currentTimer.active_team &&
      data.orange_time_ms === undefined &&
      data.purple_time_ms === undefined
    ) {
      if (currentTimer.active_team === 'orange') {
        updatedData.orange_time_ms = Math.max(
          0,
          currentTimer.orange_time_ms - timeDelta,
        )
        updatedData.purple_time_ms = currentTimer.purple_time_ms
      } else {
        updatedData.orange_time_ms = currentTimer.orange_time_ms
        updatedData.purple_time_ms = Math.max(
          0,
          currentTimer.purple_time_ms - timeDelta,
        )
      }
    }

    // Always update the last_update_time
    updatedData.last_update_time = now.toISOString()

    const { data: updatedTimer, error } = await supabase
      .from('timers')
      .update(updatedData)
      .eq('name', name)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return updatedTimer
  },

  /** Reset a timer to initial state */
  resetTimer: async ({ name }: { name: string }) => {
    const supabase = createServiceClient()
    const now = new Date()

    const { data: resetTimer, error } = await supabase
      .from('timers')
      .update({
        orange_time_ms: 36000000, // 10 hours
        purple_time_ms: 36000000, // 10 hours
        active_team: null,
        is_paused: true,
        last_update_time: now.toISOString(),
      })
      .eq('name', name)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return resetTimer
  },

  /** Get current timer state with calculated times */
  getCurrentTimerState: async ({ name }: { name: string }) => {
    const supabase = createServiceClient()
    const { data: timer, error } = await supabase
      .from('timers')
      .select('*')
      .eq('name', name)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Calculate current times based on last update
    const now = new Date()
    const lastUpdate = new Date(timer.last_update_time)
    const timeDelta = now.getTime() - lastUpdate.getTime()

    let currentOrangeTime = timer.orange_time_ms
    let currentPurpleTime = timer.purple_time_ms

    // If timer is running, subtract elapsed time from active team
    if (!timer.is_paused && timer.active_team) {
      if (timer.active_team === 'orange') {
        currentOrangeTime = Math.max(0, timer.orange_time_ms - timeDelta)
      } else {
        currentPurpleTime = Math.max(0, timer.purple_time_ms - timeDelta)
      }
    }

    return {
      ...timer,
      orange_time_ms: currentOrangeTime,
      purple_time_ms: currentPurpleTime,
      calculated_at: now.toISOString(),
    }
  },

  /** Delete a timer */
  deleteTimer: async ({ name }: { name: string }) => {
    const supabase = createServiceClient()
    const { error } = await supabase.from('timers').delete().eq('name', name)

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  },
}
