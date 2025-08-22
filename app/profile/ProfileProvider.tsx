import { createClient } from "@/utils/supabase/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Profile from "./Profile";
import { getCurrentUser, getCurrentUserProfile } from "../actions/db/users";

export default async function ProfileProvider() {
  const queryClient = new QueryClient();

  // Get current user first
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) {
    // Prefetch user data server-side
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["users", "current"],
        queryFn: getCurrentUser,
      }),
      queryClient.prefetchQuery({
        queryKey: ["users", "profile", user.id],
        queryFn: () => getCurrentUserProfile({}),
      }),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile />
    </HydrationBoundary>
  );
}
