import React, { useState, useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clientsignupRequest, verifyOtpRequest } from '@/services/auth/auth'; 
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
      await clientsignupRequest({ ...values }); 
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
      navigate('/onboarding', { replace: true });
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
              
              
              <EmailField name="email" />
              
              <PasswordField name="password" />
              <PasswordField name="confirmPassword" placeholder="Confirm Password" />
              
              <Field name="role" type="hidden" value="client" />
              
              <SubmitButton type="submit" disabled={isSubmitting}>Sign Up Now</SubmitButton>
              
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