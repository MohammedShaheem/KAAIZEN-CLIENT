import api from "../../api/axios";

export const getClientProfile = async () => {
  try {
    const response = await api.get("/api/client/me/profile");
    return response.data;
  } catch(error) {  
    if (error.response?.status === 404) {
      return null;
      
    }
    throw new Error(error.response?.data?.detail || "Failed to fetch profile");

  }
};


export const createClientProfile = (data) => {
  return api.post("/api/client/me/profile/", data);
};


export const updateClientProfile = async (data) => {
  try {
      const response = await api.patch(
        "/api/client/me/profile/",
        data
      )
    return response.data;
  }catch (error){
    if (error.response?.status === 404) {
      throw new Error(error.response?.data?.detail || "Profile not found")
    }
    throw new Error(error.response?.data?.detail || "Failed to update profile");
  }
};