"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DbSessionView, DbLocation } from "@/types/database/dbTypeAliases";
import Image from "next/image";
import SessionModal from "./SessionModalCard";

const SCHEDULE_END_TIME = 22;
const SCHEDULE_START_TIME = 9;


// Generate time slots from 9:00 to 22:00 in 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = SCHEDULE_START_TIME; hour <= SCHEDULE_END_TIME; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < SCHEDULE_END_TIME) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Color options for events
const eventColors = [
  "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400", 
  "bg-cyan-400", "bg-pink-400", "bg-yellow-400", "bg-red-400", 
  "bg-indigo-400", "bg-teal-400"
];

interface ScheduleProps {
  sessions: DbSessionView[];
  locations: DbLocation[];
  sessionId?: string;
  dayIndex?: number
}

// Add PST timezone constant
const CONFERENCE_TIMEZONE = 'America/Los_Angeles';

// Helper function to convert UTC timestamp to PST Date object
const toPSTDate = (timestamp: string) => {
  const utcDate = new Date(timestamp);
  // Create a new date in PST by converting from UTC
  return new Date(utcDate.toLocaleString('en-US', { timeZone: CONFERENCE_TIMEZONE }));
};

// Helper function to get minutes since midnight in PST
const getPSTMinutes = (timestamp: string) => {
  const pstDate = toPSTDate(timestamp);
  return pstDate.getHours() * 60 + pstDate.getMinutes();
};

// Updated time string function - PST only
const getTimeString = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: CONFERENCE_TIMEZONE  // Force PST
  });
};

// Updated slot checking - PST based
const eventStartsInSlot = (session: DbSessionView, slotTime: string) => {
  if (!session.start_time) return false;
  
  const sessionStartMinutes = getPSTMinutes(session.start_time);
  const [slotHour, slotMinute] = slotTime.split(':').map(Number);
  const slotStartMinutes = slotHour * 60 + slotMinute;
  const slotEndMinutes = slotStartMinutes + 30;
  
  return sessionStartMinutes >= slotStartMinutes && sessionStartMinutes < slotEndMinutes;
};

// Updated offset calculation - PST based
const getEventOffsetMinutes = (session: DbSessionView, slotTime: string) => {
  if (!session.start_time) return 0;
  
  const sessionStartMinutes = getPSTMinutes(session.start_time);
  const [slotHour, slotMinute] = slotTime.split(':').map(Number);
  const slotStartMinutes = slotHour * 60 + slotMinute;
  
  return Math.max(0, sessionStartMinutes - slotStartMinutes);
};

// Updated duration calculation - PST based
const getEventDurationMinutes = (session: DbSessionView, slotTime: string) => {
  if (!session.start_time || !session.end_time) return 30;
  
  const startMinutes = getPSTMinutes(session.start_time);
  const endMinutes = getPSTMinutes(session.end_time);
  
  const [slotHour, slotMinute] = slotTime.split(':').map(Number);
  const slotEndMinutes = (slotHour * 60 + slotMinute) + 30;
  
  // Cap at slot boundary
  const cappedEndMinutes = Math.min(endMinutes, slotEndMinutes);
  
  return Math.max(5, cappedEndMinutes - startMinutes);
};


