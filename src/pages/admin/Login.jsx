import React from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '@/services/auth/auth';
import { emailRule, passwordRule } from '@/validators/common.schema';
import { setUSer, setError, clearError, setLoading } from '@/features/auth/authSlice';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import BaseAuthForm from '@/components/auth/forms/BaseAuthForm';
import EmailField from '@/components/auth/fields/EmailField';
import PasswordField from '@/components/auth/fields/PasswordField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';
import loginimage from '@/assets/admin_images/admin_login_image.jpg'

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const initialValues = { email: '', password: '' };
  const validationSchema = Yup.object({ email: emailRule, password: passwordRule });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const response = await loginRequest(values);
      dispatch(setUSer(response.data.user));
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Invalid email or password'));
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout imageSrc={loginimage} role="admin">
      <BaseAuthForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        title="ADMIN LOGIN"
        error={error}
      >
        {({ isSubmitting }) => (
          <>
            <EmailField name="email" />
            <PasswordField name="password" />
            <SubmitButton disabled={isSubmitting || isLoading} type="submit">Login Now</SubmitButton>
            <p className="text-center mt-8 text-gray-600">
              Client login? <AuthLink to="/login">Client Portal</AuthLink>
            </p>
          </>
        )}
      </BaseAuthForm>
    </AuthLayout>
  );
}