import api from "../../api/axios";

export const getPublicPlans = async () => {
  try {
    const response = await api.get(
      "/api/personaltraining/public/training-plans/"
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }

    throw new Error(
      error.response?.data?.detail || "Failed to fetch training plans"
    );
  }
};


export const getPublicPlanDetail = async (id) => {
  try {
    const response = await api.get(
      `/api/personaltraining/training-plans/${id}/`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; 
    }

    throw new Error(
      error.response?.data?.detail || "Failed to fetch training plan details"
    );
  }
};

export const getClientPlan = async () => {
  try {
    const response = await api.get("/api/personaltraining/plan/");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw new Error(
      error.response?.data?.detail || "Failed to fetch training plans"
    );
  }
};

export const createCheckoutSession = async (values) => {
  try {
    const { data } = await api.post(
      "/api/personaltraining/payments/checkout/",
      values
    );

    return data; 

  } catch (error) {
    throw new Error(
      error.response?.data?.detail
    );
  }
};

export const createClientPlan = async (values) => {
  try {
    const response = await api.post(
      "api/personaltraining/plan/",
      values
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create training plan"
    );
  }
};

const DEFAULT_ERROR = "Something went wrong. Please try again.";


export const selectSessionType = async (values) => {
  try {
    const { data } = await api.post(
      "/api/personaltraining/session-type/",
      values
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || DEFAULT_ERROR);
  }
};


export const selectSessionSlot = async (values) => {
  try {
    const { data } = await api.post(
      "/api/personaltraining/select-slot/",
      values
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || DEFAULT_ERROR);
  }
};


export const selectTrainer = async (values) => {
  try {
    const { data } = await api.post(
      "/api/personaltraining/select-trainer/",
      values
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || DEFAULT_ERROR);
  }
};

export const selectStartDate = async (values) => {
  try {
    const { data } = await api.post(
      "/api/personaltraining/select-startdate/",
      values
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || DEFAULT_ERROR);
  }
};


export const confirmAssignment = async () => {
  try {
    const { data } = await api.post(
      "/api/personaltraining/confirm-assignment/",
      { confirm: true }
    );
    return data;
  } catch (error) {
    console.log("CONFIRM ERROR:", error.response?.data);
    throw new Error(error.response?.data?.detail || DEFAULT_ERROR);
  }
};

export const getClientCurrentPlan = async () => {
  const response = await api.get("/api/personaltraining/my-current-plan/");
  return response.data.data ?? response.data;
};



export const getTrainerSessions = async () => {
  const response = await api.get(
    "/api/personaltraining/trainers/sessions/"
  );
  return response.data;
};

export const getTrainerSessionDetail = async (sessionId) => {
  if (!sessionId) throw new Error("Session ID is required");

  const response = await api.get(
    `/api/personaltraining/trainers/sessions/${sessionId}/`
  );
  return response.data;
};

export const getSessionVideoToken = async (sessionId) => {
  if (!sessionId) {
    throw new Error("Session ID is required");
  }

  try {
    const response = await api.get(
      `/api/personaltraining/sessions/${sessionId}/video-token/`,
      {
        withCredentials: true,
      }
    
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching session video token:", error);

    const message =
      error.response?.data?.detail ||
      "Failed to fetch video token";

    throw new Error(message);
  }
};






