import { useQuery } from "@tanstack/react-query";
import { getTrainerDashboard } from "@/services/trainer/trainers";

export function useTrainerDashboard() {
  return useQuery({
    queryKey: ["trainerDashboard"],
    queryFn: getTrainerDashboard,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}
