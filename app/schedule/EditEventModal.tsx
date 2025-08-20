"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminAddSession,
  adminUpdateSession,
  adminDeleteSession,
} from "@/app/actions/db/sessions";
import { fetchLocations, fetchProfiles, fetchSessionById } from "./queries";
import { useUser } from "@/hooks/dbQueries";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DbSessionAges } from "@/types/database/dbTypeAliases";
import {
  getAgesDisplayText,
  SESSION_AGES,
} from "@/utils/dbUtils";
import { XIcon } from "lucide-react";
import { CONFERENCE_DAYS } from "./Schedule";
import { dateUtils } from "@/utils/dateUtils";
import { userEditSession } from "./actions";
interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDay?: string;
  prefillData?: {
    startTime: string;
    locationId: string;
  } | null;
  existingSessionId?: string | null;
  canEdit?: boolean;
}

type FormData = {
  title: string;
  description: string;
  day: string;
  startTime: string;
  endTime: string;
  minCapacity: number | null;
  maxCapacity: number | null;
  locationId: string | null;
  ages: DbSessionAges;
  host_1_id: string | null;
  host_2_id: string | null;
  host_3_id: string | null;
};
export function AddEventModal({
  isOpen,
  onClose,
  defaultDay,
  prefillData,
  existingSessionId,
  canEdit = false,
}: AddEventModalProps) {
  const queryClient = useQueryClient();
  const { currentUserProfile } = useUser();
  const isEditMode = !!existingSessionId;
  const defaultFormData = {
    title: "",
    description: "",
    day: defaultDay || CONFERENCE_DAYS[0].date.getDate().toString(),
    startTime: "09:00",
    endTime: "09:30",
    minCapacity: null,
    maxCapacity: null,
    locationId: null,
    ages: SESSION_AGES.ALL,
    host_1_id: null,
    host_2_id: null,
    host_3_id: null,
  };
  const {
    data: profiles,
    isLoading: profilesLoading,
    error: profilesError,
  } = useQuery({
    queryKey: ["profiles", "all"],
    queryFn: fetchProfiles,
    enabled: !!currentUserProfile?.is_admin && !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    enabled: !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch the existing session data if in edit mode
  const { data: existingSession, isLoading: sessionLoading } = useQuery({
    queryKey: ["sessions", existingSessionId],
    queryFn: () => fetchSessionById(existingSessionId!),
    enabled: !!isEditMode && !!existingSessionId && !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const [formData, setFormData] = useState<FormData>(defaultFormData);
  // Initialize form data when existingSession changes
  useEffect(() => {
    if (existingSession && !sessionLoading) {
      const startDatePSTParts = dateUtils.getPacificParts(new Date(existingSession.start_time!));
      const endDatePSTParts = existingSession.end_time
        ? dateUtils.getPacificParts(new Date(existingSession.end_time))
        : null;

      // Check if the host IDs exist in the profiles before setting them
      const validateHostId = (hostId: string | null) => {
        if (!hostId) return null;
        // If profiles aren't loaded (e.g., non-admin view), keep the existing host id as-is
        if (!profiles) return hostId;
        const profileExists = profiles.some(p => p.id === hostId);
        return profileExists ? hostId : null;
      };

      const newFormData = {
        title: existingSession.title || "",
        description: existingSession.description || "",
        day: startDatePSTParts.day,
        startTime: startDatePSTParts.hour + ":" + startDatePSTParts.minute,
        endTime: endDatePSTParts ? endDatePSTParts.hour + ":" + endDatePSTParts.minute : "10:00",
        minCapacity: existingSession.min_capacity,
        maxCapacity: existingSession.max_capacity,
        locationId: existingSession.location_id || null,
        ages: existingSession.ages || SESSION_AGES.ALL,
        host_1_id: validateHostId(existingSession.host_1_id),
        host_2_id: validateHostId(existingSession.host_2_id),
        host_3_id: validateHostId(existingSession.host_3_id),
      };
      setFormData(newFormData);
    } else if (prefillData) {
      // The prefillData.startTime is already the exact time of the slot (e.g., "14:30")
      // End time should be 30 minutes later (next half-hour slot)
      const [startHour, startMinute] = prefillData.startTime
        .split(":")
        .map(Number);
      let endHour = startHour;
      let endMinute = startMinute + 30;

      // Handle hour rollover
      if (endMinute >= 60) {
        endHour += 1;
        endMinute = 0;
      }

      const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

      setFormData({
        ...defaultFormData,
        startTime: prefillData.startTime,
        endTime: endTime,
        locationId: prefillData.locationId || '',
      });
    } else {
      // Reset to defaults
      setFormData({
        ...defaultFormData,
      });
    }
  }, [existingSession, sessionLoading, isEditMode, defaultDay, prefillData, profiles]);
  // Bump up hosts when an earlier host is cleared
  useEffect(() => {
    if (!formData.host_1_id && !formData.host_2_id && !formData.host_3_id) return;
    if (!formData.host_1_id) {
      setFormData(prev => ({ 
        ...prev, 
        host_1_id: prev.host_2_id,
        host_2_id: prev.host_3_id,
        host_3_id: null
      }));
    }
  }, [formData.host_1_id]);

  useEffect(() => {
    if (!formData.host_2_id) {
      setFormData(prev => ({ 
        ...prev, 
        host_2_id: prev.host_3_id,
        host_3_id: null
      }));
    }
  }, [formData.host_2_id]);


  const addEventMutation = useMutation({
    mutationFn: adminAddSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Event created successfully!");
      onClose();
      // Reset form
      setFormData({
        ...defaultFormData,
      });
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error.message}`);
    },
  });

  const userEditSessionMutation = useMutation({
    mutationFn: userEditSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Event updated successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: adminUpdateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Event updated successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: adminDeleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Event deleted successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate times
    if (formData.startTime >= formData.endTime) {
      toast.error("End time must be after start time");
      return;
    }



    if (formData.minCapacity && formData.maxCapacity && formData.minCapacity > formData.maxCapacity) {
      toast.error("Minimum capacity cannot be greater than maximum capacity");
      return;
    }

    // Validate host selection
    if (!formData.host_1_id) {
      toast.error("Please select a host for the event");
      return;
    }


    const startDateTime = dateUtils.dateFromParts({
      year: 2025,
      month: 9,
      day: formData.day,
      time: formData.startTime,
    });
    const endDateTime = dateUtils.dateFromParts({
      year: 2025,
      month: 9,
      day: formData.day,
      time: formData.endTime,
    });
    const payload = {
      title: formData.title,
      description: formData.description || null,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      min_capacity: formData.minCapacity,
      max_capacity: formData.maxCapacity,
      location_id: formData.locationId,
      host_1_id: formData.host_1_id,
      host_2_id: formData.host_2_id,
      host_3_id: formData.host_3_id,
      ages: formData.ages,
    };

    if (isEditMode && existingSessionId) {
      if (currentUserProfile?.is_admin) {
        updateEventMutation.mutate({
          sessionId: existingSessionId,
          payload,
        });
      } else if (canEdit) {
        userEditSessionMutation.mutate({
          sessionId: existingSessionId,
          sessionUpdate: payload,
        });
      } else {
        toast.error("You don't have permission to edit this event");
        return;
      }
    } else {
      addEventMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (!existingSessionId) return;

    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      deleteEventMutation.mutate({ sessionId: existingSessionId });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    
    // Handle number fields
    if (name === "minCapacity" || name === "maxCapacity") {
      const numValue = value === "" ? null : parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const hostSelectOptions = () => {
    if (!currentUserProfile?.is_admin) {
      console.log("non-admin")
      return (
        <SelectItem value="read-only" disabled>
          Hosts are read-only for non-admins
        </SelectItem>
      );
    }
    if (profilesLoading) {
      return (
        <SelectItem value="loading" disabled>
          Loading profiles...
        </SelectItem>
      )
    }
    if (profilesError && currentUserProfile?.is_admin) {
      return (
        <SelectItem value="error" disabled>
          Error loading profiles: {profilesError.message}
        </SelectItem>
      );
    }
    if (profiles && profiles.length === 0) {
      return (
        <SelectItem value="empty" disabled>
          No profiles found
        </SelectItem>
      )
    }
    return profiles?.map((profile) => {
      return (
        <SelectItem key={profile.id} value={profile.id}>
          {profile.first_name ? `${profile.first_name} ${profile.last_name ?? ""} - ${profile.email || profile.id}` : profile.email || profile.id}
        </SelectItem>
      );
    })
  }
  if (!isOpen) return null;

  // Show loading state while fetching session data in edit mode
  if (isEditMode && sessionLoading) {
    return (
      <Modal onClose={onClose}>
        <div className="bg-dark-400 w-full max-w-md rounded-lg p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-2 text-lg font-semibold">
              Loading event data...
            </div>
            <div className="text-sm text-gray-400">
              Please wait while we fetch the event details.
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div className="bg-dark-400 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">
          {isEditMode ? "Edit Event" : "Add New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="day" className="mb-1 block text-sm font-medium">
                Day <span className="text-red-500">*</span>
              </label>
              <Select
                name="day"
                required
                value={formData.day}
                disabled={!currentUserProfile?.is_admin}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, day: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  {CONFERENCE_DAYS.map((day) => (
                    <SelectItem key={day.date.getDate().toString()} value={day.date.getDate().toString()}>
                      {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="locationId"
                className="mb-1 block text-sm font-medium"
              >
                Location
              </label>
              <Select
                name="locationId"
                value={formData.locationId || ""}
                disabled={!currentUserProfile?.is_admin}
                onValueChange={(value) => {
                  if (!value) {
                    return
                  }
                  setFormData((prev) => ({ ...prev, locationId: value === "none" ? null : value }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  <SelectItem value="none">No specific location</SelectItem>
                  {locationsLoading && (
                    <SelectItem value="loading" disabled>
                      Loading locations...
                    </SelectItem>
                  )}
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startTime"
                className="mb-1 block text-sm font-medium"
              >
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                required
                disabled={!currentUserProfile?.is_admin}
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="endTime"
                className="mb-1 block text-sm font-medium"
              >
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                required
                disabled={!currentUserProfile?.is_admin}
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          
          {/* Host 1 - Required */}
          { currentUserProfile?.is_admin && 
            <div>
              <div className="flex gap-2">
                <label htmlFor="host_1_id" className="mb-1 block text-sm font-medium">
                  Host 1 <span className="text-red-500">*</span>
                </label>
                {formData.host_1_id && <XIcon className="size-4 text-red-500" onClick={() => setFormData((prev) => ({ ...prev, host_1_id: null }))} />}
              </div>
              <Select
                name="host_1_id"
                value={formData.host_1_id || ""}
                disabled={!currentUserProfile?.is_admin}
                onValueChange={(value) => {
                  if (!value) return;
                  setFormData((prev) => {
                    return { ...prev, host_1_id: value }
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a host" />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  {hostSelectOptions()}
                </SelectContent>
              </Select>
              {profilesError && (
                <p className="mt-1 text-xs text-red-400">
                  Error: {profilesError.message}
                </p>
              )}
            </div>
          }

          {/* Host 2 - Optional, only show if Host 1 is selected */}
          {formData.host_1_id && currentUserProfile?.is_admin && (
            <div>
              <div className="flex gap-2">
                <label htmlFor="host_2_id" className="mb-1 block text-sm font-medium">
                  Host 2 <span className="text-gray-400">(Optional)</span> 
                </label>
                {formData.host_2_id && <XIcon className="size-4 text-red-500" onClick={() => setFormData((prev) => ({ ...prev, host_2_id: null }))} />}
              </div>
                  <Select
                    name="host_2_id"
                    value={formData.host_2_id || ""}
                    disabled={!currentUserProfile?.is_admin}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, host_2_id: value === "none" ? null : value }))
                    }
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a second host" />
                  </SelectTrigger>
                <SelectContent className="z-[70]">
                  <SelectItem value="none">No second host</SelectItem>
                  {hostSelectOptions()}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Host 3 - Optional, only show if Host 2 is selected */}
          {formData.host_1_id && formData.host_2_id && currentUserProfile?.is_admin && (
            <div>
              <div className="flex gap-2">
                <label htmlFor="host_3_id" className="mb-1 block text-sm font-medium">
                  Host 3 <span className="text-gray-400">(Optional)</span>
                </label>
                {formData.host_3_id && <XIcon className="size-4 text-red-500" onClick={() => setFormData((prev) => ({ ...prev, host_3_id: null }))} />}
              </div>
                      <Select
                    name="host_3_id"
                    value={formData.host_3_id || ""}
                    disabled={!currentUserProfile?.is_admin}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, host_3_id: value === "none" ? null : value }))
                    }
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a third host" />
                  </SelectTrigger>
                <SelectContent className="z-[70]">
                  <SelectItem value="none">No third host</SelectItem>
                  {hostSelectOptions()}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="minCapacity"
                className="mb-1 block text-sm font-medium"
              >
                Min Capacity
              </label>
              <input
                id="minCapacity"
                name="minCapacity"
                type="number"
                min="0"
                value={formData.minCapacity || ""}
                onChange={handleInputChange}
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label
                htmlFor="maxCapacity"
                className="mb-1 block text-sm font-medium"
              >
                Max Capacity
              </label>
              <input
                id="maxCapacity"
                name="maxCapacity"
                type="number"
                min="0"
                value={formData.maxCapacity || ""}
                onChange={handleInputChange}
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label htmlFor="ages" className="mb-1 block text-sm font-medium">
                Ages
              </label>
              <Select
                value={formData.ages}
                onValueChange={(value: DbSessionAges) =>
                  setFormData((prev) => ({ ...prev, ages: value }))
                }
                name="ages"
              >
                <SelectTrigger id="ages" className="w-full">
                  <SelectValue placeholder="Select an age" />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  {Object.values(SESSION_AGES).map((age) => (
                    <SelectItem key={age} value={age}>
                      {getAgesDisplayText(age)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={
                addEventMutation.isPending || updateEventMutation.isPending
              }
              className="flex-1 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addEventMutation.isPending || updateEventMutation.isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Event"
                  : "Create Event"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>

          {isEditMode && (
            <div className="border-t border-gray-600 pt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteEventMutation.isPending}
                className="w-full rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteEventMutation.isPending ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
