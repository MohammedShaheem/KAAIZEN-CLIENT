import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getClientProfile,createClientProfile,updateClientProfile } from "@/services/client/clients"

// Fetch client profile
export function useClientProfile() {
  return useQuery({
    queryKey: ["clientProfile"],
    queryFn: getClientProfile,
    staleTime: 1000 * 60 * 10, 
  })
}

// Create client profile
export function useCreateClientProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createClientProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientProfile"] })
    },
  })
}

// Update client profile
export function useUpdateClientProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => updateClientProfile(data),
    onSuccess: (updatedProfile) => {
      
      queryClient.setQueryData(["clientProfile"], updatedProfile)
    },
  })
}