"use client"

import React, { useState } from 'react';
import Input from './components/ui/inputField';
import Button from './components/ui/login-signupButton';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    // Use window.location.href to navigate properly in Next.js
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2
            className="mt-6 text-center text-3xl font-bold text-gray-900"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 700,
            }}
          >
            {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
          </h2>
          <p
            className="mt-2 text-center text-sm text-gray-600"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 400,
            }}
          >
            {isSubmitted 
              ? 'We\'ve sent a password reset link to your email address.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                required
                error={error}
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  try again
                </button>
              </p>
            </div>

            <div>
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={handleBackToLogin}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
