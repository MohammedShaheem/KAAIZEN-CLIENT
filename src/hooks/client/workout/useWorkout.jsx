import { useQuery } from "@tanstack/react-query";
import { getWorkoutCategories,getcategoryDetail } from "@/services/client/workouts";

export function useWorkoutCategories(page) {
  return useQuery({
    queryKey: ["workoutCategories", page],
    queryFn: () => getWorkoutCategories(page),
    staleTime: 1000 * 60 * 5,
    // for keeping old page while loading new page
    keepPreviousData: true, 
  });
}

export function useCategoryDetail(categoryId, page) {
  return useQuery({
    queryKey: ["categoryDetail", categoryId, page],
    queryFn: () => getcategoryDetail(categoryId, page),
     // don't run until ID exists
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
}