import { ProfileFormData } from './schemas/profile'

import { DbProfile } from '@/types/database/dbTypeAliases'

export const requiredProfileFields: (keyof ProfileFormData)[] = [
  'first_name',
  'bringing_kids',
  'opted_in_to_homepage_display',
  'minor',
]

export const profileIsIncomplete = (profile: DbProfile) => {
  return requiredProfileFields.some((field) => profile[field] === null)
}
