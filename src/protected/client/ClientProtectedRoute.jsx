import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ClientProtectedRoute() {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return null;

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (user.role !== "client") {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "trainer") {
      return <Navigate to="/trainer/trainer_dashboard" replace />;
    }
  }

  
  // if (!user.has_profile) {
  //   return <Navigate to="/onboarding" replace />;
  // }else{
  //   return <Navigate to="/Dashboard" replace />;
  // }

  return <Outlet />;
}
