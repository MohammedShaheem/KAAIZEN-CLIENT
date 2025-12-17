import { Route, Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppRoutes from "./routes/AppRoutes";
import TrainerRoutes from "./routes/TrainerRoutes";

export default function App(){
    return(
     <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/trainer/*" element={<TrainerRoutes />} />
    </Routes>

    )
}