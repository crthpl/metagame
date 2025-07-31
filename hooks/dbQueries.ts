import { getCurrentUser } from "@/app/actions/db/users/queries";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const { data: currentUser, isLoading: currentUserLoading, isError: currentUserError } = useQuery({
    queryKey: ['users', 'current'],
    queryFn: getCurrentUser
  })

  return { currentUser, currentUserLoading, currentUserError }
};