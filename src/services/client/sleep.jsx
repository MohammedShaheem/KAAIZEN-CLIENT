import api from "@/api/axios";

export const logSleep = async (payload) => {
  const { data } = await api.post("/api/nutrition/sleep/", payload);
  return data;
};

export const getSleepHistory = async () => {
  const { data } = await api.get("/api/nutrition/sleep/weekly/");
  return data;
};
