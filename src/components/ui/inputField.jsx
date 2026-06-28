"use client"

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
// Reusable Input Component
const Input = ({ label, type = 'text', placeholder, value, onChange, required = false, error = '' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-900 dark:text-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-400 ${
            error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-200 focus:ring-purple-500'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;