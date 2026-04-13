import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, lazy, Suspense } from "react";
import { refreshSession } from "./features/auth/authSlice";
import { Spinner } from "./components/common/Spinner";
import { Toaster } from "sonner";

import { getDeviceToken } from "./notifications/notifications";


const ClientRoutes = lazy(() => import("@/routes/ClientRoutes"));
const AdminRoutes = lazy(() => import("@/routes/AdminRoutes"));
const TrainerRoutes = lazy(() => import("@/routes/TrainerRoutes"));

export default function App() {
  const dispatch = useDispatch();

  const { isLoading, user } = useSelector((state) => state.auth);
  
  const hasDispatched = useRef(false);
  const tokenInitialized = useRef(false);



  useEffect(() => {
    if (!hasDispatched.current) {
      hasDispatched.current = true;
      dispatch(refreshSession());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && user && !tokenInitialized.current) {
      tokenInitialized.current = true;
      getDeviceToken();
    }
  }, [isLoading, user]);




  if (isLoading) {
    return <Spinner loading size={64} />;
  }

  return (
    <Suspense fallback={<Spinner loading size={64} />}>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/trainer/*" element={<TrainerRoutes />} />
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>

    </Suspense>
  );
}
