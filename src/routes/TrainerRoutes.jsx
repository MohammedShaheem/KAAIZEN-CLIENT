import { Routes, Route, Navigate } from "react-router-dom";

import TrainerLogin from "@/pages/trainer/auth/TrainerLogin";
import TrainerSignup from "@/pages/trainer/auth/TrainerSignup";
import TrainerVerifyOtp from "@/pages/trainer/auth/TrainerVerifyOTP";
import TrainerVerifyResetOtp from "@/pages/trainer/auth/TrainerVerifyResetOTP";
import TrainerForgotPassword from "@/pages/trainer/auth/TrainerForgotPassword";
import TrainerResetPassword from "@/pages/trainer/auth/TrainerResetPassword";

import TrainerProtectedRoute from "@/protected/trainer/TrainerProtected";
import TrainerPublicRoute from "@/protected/trainer/TrainerPublicRoutes";

import TrainerOnboardingMain from "@/pages/trainer/onboarding/TrainerOnboardingMAin";
import Dashboard from "@/pages/trainer/dashboard/dashboard";

import TrainerSessionsPage from "@/pages/trainer/personaltraining/TrainerSessionsPage";
import TrainerSessionDetailPage from "@/pages/trainer/personaltraining/TrainerSessionDetailPage";

import TrainerProfilePage from "@/pages/trainer/profile/profilePage";
import TrainerLeavesPage from "@/pages/trainer/leave/TrainerLeavePage";

import TrainerVideoCallPage from "@/pages/trainer/personaltraining/TrainerVideoCallPage";

export default function TrainerRoutes() {
  return (
    <Routes>

      
      <Route element={<TrainerPublicRoute />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<TrainerLogin />} />
        <Route path="signup" element={<TrainerSignup />} />
        <Route path="verify-otp" element={<TrainerVerifyOtp />} />
        <Route path="forgot-password" element={<TrainerForgotPassword />} />
        <Route path="verify-reset-otp" element={<TrainerVerifyResetOtp />} />
        <Route path="reset-password" element={<TrainerResetPassword />} />
      </Route>

      
      <Route element={<TrainerProtectedRoute />}>
        <Route path="onboarding" element={<TrainerOnboardingMain />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<TrainerProfilePage />} />
        <Route path="sessions" element={<TrainerSessionsPage />} />
        <Route path="sessions/:sessionId" element={<TrainerSessionDetailPage />}/>
        <Route path="sessions/:sessionId/video"element={<TrainerVideoCallPage />}/>
        <Route path="leaves" element={<TrainerLeavesPage />}/>

        
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      
      <Route path="*" element={<Navigate to="/trainer/login" replace />} />

    </Routes>
  );
}

