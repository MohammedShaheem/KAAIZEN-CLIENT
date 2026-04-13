import api from "@/api/axios";

export const getPlan = async () => {
  try {
    const response = await api.get("/api/personaltraining/admin/training-plans/");
    return response.data;
  } catch(error) {  
    if (error.response?.status === 404) {
      return null;
      
    }
    throw new Error(error.response?.data?.detail || "Failed to fetch profile");

  }
};


export const createPlan = async (data) => {
  try {
    const response = await api.post("/api/personaltraining/admin/training-plans/", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to create plan");
  }
};

export const getPlanDetail = async (planId) => {
  try {
    const response = await api.get(
      `/api/personaltraining/admin/training-plans/${planId}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch plan details"
    );
  }
};
export const updatePlanStatus = async ({ planId, isActive }) => {
  const response = await api.patch(
    `/api/personaltraining/admin/training-plans/${planId}/`,
    { is_active: isActive }
  );
  return response.data;
};


