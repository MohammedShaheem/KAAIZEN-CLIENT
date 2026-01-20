import { Routes, Route } from "react-router-dom";
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/components/admin/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ClientList from "@/pages/admin/ClientList";
import ClientDetails from "@/pages/admin/ClientDetails";
import AdminPublicRoute from "@/protected/admin/AdminPublicRoute";
import AdminProtectedRoute from "@/protected/admin/AdminProtectedRoute";
import TrainerList from "@/pages/admin/trainers/TrainerList";
import TrainerDetail from "@/pages/admin/trainers/TrainerDetail";
import TrainerVerificationList from "@/pages/admin/trainers/TrainerVerificationList";
import TrainerVerificationDetail from "@/pages/admin/trainers/TrainerVerificationDetail";
import AdminWorkoutCategoryList from "@/pages/admin/workout/workoutCategory/AdminWokoutCategoryList";
import AdminWorkoutVideoList from "@/pages/admin/workout/workoutCategory/AdminWorkoutVideoList";
export default function AdminRoutes() {
  return (
    <Routes>
      
      <Route element={<AdminPublicRoute />}>
        <Route path="/login" element={<AdminLogin />} />
      </Route>

    
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          
          <Route index element={<AdminDashboard />} />
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="clientslisting" element={<ClientList />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="trainerslisting" element={<TrainerList />} />
          <Route path="trainers/:id" element={<TrainerDetail />} />
          <Route path="trainers/verification"element={<TrainerVerificationList />}/>
          <Route path="trainers/verification/:id"element={<TrainerVerificationDetail />}/>
          <Route path="workouts/categories"element={<AdminWorkoutCategoryList />}/>
          <Route path="workouts/workoutvideos"element={<AdminWorkoutVideoList />}/>

        
        
        </Route>
      </Route>
    </Routes>
  );
}
