import { createClient } from "@/utils/supabase/server";
import Schedule from "./Schedule";


export default async function ScheduleDemo() {
  const supabase = await createClient();
  const { data: sessions, error: sessionsError } = await supabase.from('sessions_view').select('*');
  const { data: locations, error: locationsError } = await supabase.from('locations').select('*');

  if (sessionsError || locationsError || !sessions || !locations) {
    console.error(sessionsError, locationsError);
    return <div>Error loading sessions or locations</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-secondary-200 mb-8 text-center">
          Conference Schedule Demo
        </h1>
        <Schedule sessions={sessions || []} locations={locations || []} />
      </div>
    </div>
  );
} 