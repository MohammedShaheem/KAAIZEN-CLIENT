import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getDailySummary, getMealEntries } from "@/services/client/meals"
import { getMealAllocations,createMealEntry } from "@/services/client/meals"

// fetch daily summary
export function useDailySummary(date) {
  return useQuery({
    queryKey: ["dailySummary", date],
    queryFn: () => getDailySummary(date),
    enabled: !!date, 
    staleTime: 1000 * 60 * 5, 
  })
}


// fetch meal logs
export function useMealEntries(date) {
  return useQuery({
    queryKey: ["mealEntries", date],
    queryFn: () => getMealEntries(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  })
}

// meal allocations
export function useMealAllocations() {
  return useQuery({
    queryKey: ["mealAllocations"],
    queryFn: getMealAllocations,
    staleTime: 1000 * 60 * 5,
  })
}


// for allocating meals
export function useLogMeal(date) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) =>
      createMealEntry({ ...data, date_eaten: date }),

    onSuccess: () => {
      // for refreshing related data automatically
      queryClient.invalidateQueries({ queryKey: ["dailySummary", date] })
      queryClient.invalidateQueries({ queryKey: ["mealEntries", date] })
    },
  })
}
