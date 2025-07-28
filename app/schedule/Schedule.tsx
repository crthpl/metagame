"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, UserIcon } from "lucide-react";
import { DbSessionView, DbLocation } from "@/types/database/dbTypeAliases";
import Image from "next/image";
import SessionModal from "./SessionModalCard";
import { useRouter } from "next/navigation";
import { dbGetHostsFromSession } from "@/utils/dbUtils";

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
  const router = useRouter()

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
  const updateSearchParams = ({
    dayIndex,
    sessionId
  }: { dayIndex?: number; sessionId?: string}) => {
    const params = new URLSearchParams
    if (dayIndex != undefined) params.set('day', dayIndex.toString())
    if (sessionId) params.set('session', sessionId)
    router.replace(`?${params.toString()}`, {scroll: false})
  }
  const setDayIndex = (dayIndex: number) => {
    setCurrentDayIndex(dayIndex)
    updateSearchParams({dayIndex:dayIndex})
  }
  const nextDay = () => {
    setCurrentDayIndex((prev) => {
      const newDay = Math.min(days.length - 1, prev + 1)
      updateSearchParams({dayIndex: newDay})
      return  (newDay)
    });
  };

  const prevDay = () => {
    setCurrentDayIndex((prev) => {
      const newDay = Math.max(0, prev - 1)
      updateSearchParams({dayIndex:newDay})
      return newDay
    })
  };

  const handleOpenSessionModal = (sessionId: string) => {
    setOpenedSessionId(sessionId)
    updateSearchParams({sessionId:sessionId})
  }

  // Helper function to get event color
  const getEventColor = (sessionId: string) => {
    const index = sessions.findIndex(s => s.id === sessionId);
    return eventColors[index % eventColors.length];
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-500 border border-secondary-300 rounded-xl overflow-hidden">
      {/* Day Navigator - Fixed on desktop, scrollable on mobile */}
      <div className="hidden lg:flex flex-shrink-0 items-center justify-between p-4 bg-dark-600 border-b border-secondary-300">
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

      {/* Scrollable Schedule Content */}
      <div className="flex-1 overflow-auto">
        {/* Day Navigator - Mobile only, inside scrollable area, sticky left */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-dark-600 border-b border-secondary-300 sticky left-0 z-30">
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

        <div className="min-w-fit h-fit">
          {/* Images Row - Scrollable on mobile, sticky on large */}
          <div className="grid bg-dark-400 lg:sticky lg:top-0 lg:z-10" style={{ gridTemplateColumns: `60px repeat(${locations.length}, minmax(180px, 1fr))` }}>
            <div className="bg-dark-600 p-3 border sticky left-0 z-sticky-header border-secondary-300">
              {/* Empty space above time column */}
            </div>
            {locations.map((venue) => (
              <div key={venue.id} className="bg-dark-600 p-3 border border-secondary-300">
                {venue.thumbnail_url ? 
                  <Image src={venue.thumbnail_url} alt={venue.name} width={100} height={100} className="object-cover w-full h-24"/>
                  : <div className="w-full h-24 bg-dark-500"/>
                }
              </div>
            ))}
          </div>

          {/* Names Row - Always sticky, with day nav on mobile */}
          <div className="grid bg-dark-400 sticky top-0 lg:top-[120px] z-20" style={{ gridTemplateColumns: `60px repeat(${locations.length}, minmax(180px, 1fr))` }}>
            <div className="bg-dark-600 p-3 sticky left-0 z-30 border border-secondary-300">
              {/* Desktop: Just "Time" */}
              <div className="hidden md:block text-sm text-secondary-300 font-medium">
              </div>
            </div>
            {locations.map((venue) => (
              <div key={venue.id} className="bg-dark-600 p-3 border border-secondary-300">
                <div className="size-full flex items-center justify-center  text-center text-lg font-semibold text-secondary-200">
                  {venue.name}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots Grid */}
          <div className="grid bg-dark-400" style={{ gridTemplateColumns: `60px repeat(${locations.length}, minmax(180px, 1fr))` }}>
            {timeSlots.map((time) => (
              <div key={time} className="contents">
                {/* Time Cell - Sticky Left */}
                <div className="bg-dark-500 p-3 border border-r-secondary-300 border-dark-400 sticky left-0 top-0 z-sticky">
                  <div className="text-sm text-secondary-300 font-medium">{time}</div>
                </div>

                {/* Venue Cells */}
                {locations.map((venue) => {
                  const eventsInSlot = currentDay.events.filter(session => 
                    session.location_id === venue.id && eventStartsInSlot(session, time)
                  );
                  return (
                    <div key={venue.id} className="bg-dark-500 border-x-secondary-300 min-h-[60px] border border-dark-400 relative overflow-visible">
                      {eventsInSlot.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => handleOpenSessionModal(session.id!)}
                          className={`absolute z-content p-1 m-1 rounded-md ${getEventColor(session.id!)} text-black font-semibold`}
                          style={{
                            top: `${getEventOffsetMinutes(session, time) * 2}px`,     // 2px per minute
                            height: `${getEventDurationMinutes(session, time) * 2}px`, // 2px per minute  
                            left: '4px',
                            right: '4px',
                          }}
                        >
                          <div className="flex flex-col size-full relative">
                            <div className="font-bold text-sm leading-tight">
                              {session.title}
                            </div>
                            <div className="text-xs">
                              {dbGetHostsFromSession(session).join(", ")}
                            </div>

                            <div className=" absolute bottom-0 right-0 text-xs opacity-80 flex items-center gap-1">
                            <UserIcon className="size-3"/> {session.rsvp_count ?? "0"} / {session.max_capacity}
                            </div>

                          </div>
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

      {openedSessionId && 
        <SessionModal 
        session={sessions.find(s => s.id === openedSessionId)!} 
        onClose={() => {
          const sessionDayIndex = days.findIndex(day => day.events.some(event => event.id === openedSessionId))
          setOpenedSessionId(null)
          setDayIndex(sessionDayIndex)
          }
        }/>
      }
    </div>
  );
} 