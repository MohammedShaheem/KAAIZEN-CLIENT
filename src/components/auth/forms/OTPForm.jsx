import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import OTPInputs from '../fields/OTPInputs';
import SubmitButton from '@/components/ui/SubmitButton';

const OTPForm = ({ 
  initialValues, 
  validationSchema, 
  onSubmit, 
  title = 'Verify OTP', 
  digitCount = 6, 
  resendHandler,
  email // For resend
}) => {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = async () => {
    if (resendHandler) {
      await resendHandler(email);
      setTimer(60);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue, errors, values }) => (
        <Form className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-8 tracking-wide">{title}</h2>
          <OTPInputs
            digitCount={digitCount}
            value={values.otp}
            onChange={(otp) => setFieldValue('otp', otp)}
            timer={timer}
            onResend={handleResend}
          />
          {errors.otp && <div className="text-red-500 text-sm text-center">{errors.otp}</div>}
          <SubmitButton type="submit" isSubmitting={isSubmitting}>Verify OTP</SubmitButton>
        </Form>
      )}
    </Formik>
  );
};

export default OTPForm;