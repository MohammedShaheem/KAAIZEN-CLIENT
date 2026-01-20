// src/pages/trainer/auth/TrainerVerifyResetOtp.jsx
import React from 'react';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetOtpRequest, resendresetotp } from '@/services/auth/auth';
import { emailRule, otpRule } from '@/validators/common.schema';
import OTPForm from '@/components/auth/forms/OTPForm';
import AuthLayout from '@/components/auth/layouts/AuthLayout';

export default function TrainerVerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  // 🔒 Guard: must come from forgot-password
  if (!email) {
    navigate('/trainer/forgot-password', { replace: true });
    return null;
  }

  const initialValues = { email, otp: '' };

  const validationSchema = Yup.object({
    email: emailRule,
    otp: otpRule,
  });

  // ✅ Formik error handling (NOT Redux)
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await verifyResetOtpRequest(values);
      const reset_token = res.data.reset_token;

      navigate('/trainer/reset-password', {
        state: { email: values.email, reset_token },
      });
    } catch (err) {
      setErrors({
        otp: err.response?.data?.detail || 'Invalid or expired OTP',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (email) => {
    try {
      await resendresetotp({ email });
    } catch (err) {
      // Resend errors are non-field → alert-style
      alert(err.response?.data?.detail || 'Failed to resend OTP');
    }
  };

  return (
    <AuthLayout role="trainer">
      <OTPForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="VERIFY RESET OTP"
        digitCount={6}
        resendHandler={handleResend}
        email={email}
      />
    </AuthLayout>
  );
}
