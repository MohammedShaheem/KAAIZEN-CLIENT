import api from "@/api/axios";

export const getDailySummary = async (date) => {
  try {
    const response = await api.get(`/api/nutrition/daily-summary/${date}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch daily summary");
  }
};

export const getMealEntries = async (date) => {
  try {
    const response = await api.get(`/api/nutrition/meal-entries/${date}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch meal entries");
  }
};

export const getMealAllocations = async () => {
  try {
    const response = await api.get("/api/client/meal-allocations/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch meal allocations");
  }
};

export const createMealEntry = async (data) => {
  try {
    const response = await api.post("/api/nutrition/meal-entries/", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to create meal entry");
  }
};