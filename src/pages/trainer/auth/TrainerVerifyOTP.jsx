// src/pages/trainer/auth/TrainerVerifyOtp.jsx
import React from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtpRequest } from '@/services/auth/auth';
import { setUSer, setError, clearError, setLoading } from '@/features/auth/authSlice';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import OTPForm from '@/components/auth/forms/OTPForm';
import trainerVerifyImage from '../../../assets/client-images/client-otp-verify.avif';  

export default function TrainerVerifyOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const { isLoading, error } = useSelector((state) => state.auth);

  if (!email) {
    navigate('/trainer/signup');
    return null;
  }

  const initialValues = { otp: '' };
  const validationSchema = Yup.object({
    otp: Yup.string().matches(/^\d{6}$/, 'OTP must be 6 digits').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const payload = { email, otp: values.otp };
      const response = await verifyOtpRequest(payload);
      dispatch(setUSer(response.data.user));
      navigate('/trainer/onboarding', { replace: true });
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'OTP verification failed'));
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  const handleResend = async (resendEmail) => {
    // Use resendresetotp or implement resend for signup OTP if separate API exists
    // Assuming resendresetotp works for both, or adjust if needed
    try {
      await resendresetotp({ email: resendEmail });
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Failed to resend OTP'));
    }
  };

  return (
    <AuthLayout imageSrc={trainerVerifyImage} role="trainer">
      <OTPForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="VERIFY OTP"
        resendHandler={handleResend}
        email={email}
      />
    </AuthLayout>
  );
}