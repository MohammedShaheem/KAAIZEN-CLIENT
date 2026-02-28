import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAIPlan,generateAIPlan } from "@/services/AIplan/AIplan"


export function useAIPlan() {
  return useQuery({
    queryKey: ["aiPlan"],
    queryFn: getAIPlan,
    staleTime: 1000 * 60 * 5,
  })
}



export function useGenerateAIPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateAIPlan,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPlan"] })
    },
  })
}
