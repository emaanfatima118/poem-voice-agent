import React from 'react'
const LoginSignupButton = ({ children, variant = 'primary', fullWidth = false, onClick, type = 'button' }) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-400',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
};
export default LoginSignupButton;