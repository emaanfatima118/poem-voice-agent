"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Input from './components/ui/inputField';
import Button from './components/ui/login-signupButton';
import SocialButton from './components/ui/socialButton';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value =
      field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
    
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Login failed. Please try again.' });
        return;
      }

      // Success! Store user data and redirect
      console.log('Login successful:', data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to new dashboard
      window.location.href = '/stackwise-dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
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

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-white dark:bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2
              className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-gray-900 dark:text-gray-900 mb-2 leading-[36px] sm:leading-[40px]"
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 700,
                fontStyle: 'normal',
                letterSpacing: '0%',
                textAlign: 'center',
              }}
            >
              Sign In Account
            </h2>
            <p
              className="text-[14px] sm:text-[16px] md:text-[18px] text-gray-600 dark:text-gray-600 leading-[22px] sm:leading-[24px]"
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 400,
                fontStyle: 'normal',
                letterSpacing: '0%',
                textAlign: 'center',
              }}
            >
              Enter your data to login your Account.
            </p>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <SocialButton
              provider="Google"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
              onClick={() => handleSocialLogin('Google')}
            />
            <SocialButton
              provider="Apple"
              icon={
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
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
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-white text-gray-500 dark:text-gray-500 text-xs">Or</span>
            </div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="eg. johnfrans@gmail.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                error={errors.email}
              />
            </div>
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
            </div>

            {/* Remember me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange('rememberMe')}
                  className="accent-purple-600 w-4 h-4 rounded"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button with top margin */}
            <div className="mt-6">
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/sign-up"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
    </main>
  );
};

export default LoginPage;
