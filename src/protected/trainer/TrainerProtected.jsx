import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function TrainerProtectedRoute() {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/trainer/login" replace />;
  }
  
  
  

  if (user.role !== "trainer") {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "client") {
      return <Navigate to="/Dashboard" replace />;  
    }
  }

  return <Outlet />;
}