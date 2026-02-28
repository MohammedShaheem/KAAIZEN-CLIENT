import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlan, createPlan,getPlanDetail,updatePlanStatus } from '../../services/admin/personaltraining/PersonalTraining'

export function useClientPlans(params) {
  return useQuery({
    queryKey: ["clientPlans", params],
    queryFn: () => getPlan(params),
    keepPreviousData: true,
  });
}
export function useCreateClientPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientPlans"] });
    },
  });
}

export function useTrainingPlanDetail(planId) {
  return useQuery({
    queryKey: ["trainingPlanDetail", planId],
    queryFn: () => getPlanDetail(planId),
    enabled: !!planId, 
    staleTime: 1000 * 60 * 5, 
  });
}

export function useUpdateTrainingPlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlanStatus,

    onSuccess: (data, variables) => {
      const { planId } = variables;
      queryClient.setQueryData(
        ["trainingPlanDetail", planId],
        data
      );
      queryClient.invalidateQueries({
        queryKey: ["adminTrainingPlans"],
      });
    },
  });
}