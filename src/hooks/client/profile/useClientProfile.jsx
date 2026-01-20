import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getClientProfile,updateClientProfile } from "@/services/client/clients"

export function useClientProfile() {
  return useQuery({
    queryKey: ["clientProfile"],
    queryFn: getClientProfile,
    // 5 minutes
    staleTime: 1000 * 60 * 5,
  })
}

// useQueryClient() is used for acessing the chache from the gobal chache,
// the useMutation is used for when mutate() with user form data here this endpoint want to work,
// if that api result sucess then by using the useQueryClient() instance can stale the current,
// user profile cache, it can trigerr the automatic profile data updae in cache.
export function useUpdateClientProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateClientProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientProfile"] })
    },
  })
}
