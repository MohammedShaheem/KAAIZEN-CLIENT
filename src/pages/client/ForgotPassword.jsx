import React from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordRequest } from '@/services/auth';
import { emailRule } from '@/validators/common.schema';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import BaseAuthForm from '@/components/auth/forms/BaseAuthForm';
import EmailField from '@/components/auth/fields/EmailField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';
import ForgetPasswordImage from '@/assets/client-images/forgot-password-client.avif';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const initialValues = { email: '' };
  const validationSchema = Yup.object({ email: emailRule });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
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
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout imageSrc={ForgetPasswordImage} role="client">
      <BaseAuthForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="FORGOT PASSWORD"
      >
        {({ isSubmitting }) => (
          <>
            <EmailField name="email" />
            <SubmitButton disabled={isSubmitting}>Send OTP</SubmitButton>
            <p className="text-center mt-8 text-gray-600">
              Remember your password? <AuthLink to="/login">Login</AuthLink>
            </p>
          </>
        )}
      </BaseAuthForm>
    </AuthLayout>
  );
}