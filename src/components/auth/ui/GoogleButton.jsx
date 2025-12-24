import React from 'react';
import { GoogleLogin } from "@react-oauth/google";

const GoogleButton = ({ onSuccess, onError, theme = "outline", size = "large", shape = "pill" }) => (
  <div className="w-full flex justify-center">
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      theme={theme}
      size={size}
      shape={shape}
      width="100%"
    />
  </div>
);

export default GoogleButton;