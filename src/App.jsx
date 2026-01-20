import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import ClientRoutes from "@/routes/ClientRoutes";
import AdminRoutes from "@/routes/AdminRoutes";
import { refreshSession } from "./features/auth/authThunk";
import { Spinner } from "./components/common/Spinner";
import TrainerRoutes from "./routes/TrainerRoutes";

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
      <Spinner loading={isLoading} size={64} />
    );
  }


  return (
      <Routes>
        <Route path="/*" element={<ClientRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/trainer/*" element={<TrainerRoutes />} />
      </Routes>
  );
}
