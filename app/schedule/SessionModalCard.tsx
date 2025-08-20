"use client";

import { useState } from "react";
import { LinkIcon, UserIcon, EditIcon } from "lucide-react";
import { SessionResponse } from "@/app/api/queries/sessions/schema";
import { RsvpResponse } from "@/app/api/queries/rsvps/schema";
import { dbGetHostsFromSession } from "@/utils/dbUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUserRsvps } from "./queries";
import { rsvpCurrentUserToSession, unrsvpCurrentUserFromSession } from "@/app/actions/db/sessions";
import { useUser } from "@/hooks/dbQueries";
import { AddEventModal } from "./EditEventModal";
import { SessionTitle } from "@/components/SessionTitle";
import { dateUtils } from "@/utils/dateUtils";

  export default function SessionDetailsCard({ 
    session,
    canEdit = false
  }: {
    session: SessionResponse;
    canEdit?: boolean;
  }) {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const currentUserRsvps = useQuery({
    queryKey: ['rsvps', 'current-user'],
    queryFn: fetchCurrentUserRsvps
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
    onMutate: async ({ sessionId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['rsvps', 'current-user'] })
      await queryClient.cancelQueries({ queryKey: ['sessions'] })
      
      // Snapshot the previous values
      const previousRsvps = queryClient.getQueryData(['rsvps', 'current-user'])
      const previousSessions = queryClient.getQueryData(['sessions'])
      
      // Optimistically update RSVPs
      queryClient.setQueryData(['rsvps', 'current-user'], (old: RsvpResponse[] | undefined) => 
        old?.filter((rsvp) => rsvp.session_id !== sessionId) || []
      )
      
      // Optimistically update sessions (decrease RSVP count)
      queryClient.setQueryData(['sessions'], (old: SessionResponse[] | undefined) => 
        old?.map((s) => 
          s.id === sessionId 
            ? { ...s, rsvp_count: Math.max(0, (s.rsvp_count || 0) - 1) }
            : s
        ) || []
      )
      
      return { previousRsvps, previousSessions }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousRsvps) {
        queryClient.setQueryData(['rsvps', 'current-user'], context.previousRsvps)
      }
      if (context?.previousSessions) {
        queryClient.setQueryData(['sessions'], context.previousSessions)
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['rsvps', 'current-user'] })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    }
  })
  
  const rsvpMutation = useMutation({
    mutationFn: rsvpCurrentUserToSession,
    onMutate: async ({ sessionId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['rsvps', 'current-user'] })
      await queryClient.cancelQueries({ queryKey: ['sessions'] })
      
      // Snapshot the previous values
      const previousRsvps = queryClient.getQueryData(['rsvps', 'current-user'])
      const previousSessions = queryClient.getQueryData(['sessions'])
      
      // Optimistically add RSVP (simplified - no waitlist logic)
      const newRsvp: RsvpResponse = {
        session_id: sessionId,
        user_id: currentUserProfile?.id || '',
        on_waitlist: false, // Let server handle waitlist logic
        created_at: new Date().toISOString()
      }
      
      queryClient.setQueryData(['rsvps', 'current-user'], (old: RsvpResponse[] | undefined) => 
        [...(old || []), newRsvp]
      )
      
      // Optimistically update sessions (increase RSVP count)
      queryClient.setQueryData(['sessions'], (old: SessionResponse[] | undefined) => 
        old?.map((s) => 
          s.id === sessionId 
            ? { ...s, rsvp_count: (s.rsvp_count || 0) + 1 }
            : s
        ) || []
      )
      
      return { previousRsvps, previousSessions }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousRsvps) {
        queryClient.setQueryData(['rsvps', 'current-user'], context.previousRsvps)
      }
      if (context?.previousSessions) {
        queryClient.setQueryData(['sessions'], context.previousSessions)
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['rsvps', 'current-user'] })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    }
  })
  const {currentUserProfile} = useUser()
  
  const handleToggleRsvp = () => {
    if (currentUserIsRsvpd) {
      unrsvpMutation.mutate({sessionId:session.id!})
    } else {
      rsvpMutation.mutate({sessionId:session.id!})
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

       

        {/* Content */}
        <div className="flex flex-col gap-2">
          {/* Title and Hosts*/}
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 w-full justify-between">
              <h2 className="text-xl font-bold text-secondary-200 leading-tight">
                <SessionTitle title={session.title || 'Untitled Session'} />
              </h2>
              <div className="w-fit flex gap-1 self-start">
                {showCopiedMessage ?
                  <span className="text-green-400 text-light p-1">✓</span>
                  :
                  <button
                    onClick={copyLink}
                    className=" p-1 cursor-pointer rounded-md hover:bg-dark-400 transition-colors"
                    >
                      <LinkIcon className={`size-4 ${copyError ? "text-red-500" : "text-secondary-300"}`}/>
                  </button>
                }

                {/* Edit button for admins */}
                {canEdit && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className=" p-1 cursor-pointer rounded-md hover:bg-dark-400 transition-colors"
                    title="Edit Event"
                  >
                    <EditIcon className="size-4 text-secondary-300" />
                  </button>
                )}
              </div>
            </div>

            {/* Hosts */}
            <div className="text-sm text-secondary-400">
              {dbGetHostsFromSession(session).join(", ")}
            </div>
          </div>

          {/* Time & Date */}
          {session.start_time && (
            <div className="space-y-1">
              {currentUserProfile?.id && 
                <div className="flex items-center gap-3">
                  {currentUserIsRsvpd ? (
                    <>
                      <span className={`font-semibold ${currentUserIsOnWaitlist ? 'text-yellow-400' : 'text-green-400'}`}>
                        {currentUserIsOnWaitlist ? 'on Waitlist' : "RSVP'D"}
                      </span>
                      <button 
                        className="text-red-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                        onClick={handleToggleRsvp}
                        disabled={rsvpMutation.isPending || unrsvpMutation.isPending}
                      >
                        {unrsvpMutation.isPending ? 'Un-RSVPing...' : 'Un-RSVP'}
                      </button>
                    </>
                  ) : (
                    <button 
                      className="text-green-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                      onClick={handleToggleRsvp}
                      disabled={rsvpMutation.isPending || unrsvpMutation.isPending}
                    >
                      {rsvpMutation.isPending ? 'RSVPing...' : (isSessionFull ? 'Join Waitlist' : 'RSVP')}
                    </button>
                  )}
                </div>
              }
              <div className="text-secondary-300 font-medium">
                📅 {dateUtils.getStringDate(session.start_time)}
              </div>
              <div className="text-secondary-300">
                🕐 {dateUtils.getStringTime(session.start_time)}
                {session.end_time && ` - ${dateUtils.getStringTime(session.end_time)}`}
              </div>
            </div>
          )}
          {/* Description */}
          {session.description && (
            <div className="space-y-2">
              <div className="text-secondary-300 font-light text-base leading-relaxed whitespace-pre-wrap">
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

        {/* Edit Modal */}
        <AddEventModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          existingSessionId={session.id}
          canEdit={canEdit}
        />
      </div>
  );
}
