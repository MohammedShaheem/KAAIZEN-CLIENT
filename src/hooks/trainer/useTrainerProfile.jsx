import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTrainerProfile,createTrainerProfile,updateTrainerProfile } from "@/services/trainer/trainers"


export function useTrainerProfile() {
  return useQuery({
    queryKey: ["trainerProfile"],
    queryFn: getTrainerProfile,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTrainerProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTrainerProfile,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["trainerProfile"] })
    },
  })
}
 
export function useUpdateTrainerProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTrainerProfile,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["trainerProfile"] })
    },
  })
}
