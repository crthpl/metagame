'use client'

import { NavItem } from './Nav'
import { ProfilePicture } from './ProfilePicture'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { getCurrentUserProfile } from '@/app/actions/db/users'

import { useUser } from '@/hooks/dbQueries'
import { useLogout } from '@/hooks/useLogout'

export default function AccountButton({
  closeMenu,
}: {
  closeMenu: () => void
}) {
  const { currentUser: user, currentUserLoading: userLoading } = useUser()
  const { handleLogout, isLoggingOut } = useLogout()

  const { data: profile } = useQuery({
    queryKey: ['users', 'profiles', user?.id],
    queryFn: () => getCurrentUserProfile({ userId: user?.id }),
    enabled: !!user?.id,
  })
  if (!userLoading && !user) {
    return (
      <NavItem href="/login" closeMenu={closeMenu}>
        Log In
      </NavItem>
    )
  }

  const dropdownTriggerElement = () => {
    if (userLoading || !user) {
      return (
        <div className="bg-dark-400 size-[32px] animate-pulse rounded-full" />
      )
    }

    // Get initial from profile first name, user email, or default
    const initial =
      profile?.first_name?.charAt(0)?.toUpperCase() ||
      user?.email?.charAt(0)?.toUpperCase() ||
      '?'

    return (
      <ProfilePicture
        src={profile?.profile_pictures_url}
        alt="User Profile Picture"
        size={32}
        team={profile?.team}
        fallbackText={initial}
        ringSize="small"
        className="bg-dark-300 text-sm font-bold text-white"
      />
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-12 items-center justify-center">
        {dropdownTriggerElement()}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild onClick={closeMenu}>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            handleLogout('/')
            closeMenu()
          }}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
