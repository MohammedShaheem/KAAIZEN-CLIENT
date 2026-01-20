// src/pages/trainer/auth/TrainerForgotPassword.jsx
import React from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordRequest } from '@/services/auth/auth';
import { emailRule } from '@/validators/common.schema';
import { setError, clearError, setLoading } from '@/features/auth/authSlice';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import BaseAuthForm from '@/components/auth/forms/BaseAuthForm';
import EmailField from '@/components/auth/fields/EmailField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';
import trainerForgotImage from '../../../assets/client-images/forgot-password-client.avif';  

export default function TrainerForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const initialValues = { email: '' };
  const validationSchema = Yup.object({ email: emailRule });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      await forgotPasswordRequest(values);
      navigate('/trainer/verify-reset-otp', { state: { email: values.email } });
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Failed to send reset OTP'));
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout imageSrc={trainerForgotImage} role="trainer">
      <BaseAuthForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="FORGOT PASSWORD"
        error={error}
      >
        {({ isSubmitting }) => (
          <>
            <EmailField name="email" />
            <SubmitButton disabled={isSubmitting || isLoading} type="submit">Send Reset OTP</SubmitButton>
            <p className="text-center mt-8 text-gray-600">
              Remember your password? <AuthLink to="/trainer/login">Login</AuthLink>
            </p>
          </>
        )}
      </BaseAuthForm>
    </AuthLayout>
  );
}