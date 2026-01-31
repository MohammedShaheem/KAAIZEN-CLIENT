'use client';

import React from 'react';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPasswordRequest } from '@/services/auth/auth';
import { passwordRule, emailRule } from '@/validators/common.schema';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import BaseAuthForm from '@/components/auth/forms/BaseAuthForm';
import EmailField from '@/components/auth/fields/EmailField';
import PasswordField from '@/components/auth/fields/PasswordField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';
import resetPasswordImage from '@/assets/client-images/client-setnew-password.avif';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, reset_token } = location.state || {};
 console.log("reset_token from resetpassword",reset_token);
  
  if (!email || !reset_token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500">Invalid session. Please start again from Forgot Password.</p>
      </div>
    );
  }

  const initialValues = { email: email, new_password: '', confirmPassword: '' };
  const validationSchema = Yup.object({
    email: emailRule,
    new_password: passwordRule,
    confirmPassword: passwordRule.required('Confirm password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (values.new_password !== values.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords must match' });
      return;
    }
    try {
      await resetPasswordRequest({
        email: values.email,
        reset_token: reset_token,
        new_password: values.new_password,
      });
      navigate('/login', { replace: true });
    } catch (err) {
      setErrors({
        new_password: err.response?.data?.detail || 'Failed to reset password. Try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout imageSrc={resetPasswordImage} role="client">
      <BaseAuthForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="RESET PASSWORD"
      >
        {({ isSubmitting }) => (
          <>
            <EmailField name="email" disabled />
            <PasswordField name="new_password" label="New Password" />
            <PasswordField name="confirmPassword" label="Confirm Password"placeholder="confirm password"/>
            <SubmitButton disabled={isSubmitting} type="submit">Reset Password</SubmitButton>
            <p className="text-center mt-8 text-gray-600">
              Remember your password? <AuthLink to="/login">Back to Login</AuthLink>
            </p>
          </>
        )}
      </BaseAuthForm>
    </AuthLayout>
  );
}
