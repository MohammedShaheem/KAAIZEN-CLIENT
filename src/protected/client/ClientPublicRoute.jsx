import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ClientPublicRoute(){
    const {user,isLoading } = useSelector((state)=>state.auth);


    if(isLoading) return null;

    if(!user) return <Outlet />;

    if (user.role === "client") {
        return user.has_profile
        ? <Navigate to="/dashboard" replace />
        : <Navigate to="/onboarding" replace />;
    }

    if(user.role === "admin"){
        return <Navigate to="/admin/dashboard" replace />
    }

    return <Outlet/>;

}