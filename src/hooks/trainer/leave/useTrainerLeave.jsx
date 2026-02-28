import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrainerLeaves,createTrainerLeave } from "@/services/trainer/trainers";

export function useTrainerLeaves() {
  return useQuery({
    queryKey: ["trainer", "leaves"],
    queryFn: getTrainerLeaves,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 500 && failureCount < 2) {
        return true;
      }
      return false;
    },
  });
}

export function useCreateTrainerLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrainerLeave,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainer", "leaves"],
      });
    },
  });
}
