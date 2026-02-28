import api from "@/api/axios";

export const saveDeviceToken = async (token) => {
  try {
    const response = await api.post("/api/save-device-token/", {
      token,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to save device token"
    );
  }
};