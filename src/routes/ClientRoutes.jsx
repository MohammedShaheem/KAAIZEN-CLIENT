import { Route, Routes, Navigate } from "react-router-dom";
import Login from "@/pages/client/Login";
import Signup from "@/pages/client/Signup";
import VerifyOTP from "@/pages/client/VerifyOTP";
import VerifyResetOtp from "@/pages/client/VerifyResetOtp";
import ForgotPassword from "@/pages/client/ForgotPassword";
import ResetPassword from "@/pages/client/ResetPassword";
import ClientProtectedRoute from "@/protected/client/ClientProtectedRoute";
import ClientPublicRoute from "@/protected/client/ClientPublicRoute";
import Dashboard from "@/pages/client/Dashboard";
import OnboardingMain from "@/pages/client/OnboardingMain";
import MealEntryPage from "@/pages/client/MealEntryPage";
import MealLoggingPage from "@/pages/client/MealLoggingPage";
import SleepDashboard from "@/pages/client/SleepDashboard";
import WorkoutCategories from "@/pages/client/workouts/WorkoutCategories";
import CategoryDetail from "@/pages/client/workouts/CategoryDetail";
import WorkoutDetail from "@/pages/client/workouts/WorkoutDetail";
export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ClientPublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ClientProtectedRoute />}>
        <Route path="/dashboard" element={< Dashboard />} />
        <Route path="/meals" element={<MealEntryPage />} />
        <Route path="/meals/log" element={<MealLoggingPage />} />
        <Route path="/sleep/log" element={<SleepDashboard />} />
        <Route path="/workout_categories" element={<WorkoutCategories />} />
        <Route path="/client/category_detail/:categoryId" element={<CategoryDetail />}/>
        <Route path="/client/workouts/:workoutId"element={<WorkoutDetail />}/>
        <Route path="/onboarding" element={<OnboardingMain />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}