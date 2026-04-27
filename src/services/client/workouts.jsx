import api from "@/api/axios";

export const getWorkoutCategories = async (page = 1) => {
  const { data } = await api.get(
    `/api/client/workouts/categories/?page=${page}`
  );
  return data;
};

export const getcategoryDetail = async (categoryId, page = 1) => {
  const { data } = await api.get(
    `/api/client/workouts/categories/${categoryId}/workouts/?page=${page}`
  );
  return data;
};

export const getworkoutDetail = async (workoutId) => {
  const { data } = await api.get(
    `/api/client/workouts/workouts/${workoutId}/`
  );
  return data;
};

export const startWorkoutSession = async (payload) => {
  const { data } = await api.post(
    "/api/client/workouts/sessions/start/",
    payload
  );
  return data;
};


export const sendWorkoutHeartbeat = async (payload) => {
  const { data } = await api.post(
    "/api/client/workouts/sessions/heartbeat/",
    payload
  );
  return data;
};


export const completeWorkoutSession = async (payload) => {
  const { data } = await api.post(
    "/api/client/workouts/sessions/complete/",
    payload
  );
  return data;
};

export const getRecentWorkoutSessions = async () => {
  const { data } = await api.get("/api/client/workouts/sessions/recent/");
  
  return Array.isArray(data) ? data : (data.data ?? []);
};