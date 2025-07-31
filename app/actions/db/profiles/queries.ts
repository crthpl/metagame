import { createServiceClient } from '@/utils/supabase/service';


export async function getSpeakersFromProfiles() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('opted_in_to_homepage_display', true)
    .order('homepage_order', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching speakers from profiles:', error);
    throw new Error(`Failed to fetch speakers: ${error.message}`);
  }

  const dataToReturn = data.map((profile) => {
    return {
      id: profile.id,
      name: profile.first_name + ' ' + profile.last_name,
      image: profile.profile_pictures_url,
      gameName: profile.site_name,
      gameUrl: profile.site_url,
      gameName2: profile.site_name_2,
      gameUrl2: profile.site_url_2,
    }
  })

  return dataToReturn;
} 