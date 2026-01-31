import React, { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordRequest } from '@/services/auth/auth';
import { emailRule } from '@/validators/common.schema';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import BaseAuthForm from '@/components/auth/forms/BaseAuthForm';
import EmailField from '@/components/auth/fields/EmailField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';
import ForgetPasswordImage from '@/assets/client-images/forgot-password-client.avif';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = { email: '' };
  const validationSchema = Yup.object({ email: emailRule });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    try {
      const response = await forgotPasswordRequest(values);
      if (!response.data.otp_sent) {
        setErrors({ email: 'User not found' });
        return;
      }
      navigate('/verify-reset-otp', {
        replace: true,
        state: { email: values.email },
      });
    } catch (err) {
      setErrors({
        email: err.response?.data?.detail || 'Something went wrong. Please try again',
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout imageSrc={ForgetPasswordImage} role="client">
      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-40">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-white font-semibold">Sending OTP...</p>
          </div>
        </div>
      )}

      <BaseAuthForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="FORGOT PASSWORD"
      >
        {({ isSubmitting }) => (
          <>
            <EmailField name="email" />
            <SubmitButton disabled={isSubmitting || isLoading} type="submit">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send OTP'
              )}
            </SubmitButton>
            <p className="text-center mt-8 text-gray-600">
              Remember your password? <AuthLink to="/login">Login</AuthLink>
            </p>
          </>
        )}
      </BaseAuthForm>
    </AuthLayout>
  );
}
