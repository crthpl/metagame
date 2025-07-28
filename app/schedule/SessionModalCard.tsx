"use client";

import { useEffect, useState } from "react";
import { LinkIcon, XIcon } from "lucide-react";
import { DbSessionView } from "@/types/database/dbTypeAliases";

interface SessionModalProps {
  session: DbSessionView;
  onClose: () => void;
}

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


export default function SessionModal({ session, onClose }: SessionModalProps) {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [copyError, setCopyError] = useState(false)
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
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
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-dark-600 border border-secondary-300 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-dark-500 transition-colors"
        >
          <XIcon className="w-5 h-5 text-secondary-300" />
        </button>
        {showCopiedMessage ?
        <span className="text-green-400 text-light absolute bottom-4 right-4 p-2">Copied!</span>
        :
        <button
          onClick={copyLink}
          className="absolute bottom-4 right-4 p-2 rounded-md hover:bg-dark-400 transition-colors"
          >
            <LinkIcon className={`size-4 ${copyError ? "text-red-500" : "text-secondary-300"}`}/>
          </button>
}
        {/* Content */}
        <div className="space-y-4 pr-8">
          {/* Title */}
          <h2 className="text-xl font-bold text-secondary-200 leading-tight">
            {session.title || 'Untitled Session'}
          </h2>

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

          {/* Location */}
          <div className="text-secondary-300">
            📍 {(session.location || 'TBD')}
          </div>

          {/* Capacity */}
          {session.capacity && (
            <div className="text-secondary-300">
              👥 Max {session.capacity} participants
            </div>
          )}

          {/* Description */}
          {session.description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-secondary-200">Description</h3>
              <div className="text-secondary-300 leading-relaxed whitespace-pre-wrap">
                {session.description}
              </div>
            </div>
          )}

          {/* Host Info */}
          <div className="text-sm text-secondary-400">
            Host: {session.host_first_name ?? "a"} {session.host_last_name ?? "b"}
          </div>
        </div>
      </div>
    </div>
  );
}