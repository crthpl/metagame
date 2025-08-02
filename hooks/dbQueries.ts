import { getCurrentUser } from "@/app/actions/db/users";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: currentUser, isLoading: currentUserLoading, isError: currentUserError } = useQuery({
    queryKey: ['users', 'current'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true,
    retry: 1
  })

  return { currentUser, currentUserLoading, currentUserError }
};