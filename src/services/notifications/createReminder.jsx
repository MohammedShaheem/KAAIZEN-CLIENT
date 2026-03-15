import api from "@/api/axios";


export const createReminder = async (data) => {
  try {
    const response = await api.post(
      "/api/notification/create-reminder/",
      data
    );

    return response.data;

  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      "Failed to create reminder";

    throw new Error(message);
  }
};