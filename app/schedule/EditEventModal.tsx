"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminAddSession,
  adminUpdateSession,
  adminDeleteSession,
  getSessionById,
} from "../actions/db/sessions";
import { adminGetAllProfiles } from "../actions/db/users";
import { getOrderedScheduleLocations } from "../actions/db/locations";
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
  SessionAgesEnum,
} from "@/utils/dbUtils";
import { XIcon } from "lucide-react";

// Conference days configuration
const CONFERENCE_DAYS = [
  { date: "2025-09-12", name: "Friday" },
  { date: "2025-09-13", name: "Saturday" },
  { date: "2025-09-14", name: "Sunday" },
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
}: AddEventModalProps) {
  const queryClient = useQueryClient();
  const { is_admin } = useUser();
  const isEditMode = !!existingSessionId;
  const defaultFormData = {
    title: "",
    description: "",
    day: defaultDay || CONFERENCE_DAYS[0].date,
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
    queryFn: adminGetAllProfiles,
    enabled: !!is_admin && !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: getOrderedScheduleLocations,
    enabled: !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch the existing session data if in edit mode
  const { data: existingSession, isLoading: sessionLoading } = useQuery({
    queryKey: ["sessions", existingSessionId],
    queryFn: () => getSessionById({ sessionId: existingSessionId! }),
    enabled: !!isEditMode && !!existingSessionId && !!isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Initialize form data when existingSession changes
  useEffect(() => {
    if (existingSession && !sessionLoading) {
      const startDate = new Date(existingSession.start_time!);
      const endDate = existingSession.end_time
        ? new Date(existingSession.end_time)
        : null;

      // Convert UTC to PST for display
      const pstStartDate = new Date(
        startDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );
      const pstEndDate = endDate
        ? new Date(
            endDate.toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
            }),
          )
        : null;

      setFormData({
        title: existingSession.title || "",
        description: existingSession.description || "",
        day: pstStartDate.toISOString().split("T")[0],
        startTime: pstStartDate.toTimeString().slice(0, 5),
        endTime: pstEndDate ? pstEndDate.toTimeString().slice(0, 5) : "10:00",
        minCapacity: existingSession.min_capacity,
        maxCapacity: existingSession.max_capacity,
        locationId: existingSession.location_id || null,
        ages: existingSession.ages || SESSION_AGES.ALL,
        host_1_id: existingSession.host_1_id || null,
        host_2_id: existingSession.host_2_id || null,
        host_3_id: existingSession.host_3_id || null,
      });
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
  }, [existingSession, sessionLoading, isEditMode, defaultDay, prefillData]);

  // Bump up hosts when an earlier host is cleared
  useEffect(() => {
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

    // Convert to ISO datetime strings treating input as PST (UTC-8)
    // Add -08:00 to indicate PST timezone
    const startDateTime = new Date(
      `${formData.day}T${formData.startTime}:00-07:00`,
    ).toISOString();
    const endDateTime = new Date(
      `${formData.day}T${formData.endTime}:00-07:00`,
    ).toISOString();

    const payload = {
      title: formData.title,
      description: formData.description || null,
      start_time: startDateTime,
      end_time: endDateTime,
      min_capacity: formData.minCapacity,
      max_capacity: formData.maxCapacity,
      location_id: formData.locationId,
      host_1_id: formData.host_1_id,
      host_2_id: formData.host_2_id,
      host_3_id: formData.host_3_id,
      ages: formData.ages,
    };

    if (isEditMode && existingSessionId) {
      updateEventMutation.mutate({
        sessionId: existingSessionId,
        payload,
      });
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

  if (!isOpen || !is_admin) return null;

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
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, day: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  {CONFERENCE_DAYS.map((day) => (
                    <SelectItem key={day.date} value={day.date}>
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
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700"
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
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Host 1 - Required */}
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
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, host_1_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a host" />
              </SelectTrigger>
              <SelectContent className="z-[70]">
                {profilesLoading && (
                  <SelectItem value="loading" disabled>
                    Loading profiles...
                  </SelectItem>
                )}
                {profilesError && (
                  <SelectItem value="error" disabled>
                    Error loading profiles: {profilesError.message}
                  </SelectItem>
                )}
                {profiles && profiles.length === 0 && (
                  <SelectItem value="empty" disabled>
                    No profiles found
                  </SelectItem>
                )}
                {profiles?.map((profile) => {
                  const display = () => {
                    if (profile.first_name) {
                      return `${profile.first_name} ${profile.last_name ?? ""} - ${profile.email || profile.id}`;
                    }
                    return profile.email || profile.id;
                  };
                  return (
                    <SelectItem key={profile.id} value={profile.id}>
                      {display()}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {profilesError && (
              <p className="mt-1 text-xs text-red-400">
                Error: {profilesError.message}
              </p>
            )}
          </div>

          {/* Host 2 - Optional, only show if Host 1 is selected */}
          {formData.host_1_id && (
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
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, host_2_id: value === "none" ? null : value }))
                    }
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a second host" />
                  </SelectTrigger>
                <SelectContent className="z-[70]">
                  <SelectItem value="none">No second host</SelectItem>
                  {profiles?.map((profile) => {
                    // Don't show the same profile as host 1
                    if (profile.id === formData.host_1_id) return null;
                    const display = () => {
                      if (profile.first_name) {
                        return `${profile.first_name} ${profile.last_name ?? ""} - ${profile.email || profile.id}`;
                      }
                      return profile.email || profile.id;
                    };
                    return (
                      <SelectItem key={profile.id} value={profile.id}>
                        {display()}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Host 3 - Optional, only show if Host 2 is selected */}
          {formData.host_1_id && formData.host_2_id && (
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
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, host_3_id: value === "none" ? null : value }))
                    }
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a third host" />
                  </SelectTrigger>
                <SelectContent className="z-[70]">
                  <SelectItem value="none">No third host</SelectItem>
                  {profiles?.map((profile) => {
                    // Don't show the same profiles as host 1 or 2
                    if (profile.id === formData.host_1_id || profile.id === formData.host_2_id) return null;
                    const display = () => {
                      if (profile.first_name) {
                        return `${profile.first_name} ${profile.last_name ?? ""} - ${profile.email || profile.id}`;
                      }
                      return profile.email || profile.id;
                    };
                    return (
                      <SelectItem key={profile.id} value={profile.id}>
                        {display()}
                      </SelectItem>
                    );
                  })}
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
                  {SessionAgesEnum.map((age) => (
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
