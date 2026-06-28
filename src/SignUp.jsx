"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Input from './components/ui/inputField';
import Button from './components/ui/login-signupButton';
import SocialButton from './components/ui/socialButton';

// Main Sign Up Page Component
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateName = (name, fieldName) => {
    if (!name.trim()) return `${fieldName} is required`;
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return `${fieldName} can only contain letters and spaces`;
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Sign up failed. Please try again.' });
        return;
      }

      // Success! Store user data and redirect to login
      console.log('Sign up successful:', data.user);
      
      // Show success message and redirect to login
      alert('Account created successfully! Please log in.');
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Sign up error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const providerMap = {
      'Google': 'google',
      'Apple': 'apple',
      'Microsoft': 'microsoft'
    };
    
    const providerKey = providerMap[provider];
    if (providerKey) {
      window.location.href = `/api/auth/${providerKey}/authorize`;
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-white">
      <div className="sm:min-h-screen lg:h-screen flex flex-col lg:flex-row">
      {/* Top Panel - Purple Background with Logo (Mobile & Tablet) */}
      <div className="lg:hidden w-full h-[30rem] sm:h-[34rem] relative overflow-hidden p-6 flex flex-col items-center justify-center">
        {/* Rounded Gradient Background */}
        <div 
          className="absolute inset-3 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl"
          style={{
            backgroundImage: 'url(/login-signup/gradient-bg.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
        </div>
        
        {/* Logo and Tagline */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-8 text-white">
          <div className="mb-4">
            {/* White Logo from SVG */}
            <img 
              src="/login-signup/white-logo.svg" 
              alt="Stackwise Logo"
              className="w-48 h-auto"
            />
          </div>
          <p className="text-sm sm:text-base text-purple-100 text-center font-light">
            The Marketing Stack That Works For You
          </p>
        </div>
      </div>

      {/* Left Panel - Purple Background with Logo (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden p-8">
        {/* Rounded Gradient Background */}
        <div 
          className="absolute inset-2 bg-gradient-to-br from-purple-600 to-purple-800 sm:rounded-xl lg:rounded-3xl"
          style={{
            backgroundImage: 'url(/login-signup/gradient-bg.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
        </div>
        
        {/* Logo and Tagline */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-8 text-white">
          <div className="mb-6">
            {/* White Logo from SVG */}
            <img 
              src="/login-signup/white-logo.svg" 
              alt="Stackwise Logo"
              className="w-64 h-auto"
            />
          </div>
          <p className="text-lg text-purple-100 text-center font-light">
            The Marketing Stack That Works For You
          </p>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white dark:bg-white">
        <div className="w-full max-w-md">
          {/* Form Header */}
<div className="mb-6 text-center">
  <h2
    className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-gray-900 dark:text-gray-900 mb-2 leading-[36px] sm:leading-[40px]"
    style={{
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontWeight: 700,
      fontStyle: "normal",
      letterSpacing: "0%",
      textAlign: "center",
    }}
  >
    Sign Up Account
  </h2>
  <p
    className="text-[14px] sm:text-[16px] md:text-[18px] text-gray-600 dark:text-gray-600 leading-[22px] sm:leading-[24px]"
    style={{
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontWeight: 400,
      fontStyle: "normal",
      letterSpacing: "0%",
      textAlign: "center",
    }}
  >
    Enter your personal data to create your account.
  </p>
</div>


          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <SocialButton
              provider="Google"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
              onClick={() => handleSocialLogin('Google')}
            />
            <SocialButton
              provider="Apple"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              }
              onClick={() => handleSocialLogin('Apple')}
            />
            <SocialButton
              provider="Microsoft"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                  <path d="M0 0h11v11H0z" fill="#F25022"/>
                  <path d="M12 0h11v11H12z" fill="#00A4EF"/>
                  <path d="M0 12h11v11H0z" fill="#7FBA00"/>
                  <path d="M12 12h11v11H12z" fill="#FFB900"/>
                </svg>
              }
              onClick={() => handleSocialLogin('Microsoft')}
            />
          </div>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-white text-gray-500 dark:text-gray-500 text-xs">Or</span>
            </div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <div className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                placeholder="eg. John"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="eg. Francisco"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
                error={errors.lastName}
              />
            </div>

            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              placeholder="eg. johnfrans@gmail.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              error={errors.email}
            />

            {/* Password Field */}
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
                error={errors.password}
              />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and number.
              </p>
            </div>

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
              error={errors.confirmPassword}
            />

            {/* Submit Button */}
            <Button 
              type="button" 
              variant="primary" 
              fullWidth 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </main>
  );
};

export default SignUpPage;