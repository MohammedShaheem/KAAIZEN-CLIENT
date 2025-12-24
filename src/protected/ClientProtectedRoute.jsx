import {useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export default function ClientProtectedRoute() {
    const { user,isLoading} = useSelector((state) => state.auth);

    if (isLoading) return null;

    if (!user) {
        return <Navigate to="/login" replace />; 
    }
    
    if(user.role !== "client"){
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet/>
}