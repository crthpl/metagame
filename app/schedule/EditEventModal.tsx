"use client";

import { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAddSession, adminUpdateSession, adminDeleteSession, getSessionById } from '../actions/db/sessions';
import { adminGetAllProfiles } from '../actions/db/users';
import { getOrderedScheduleLocations } from '../actions/db/locations';
import { useUser } from '@/hooks/dbQueries';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DbSessionAges } from '@/types/database/dbTypeAliases';
import { getAgesDisplayText, SessionAges, SessionAgesEnum } from '@/utils/dbUtils';

// Conference days configuration
const CONFERENCE_DAYS = [
  { date: '2025-09-12', name: 'Friday' },
  { date: '2025-09-13', name: 'Saturday' }, 
  { date: '2025-09-14', name: 'Sunday' }
];


interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDay?: string;
  prefillData?: {
    startTime: string;
    locationId: string;
  } | null;
  existingSessionId?: string | null;
}

type FormData = {
  title: string;
  description: string;
  day: string;
  startTime: string;
  endTime: string;
  minCapacity: string;
  maxCapacity: string;
  locationId: string;
  ages: DbSessionAges;
  hostId: string;
}
export function AddEventModal({ isOpen, onClose, defaultDay, prefillData, existingSessionId }: AddEventModalProps) {
  const queryClient = useQueryClient();
  const { is_admin } = useUser();
  const isEditMode = !!existingSessionId;
  const defaultFormData = {
    title: '',
    description: '',
    day: defaultDay || CONFERENCE_DAYS[0].date,
    startTime: '09:00',
    endTime: '09:30',
    minCapacity: '',
    maxCapacity: '',
    locationId: '',
    ages: SessionAges.ALL,
    hostId: ''
  }
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useQuery({
    queryKey: ['profiles', 'all'],
    queryFn: adminGetAllProfiles,
    enabled: !!is_admin && !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: getOrderedScheduleLocations,
    enabled: !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch the existing session data if in edit mode
  const { data: existingSession, isLoading: sessionLoading } = useQuery({
    queryKey: ['sessions', existingSessionId],
    queryFn: () => getSessionById({sessionId: existingSessionId!}),
    enabled: !!isEditMode && !!existingSessionId && !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Initialize form data when existingSession changes
  useEffect(() => {
    if (existingSession && !sessionLoading) {
      const startDate = new Date(existingSession.start_time!);
      const endDate = existingSession.end_time ? new Date(existingSession.end_time) : null;
      
      // Convert UTC to PST for display
      const pstStartDate = new Date(startDate.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
      const pstEndDate = endDate ? new Date(endDate.toLocaleString("en-US", {timeZone: "America/Los_Angeles"})) : null;
      
      setFormData({
        title: existingSession.title || '',
        description: existingSession.description || '',
        day: pstStartDate.toISOString().split('T')[0],
        startTime: pstStartDate.toTimeString().slice(0, 5),
        endTime: pstEndDate ? pstEndDate.toTimeString().slice(0, 5) : '10:00',
        minCapacity: existingSession.min_capacity?.toString() || '',
        maxCapacity: existingSession.max_capacity?.toString() || '',
        locationId: existingSession.location_id || '',
        ages: existingSession.ages || SessionAges.ALL,
        hostId: existingSession.host_1_id || ''
      });
    } else if (prefillData) {
      // The prefillData.startTime is already the exact time of the slot (e.g., "14:30")
      // End time should be 30 minutes later (next half-hour slot)
      const [startHour, startMinute] = prefillData.startTime.split(':').map(Number);
      let endHour = startHour;
      let endMinute = startMinute + 30;
      
      // Handle hour rollover
      if (endMinute >= 60) {
        endHour += 1;
        endMinute = 0;
      }
      
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      setFormData({
        ...defaultFormData,
        startTime: prefillData.startTime,
        endTime: endTime,
        locationId: prefillData.locationId,
      
      });
    } else {
      // Reset to defaults
      setFormData({
        ...defaultFormData,
      });
    }
  }, [existingSession, sessionLoading, isEditMode, defaultDay, prefillData]);

  const addEventMutation = useMutation({
    mutationFn: adminAddSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Event created successfully!');
      onClose();
      // Reset form
      setFormData({
        ...defaultFormData,
      });
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error.message}`);
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: adminUpdateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Event updated successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: adminDeleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Event deleted successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate times
    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    // Validate capacities
    const minCap = formData.minCapacity ? parseInt(formData.minCapacity) : null;
    const maxCap = formData.maxCapacity ? parseInt(formData.maxCapacity) : null;
    
    if (minCap && maxCap && minCap > maxCap) {
      toast.error('Minimum capacity cannot be greater than maximum capacity');
      return;
    }

    // Validate host selection
    if (!formData.hostId) {
      toast.error('Please select a host for the event');
      return;
    }

    // Convert to ISO datetime strings treating input as PST (UTC-8)
    // Add -08:00 to indicate PST timezone
    const startDateTime = new Date(`${formData.day}T${formData.startTime}:00-07:00`).toISOString();
    const endDateTime = new Date(`${formData.day}T${formData.endTime}:00-07:00`).toISOString();

    const payload = {
      title: formData.title,
      description: formData.description || null,
      start_time: startDateTime,
      end_time: endDateTime,
      min_capacity: minCap,
      max_capacity: maxCap,
      location_id: formData.locationId || null,
      host_1_id: formData.hostId,
      ages: formData.ages
    };

    if (isEditMode && existingSessionId) {
      updateEventMutation.mutate({
        sessionId: existingSessionId,
        payload
      });
    } else {
      addEventMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (!existingSessionId) return;
    
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEventMutation.mutate({ sessionId: existingSessionId });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgesChange = (value: DbSessionAges) => {
    setFormData(prev => ({ ...prev, ages: value }));
  };

  if (!isOpen || !is_admin) return null;

  // Show loading state while fetching session data in edit mode
  if (isEditMode && sessionLoading) {
    return (
      <Modal onClose={onClose}>
        <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Loading event data...</div>
            <div className="text-sm text-gray-400">Please wait while we fetch the event details.</div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="day" className="block text-sm font-medium mb-1">
            Day <span className="text-red-500">*</span>
          </label>
          <select
            id="day"
            name="day"
            required
            value={formData.day}
            onChange={handleInputChange}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
          >
            {CONFERENCE_DAYS.map((day) => (
              <option key={day.date} value={day.date}>
                {day.name} ({day.date})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              required
              value={formData.startTime}
              onChange={handleInputChange}
              className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              required
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="locationId" className="block text-sm font-medium mb-1">
            Location
          </label>
          <select
            id="locationId"
            name="locationId"
            value={formData.locationId}
            onChange={handleInputChange}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">No specific location</option>
            {locationsLoading && <option disabled>Loading locations...</option>}
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ages" className="block text-sm font-medium mb-1">
            Ages
          </label>
          <Select
            value={formData.ages}
            onValueChange={handleAgesChange}
            name="ages"
          >
            <SelectTrigger id="ages" className="w-full">
              <SelectValue placeholder="Select an age" />
            </SelectTrigger>
            <SelectContent className="z-[70]">
              {SessionAgesEnum.map((age) => (
                <SelectItem key={age} value={age}>{getAgesDisplayText(age)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="hostId" className="block text-sm font-medium mb-1">
            Host <span className="text-red-500">*</span>
          </label>
          <select
            id="hostId"
            name="hostId"
            value={formData.hostId}
            onChange={handleInputChange}
            required
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select a host</option>
            {profilesLoading && <option disabled>Loading profiles...</option>}
            {profilesError && <option disabled>Error loading profiles: {profilesError.message}</option>}
            {profiles && profiles.length === 0 && <option disabled>No profiles found</option>}
            {profiles?.map((profile) => {
              const display = () => {
                if (profile.first_name) {
                  return `${profile.first_name} ${profile.last_name ?? ""} - ${profile.email || profile.id}`
                }
                return profile.email || profile.id
              }
              return (
                <option key={profile.id} value={profile.id}>
                  {display()}
                </option>
              )
            })}
          </select>
          {profilesError && (
            <p className="text-xs text-red-400 mt-1">Error: {profilesError.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minCapacity" className="block text-sm font-medium mb-1">
              Min Capacity
            </label>
            <input
              id="minCapacity"
              name="minCapacity"
              type="number"
              min="0"
              value={formData.minCapacity}
              onChange={handleInputChange}
              className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="maxCapacity" className="block text-sm font-medium mb-1">
              Max Capacity
            </label>
            <input
              id="maxCapacity"
              name="maxCapacity"
              type="number"
              min="0"
              value={formData.maxCapacity}
              onChange={handleInputChange}
              className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={addEventMutation.isPending || updateEventMutation.isPending}
            className="flex-1 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addEventMutation.isPending || updateEventMutation.isPending 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Event' : 'Create Event')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white rounded py-2 px-4 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>

        {isEditMode && (
          <div className="pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteEventMutation.isPending}
              className="w-full bg-red-600 text-white rounded py-2 px-4 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteEventMutation.isPending ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        )}
      </form>
      </div>
    </Modal>
  );
}