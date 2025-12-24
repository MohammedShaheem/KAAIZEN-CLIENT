import React from 'react';

const SubmitButton = ({ children, disabled, isSubmitting, className = '', ...props }) => (
  <button
    type="submit"
    disabled={disabled || isSubmitting}
    className={`w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 ${className}`}
    style={{
      background: "linear-gradient(135deg, #14b8a6 0%, #8b5cf6 100%)",
    }}
    {...props}
  >
    {isSubmitting ? "Loading..." : children}
  </button>
);

export default SubmitButton;