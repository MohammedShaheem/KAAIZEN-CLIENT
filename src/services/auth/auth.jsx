import api from "@/api/axios";


export const csrfRequest = () => api.get("/api/auth/csrf/");
export const loginRequest = (payload) => api.post("/api/auth/login/", payload);
export const clientsignupRequest = (payload) => api.post("/api/auth/client_signup/", payload);
export const trainersignupRequest = (payload) => api.post("/api/auth/trainer_signup/", payload);
export const verifyOtpRequest = (payload) => api.post("/api/auth/verify-otp/", payload);
export const meRequest = () => api.get("/api/auth/me/");
export const refreshRequest = () => api.post("/api/auth/refresh/");
export const logoutRequest = () => api.post("/api/auth/logout/");
export const forgotPasswordRequest = (payload) => api.post("/api/auth/forgot-password/",payload);
export const verifyResetOtpRequest = (payload) => api.post("/api/auth/verify-reset-otp/",payload);
export const resetPasswordRequest = (payload) => api.post("/api/auth/reset-password/",payload);
export const resendresetotp = (payload) => api.post("/api/auth/resend-otp/",payload)
export const resendSignupOtp = (payload) => api.post("/api/auth/signup/resend-otp/",payload)
export const googleAuth = (payload) => api.post("/api/auth/google-auth",payload)