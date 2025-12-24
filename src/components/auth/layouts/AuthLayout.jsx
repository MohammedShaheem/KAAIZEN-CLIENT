import React from 'react';

const AuthLayout = ({ children, imageSrc, imageAlt = 'Auth illustration', role = 'client' }) => (
  <div className="min-h-screen h-screen flex overflow-hidden">
    {/* Left Side - Form */}
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-12 bg-white overflow-y-auto">
      <div className="w-full max-w-md">{children}</div>
    </div>
    {/* Right Side - Image */}
    <div className="hidden lg:block lg:w-1/2 h-full">
      <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
    </div>
  </div>
);

export default AuthLayout;