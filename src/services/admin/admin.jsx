import api from "@/api/axios";

export const fetchAdminDashboard = () => 
  api.get("/api/admin/dashboard/");

export const fetchClients = (page = 1) => 
  api.get(`/api/admin/clients/?page=${page}`);

export const fetchClientDetail = (id) => 
  api.get(`/api/admin/clients/${id}/`);

export const fetchTrainers = (page = 1) => 
  api.get(`/api/admin/trainers/?page=${page}`);

export const fetchTrainerDetail = (id) => 
  api.get(`/api/admin/trainers/${id}/`);

export const updateUserStatus = (id, is_active) => 
  api.patch(`/api/admin/users/${id}/status/`, { is_active });

export const updateTrainerStatus = (id, is_active) => 
  api.patch(`/api/admin/trainers/${id}/status/`, { is_active });

export const fetchPendingTrainerVerifications = (page = 1) =>
  api.get(`/api/admin/trainers/verification/?page=${page}`);

export const verifyTrainer = (id, approve) =>
  api.patch(
    `/api/admin/trainers/verification/${id}/action/`,
    { approve }
  );

export const fetchTrainerVerificationDetail = (id) =>
  api.get(`/api/admin/trainers/verification/${id}/`);

