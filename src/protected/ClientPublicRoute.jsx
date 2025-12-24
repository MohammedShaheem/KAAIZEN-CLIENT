import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ClientPublicRoute(){
    const {user,isLoading } = useSelector((state)=>state.auth);


    if(isLoading) return null;

    if(!user) return <Outlet />;

    if(user.role == "client"){
        return <Navigate to="/dashboard" replace />;
    }

    if(user.role === "admin"){
        return <Navigate to="/admin/dashboard" replace />
    }

    return <Outlet/>;

}