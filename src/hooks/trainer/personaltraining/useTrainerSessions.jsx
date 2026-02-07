import { useQuery } from "@tanstack/react-query";
import { getTrainerSessions,getTrainerSessionDetail } from "@/services/personal_training/PersonalTraining";


export function useTrainerSessions() {
  return useQuery({
    queryKey: ["trainerSessions"],
    queryFn: getTrainerSessions,
    staleTime: 1000 * 60 * 5, 
    retry: false,
  });
}


export function useTrainerSessionDetail(sessionId) {
  return useQuery({
    queryKey: ["trainerSessionDetail", sessionId],
    queryFn: () => getTrainerSessionDetail(sessionId),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
