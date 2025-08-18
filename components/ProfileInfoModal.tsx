'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Modal } from '@/components/Modal'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCurrentUserProfile } from '@/app/actions/db/users'
import { ProfileFormData, profileFormSchema } from '@/lib/schemas/profile'
import { DbProfile } from '@/types/database/dbTypeAliases'

interface ProfileInfoModalProps {
  onClose: () => void
  currentProfile: DbProfile | null | undefined
  currentUserId?: string
}

export function ProfileInfoModal({ 
  onClose, 
  currentProfile, 
  currentUserId 
}: ProfileInfoModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<ProfileFormData>(() => 
    profileFormSchema.parse(currentProfile)
  )

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateCurrentUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile', currentUserId] })
      toast.success('Profile updated successfully!')
      onClose()
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  })

  // Dismiss modal mutation
  const dismissModalMutation = useMutation({
    mutationFn: () => updateCurrentUserProfile({
      data: { dismissed_info_request: true }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile', currentUserId] })
      toast.success('You won\'t be prompted again')
      onClose()
    },
    onError: (error) => {
      console.error('Error dismissing modal:', error)
      toast.error('Failed to dismiss modal')
    }
  })

  const handleSave = () => {
    const result = profileFormSchema.safeParse(formData)
    if (!result.success) {
      toast.error('Please check your form data')
      return
    }
    
    updateProfileMutation.mutate({
      data: result.data
    })
  }

  const handleDismiss = () => {
    dismissModalMutation.mutate()
  }

  const isSaving = updateProfileMutation.isPending || dismissModalMutation.isPending

  return (
    <Modal onClose={onClose}>
      <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <p className="text-muted-foreground mb-6">
          Fill out more profile details!
        </p>

        <div className="space-y-4">
          {/* Name Fields */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="First name"
                value={formData.first_name ?? ''}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value || null}))}
              />
              <Input
                placeholder="Last name"
                value={formData.last_name ?? ''}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value || null}))}
              />
            </div>
          </div>

          {/* Discord Handle */}
          <div>
            <label className="block text-sm font-medium mb-2">Discord Handle</label>
            <Input
              placeholder="Your Discord handle"
              value={formData.discord_handle ?? ''}
              onChange={(e) => setFormData(prev => ({ ...prev, discord_handle: e.target.value || null}))}
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <div className="space-y-2">
              <Input
                placeholder="Website name"
                value={formData.site_name ?? ''}
                onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value || null}))}
              />
              <Input
                placeholder="Website URL"
                value={formData.site_url ?? ''}
                onChange={(e) => setFormData(prev => ({ ...prev, site_url: e.target.value || null}))}
              />
            </div>
          </div>

          {/* Homepage Display Radio Group */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Allow my profile card to be displayed on the homepage attendee list (opt-in)</label>
            <RadioGroup
              value={formData.opted_in_to_homepage_display === null ? '' : formData.opted_in_to_homepage_display ? 'yes' : 'no'}
              onValueChange={(value) => {
                const newValue = value === 'yes' ? true : value === 'no' ? false : null
                setFormData(prev => ({ ...prev, opted_in_to_homepage_display: newValue }))
              }}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="homepage-yes-modal" />
                <label htmlFor="homepage-yes-modal" className="text-sm">Yes</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="homepage-no-modal" />
                <label htmlFor="homepage-no-modal" className="text-sm">No</label>
              </div>
            </RadioGroup>
          </div>

          {/* Minor Checkbox */}
          <div className="space-y-3">
            Are you 18 or older?
            <RadioGroup
              value={formData.minor === null ? '' : formData.minor ? 'no' : 'yes'}
              onValueChange={(value) => {
                const newValue = value === 'yes' ? false : value === 'no' ? true : null
                setFormData(prev => ({ ...prev, minor: newValue }))
              }}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="age-yes-modal" />
                <label htmlFor="age-yes-modal" className="text-sm">Yes</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="age-no-modal" />
                <label htmlFor="age-no-modal" className="text-sm">No</label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-6">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            disabled={isSaving}
            className="w-full"
          >
            {dismissModalMutation.isPending ? 'Dismissing...' : 'Stop prompting me for this'}
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
