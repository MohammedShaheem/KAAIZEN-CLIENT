import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function TrainerPublicRoute() {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return null;

  if (!user) return <Outlet />;

  if (user.role === "trainer") {
    console.log("log from trainer public reoutes",user);
    
    return user.has_profile
      ? <Navigate to="/trainer/trainer_dashboard" replace />
      : <Navigate to="/trainer/trainer_onboarding" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "client") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}