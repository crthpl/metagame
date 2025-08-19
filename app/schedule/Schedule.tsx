"use client";

import { useState, useMemo, useEffect } from 'react';
import { CheckIcon, ChevronLeft, ChevronRight, FilterIcon, User2Icon, UserIcon, PlusIcon } from "lucide-react";
import { DbSessionView } from "@/types/database/dbTypeAliases";
import Image from "next/image";
import SessionDetailsCard from "./SessionModalCard";
import { useRouter } from "next/navigation";
import { dbGetHostsFromSession } from "@/utils/dbUtils";
import { Modal } from "@/components/Modal";

import { useQuery } from '@tanstack/react-query';
import { getAllSessions, getCurrentUserRsvps } from '@/app/actions/db/sessions'
import { getOrderedScheduleLocations } from '../actions/db/locations';
import { useUser } from '@/hooks/dbQueries';
import { toast } from 'sonner';
import { AddEventModal } from './EditEventModal';
import { BloodDrippingFrame } from '@/components/BloodDrippingFrame';
import { dateUtils } from '@/utils/dateUtils';
import { usePathname } from 'next/navigation';
import { SessionTooltip } from './SessionTooltip';

const SCHEDULE_START_TIMES = [14, 9, 9];
const SCHEDULE_END_TIMES = [22, 22, 22];
  // Fixed conference days - create Date objects representing midnight in Pacific Time
export const CONFERENCE_DAYS = [
    { date: new Date('2025-09-12T00:00:00-07:00'), name: 'Friday' },
    { date: new Date('2025-09-13T00:00:00-07:00'), name: 'Saturday' }, 
    { date: new Date('2025-09-14T00:00:00-07:00'), name: 'Sunday' }
  ];

// Generate time slots from 9:00 to 22:00 in 30-minute intervals
const generateTimeSlots = (dayIndex: number) => {
  const slots = [];
  for (let hour = SCHEDULE_START_TIMES[dayIndex]; hour <= SCHEDULE_END_TIMES[dayIndex]; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < SCHEDULE_END_TIMES[dayIndex]) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};



// Color options for events
const locationEventColors = [
  "bg-blue-300 border-blue-400", "bg-purple-300 border-purple-400", "bg-orange-300 border-orange-400", 
  "bg-cyan-200 border-cyan-300", "bg-pink-300 border-pink-400", "bg-yellow-300 border-yellow-400", "bg-red-300 border-red-400", 
  "bg-indigo-300 border-indigo-400", "bg-teal-300 border-teal-400"
];

// Updated slot checking - PST based
const eventStartsInSlot = (session: DbSessionView, slotTime: string) => {
  if (!session.start_time) return false;
  
  const sessionStartMinutes = dateUtils.getPSTMinutes(session.start_time);
  const [slotHour, slotMinute] = slotTime.split(':').map(Number);
  const slotStartMinutes = slotHour * 60 + slotMinute;
  const slotEndMinutes = slotStartMinutes + 30;
  
  return sessionStartMinutes >= slotStartMinutes && sessionStartMinutes < slotEndMinutes;
};

// Updated offset calculation - PST based
const getEventOffsetMinutes = (session: DbSessionView, slotTime: string) => {
  if (!session.start_time) return 0;
  
  const sessionStartMinutes = dateUtils.getPSTMinutes(session.start_time);
  const [slotHour, slotMinute] = slotTime.split(':').map(Number);
  const slotStartMinutes = slotHour * 60 + slotMinute;
  
  return Math.max(0, sessionStartMinutes - slotStartMinutes);
};

// Updated duration calculation - PST based
const getEventDurationMinutes = (session: DbSessionView) => {
  if (!session.start_time || !session.end_time) return 30;
  
  const startMinutes = dateUtils.getPSTMinutes(session.start_time);
  const endMinutes = dateUtils.getPSTMinutes(session.end_time);
  return endMinutes - startMinutes;
};

