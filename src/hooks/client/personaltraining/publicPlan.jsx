import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublicPlans,getPublicPlanDetail } from "@/services/personal_training/PersonalTraining";
import { getClientPlan, createClientPlan } from "@/services/personal_training/PersonalTraining";
// import { clientTrainerAssignment } from "@/services/personal_training/PersonalTraining";
import { selectSessionType,selectSessionSlot,selectTrainer,confirmAssignment,} from "@/services/personal_training/PersonalTraining";
import { getClientCurrentPlan } from "@/services/personal_training/PersonalTraining";
import { selectStartDate } from "@/services/personal_training/PersonalTraining";
import { createCheckoutSession } from "@/services/personal_training/PersonalTraining";

export function usePublicPlans() {
  return useQuery({
    queryKey: ["publicTrainingPlans"], 
    queryFn: getPublicPlans,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicPlanDetail(planId) {
  return useQuery({
    queryKey: ["publicTrainingPlanDetail", planId],
    queryFn: () => getPublicPlanDetail(planId),
    enabled: !!planId, 
    staleTime: 1000 * 60 * 5,
  });
}



export function useClientPlans() {
  return useQuery({
    queryKey: ["clientPlans"],
    queryFn: getClientPlan,
    staleTime: 1000 * 60 * 5,
  });
}


export function useCreateClientPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClientPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(["clientPlans"]);
    },
  });
}


export function useSelectSessionType() {
  return useMutation({
    mutationFn: selectSessionType,
  });
}


export function useSelectSessionSlot() {
  return useMutation({
    mutationFn: selectSessionSlot,
  });
}

export function useSelectTrainer() {
  return useMutation({
    mutationFn: selectTrainer,
  });
}

export function useSelectStartDate() {
  return useMutation({
    mutationFn: selectStartDate,
  });
}

export function useConfirmAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmAssignment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["clientTrainerSessions"],
      });
    },
  });
}

export function useClientCurrentPlan() {
  return useQuery({
    queryKey: ["clientCurrentPlan"],
    queryFn: getClientCurrentPlan,
    staleTime: 1000 * 60 * 5,
    retry: false, 
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: createCheckoutSession,

    onSuccess: (data) => {
        if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
  });
}