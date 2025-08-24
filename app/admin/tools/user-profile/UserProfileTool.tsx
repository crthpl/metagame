import { ProfileDataCollapsible } from './ProfileDataCollapsible'
import { UserSelector } from './UserSelector'
import Image from 'next/image'

import { Card } from '@/components/Card'

import { adminGetAllTickets } from '@/app/actions/db/tickets'
import { adminGetAllProfiles } from '@/app/actions/db/users'

interface UserProfileToolProps {
  searchParams?: Promise<{ user_id?: string }>
}

export default async function UserProfileTool({
  searchParams,
}: UserProfileToolProps) {
  const profiles = await adminGetAllProfiles()
  const tickets = await adminGetAllTickets()
  const params = searchParams ? await searchParams : {}
  const { user_id } = params
  const selectedProfile = user_id
    ? profiles.find((p) => p.id === user_id)
    : null
  const userTickets = selectedProfile
    ? tickets.filter((t) => t.owner_id === selectedProfile.id)
    : []

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <UserSelector users={profiles} selectedUserId={user_id} />

        {selectedProfile && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Profile Details</h3>
                <div className="flex gap-2">
                  {selectedProfile.is_admin && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-md">
                      Admin
                    </span>
                  )}
                  {selectedProfile.minor && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">
                      Minor
                    </span>
                  )}
                  {selectedProfile.bringing_kids && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                      Bringing Kids
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <strong>Name:</strong>
                  <p>
                    {selectedProfile.first_name || ''}{' '}
                    {selectedProfile.last_name || ''}{' '}
                    {!selectedProfile.first_name &&
                      !selectedProfile.last_name &&
                      'Not provided'}
                  </p>
                </div>
                <div>
                  <strong>Email:</strong>
                  <p>{selectedProfile.email || 'Not provided'}</p>
                </div>
                <div>
                  <strong>Discord Handle:</strong>
                  <p>{selectedProfile.discord_handle || 'Not provided'}</p>
                </div>
                <div>
                  <strong>Tickets:</strong>
                  <p>{userTickets.length}</p>
                </div>
                <div>
                  <strong>ID:</strong>
                  <p className="font-mono text-sm break-all">
                    {selectedProfile.id}
                  </p>
                </div>
                {selectedProfile.profile_pictures_url && (
                  <div>
                    <strong>Profile Picture:</strong>
                    <Image
                      src={selectedProfile.profile_pictures_url}
                      alt="Profile"
                      className="mt-1 w-16 h-16 object-cover rounded-full"
                      width={64}
                      height={64}
                    />
                  </div>
                )}
              </div>

              {(selectedProfile.site_name || selectedProfile.site_url) && (
                <div>
                  <strong>Website 1:</strong>
                  <div className="flex gap-2 items-center">
                    <p>{selectedProfile.site_name || 'Unnamed'}</p>
                    {selectedProfile.site_url && (
                      <a
                        href={selectedProfile.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Visit
                      </a>
                    )}
                  </div>
                </div>
              )}

              {(selectedProfile.site_name_2 || selectedProfile.site_url_2) && (
                <div>
                  <strong>Website 2:</strong>
                  <div className="flex gap-2 items-center">
                    <p>{selectedProfile.site_name_2 || 'Unnamed'}</p>
                    {selectedProfile.site_url_2 && (
                      <a
                        href={selectedProfile.site_url_2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Visit
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <strong>Status:</strong>
                  <div className="flex gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">Homepage:</span>
                      {selectedProfile.opted_in_to_homepage_display === true ? (
                        <span className="text-green-500">✓</span>
                      ) : selectedProfile.opted_in_to_homepage_display ===
                        false ? (
                        <span className="text-red-500">✗</span>
                      ) : (
                        <span className="text-gray-500">−</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">18+:</span>
                      {selectedProfile.minor === false ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">Bringing Kids:</span>
                      {selectedProfile.bringing_kids ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <strong>Info Request:</strong>
                  <p>
                    {selectedProfile.dismissed_info_request
                      ? 'Dismissed'
                      : 'Not Dismissed'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedProfile && (
          <ProfileDataCollapsible
            profile={selectedProfile}
            tickets={userTickets}
          />
        )}

        {!selectedProfile && user_id && (
          <Card className="p-6">
            <p className="text-center text-gray-500">
              User with ID &quot;{user_id}&quot; not found.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