export default function Schedule({ 
  sessionId, dayIndex 
}: {
  sessionId?: string;
  dayIndex?: number;
}) {
  const pathname = usePathname()
  const router = useRouter()
  const {currentUserProfile} = useUser()
  const { data: sessions = [] , isLoading: sessionsLoading, isError: sessionsError} = useQuery({
    queryKey: ['sessions'],
    queryFn: getAllSessions

  })
  const { data: locations = [] , isLoading: locationsLoading, isError: locationsError} = useQuery({
    queryKey: ['locations'],
    queryFn: getOrderedScheduleLocations
  })
  const { data: currentUserRsvps = [] } = useQuery({
    queryKey: ['rsvps', 'current-user'],
    queryFn: getCurrentUserRsvps,
    enabled: !!currentUserProfile?.id
  })
  const [filterForUserEvents, setFilterForUserEvents] = useState(false)



  
  // Group sessions by the 3 fixed conference days
  const days = useMemo(() => {
    const dayEvents = [
      [], // Day 0: Friday 9/12
      [], // Day 1: Saturday 9/13  
      []  // Day 2: Sunday 9/14
    ] as DbSessionView[][];
    const filterSessionForUser = (session: DbSessionView) => {
      if (!currentUserProfile) return true
      if (currentUserRsvps.some(rsvp => rsvp.session_id === session.id!)) {
        return true
      }
      const sessionHostIds = [session.host_1_id, session.host_2_id, session.host_3_id].filter(Boolean)
      return sessionHostIds.some(hostId => currentUserProfile?.id === hostId)
    }
    const maybeFilteredSessions = filterForUserEvents ? sessions.filter(filterSessionForUser) : sessions
    maybeFilteredSessions.forEach((session) => {
      const [sessionStart, sessionEnd] = [session.start_time, session.end_time].filter(Boolean)
      if (!sessionStart || !sessionEnd || !session.title) return;
      
      const dayIndex = CONFERENCE_DAYS.findIndex(day => {
        if (dateUtils.getPacificParts(day.date).day === dateUtils.getPacificParts(new Date(sessionStart)).day) {
          return true;
        }
        return false;
      });
      if (dayIndex >= 0) {
        dayEvents[dayIndex].push(session);
      }
    });
    
    // Create the final days array
    return CONFERENCE_DAYS.map((confDay, index) => ({
      date: confDay.date,
      displayName: `${confDay.name} (${dateUtils.getYYYYMMDD(confDay.date)})`,
      events: dayEvents[index].sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
    }));
  }, [sessions, filterForUserEvents]);
  const [currentDayIndex, setCurrentDayIndex] = useState(dayIndex ?? 0);
  const [openedSessionId, setOpenedSessionId] = useState<DbSessionView['id'] | null>(sessionId ?? null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [addEventPrefill, setAddEventPrefill] = useState<{
    startTime: string;
    locationId: string;
  } | null>(null);
  
  // Sync URL parameters with state changes
  useEffect(() => {
    if (!pathname.startsWith('/schedule')) return;
    const params = new URLSearchParams();
    if (currentDayIndex !== 0) params.set('day', currentDayIndex.toString());
    if (openedSessionId) params.set('session', openedSessionId);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [currentDayIndex, openedSessionId, router]);
  const currentDay = days[currentDayIndex] || { date: '', displayName: 'No Events', events: [] };

  const nextDay = () => {
    setCurrentDayIndex(prev => Math.min(days.length - 1, prev + 1))
  };

  const prevDay = () => {
    setCurrentDayIndex(prev => Math.max(0, prev - 1))
  };

  const handleOpenSessionModal = (sessionId: string) => {
    setOpenedSessionId(sessionId)
  }

  const handleEmptySlotClick = (time: string, locationId: string) => {
    if (!currentUserProfile?.is_admin) return;
    
    setAddEventPrefill({
      startTime: time,
      locationId: locationId
    });
    setIsAddEventModalOpen(true);
  }

  const handleToggleFilterForUserEvents = () => {
    setFilterForUserEvents(prev => {
      const newFilter = !prev
      toast.info(`Now displaying ${newFilter ? 'only your hosted/rsvp\'d events' : 'all events'}`)
      return newFilter
    })
  }
  // Helper function to get event color
  const getEventColor = (session:DbSessionView) => {
    const locationIndex = locations.findIndex(l => l.id === session.location_id)
    return currentUserRsvps.some(rsvp => rsvp.session_id === session.id!) ? 'bg-green-400 border-green-500' : locationEventColors[locationIndex % locationEventColors.length]
  };

  if (sessionsLoading || locationsLoading) {
    return <div>Loading...</div>
  }
  if (sessionsError || locationsError) {
    console.error(sessionsError, locationsError)

    return <div className="text-red-200">Error loading sessions or locations</div>
  }
  return (
    <div className="relative font-serif w-full h-full flex flex-col bg-dark-500 overflow-hidden">
      {/* Day Navigator - Fixed on desktop, scrollable on mobile */}
      <div className="hidden lg:flex flex-shrink-0 items-center justify-between p-4 bg-dark-600 border-b border-secondary-300">
        <button
          onClick={prevDay}
          className="p-2 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          disabled={currentDayIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 text-secondary-300" />
        </button>
        
        <h2 className="text-xl font-bold text-secondary-200 text-center">
          {currentDay.displayName}
        </h2>
        
        <button
          onClick={nextDay}
          className="p-2 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
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
            className="p-2 rounded-md transition-colors disabled:opacity-50"
            disabled={currentDayIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 text-secondary-300" />
          </button>
          
          <h2 className="text-xl font-bold text-secondary-200 text-center">
            {currentDay.displayName}
          </h2>
          
          <button
            onClick={nextDay}
            className="p-2 rounded-md transition-colors disabled:opacity-50"
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
            {locations.map((location) => (
              <div key={location.id} className="bg-dark-600 p-3 border border-secondary-300">
                {location.name === "The Clocktower" ? (
                  <BloodDrippingFrame className="w-full h-24">
                    {location.thumbnail_url ? 
                      <Image src={location.thumbnail_url} alt={location.name} width={100} height={100} className="object-cover w-full h-24"/>
                      : <div className="w-full h-24 bg-dark-500"/>
                    }
                  </BloodDrippingFrame>
                ) : (
                  location.thumbnail_url ? 
                    <Image src={location.thumbnail_url} alt={location.name} width={100} height={100} className="object-cover w-full h-24"/>
                    : <div className="w-full h-24 bg-dark-500"/>
                )}
              </div>
            ))}
          </div>

          {/* Names Row - Always sticky, with day nav on mobile */}
          <div className="grid bg-dark-400 sticky top-0 lg:top-[120px] z-20" style={{ gridTemplateColumns: `60px repeat(${locations.length}, minmax(180px, 1fr))` }}>
            <div className="bg-dark-600 p-3 sticky border-b-2 left-0 top-0 z-30 border border-secondary-300">
              <div className="flex text-sm text-secondary-300 font-medium size-full items-center justify-center gap-1">
                {currentUserProfile?.id && (
                  <button 
                    className={`${filterForUserEvents ? 'opacity-100' : 'opacity-50'} cursor-pointer bg-dark-200 rounded-sm p-2 hover:bg-dark-300 transition-colors`} 
                    title="Filter for events I am rsvp'd to or hosting"  
                    onClick={handleToggleFilterForUserEvents}
                  >
                    <FilterIcon className="size-4 text-secondary-300" />
                  </button>
                )}
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
            {generateTimeSlots(currentDayIndex).map((time) => (
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
                        <SessionTooltip key={session.id} tooltip={<SessionDetailsCard session={session}/>}>
                          
                          <div
                            onClick={() => handleOpenSessionModal(session.id!)}
                            className={` z-content p-1 m-0.5 border-2 rounded-md ${getEventColor(session)} text-black font-semibold`}
                            style={{
                              top: `${getEventOffsetMinutes(session, time) * 2}px`,     // 2px per minute
                              height: `${getEventDurationMinutes(session) * 2}px`, // 2px per minute  
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
                                {currentUserRsvps.some(rsvp => rsvp.session_id === session.id!) && <CheckIcon className="size-3"/>}
                                <UserIcon className="size-3"/> 
                                {currentUserProfile?.id ? (
                                  session.max_capacity ? 
                                    `${session.rsvp_count ?? "0"} / ${session.max_capacity}` :
                                    `${session.rsvp_count ?? "0"}`
                                ) : (
                                  session.min_capacity && session.max_capacity ?
                                    `${session.min_capacity} - ${session.max_capacity}` :
                                    null
                                )}
                              </div>

                            </div>
                          </div>
                        </SessionTooltip>
                      ))}
                      
                      {/* Clickable empty slot for admins */}
                      {currentUserProfile?.is_admin && eventsInSlot.length === 0 && (
                        <div
                          onClick={() => handleEmptySlotClick(time, venue.id)}
                          className="absolute inset-0 cursor-pointer hover:bg-dark-400 hover:bg-opacity-20 transition-colors duration-200 group"
                          title={`Add event at ${time} in ${venue.name}`}
                        >
                          <div className="hidden group-hover:flex items-center justify-center h-full text-xs text-secondary-400">
                            <PlusIcon className="size-6"/>
                          </div>
                        </div>
                      )}
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
          if (sessionDayIndex >= 0) {
            setCurrentDayIndex(sessionDayIndex)
          }
          }}
        >
          <SessionDetailsCard 
            session={sessions.find(s => s.id === openedSessionId)!} 
          />
        </Modal>
      }
      
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => {
          setIsAddEventModalOpen(false);
          setAddEventPrefill(null);
        }}
        defaultDay={dateUtils.getPacificParts(CONFERENCE_DAYS[currentDayIndex]?.date).day}
        prefillData={addEventPrefill}
      />

      {/* Floating Action Button - Admin Only */}
      {currentUserProfile?.is_admin && (
        <button
          className="absolute bottom-6 right-6 z-40 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
          title="Add new event"
          onClick={() => setIsAddEventModalOpen(true)}
        >
          <PlusIcon className="size-5" />
        </button>
      )}
    </div>
  );
} 
