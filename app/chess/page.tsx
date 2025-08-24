'use client'

import React from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import {
  getCurrentTimerState,
  pauseTimer,
  resetTimer,
  switchTimer,
} from '@/app/actions/db/timers'
import { getCurrentUser, getCurrentUserProfile } from '@/app/actions/db/users'

const TIMER_NAME = 'chess-timer'

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default function ChessTimer() {
  const queryClient = useQueryClient()

  const { data: currentUser } = useQuery({
    queryKey: ['users', 'current'],
    queryFn: getCurrentUser,
  })

  const { data: currentUserProfile } = useQuery({
    queryKey: ['users', 'profile', currentUser?.id],
    queryFn: () => getCurrentUserProfile({}),
    enabled: !!currentUser?.id,
  })

  // Get timer state from database with real-time polling
  const { data: timerState, isLoading } = useQuery({
    queryKey: ['timer', TIMER_NAME],
    queryFn: () => getCurrentTimerState({ name: TIMER_NAME }),
    refetchInterval: 500, // Refresh every 500ms for smooth real-time updates
    refetchOnWindowFocus: true, // Refresh when window regains focus
    staleTime: 0, // Always consider data stale to force fresh fetches
  })

  // Mutations for timer operations
  const switchTimerMutation = useMutation({
    mutationFn: () =>
      switchTimer({ name: TIMER_NAME, userTeam: currentUserProfile?.team }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timer', TIMER_NAME] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to switch timer')
    },
  })

  const pauseTimerMutation = useMutation({
    mutationFn: () => pauseTimer({ name: TIMER_NAME }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timer', TIMER_NAME] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to pause timer')
    },
  })

  const resetTimerMutation = useMutation({
    mutationFn: () => resetTimer({ name: TIMER_NAME }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timer', TIMER_NAME] })
      toast.success('Timer reset successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset timer')
    },
  })

  const canControlTimer = (team: 'orange' | 'purple'): boolean => {
    return currentUserProfile?.team === team
  }

  const handleTimerPress = (team: 'orange' | 'purple') => {
    // Only allow clicking if it's your team's turn or no one's turn yet
    if (!canControlTimer(team)) return
    if (timerState?.active_team && timerState.active_team !== team) return
    switchTimerMutation.mutate()
  }

  const handlePause = () => {
    if (!currentUserProfile?.team) return
    pauseTimerMutation.mutate()
  }

  const handleReset = () => {
    if (!currentUserProfile?.team) return
    resetTimerMutation.mutate()
  }

  const userTeam = currentUserProfile?.team
  const isOperationPending =
    switchTimerMutation.isPending ||
    pauseTimerMutation.isPending ||
    resetTimerMutation.isPending

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Chess Timer</h1>
          <div className="text-center">Loading timer...</div>
        </div>
      </div>
    )
  }

  if (!timerState) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Chess Timer</h1>
          <div className="text-center text-red-500">Failed to load timer</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Chess Timer</h1>

        {!userTeam && (
          <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-center">
            <p className="text-yellow-800 dark:text-yellow-200">
              You need to select a team in your profile to use the timer.
            </p>
          </div>
        )}

        {/* Global Status */}
        <div className="text-center mb-8">
          {timerState.is_paused ? (
            <div className="text-2xl text-gray-600">⏸️ Paused</div>
          ) : !timerState.active_team ? (
            <div className="text-2xl text-gray-600">Ready to start</div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Purple Team Timer */}
          <div className="flex flex-col items-center">
            {/* Turn indicator above purple timer - with fixed height for alignment */}
            <div className="h-12 mb-4 flex items-center justify-center">
              {timerState.active_team === 'purple' && !timerState.is_paused && (
                <div className="text-2xl flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#800080" />
                  </svg>
                  Purple team&apos;s turn
                </div>
              )}
            </div>
            <div
              className={`relative w-64 h-64 rounded-full flex items-center justify-center text-6xl font-mono transition-all duration-200 ${
                timerState.active_team === 'purple'
                  ? 'bg-purple-500 text-gray-800 shadow-lg transform scale-105'
                  : canControlTimer('purple') &&
                      timerState.active_team !== 'purple'
                    ? 'bg-neutral-800 dark:bg-neutral-900 text-gray-300 dark:text-gray-400'
                    : 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
              } ${
                canControlTimer('purple') &&
                timerState.active_team === 'purple' &&
                !isOperationPending
                  ? 'cursor-pointer hover:scale-110'
                  : canControlTimer('purple') &&
                      !timerState.active_team &&
                      !isOperationPending
                    ? 'cursor-pointer hover:scale-110'
                    : 'cursor-not-allowed'
              }`}
              onClick={() => handleTimerPress('purple')}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#800080" />
                  </svg>
                  PURPLE
                </div>
                <div className="text-4xl">
                  {formatTime(timerState.purple_time_ms)}
                </div>
              </div>
              {timerState.purple_time_ms === 0 && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-75 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    TIME UP!
                  </span>
                </div>
              )}
            </div>
            {canControlTimer('purple') &&
              timerState.active_team === 'purple' && (
                <p className="text-sm text-green-600 mt-2">Click to end turn</p>
              )}
          </div>

          {/* Orange Team Timer */}
          <div className="flex flex-col items-center">
            {/* Turn indicator above orange timer - with fixed height for alignment */}
            <div className="h-12 mb-4 flex items-center justify-center">
              {timerState.active_team === 'orange' && !timerState.is_paused && (
                <div className="text-2xl flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#FF8C00" />
                  </svg>
                  Orange team&apos;s turn
                </div>
              )}
            </div>
            <div
              className={`relative w-64 h-64 rounded-full flex items-center justify-center text-6xl font-mono transition-all duration-200 ${
                timerState.active_team === 'orange'
                  ? 'bg-orange-500 text-gray-800 shadow-lg transform scale-105'
                  : canControlTimer('orange') &&
                      timerState.active_team !== 'orange'
                    ? 'bg-neutral-800 dark:bg-neutral-900 text-gray-300 dark:text-gray-400'
                    : 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
              } ${
                canControlTimer('orange') &&
                timerState.active_team === 'orange' &&
                !isOperationPending
                  ? 'cursor-pointer hover:scale-110'
                  : canControlTimer('orange') &&
                      !timerState.active_team &&
                      !isOperationPending
                    ? 'cursor-pointer hover:scale-110'
                    : 'cursor-not-allowed'
              }`}
              onClick={() => handleTimerPress('orange')}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#FF8C00" />
                  </svg>
                  ORANGE
                </div>
                <div className="text-4xl">
                  {formatTime(timerState.orange_time_ms)}
                </div>
              </div>
              {timerState.orange_time_ms === 0 && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-75 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    TIME UP!
                  </span>
                </div>
              )}
            </div>
            {canControlTimer('orange') &&
              timerState.active_team === 'orange' && (
                <p className="text-sm text-green-600 mt-2">Click to end turn</p>
              )}
          </div>
        </div>

        {/* Control Buttons */}
        {userTeam && (
          <div className="text-center mb-8">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handlePause}
                variant="outline"
                disabled={timerState.is_paused || isOperationPending}
              >
                {pauseTimerMutation.isPending ? 'Pausing...' : '⏸️ Pause'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isOperationPending}
              >
                {resetTimerMutation.isPending ? 'Resetting...' : '🔄 Reset'}
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Megachess Rules
          </h2>
          <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
            <p>
              <strong>
                The first rule of Megachess is: you do not talk about Megachess.
              </strong>
            </p>
            <p>
              You may not discuss the game with your teammates at any point in
              time.
            </p>

            <p>
              <strong>
                The second rule of Megachess is: each attendee can make one move
                on behalf of their team
              </strong>
            </p>
            <p>
              Over the weekend, we will run Megachess ongoingly. If it&apos;s
              your team&apos;s turn and you haven&apos;t used your one move yet
              over the course of the weekend, you may make one valid chess move.
              Then, hit the chess clock, and it will switch to the other
              team&apos;s turn. [TODO: actually enforce this]
            </p>

            <p>
              <strong>The rest of the rules of Megachess are:</strong>
            </p>
            <div className="ml-4">
              <p>
                <strong>Chess Rules:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  The game is played on a checkered board with 64 squares
                  arranged in an 8×8 grid
                </li>
                <li>
                  Each player starts with 16 pieces: one king, one queen, two
                  rooks, two bishops, two knights, and eight pawns
                </li>
                <li>The objective is to checkmate the opponent&apos;s king</li>
                <li>
                  Pieces move according to their specific rules:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>King: one square in any direction</li>
                    <li>
                      Queen: any number of squares diagonally, horizontally, or
                      vertically
                    </li>
                    <li>
                      Rook: any number of squares horizontally or vertically
                    </li>
                    <li>Bishop: any number of squares diagonally</li>
                    <li>
                      Knight: in an L-shape (two squares in one direction, then
                      one square perpendicular)
                    </li>
                    <li>
                      Pawn: one square forward (or two on first move), captures
                      diagonally
                    </li>
                  </ul>
                </li>
                <li>
                  Special moves:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      Castling: king moves 2 squares toward a rook, rook moves
                      to square king crossed (conditions: neither piece has
                      moved, no pieces between them, king not in check
                      before/during/after move)
                    </li>
                    <li>
                      En passant: if opponent&apos;s pawn moves 2 squares from
                      start and lands beside your pawn, you may capture it as if
                      it only moved 1 square (must be done immediately)
                    </li>
                    <li>
                      Pawn promotion: when a pawn reaches the opposite end of
                      the board, you choose what piece it becomes (queen, rook,
                      bishop, or knight)
                    </li>
                  </ul>
                </li>
                <li>
                  A player is in check when their king is under attack and must
                  immediately get out of check
                </li>
                <li>
                  Checkmate occurs when the king is in check and cannot escape
                  capture
                </li>
                <li>
                  Stalemate occurs when a player has no legal moves but is not
                  in check (results in a draw)
                </li>
              </ul>
              <p className="mt-2">
                <strong>Additional Megachess rules:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Since there is no communication, you may not draw or resign
                </li>
                <li>Each team starts with 10 hours on their timer</li>
                <li>Make a move on the big board at [LOCATION]</li>
                <li>
                  After you have made a move, click your team&apos;s timer to
                  end your turn and start the other timer.
                </li>
                <li>
                  [TODO: Actually assign random teams] Set your team in your
                  profile to participate
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
