import { Routes, Route } from "react-router-dom";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ClientList from "@/pages/admin/ClientList";
import ClientDetails from "@/pages/admin/ClientDetails";
import AdminPublicRoute from "@/protected/AdminPublicRoute";
import AdminProtectedRoute from "@/protected/AdminProtectedRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      
      <Route element={<AdminPublicRoute />}>
        <Route path="/login" element={<AdminLogin />} />
      </Route>

    
      <Route element={<AdminProtectedRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/clientslisting" element={<ClientList />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
      </Route>
    </Routes>
  );
}
