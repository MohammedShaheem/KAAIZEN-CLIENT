import React from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginRequest, googleAuth } from '@/services/auth/auth';
import { GoogleLogin } from '@react-oauth/google';
import { emailRule, passwordRule, roleRule } from '@/validators/common.schema';
import { setUSer, setError, clearError, setLoading } from '@/features/auth/authSlice';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import BaseAuthForm from '@/components/auth/forms/BaseAuthForm';
import EmailField from '@/components/auth/fields/EmailField';
import PasswordField from '@/components/auth/fields/PasswordField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';
import loginImage from '@/assets/client-images/client-login-page-image.jpg';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const initialValues = { email: '', password: '',login_as: 'client'};
  const validationSchema = Yup.object({ email: emailRule, password: passwordRule, login_as: roleRule(['client']) });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const response = await loginRequest(values);
      dispatch(setUSer(response.data.user));
      console.log((response.data.user.has_profile));

      // if (response.data.user.role !== 'client') {
      //   throw new Error('Invalid role for client login');
      // }
      
      
      
      if (response.data.user.has_profile) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Invalid email or password'));
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const response = await googleAuth({ id_token: credentialResponse.credential });
      dispatch(setUSer(response.data.user));
      if (response.data.user.role !== 'client') {
        throw new Error('Invalid role for client login');
      }
      console.log(response.data.user.has_profile);
      if (response.data.user.has_profile) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Google login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleError = () => {
    dispatch(setError('Google login failed'));
  };

  return (
    <AuthLayout imageSrc={loginImage} role="client">
      <BaseAuthForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="LOGIN"
        error={error}
      >
        {({ isSubmitting }) => (
          <>
            <EmailField name="email" />
            <PasswordField name="password" />
            <div className="flex justify-end">
              <AuthLink to="/forgot-password">Forgot Password?</AuthLink>
            </div>
            <SubmitButton disabled={isSubmitting || isLoading} type="submit" >Login Now</SubmitButton>
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-gray-500 text-sm font-semibold">Login with Others</span>
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
              Don't have an account? <AuthLink to="/signup">Sign Up</AuthLink>
            </p>
          </>
        )}
      </BaseAuthForm>
    </AuthLayout>
  );
}