'use client'

import { useUser } from "@/hooks/dbQueries"
import { NavItem } from "@/components/Nav"
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

export default function AccountButton() {
    const {currentUser: user, currentUserLoading: userLoading} = useUser()

    const {data: profile, isLoading: profileLoading} = useQuery({
        queryKey: ["users", "profile-picture", user?.id],
        queryFn: () => getCurrentUserProfile({userId: user?.id})
    })

    const dropdownTriggerElement = () => {
        if (userLoading) {
            return <div className="size-[32px] bg-dark-400 rounded-full" />
        }
        if (!user) {
            return <Link
            href='/login'
            className="block py-2 px-3 text-white font-bold text-lg rounded md:bg-transparent transition-all md:p-0 hover:text-secondary-200"
          >
            Log In
          </Link>
        }
        return profile?.profile_pictures_url 
            ? <Image src={profile.profile_pictures_url} alt="User Profile Picture" width={32} height={32} />
            : <div className="size-[32px] bg-dark-300 rounded-full flex items-center justify-center text-white text-lg font-bold">{profile?.first_name?.charAt(0)}</div>
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
                <DropdownMenuItem asChild>
                    <Link href="/logout">Log Out</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
