'use client'

import { useUser } from "@/hooks/dbQueries"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUserProfile } from "@/app/actions/db/users"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useLogout } from "@/hooks/useLogout"
import { NavItem } from "./Nav"

export default function AccountButton() {
    const {currentUser: user, currentUserLoading: userLoading} = useUser()
    const { handleLogout, isLoggingOut } = useLogout()

    const {data: profile} = useQuery({
        queryKey: ["users", "profile-picture", user?.id],
        queryFn: () => getCurrentUserProfile({userId: user?.id}),
        enabled: !!user?.id
    })
    if (!userLoading && !user) {
        return <NavItem href="/login">Log In</NavItem>
    }
    
    const dropdownTriggerElement = () => {
        if (userLoading || !user) {
            return <div className="size-[32px] bg-dark-400 rounded-full animate-pulse" />
        }
        
        // Get initial from profile first name, user email, or default
        const initial = profile?.first_name?.charAt(0)?.toUpperCase() || 
                       user?.email?.charAt(0)?.toUpperCase() || 
                       '?'
        
        return profile?.profile_pictures_url 
            ? <Image 
                src={profile.profile_pictures_url} 
                alt="User Profile Picture" 
                width={32} 
                height={32} 
                className="rounded-full object-cover"
              />
            : <div className="size-[32px] bg-dark-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {initial}
              </div>
    }
    return (
        <DropdownMenu >
            <DropdownMenuTrigger className="h-8 w-12 flex items-center justify-center">
                {dropdownTriggerElement()}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={() => handleLogout('/')}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? 'Logging out...' : 'Log Out'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
