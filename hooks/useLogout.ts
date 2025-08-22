'use client'

import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { logout } from '@/app/actions/auth/logout'

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (redirectTo: string = '/') => {
    try {
      setIsLoggingOut(true)

      // Clear all user-related queries immediately
      queryClient.removeQueries({ queryKey: ['users'] })

      // Call server action to logout
      await logout(redirectTo)

      // After logout, invalidate all queries to ensure fresh data
      await queryClient.invalidateQueries()
    } catch (error) {
      console.error('Logout failed:', error)
      // If logout fails, still clear cache and redirect
      queryClient.clear()
      router.push(redirectTo)
    } finally {
      // Reset the logging out state after a small delay to ensure UI updates
      setTimeout(() => setIsLoggingOut(false), 100)
    }
  }

  return { handleLogout, isLoggingOut }
}
