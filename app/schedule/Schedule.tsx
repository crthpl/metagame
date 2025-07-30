"use client";

import { useState, useMemo } from 'react';
import { CheckIcon, ChevronLeft, ChevronRight, FilterIcon, User2Icon, UserIcon } from "lucide-react";
import { DbSessionView } from "@/types/database/dbTypeAliases";
import Image from "next/image";
import SessionDetailsCard from "./SessionModalCard";
import { useRouter } from "next/navigation";
import { dbGetHostsFromSession } from "@/utils/dbUtils";
import { Modal } from "@/components/Modal";
import { SmartTooltip } from '@/components/SmartTooltip';
import { useQuery } from '@tanstack/react-query';
import { getAllSessions, getCurrentUserRsvps } from '../actions/db/sessions/queries';
import { getAllLocations } from '../actions/db/locations/queries';
import { useCurrentUser } from '@/hooks/dbQueries';
import { toast } from 'sonner';

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
const locationEventColors = [
  "bg-blue-300 border-blue-400", "bg-purple-300 border-purple-400", "bg-orange-300 border-orange-400", 
  "bg-cyan-200 border-cyan-300", "bg-pink-300 border-pink-400", "bg-yellow-300 border-yellow-400", "bg-red-300 border-red-400", 
  "bg-indigo-300 border-indigo-400", "bg-teal-300 border-teal-400"
];


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
  return endMinutes - startMinutes;
};


