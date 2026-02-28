import api from "../../api/axios";

export const getTrainerProfile = async () => {
  try {
    const response = await api.get("/api/trainers/me/profile");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(error.response?.data?.detail || "Failed to fetch profile");
  }
};

export const createTrainerProfile = (data) => {
  return api.post("/api/trainers/me/profile/", data);
};

export const updateTrainerProfile = async (data) => {
  try {
    const response = await api.patch("/api/trainers/me/profile/", data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(error.response?.data?.detail || "Profile not found");
    }
    throw new Error(error.response?.data?.detail || "Failed to update profile");
  }
};

export const getTrainerDashboard = async () => {
  const response = await api.get("/api/trainers/dashboard/");
  return response.data;
};

export const getTrainerLeaves = async () => {
  const { data } = await api.get("/api/trainers/leave/");
  return data ?? [];
};

export const createTrainerLeave = async (payload) => {
  const { data } = await api.post("/api/trainers/leave/", payload);
  return data;
};