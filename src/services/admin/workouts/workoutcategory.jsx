import api from "@/api/axios";


export const fetchWorkoutCategories = (page = 1) =>
  api.get(`/api/admin/workouts/categories/?page=${page}`);


export const createWorkoutCategory = (data) =>
  api.post(`/api/admin/workouts/categories/`, data);


export const fetchWorkoutCategoryDetail = (id) =>
  api.get(`/api/admin/workouts/categories/${id}/`);


export const updateWorkoutCategory = (id, data) =>
  api.patch(`/api/admin/workouts/categories/${id}/`, data);


export const deleteWorkoutCategory = (id) =>
  api.delete(`/api/admin/workouts/categories/${id}/`);
