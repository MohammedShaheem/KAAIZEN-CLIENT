import api from "../api/axios";

export const fetchAdminDashboard = () => 
    api.get("/api/admin/dashboard");
export const fetchClients = (page = 1) => 
    api.get(`/api/admin/clients/?page=${page}`);
export const fetchClientDetail = (id) => 
    api.get(`/api/admin/clients/${id}`);
export const fetchTrainers = (page = 1) => 
    api.get(`/api/admin/trainers/?page=${page}`);
export const updateUserStatus = (is,is_active) => 
    api.patch(`/api/admin/users/${id}/status`,{is_active});
