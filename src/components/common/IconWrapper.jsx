import React from 'react';

const IconWrapper = ({ icon: Icon, children, ...props }) => (
  <div className="relative" {...props}>
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      <Icon className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" />
    </span>
    {children}
  </div>
);

export default IconWrapper;