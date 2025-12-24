import React, { useState, useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signupRequest, verifyOtpRequest } from '@/services/auth'; // Assume resendSignupOtp if available; otherwise console
import { emailRule, passwordRule, otpRule } from '@/validators/common.schema';
import { setUSer } from '@/features/auth/authSlice';
import AuthLayout from '@/components/auth/layouts/AuthLayout';
import EmailField from '@/components/auth/fields/EmailField';
import PasswordField from '@/components/auth/fields/PasswordField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthLink from '@/components/auth/ui/AuthLink';
import SignupImage from '@/assets/client-images/clinet-signup-page.jpg';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [timer, setTimer] = useState(56);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (showOtpModal && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtpModal, timer]);

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  };

  const validationSchema = Yup.object({
    email: emailRule,
    password: passwordRule,
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string().required(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (values.password !== values.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords must match' });
      return;
    }
    try {
      await signupRequest({ ...values, role: 'client' }); // Ensure role is sent
      setUserEmail(values.email);
      setShowOtpModal(true);
      setTimer(56);
      setOtpError('');
    } catch (err) {
      setErrors({
        email: err.response?.data?.detail || 'Signup failed. Try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...Array(6).fill('')]; // Ensure 6 digits
      // Reconstruct full OTP from previous state or local (simplified; use Formik for full sync if needed)
      inputRefs.current.forEach((ref, i) => {
        if (i !== index && ref?.value) newOtpValues[i] = ref.value;
      });
      newOtpValues[index] = value;
      inputRefs.current[index].value = value; // Direct DOM update for refs
      setOtpError('');
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !inputRefs.current[index]?.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      // Assume resend API; if not, just reset
      // await resendSignupOtp({ email: userEmail });
      console.log('Resend OTP for', userEmail); // Placeholder
      setTimer(56);
      setOtpError('');
      inputRefs.current.forEach(ref => (ref.value = '')); // Clear inputs
      inputRefs.current[0]?.focus();
    } catch (err) {
      setOtpError(err.response?.data?.detail || 'Resend failed');
    }
  };

  const handleVerifyOtp = async () => {
    const otpInputs = inputRefs.current;
    const otp = otpInputs.map(input => input?.value || '').join('');
    if (otp.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    setIsVerifying(true);
    try {
      const response = await verifyOtpRequest({ email: userEmail, otp });
      dispatch(setUSer(response.data.user));
      setShowOtpModal(false); // Close modal
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setOtpError(err.response?.data?.detail || 'Invalid or expired OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <AuthLayout imageSrc={SignupImage} role="client">
      <div className={`transition-all duration-300 ${showOtpModal ? 'opacity-50 pointer-events-none' : ''}`}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <h2 className="text-4xl font-bold text-center mb-2 tracking-wide">SIGN UP</h2>
              <p className="text-gray-500 text-center mb-8">How to get started lorem ipsum dolor at?</p>
              
              <EmailField name="email" />
              
              <PasswordField name="password" />
              
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                  />
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1 ml-4" />
              </div>
              
              <Field name="role" type="hidden" value="client" />
              
              <SubmitButton disabled={isSubmitting}>Sign Up Now</SubmitButton>
              
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-4 text-gray-500 text-sm font-semibold">Sign up with Others</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              
              {/* Google Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors mb-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-600">
                  Sign up with <span className="font-semibold">Google</span>
                </span>
              </button>
              
              {/* Facebook Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                <span className="text-gray-600">
                  Sign up with <span className="font-semibold">Facebook</span>
                </span>
              </button>
              
              <p className="text-center mt-8 text-gray-600">
                Already have an account? <AuthLink onClick={handleLogin}>Login</AuthLink>
              </p>
            </Form>
          )}
        </Formik>
      </div>

      {/* OTP Modal Overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl mx-4 relative">
            {/* Close Button (Optional) */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-8 tracking-wide">VERIFY YOUR ACCOUNT</h2>
            
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-4">
              {Array.from({ length: 6 }, (_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-semibold bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              ))}
            </div>
            
            {otpError && <div className="text-red-500 text-sm text-center mb-4">{otpError}</div>}
            
            <div className="text-center text-gray-500 text-sm mb-6">
              00:{timer.toString().padStart(2, '0')}
            </div>
            
            <SubmitButton
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className="mb-4"
              style={{
                background: 'linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%)',
              }}
            >
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </SubmitButton>
            
            <div className="text-center text-sm text-gray-600">
              OTP expired?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0}
                className="font-bold text-gray-800 hover:underline disabled:text-gray-400"
              >
                {timer > 0 ? `Resend in ${timer}s` : 'RESEND OTP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}