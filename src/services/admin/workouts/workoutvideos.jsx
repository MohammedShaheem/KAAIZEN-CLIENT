import api from "@/api/axios";

export const fetchWorkouts = (page = 1) =>
  api.get(`/api/admin/workouts/workouts/?page=${page}`);


export const createWorkout = (data) =>
  api.post(`/api/admin/workouts/workouts/`, data);


export const fetchWorkoutDetail = (id) =>
  api.get(`/api/admin/workouts/workouts/${id}/`);


export const updateWorkout = (id, data) =>
  api.patch(`/api/admin/workouts/workouts/${id}/`, data);


export const deleteWorkout = (id) =>
  api.delete(`/api/admin/workouts/workouts/${id}/`);
