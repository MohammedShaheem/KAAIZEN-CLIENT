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

export default function TrainerRoutes() {
  return (
    <Routes>

      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route element={<TrainerPublicRoute />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<TrainerLogin />} />
        <Route path="signup" element={<TrainerSignup />} />
        <Route path="verify-otp" element={<TrainerVerifyOtp />} />
        <Route path="forgot-password" element={<TrainerForgotPassword />} />
        <Route path="verify-reset-otp" element={<TrainerVerifyResetOtp />} />
        <Route path="reset-password" element={<TrainerResetPassword />} />
      </Route>

      {/* ---------- PROTECTED ROUTES ---------- */}
      <Route element={<TrainerProtectedRoute />}>
        <Route path="trainer_onboarding" element={<TrainerOnboardingMain />} />
        <Route path="trainer_dashboard" element={<Dashboard />} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="login" replace />} />

    </Routes>
  );
}
