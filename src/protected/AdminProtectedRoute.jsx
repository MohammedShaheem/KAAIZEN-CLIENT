import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
    const { user,isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return null;
    }

    if(!user) {
        return <Navigate to="/admin/login" replace/>;
    }

    if(user.role !== "admin"){
        return <Navigate to="admin/dashboard" replace />;
    }

    return <Outlet />;
}