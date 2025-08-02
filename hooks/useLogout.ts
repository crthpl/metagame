'use client'

import { logout } from '@/app/actions/auth/logout'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (redirectTo: string = '/') => {
    try {
      setIsLoggingOut(true)
      
      // Invalidate current user query
      await queryClient.invalidateQueries({ queryKey: ['users', 'current'] })
      
      // Also invalidate any profile-related queries for the current user
      await queryClient.invalidateQueries({ 
        queryKey: ['users', 'profile-picture'],
        predicate: (query) => query.queryKey[0] === 'users' && query.queryKey[1] === 'profile-picture'
      })
      
      // Call server action to logout
      await logout(redirectTo)
    } catch (error) {
      console.error('Logout failed:', error)
      // If logout fails, still try to clear current user cache and redirect
      queryClient.removeQueries({ queryKey: ['users', 'current'] })
      router.push(redirectTo)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return { handleLogout, isLoggingOut }
}