"use client";

import { useState } from "react";
import { LinkIcon, UserIcon } from "lucide-react";
import { DbSessionView } from "@/types/database/dbTypeAliases";
import { dbGetHostsFromSession } from "@/utils/dbUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserRsvps } from "../actions/db/sessions/queries";
import { rsvpCurrentUserToSession, unrsvpCurrentUserFromSession } from "../actions/db/sessions/mutations";
import { useCurrentUser } from "@/hooks/dbQueries";

// Add PST timezone constant
const CONFERENCE_TIMEZONE = 'America/Los_Angeles';

// Helper function to get PST time string
const getTimeString = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: CONFERENCE_TIMEZONE
  });
};

// Helper function to get PST date string
const getDateString = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    timeZone: CONFERENCE_TIMEZONE
  });
};



  export default function SessionDetailsCard({ session }: {session: DbSessionView}) {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const currentUserRsvps = useQuery({
    queryKey: ['rsvps', 'current-user'],
    queryFn: getCurrentUserRsvps
  })
  const currentUserRsvp = currentUserRsvps.data?.find(rsvp => rsvp.session_id === session.id!)
  const currentUserIsRsvpd = !!currentUserRsvp
  const currentUserIsOnWaitlist = currentUserRsvp?.on_waitlist ?? false
  
  // Check if session is at capacity
  const isSessionFull = session.max_capacity !== null && 
                        (session.rsvp_count || 0) >= session.max_capacity
  const queryClient = useQueryClient()
  const unrsvpMutation = useMutation({
    mutationFn: unrsvpCurrentUserFromSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvps', 'current-user'] })
      queryClient.invalidateQueries({ queryKey: ['sessions', session.id!] })
    }
  })
  const rsvpMutation = useMutation({
    mutationFn: rsvpCurrentUserToSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvps', 'current-user'] })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    }
  })
  const currentUser = useCurrentUser()

  const handleToggleRsvp = () => {
    if (currentUserIsRsvpd) {
      unrsvpMutation.mutate(session.id!)
    } else {
      rsvpMutation.mutate(session.id!)
    }
  }

  const copyLink = () => {
    const base = window.location.origin
    const fullUrl = `${base}/schedule?session=${session.id!}`
    navigator.clipboard.writeText(fullUrl).then(() => {
      console.log("Copied:", fullUrl);
      setShowCopiedMessage(true)
      setTimeout(()=> setShowCopiedMessage(false), 2000)
    }).catch(err => {
      console.error("Failed to copy:", err);
      setCopyError(true)
      setTimeout(() => setCopyError(false), 2000)
    });
  };
  
  return (
      <div className="relative lg:min-w-[480px] bg-dark-600 border p-4 lg:p-6 border-secondary-300 rounded-xl max-w-xl w-full max-h-[calc(100vh-100px)] overflow-auto shadow-2xl">

        {showCopiedMessage ?
          <span className="text-green-400 text-light absolute top-4 right-4 p-2">Copied!</span>
          :
          <button
            onClick={copyLink}
            className="absolute top-4 right-4 p-2 cursor-pointer rounded-md hover:bg-dark-400 transition-colors"
            >
              <LinkIcon className={`size-4 ${copyError ? "text-red-500" : "text-secondary-300"}`}/>
          </button>
        }
        {/* Content */}
        <div className="flex flex-col gap-2">
          {/* Title and Hosts*/}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-secondary-200 leading-tight">
              {session.title || 'Untitled Session'}
            </h2>
            <div className="text-sm text-secondary-400">
              {dbGetHostsFromSession(session).join(", ")}
            </div>
          </div>

          {/* Time & Date */}
          {session.start_time && (
            <div className="space-y-1">
              {currentUser.currentUser && 
                <div className="flex items-center gap-3">
                  {currentUserIsRsvpd ? (
                    <>
                      <span className={`font-semibold ${currentUserIsOnWaitlist ? 'text-yellow-400' : 'text-green-400'}`}>
                        {currentUserIsOnWaitlist ? 'on Waitlist' : "RSVP'D"}
                      </span>
                      <button className="text-red-400 cursor-pointer" onClick={handleToggleRsvp}>
                        Un-RSVP
                      </button>
                    </>
                  ) : (
                    <button className="text-green-400 cursor-pointer" onClick={handleToggleRsvp}>
                      {isSessionFull ? 'Join Waitlist' : 'RSVP'}
                    </button>
                  )}
                </div>
              }
              <div className="text-secondary-300 font-medium">
                📅 {getDateString(session.start_time)}
              </div>
              <div className="text-secondary-300">
                🕐 {getTimeString(session.start_time)}
                {session.end_time && ` - ${getTimeString(session.end_time)}`}
              </div>
            </div>
          )}
          {/* Description */}
          {session.description && (
            <div className="space-y-2">
              <div className="text-secondary-300 font-semibold text-base leading-relaxed whitespace-pre-wrap">
                {session.description}
              </div>
            </div>
          )}

          {/* Location and Attendance */}
          <div className="flex w-full justify-between gap-1">
            <div className="text-secondary-300">
              📍 {(session.location_name || 'TBD')}
            </div>
            {session.max_capacity && (
              <div className="text-secondary-300">
                <UserIcon className="size-4 inline-block mr-1" /> {session.rsvp_count} / {session.max_capacity}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