export default function Schedule({ sessions, locations, sessionId, dayIndex }: ScheduleProps) {

  // Fixed conference days
  const CONFERENCE_DAYS = [
    { date: '2025-09-12', name: 'Friday' },
    { date: '2025-09-13', name: 'Saturday' }, 
    { date: '2025-09-14', name: 'Sunday' }
  ];
  
  // Group sessions by the 3 fixed conference days
  const days = useMemo(() => {
    const dayEvents = [
      [], // Day 0: Friday 9/12
      [], // Day 1: Saturday 9/13  
      []  // Day 2: Sunday 9/14
    ] as DbSessionView[][];
    
    sessions.forEach((session) => {
      if (!session.start_time || !session.end_time || !session.title) return;
      
      // Get date in PST and check which conference day it matches
      const pstDate = toPSTDate(session.start_time);
      const sessionDate = pstDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Assign to day 0, 1, or 2
      const dayIndex = CONFERENCE_DAYS.findIndex(day => day.date === sessionDate);
      if (dayIndex >= 0) {
        dayEvents[dayIndex].push(session);
      }
    });
    
    // Create the final days array
    return CONFERENCE_DAYS.map((confDay, index) => ({
      date: confDay.date,
      displayName: `${confDay.name} (${confDay.date})`,
      events: dayEvents[index].sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
    }));
  }, [sessions]);

  const [currentDayIndex, setCurrentDayIndex] = useState(dayIndex ?? 0);
  const [openedSessionId, setOpenedSessionId] = useState<DbSessionView['id'] | null>(sessionId ?? null);
  const currentDay = days[currentDayIndex] || { date: '', displayName: 'No Events', events: [] };

  const nextDay = () => {
    setCurrentDayIndex((prev) => Math.min(days.length - 1, prev + 1));
  };

  const prevDay = () => {
    setCurrentDayIndex((prev) => Math.max(0, prev - 1));
  };

  // Helper function to get event color
  const getEventColor = (sessionId: string) => {
    const index = sessions.findIndex(s => s.id === sessionId);
    return eventColors[index % eventColors.length];
  };

  return (
    <div className="w-full max-w-full mx-auto bg-dark-500 border border-secondary-300 rounded-xl overflow-hidden">
      {/* Day Navigator */}
      <div className="flex items-center justify-between p-4 bg-dark-600 border-b border-secondary-300">
        <button
          onClick={prevDay}
          className="p-2 rounded-md hover:bg-dark-400 transition-colors"
          disabled={currentDayIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 text-secondary-300" />
        </button>
        
        <h2 className="text-xl font-bold text-secondary-200 text-center">
          {currentDay.displayName}
        </h2>
        
        <button
          onClick={nextDay}
          className="p-2 rounded-md hover:bg-dark-400 transition-colors"
          disabled={currentDayIndex === days.length - 1}
        >
          <ChevronRight className="w-5 h-5 text-secondary-300" />
        </button>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {locations.map((venue) => (
          <div key={venue.id} className="border-b border-dark-400 last:border-b-0">
            <div className="p-3 bg-dark-600 border-b border-dark-400">
              <h3 className="font-semibold text-secondary-200 text-sm">{venue.name}</h3>
            </div>
            <div className="p-3 space-y-2">
              {currentDay.events
                .filter(session => session.location_id === venue.id)
                .map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setOpenedSessionId(session.id)}
                    className={`p-3 rounded-md ${getEventColor(session.id!)} text-black text-sm`}
                  >
                    <div className="font-semibold">{session.title}</div>
                    {session.start_time && session.end_time && (
                      <div className="text-xs opacity-80">
                        {getTimeString(session.start_time)} - {getTimeString(session.end_time)}
                      </div>
                    )}
                    {session.capacity && (
                      <div className="text-xs opacity-80">👥 max {session.capacity}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid gap-px bg-dark-400" style={{ gridTemplateColumns: `60px repeat(${locations.length}, minmax(140px, 1fr))` }}>
            <div className="bg-dark-600 p-3 left-0 shadow-lg border-b border-secondary-300">
              <div className="font-semibold text-secondary-200 text-sm ">Time</div>
            </div>
            {locations.map((venue) => (
              <div key={venue.id} className="bg-dark-600 p-3 border-b border-secondary-300">
                <div className="font-semibold text-secondary-200 text-sm mb-1">
                  {venue.thumbnail_url ? 
                  <Image src={venue.thumbnail_url} alt={venue.name} width={100} height={100} className="object-cover w-full h-24"/>
                  : <div className="w-full h-24 bg-dark-500"/>
                  }
                  {venue.name}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="grid gap-px bg-dark-400" style={{ gridTemplateColumns: `60px repeat(${locations.length}, minmax(140px, 1fr))` }}>
            {timeSlots.map((time) => (
              <div key={time} className="contents">
                {/* Time Cell */}
                <div className="bg-dark-500 p-3 border-r border-dark-400 sticky left-0 z-sticky shadow-lg">
                  <div className="text-sm text-secondary-300 font-medium">{time}</div>
                </div>

                {/* Venue Cells */}
                {locations.map((venue) => {
                  // Find events that start in this time slot for this venue
                  const eventsInSlot = currentDay.events.filter(session => 
                    session.location_id === venue.id && eventStartsInSlot(session, time)
                  );
                  return (
                    <div key={venue.id} className="bg-dark-500 min-h-[60px]  border-r border-dark-400 last:border-r-0 relative overflow-visible ">
                      {eventsInSlot.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => setOpenedSessionId(session.id)}
                          className={`absolute z-content p-2 m-1 rounded-md ${getEventColor(session.id!)} text-white text-sm`}
                          style={{
                            top: `${getEventOffsetMinutes(session, time) * 2}px`,     // 2px per minute
                            height: `${getEventDurationMinutes(session, time) * 2}px`, // 2px per minute  
                            left: '4px',
                            right: '4px',
                          }}
                        >
                          <div className="font-semibold text-xs leading-tight mb-1">
                            {session.title}
                          </div>
                          {/* {session.capacity && (
                            <div className="text-xs opacity-80 mt-1">
                              👥 max {session.capacity}
                            </div>
                          )} */}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day Dots Indicator */}
      <div className="flex justify-center items-center gap-2 p-4 bg-dark-600 border-t border-secondary-300">
        {days.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentDayIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentDayIndex
                ? "bg-secondary-300 scale-125"
                : "bg-dark-400 hover:bg-dark-300"
            }`}
          />
        ))}
      </div>

      {openedSessionId && 
        <SessionModal 
        session={sessions.find(s => s.id === openedSessionId)!} 
        onClose={() => setOpenedSessionId(null)} />
      }
    </div>
  );
} 