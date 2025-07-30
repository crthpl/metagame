import { createServiceClient } from '@/utils/supabase/service';

export interface ProfileSpeaker {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  opted_in_to_homepage_display: boolean | null;
  homepage_order: number | null;
  site_name: string | null;
  site_url: string | null;
  site_name_2: string | null;
  site_url_2: string | null;
  profile_pictures_url: string | null;
}

export async function getSpeakersFromProfiles(): Promise<ProfileSpeaker[]> {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      last_name,
      email,
      opted_in_to_homepage_display,
      homepage_order,
      site_name,
      site_url,
      site_name_2,
      site_url_2,
      profile_pictures_url
    `)
    .eq('opted_in_to_homepage_display', true)
    .order('homepage_order', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching speakers from profiles:', error);
    throw new Error(`Failed to fetch speakers: ${error.message}`);
  }

  return data || [];
} 