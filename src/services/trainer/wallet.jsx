import api from "@/api/axios";

const BASE = "/api/trainer/wallet";

export const getTrainerWalletSummary = async () => {
  try {
    const response = await api.get(`${BASE}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch wallet summary"
    );
  }
};

export const getTrainerWalletTransactions = async (params = {}) => {
  try {
    const response = await api.get(`${BASE}/transactions/`, { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch transactions"
    );
  }
};