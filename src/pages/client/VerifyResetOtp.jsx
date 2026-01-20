import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetOtpRequest, resendresetotp } from '@/services/auth/auth';
import { emailRule, otpRule } from '@/validators/common.schema';
import OTPForm from '@/components/auth/forms/OTPForm';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import verifyResetOtpImage from '@/assets/client-images/client-otp-verify.avif';

export default function VerifyResetOtp() {
  const [resendError, setResendError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const initialValues = { email, otp: '' };
  const validationSchema = Yup.object({ email: emailRule, otp: otpRule });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await verifyResetOtpRequest(values);
      const reset_token = res.data.reset_token;
      console.log("reset_token from verifyreset",reset_token);
      
      navigate('/reset-password', {
        state: { email: values.email, reset_token }, 
      });
    } catch (err) {
      setErrors({ otp: err.response?.data?.detail || 'Invalid OTP' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (email) => {
    try {
      await resendresetotp({ email });
      setResendError('');
    } catch (err) {
      setResendError(err.response?.data?.detail || 'Resend failed');
    }
  };

  return (
    <AuthLayout imageSrc={verifyResetOtpImage} role="client">
      <OTPForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="VERIFY RESET OTP"
        digitCount={6}
        resendHandler={handleResend}
        email={email}
      />
      {resendError && <div className="text-red-500 text-sm text-center">{resendError}</div>}
      <p className="text-center mt-8 text-gray-600">
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-teal-500 font-semibold hover:underline"
        >
          Back to Forgot Password
        </button>
      </p>
    </AuthLayout>
  );
}