import React from 'react';
import { Field, ErrorMessage } from 'formik';
import IconWrapper from '@/components/common/IconWrapper';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const PasswordField = ({ name = 'password', ...props }) => (
  <div>
    <IconWrapper icon={LockClosedIcon}>
      <Field
        name={name}
        type="password"
        placeholder="Password"
        className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
        {...props}
      />
    </IconWrapper>
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1 ml-4" />
  </div>
);

export default PasswordField;