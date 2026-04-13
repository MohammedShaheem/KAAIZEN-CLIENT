import api from "@/api/axios";
const BASE = "/api/client/wallet";

export const getClientWalletSummary = async () => {
  try {
    const response = await api.get(`${BASE}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch wallet summary"
    );
  }
};

export const getClientWalletTransactions = async (params = {}) => {
  try {
    const response = await api.get(`${BASE}/transactions/`, { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch transactions"
    );
  }
};