export default function Schedule({ 
  sessionId, dayIndex 
}: {
  sessionId?: string;
  dayIndex?: number;
}) {
  const router = useRouter()
  const { data: sessions = [] , isLoading: sessionsLoading, isError: sessionsError} = useQuery({
    queryKey: ['sessions'],
    queryFn: getAllSessions
  })
  const { data: locations = [] , isLoading: locationsLoading, isError: locationsError} = useQuery({
    queryKey: ['locations'],
    queryFn: getAllLocations
  })
  const { data: currentUserRsvps = [] } = useQuery({
    queryKey: ['rsvps', 'current-user'],
    queryFn: getCurrentUserRsvps
  })
  const {currentUser} = useCurrentUser()
  const [filterForUserEvents, setFilterForUserEvents] = useState(false)


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
    const filterSessionForUser = (session: DbSessionView) => {
      if (currentUserRsvps.includes(session.id!)) {
        return true
      }
      const sessionHostIds = [session.host_1_id, session.host_2_id, session.host_3_id].filter(Boolean)
      return sessionHostIds.some(hostId => currentUser?.id === hostId)
    }
    const maybeFilteredSessions = filterForUserEvents ? sessions.filter(filterSessionForUser) : sessions
    maybeFilteredSessions.forEach((session) => {
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
  }, [sessions, filterForUserEvents]);
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

  const handleToggleFilterForUserEvents = () => {
    setFilterForUserEvents(!filterForUserEvents)
    toast.info(`Now displaying ${filterForUserEvents ? 'only your hosted/rsvp\'d events' : 'all events'}`)
  }
  // Helper function to get event color
  const getEventColor = (session:DbSessionView) => {
    const locationIndex = locations.findIndex(l => l.id === session.location_id)
    return currentUserRsvps.includes(session.id!) ? 'bg-green-400 border-green-500' : locationEventColors[locationIndex % locationEventColors.length]
  };

  if (sessionsLoading || locationsLoading) {
    return <div>Loading...</div>
  }
  if (sessionsError || locationsError) {
    console.error(sessionsError, locationsError)

    return <div className="text-red-200">Error loading sessions or locations</div>
  }
  return (
    <div className="font-serif w-full h-full flex flex-col bg-dark-500 border border-secondary-300 rounded-xl overflow-hidden">
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
          <div className="grid bg-dark-400 lg:sticky lg:top-0 lg:z-30" style={{ gridTemplateColumns: `60px repeat(${locations.length}, minmax(180px, 1fr))` }}>
            <div className="bg-dark-600 p-3 border left-0 sticky border-secondary-300">
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
            <div className="bg-dark-600 p-3 sticky border-b-2 left-0 top-0 z-30 border border-secondary-300">
              <div className="flex text-sm text-secondary-300  font-medium size-full items-center justify-center">
                {currentUser && <button className={`${filterForUserEvents ? 'opacity-100' : 'opacity-50'} cursor-pointer bg-dark-200 rounded-sm p-2`} title="Filter for events I am rsvp'd to or hosting"  onClick={handleToggleFilterForUserEvents}>
                  <FilterIcon className={`size-4 text-secondary-300`} />
                </button>}
              </div>
            </div>
            {locations.map((venue) => (
              <div key={venue.id} className="bg-dark-600 p-3 border border-b-2 border-secondary-300">
                <div className="size-full flex flex-col items-start justify-start text-secondary-200">
                  <span className="font-serif font-bold text-base">{venue.name}</span>
                  {venue.campus_location && <span className="font-sans font-normal text-xs text-secondary-400">{venue.campus_location}</span>}
                  {venue.capacity && <span className="font-sans font-normal text-xs text-secondary-400 flex items-center gap-1">Max {venue.capacity}<User2Icon className="size-3"/></span>}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots Grid */}
          <div className="grid bg-dark-400" style={{ gridTemplateColumns: `60px repeat(${locations.length}, minmax(180px, 1fr))` }}>
            {timeSlots.map((time) => (
              <div key={time} className="contents">
                {/* Time Cell - Sticky Left */}
                <div className="flex justify-center w-full bg-dark-500 border border-r-secondary-300 border-dark-400 sticky left-0 top-0 z-sticky">
                  <div className="text-sm text-secondary-300 font-medium">{time}</div>
                </div>

                {/* Venue Cells */}
                {locations.map((venue) => {
                  const eventsInSlot = currentDay.events.filter(session => 
                    session.location_id === venue.id && eventStartsInSlot(session, time)
                  );
                  return (
                    <div key={venue.id} className="bg-dark-500 min-h-[60px] border border-dark-400 relative overflow-visible">
                      {eventsInSlot.map((session) => (
                        <SmartTooltip key={session.id} tooltip={<SessionDetailsCard session={session}/>}>
                          
                          <div
                            onClick={() => handleOpenSessionModal(session.id!)}
                            className={`absolute z-content p-1 m-0.5 border-2 rounded-md ${getEventColor(session)} text-black font-semibold`}
                            style={{
                              top: `${getEventOffsetMinutes(session, time) * 2}px`,     // 2px per minute
                              height: `${getEventDurationMinutes(session, time) * 2}px`, // 2px per minute  
                              left: '0px',
                              right: '0px',
                            }}
                          >
                            <div className="flex flex-col size-full relative">
                              <div className="font-bold text-sm leading-tight">
                                {session.title}
                              </div>
                              <div className="text-xs font-sans">
                                {dbGetHostsFromSession(session).join(", ")}
                              </div>

                              <div className="font-sans absolute bottom-0 right-0 text-xs opacity-80 flex items-center gap-1">
                                {currentUserRsvps.includes(session.id!) && <CheckIcon className="size-3"/>}
                                <UserIcon className="size-3"/> 
                                {session.rsvp_count ?? "0"} / {session.max_capacity}
                              </div>

                            </div>
                          </div>
                        </SmartTooltip>
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
        <Modal
        onClose={() => {
          const sessionDayIndex = days.findIndex(day => day.events.some(event => event.id === openedSessionId))
          setOpenedSessionId(null)
          setDayIndex(sessionDayIndex)
          }}
        >
          <SessionDetailsCard 
            session={sessions.find(s => s.id === openedSessionId)!} 
          />
        </Modal>
      }
    </div>
  );
} 
