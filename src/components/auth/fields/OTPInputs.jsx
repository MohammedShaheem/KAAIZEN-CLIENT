import React, { useRef, useEffect } from 'react';

const OTPInputs = ({ digitCount = 6, value, onChange, timer, onResend }) => {
  const inputRefs = useRef([]);

  // Sync internal values with Formik value
  const otpValues = value ? value.split('').concat(new Array(digitCount - value.length).fill('')) : new Array(digitCount).fill('');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, val) => {
    if (val.length <= 1 && /^\d*$/.test(val)) {
      const newVals = [...otpValues];
      newVals[index] = val;
      const newOtp = newVals.join('').replace(/\D/g, ''); // Clean non-digits
      onChange(newOtp.substring(0, digitCount)); // Limit length
      if (val && index < digitCount - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter' && otpValues.every(v => v !== '')) {
      // Optional: Trigger submit on full OTP
    }
  };

  return (
    <>
      <div className="flex justify-center gap-3 mb-4">
        {Array.from({ length: digitCount }, (_, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={otpValues[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-14 h-14 text-center text-2xl font-semibold bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>
      <div className="text-center text-gray-500 text-sm mb-6">
        {timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : 'Time expired'}
      </div>
      {onResend && (
        <button
          type="button"
          onClick={onResend}
          disabled={timer > 0}
          className="text-sm text-gray-600 hover:underline disabled:text-gray-400 block mx-auto"
          aria-label="Resend OTP"
        >
          {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
        </button>
      )}
    </>
  );
};

export default OTPInputs;