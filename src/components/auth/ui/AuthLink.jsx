import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthLink = ({ children, to, onClick, className = 'text-teal-500 font-semibold hover:underline' }) => {
  const navigate = useNavigate();
  const handleClick = onClick || (() => navigate(to));
  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default AuthLink;