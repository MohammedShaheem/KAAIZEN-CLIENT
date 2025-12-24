import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import ClientRoutes from "@/routes/ClientRoutes";
import AdminRoutes from "@/routes/AdminRoutes";
import { refreshSession } from "./features/auth/authThunk";

export default function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const hasDispatched = useRef(false);

  
  useEffect(() => {
    if (!hasDispatched.current){
      hasDispatched.current = true;
    dispatch(refreshSession());
  }
  },[dispatch]);

  if (isLoading){
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking session...</p>
      </div>
    );
  }


  return (
      <Routes>
        <Route path="/*" element={<ClientRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
  );
}
