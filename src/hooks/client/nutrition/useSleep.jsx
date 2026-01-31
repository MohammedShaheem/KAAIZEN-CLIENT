import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { logSleep,getSleepHistory } from "@/services/client/sleep"

export function useLogSleep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logSleep,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["weekly-sleep-report"] })
    }
  })
}

export function useWeeklySleepReport() {
  return useQuery({
    queryKey: ["weekly-sleep-report"],
    queryFn: getSleepHistory,
    staleTime: 1000 * 60 * 5
  })
}
