import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminPublicRoute(){
    const {user,isLoading} = useSelector((state) => state.auth);

    if(isLoading){
    return null
    };

    if(user?.role === "admin"){
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;



}