'use client'

import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import {
  ProfileFormData,
  initialProfileFormData,
  profileFormSchema,
} from '@/lib/schemas/profile'

import { URLS } from '@/utils/urls'

import { Modal } from '@/components/Modal'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { updateCurrentUserProfile } from '@/app/actions/db/users'

import { DbProfile } from '@/types/database/dbTypeAliases'

interface ProfileInfoModalProps {
  onClose: () => void
  currentProfile: DbProfile | null | undefined
  currentUserId?: string
}

export function ProfileInfoModal({
  onClose,
  currentProfile,
  currentUserId,
}: ProfileInfoModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<ProfileFormData>(
    currentProfile ?? initialProfileFormData,
  )

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateCurrentUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'profile', currentUserId],
      })
      toast.success('Profile updated successfully!')
      onClose()
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    },
  })

  // Dismiss modal mutation
  const dismissModalMutation = useMutation({
    mutationFn: () =>
      updateCurrentUserProfile({
        data: { dismissed_info_request: true },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'profile', currentUserId],
      })
      toast.success("You won't be prompted again")
      onClose()
    },
    onError: (error) => {
      console.error('Error dismissing modal:', error)
      toast.error('Failed to dismiss modal')
    },
  })

  const handleSave = () => {
    const result = profileFormSchema.safeParse(formData)
    if (!result.success) {
      toast.error('Error saving profile: ' + result.error.message)
      return
    }

    updateProfileMutation.mutate({
      data: result.data,
    })
  }

  const handleDismiss = () => {
    dismissModalMutation.mutate()
  }

  const isSaving =
    updateProfileMutation.isPending || dismissModalMutation.isPending

  return (
    <Modal onClose={onClose}>
      <div className="bg-card mx-4 w-full max-w-md rounded-lg p-6">
        <h2 className="mb-1 text-2xl font-bold">Complete Your Profile</h2>
        <p className="text-muted-foreground mb-6">
          We need some basic profile information
        </p>

        <div className="space-y-4">
          {/* Name Fields */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Name<span className="text-lg text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="First (required)"
                value={formData.first_name ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    first_name: e.target.value || null,
                  }))
                }
              />
              <Input
                placeholder="Last"
                value={formData.last_name ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    last_name: e.target.value || null,
                  }))
                }
              />
            </div>
          </div>

          {/* Homepage Display Radio Group */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Allow your profile card to be displayed on the homepage attendee
              list? (opt-in)<span className="text-lg text-red-500">*</span>
            </label>
            <RadioGroup
              value={
                formData.opted_in_to_homepage_display === null
                  ? ''
                  : formData.opted_in_to_homepage_display
                    ? 'yes'
                    : 'no'
              }
              onValueChange={(value) => {
                const newValue =
                  value === 'yes' ? true : value === 'no' ? false : null
                setFormData((prev) => ({
                  ...prev,
                  opted_in_to_homepage_display: newValue,
                }))
              }}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="homepage-yes-modal" />
                <label htmlFor="homepage-yes-modal" className="text-sm">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="homepage-no-modal" />
                <label htmlFor="homepage-no-modal" className="text-sm">
                  No
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Minor Checkbox */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Are you 18 or older?
              <span className="text-lg text-red-500">*</span>
            </label>
            <RadioGroup
              value={
                formData.minor === null ? '' : formData.minor ? 'no' : 'yes'
              }
              onValueChange={(value) => {
                const newValue =
                  value === 'yes' ? false : value === 'no' ? true : null
                setFormData((prev) => ({ ...prev, minor: newValue }))
              }}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="age-yes-modal" />
                <label htmlFor="age-yes-modal" className="text-sm">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="age-no-modal" />
                <label htmlFor="age-no-modal" className="text-sm">
                  No
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Kids Radio Group */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Are you bringing any children?
              <span className="text-lg text-red-500">*</span>
            </label>
            <RadioGroup
              value={
                formData.bringing_kids === null
                  ? ''
                  : formData.bringing_kids
                    ? 'yes'
                    : 'no'
              }
              onValueChange={(value) => {
                const newValue =
                  value === 'yes' ? true : value === 'no' ? false : null
                setFormData((prev) => ({ ...prev, bringing_kids: newValue }))
              }}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="kids-yes-modal" />
                <label htmlFor="kids-yes-modal" className="text-sm">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="kids-no-modal" />
                <label htmlFor="kids-no-modal" className="text-sm">
                  No
                </label>
              </div>
            </RadioGroup>
          </div>

          {formData.bringing_kids && (
            <Link
              className={`h-auto py-3 text-center break-words whitespace-normal ${buttonVariants({ variant: 'default' })}`}
              href={URLS.CHILDREN_REGISTRATION}
              target="_blank"
            >
              <div className="flex flex-col items-center gap-1">
                <span>If you haven&apos;t, please fill out</span>
                <span className="flex items-center gap-1">
                  the children registration form{' '}
                  <ExternalLinkIcon className="mt-1 h-4 w-4" />
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </Button>

          <Button
            variant="outline"
            onClick={handleDismiss}
            disabled={isSaving}
            className="w-full"
          >
            {dismissModalMutation.isPending
              ? 'Dismissing...'
              : 'Stop prompting me for this'}
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            className="w-full"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </Modal>
  )
}
