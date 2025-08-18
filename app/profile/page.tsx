'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '@/hooks/dbQueries'
import { updateCurrentUserProfile, deleteCurrentUserProfilePicture } from '@/app/actions/db/users'
import { getCurrentUserProfilePictureUploadUrl } from '@/app/actions/db/storage'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { CheckIcon, InfoIcon, LinkIcon, XIcon } from 'lucide-react'
import { toExternalLink, uploadFileWithSignedUrl } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { ProfileFormData, initialProfileFormData, profileFormSchema } from '@/lib/schemas/profile'
import { ProfileInfoModal } from '@/components/ProfileInfoModal'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'


export default function Profile() {
  const { currentUser, currentUserProfile, currentUserLoading } = useUser()
  const [isEditMode, setIsEditMode] = useState(false)
  const [showCTAModal, setShowCTAModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  
  // Form state using shared schema
  const [formData, setFormData] = useState<ProfileFormData>(initialProfileFormData)

  // Update form data when profile loads
  useEffect(() => {
    if (currentUserProfile && !isEditMode) {
      setFormData(profileFormSchema.parse(currentUserProfile))
    }
  }, [currentUserProfile, isEditMode])

  // Check if modal should be shown
  useEffect(() => {
    if (currentUserProfile &&
      !currentUserProfile.dismissed_info_request &&
      !isEditMode &&
      (!currentUserProfile.first_name || currentUserProfile.opted_in_to_homepage_display === null)
    ) {
      setShowCTAModal(true)
    }
  }, [currentUserProfile, isEditMode])

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateCurrentUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile', currentUser?.id] })
      setIsEditMode(false)
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  })

  // Profile picture upload mutation
  const uploadPictureMutation = useMutation({
    mutationFn: async (file: File) => {
      // Get signed URL from server
      if (!currentUser?.id) {
        throw new Error('User not found')
      }
      
      // Extract file extension from the uploaded file
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || null
      
      const {signedUrl, storageUrl} = await getCurrentUserProfilePictureUploadUrl({ fileExtension })
      // Upload file directly to storage using signed URL
      await uploadFileWithSignedUrl(signedUrl, file)
      
      // Update profile with new picture URL directly without triggering the profile update mutation
      await updateCurrentUserProfile({
        data: {
          profile_pictures_url: storageUrl + '?v=' + Date.now()
        }
      })
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile', currentUser?.id] })
      toast.success('Profile picture updated successfully!')
    },
    onError: (error) => {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload profile picture')
    }
  })

  // Profile picture delete mutation
  const deletePictureMutation = useMutation({
    mutationFn: async () => {
      await deleteCurrentUserProfilePicture()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile', currentUser?.id] })
      toast.success('Profile picture removed successfully!')
    },
    onError: (error) => {
      console.error('Error removing image:', error)
      toast.error('Failed to remove profile picture')
    }
  })

  if (currentUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    updateProfileMutation.mutate({
      data: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        discord_handle: formData.discord_handle,
        site_name: formData.site_name,
        site_url: formData.site_url,
        opted_in_to_homepage_display: formData.opted_in_to_homepage_display,
        minor: formData.minor,
      }
    })
  }

  const handleCancel = () => {
    setFormData(profileFormSchema.parse(currentUserProfile))
    setIsEditMode(false)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    uploadPictureMutation.mutate(file)
  }

  const handleRemoveImage = async () => {
    deletePictureMutation.mutate()
  }

  const fullName = `${currentUserProfile?.first_name || ''} ${currentUserProfile?.last_name || ''}`.trim() || 'No name set'
  const isSaving = updateProfileMutation.isPending || uploadPictureMutation.isPending || deletePictureMutation.isPending

  return (
    <>
      {showCTAModal && 
        <ProfileInfoModal 
          onClose={() => setShowCTAModal(false)}
          currentProfile={currentUserProfile}
          currentUserId={currentUser?.id}
        />
      }
      
      <div className="container mx-auto px-4 py-8 max-w-md md:max-w-4xl flex flex-col items-center">
      <div className="flex w-full justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        {!isEditMode ? (
          <Button onClick={() => setIsEditMode(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border border-border-primary p-6 w-full" >
        <div className="flex flex-col md:flex-row gap-8  items-center">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {currentUserProfile?.profile_pictures_url ? (
                <Image
                  src={currentUserProfile.profile_pictures_url}
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="rounded-full object-cover aspect-square"
                />
              ) : (
                <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-2xl text-muted-foreground">
                    {fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {isEditMode && (
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                >
                  Upload Photo
                </Button>
                {currentUserProfile?.profile_pictures_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isSaving}
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Profile Information Section */}
          <div className="flex-1 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              {isEditMode ? (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="First name"
                    value={formData.first_name ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value || null }))}
                  />
                  <Input
                    placeholder="Last name"
                    value={formData.last_name ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value || null }))}
                  />
                </div>
              ) : (
                <p className="text-lg">{fullName}</p>
              )}
            </div>

            {/* Discord Handle */}
            <div>
              <label className="label">
                <span className="label-text">Discord Handle</span>
              </label>
              {isEditMode ? (
                <Input
                  placeholder="Your Discord handle"
                  value={formData.discord_handle ?? ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, discord_handle: e.target.value || null }))}
                />
              ) : (
                <p className="text-lg">
                  {currentUserProfile?.discord_handle || 'Not set'}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="label">
                <span className="label-text">Website</span>
              </label>
              {isEditMode ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Website name"
                    value={formData.site_name ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value || null }))}
                  />
                  <Input
                    placeholder="Website URL"
                    value={formData.site_url ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_url: e.target.value || null }))}
                  />
                </div>
              ) : (
                <div>
                  {currentUserProfile?.site_name && currentUserProfile?.site_url ? (
                    <a
                      href={toExternalLink(currentUserProfile.site_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-2"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {currentUserProfile.site_name}
                      <span className="text-gray-400">{currentUserProfile.site_url}</span>
                    </a>
                  ) : (
                    <p className="text-lg">Not set</p>
                  )}
                </div>
              )}
            </div>


            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <p className="text-lg">{currentUserProfile?.email || currentUser.email}</p>
              {isEditMode && (
                <Link href="/profile/change-email">
                  <div className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    Change Email
                  </div>
                </Link>
              )}
            </div>
            <div className={`flex gap-4 ${isEditMode ? 'flex-col' : ''}`}>
              {/* Homepage Display Radio Group */}
              <div className="flex gap-2 items-center">
                <span className="flex items-center gap-1">
                  <label className="block text-sm font-medium">Show on Homepage?</label>
                  <Tooltip clickable>
                    <TooltipTrigger>
                      <InfoIcon className="size-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Whether your profile card is displayed on the homepage attendee list. Opt-in.
                    </TooltipContent>
                  </Tooltip>
                </span>
                {isEditMode ? (
                  <RadioGroup
                    value={formData.opted_in_to_homepage_display === null ? '' : formData.opted_in_to_homepage_display ? 'yes' : 'no'}
                    onValueChange={(value) => {
                      const newValue = value === 'yes' ? true : value === 'no' ? false : null
                      setFormData(prev => ({ ...prev, opted_in_to_homepage_display: newValue }))
                    }}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="homepage-yes" />
                      <label htmlFor="homepage-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="homepage-no" />
                      <label htmlFor="homepage-no" className="text-sm">No</label>
                    </div>
                  </RadioGroup>
                ) : (
                  <p className="text-lg">
                    {currentUserProfile?.opted_in_to_homepage_display === null
                      ? 'Default opted out'
                      : currentUserProfile?.opted_in_to_homepage_display
                        ? <CheckIcon className="w-4 h-4 text-green-500" />
                        : <XIcon className="w-4 h-4 text-red-500" />
                    }
                  </p>
                )}
              </div>
              {/* Age Status Radio Group */}
              <div className="flex gap-2 items-center">
                <label className="block text-sm font-medium">18+?</label>
                {isEditMode ? (
                  <RadioGroup
                    value={formData.minor === null ? '' : formData.minor ? 'no' : 'yes'}
                    onValueChange={(value) => {
                      const newValue = value === 'yes' ? false : value === 'no' ? true : null
                      setFormData(prev => ({ ...prev, minor: newValue }))
                    }}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="age-yes" />
                      <label htmlFor="age-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="age-no" />
                      <label htmlFor="age-no" className="text-sm">No</label>
                    </div>
                  </RadioGroup>
                ) : (
                  <p className="text-lg">
                    {currentUserProfile?.minor ? <XIcon className="w-4 h-4 text-red-500" /> : <CheckIcon className="w-4 h-4 text-green-500" /> }
                  </p>
                )}
              </div>
            </div>
            {isEditMode && (
              <div className="flex flex-col gap-2">
                <Link href="/profile/reset-password">
                  <Button variant="outline" size="sm">
                    Reset Password
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
