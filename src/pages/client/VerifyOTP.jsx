import React from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtpRequest } from '@/services/auth';
import { setUSer } from '@/features/auth/authSlice';
import { emailRule, otpRule } from '@/validators/common.schema';
import OTPForm from '@/components/auth/forms/OTPForm';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import verifyOtpImage from '@/assets/client-images/client-otp-verify.avif'; // Assume image

export default function VerifyOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate('/signup', { replace: true });
    return null;
  }

  const initialValues = { email, otp: '' };
  const validationSchema = Yup.object({ email: emailRule, otp: otpRule });

  const handleSubmit = async (values) => {
    const response = await verifyOtpRequest(values);
    dispatch(setUSer(response.data.user));
    navigate('/dashboard', { replace: true });
  };

  const handleResend = async () => {
    // Implement resend signup OTP if API exists
    console.log('Resend OTP for', email);
  };

  return (
    <AuthLayout imageSrc={verifyOtpImage} role="client">
      <OTPForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="VERIFY OTP"
        digitCount={5}
        resendHandler={handleResend}
        email={email}
      />
    </AuthLayout>
  );
}