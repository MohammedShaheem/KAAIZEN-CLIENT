// src/pages/trainer/auth/TrainerResetPassword.jsx
import React from 'react';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPasswordRequest } from '@/services/auth/auth';
import { emailRule, passwordRule } from '@/validators/common.schema';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import BaseAuthForm from '@/components/auth/forms/BaseAuthForm';
import EmailField from '@/components/auth/fields/EmailField';
import PasswordField from '@/components/auth/fields/PasswordField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';

export default function TrainerResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, reset_token } = location.state || {};

  // 🔒 Guard: must come from verify-reset-otp
  if (!email || !reset_token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500">
          Invalid session. Please start again from Forgot Password.
        </p>
      </div>
    );
  }

  const initialValues = {
    email,
    new_password: '',
  };

  const validationSchema = Yup.object({
    email: emailRule,
    new_password: passwordRule,
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await resetPasswordRequest({
        email: values.email,
        reset_token,
        new_password: values.new_password,
      });

      navigate('/trainer/login', { replace: true });
    } catch (err) {
      setErrors({
        new_password:
          err.response?.data?.detail || 'Failed to reset password',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout role="trainer">
      <BaseAuthForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="RESET PASSWORD"
      >
        {({ isSubmitting }) => (
          <>
            <EmailField name="email" disabled />
            <PasswordField name="new_password" />
            <SubmitButton disabled={isSubmitting} type="submit">
              Reset Password
            </SubmitButton>

            <p className="text-center mt-8 text-gray-600">
              Back to <AuthLink to="/trainer/login">Login</AuthLink>
            </p>
          </>
        )}
      </BaseAuthForm>
    </AuthLayout>
  );
}
