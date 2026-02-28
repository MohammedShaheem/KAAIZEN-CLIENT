import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWorkouts,
    createWorkout,
    fetchWorkoutDetail,
    updateWorkout,
    deleteWorkout } from "@/services/admin/workouts/workoutvideos";


export function useWorkouts(page = 1) {
  return useQuery({
    queryKey: ["workouts", page],
    queryFn: () => fetchWorkouts(page),
    keepPreviousData: true,
  });
}

export function useWorkoutDetail(id) {
  return useQuery({
    queryKey: ["workoutDetail", id],
    queryFn: () => fetchWorkoutDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkout,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
    },
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateWorkout(id, data),

    onSuccess: (data, variables) => {
      const { id } = variables;

      // update detail cache instantly
      queryClient.setQueryData(
        ["workoutDetail", id],
        data
      );

      // refresh list
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkout,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
    },
  });
}