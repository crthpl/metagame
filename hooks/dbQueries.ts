import { getCurrentUser } from "@/app/actions/db/users";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: currentUser, isLoading: currentUserLoading, isError: currentUserError } = useQuery({
    queryKey: ['users', 'current'],
    queryFn: getCurrentUser
  })

  return { currentUser, currentUserLoading, currentUserError }
};