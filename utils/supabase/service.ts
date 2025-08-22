import { createClient } from '@supabase/supabase-js'

import { Database } from '@/types/database/supabase.types'

const serviceRoleSecret = process.env.SUPABASE_SECRET_KEY
export function createServiceClient() {
  if (!serviceRoleSecret) {
    throw new Error('SUPABASE_SECRET_KEY is not set')
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleSecret,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  )
}
