// src/pages/trainer/auth/TrainerSignup.jsx
import React from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { trainersignupRequest, googleAuth } from '@/services/auth/auth';
import { GoogleLogin } from '@react-oauth/google';
import { emailRule, passwordRule } from '@/validators/common.schema';
import { setUSer, setError, clearError, setLoading } from '@/features/auth/authSlice';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import BaseAuthForm from '@/components/auth/forms/BaseAuthForm';
import EmailField from '@/components/auth/fields/EmailField';
import PasswordField from '@/components/auth/fields/PasswordField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';
import trainerSignupImage from '../../../assets/client-images/clinet-signup-page.jpg'

export default function TrainerSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const initialValues = { email: '', password: '', confirmPassword: '' };
  const validationSchema = Yup.object({
    email: emailRule,
    password: passwordRule,
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const payload = { ...values };
      delete payload.confirmPassword;
      const response = await trainersignupRequest(payload);
      dispatch(setUSer(response.data.user));
      navigate('/trainer/verify-otp', { state: { email: values.email } });
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Signup failed'));
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const response = await googleAuth({ id_token: credentialResponse.credential, role: 'trainer' });
      dispatch(setUSer(response.data.user));
      if (response.data.user.has_profile) {
        navigate('/trainer/dashboard', { replace: true });
      } else {
        navigate('/trainer/trainer_onboarding', { replace: true });
      }
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Google signup failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleError = () => {
    dispatch(setError('Google signup failed'));
  };

  return (
    <AuthLayout imageSrc={trainerSignupImage} role="trainer">
      <BaseAuthForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="TRAINER SIGNUP"
        error={error}
      >
        {({ isSubmitting }) => (
          <>
            <EmailField name="email" />
            <PasswordField name="password" />
            <PasswordField name="confirmPassword" placeholder="Confirm Password" />
            <SubmitButton disabled={isSubmitting || isLoading} type="submit">Sign Up Now</SubmitButton>
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-gray-500 text-sm font-semibold">Signup with Others</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
            />
            <p className="text-center mt-8 text-gray-600">
              Already have an account? <AuthLink to="/trainer/login">Login</AuthLink>
            </p>
          </>
        )}
      </BaseAuthForm>
    </AuthLayout>
  );
}