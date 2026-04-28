import { Route, Routes, Navigate } from "react-router-dom";
import Login from "@/pages/client/auth/Login";
import Signup from "@/pages/client/auth/Signup";
import VerifyOTP from "@/pages/client/auth/VerifyOTP";
import VerifyResetOtp from "@/pages/client/auth/VerifyResetOtp";
import ForgotPassword from "@/pages/client/auth/ForgotPassword";
import ResetPassword from "@/pages/client/auth/ResetPassword";
import ClientProtectedRoute from "@/protected/client/ClientProtectedRoute";
import ClientPublicRoute from "@/protected/client/ClientPublicRoute";
import Dashboard from "@/pages/client/dashbaord/Dashboard";
import OnboardingMain from "@/pages/client/onboarding/OnboardingMain";
import MealEntryPage from "@/pages/client/nutrition/MealEntryPage";
import MealLoggingPage from "@/pages/client/nutrition/MealLoggingPage";
import SleepDashboard from "@/pages/client/sleep/SleepDashboard";
import WorkoutCategories from "@/pages/client/workouts/WorkoutCategories";
import CategoryDetail from "@/pages/client/workouts/CategoryDetail";
import WorkoutDetail from "@/pages/client/workouts/WorkoutDetail";
import ClientProfilePage from "@/pages/client/profile/ClientProfilePage";
import PublicTrainingPlans from "@/pages/client/personaltraining/PublicTrainingPlans";
import PublicTrainingPlanDetail from "@/pages/client/personaltraining/PublicTrainingPlanDetail ";
import BookingPage from "@/pages/client/personaltraining/bookingPage";
import ClientCurrentPlanPage from "@/pages/client/personaltraining/clientCurrentPlanPage";
import AIPlanPage from "@/pages/client/AIplan/AIPlanPage";
import PaymentSuccess from "@/pages/client/personaltraining/paymentSucess";
import PaymentCancel from "@/pages/client/personaltraining/paymentCancel";
import ClientVideoCallPage from "@/pages/client/personaltraining/ClientVideoCallPage";
import ClientWalletPage from "@/pages/client/wallet/ClientWalletPage";

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
        <Route path="/onboarding" element={<OnboardingMain />} />
        <Route path="/meals" element={<MealEntryPage />} />
        <Route path="/meals/log" element={<MealLoggingPage />} />
        <Route path="/sleep/log" element={<SleepDashboard />} />
        <Route path="/workout_categories" element={<WorkoutCategories />} />
        <Route path="/client/category_detail/:categoryId" element={<CategoryDetail />}/>
        <Route path="/client/workouts/:workoutId"element={<WorkoutDetail />}/>
        <Route path="/profile"element={<ClientProfilePage />}/>
        <Route path="/training-plans" element={<PublicTrainingPlans />} />
        <Route path="/training-plans/:planId"element={<PublicTrainingPlanDetail />}/>
        <Route path="/booking"element={<BookingPage />}/>
        <Route path="/current-plan"element={<ClientCurrentPlanPage />}/>
        <Route path="/ai-plan"element={<AIPlanPage />}/>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/sessions/:sessionId/video" element={<ClientVideoCallPage />}/>
        <Route path="/wallet" element={<ClientWalletPage />}/>

        
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}