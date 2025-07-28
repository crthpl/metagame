"use client";

import { useState } from "react";
import { LinkIcon, UserIcon } from "lucide-react";
import { DbSessionView } from "@/types/database/dbTypeAliases";
import { dbGetHostsFromSession } from "@/utils/dbUtils";

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
      <div className="relative bg-dark-600 border border-secondary-300 rounded-xl p-6 max-w-lg w-full max-h-[calc(100vh-100px)] overflow-auto shadow-2xl">

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