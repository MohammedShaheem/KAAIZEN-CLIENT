import React from 'react';
import { Field, ErrorMessage } from 'formik';
import IconWrapper from '@/components/common/IconWrapper';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const EmailField = ({ name = 'email', disabled = false, ...props }) => (
  <div>
    <IconWrapper icon={EnvelopeIcon}>
      <Field
        name={name}
        type="email"
        placeholder="Email"
        disabled={disabled}
        className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
        {...props}
      />
    </IconWrapper>
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1 ml-4" />
  </div>
);

export default EmailField;