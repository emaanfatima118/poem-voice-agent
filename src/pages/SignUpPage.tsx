import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Components that would be imported from ../components/
type SocialButtonProps = {
  provider: string;
  icon: React.ReactNode;
  onClick: () => void;
};

const SocialButton = ({ provider, icon, onClick }: SocialButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
  >
    {icon}
    <span className="ml-3 text-gray-700 font-medium">
      Sign Up with {provider}
    </span>
  </button>
);

type InputFieldProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
};

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
}: InputFieldProps) => (
  <div className="relative">
    <input
      type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
    />
    {showPasswordToggle && (
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    )}
  </div>
);

const IllustrationSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5FBF" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="person-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>

    {/* Background abstract shape */}
    <path
      d="M80 120 C80 80, 120 50, 180 70 C240 50, 280 80, 300 140 C320 180, 290 220, 240 240 C190 250, 140 230, 100 200 C80 170, 80 140 Z"
      fill="url(#bg-gradient)"
      opacity="0.6"
    />

    {/* Secondary blob */}
    <ellipse
      cx="150"
      cy="100"
      rx="60"
      ry="40"
      fill="rgba(255,255,255,0.1)"
      transform="rotate(-20 150 100)"
    />

    {/* Desk */}
    <rect x="140" y="190" width="120" height="12" rx="6" fill="#8B4513" />
    <rect x="135" y="202" width="15" height="50" rx="7" fill="#654321" />
    <rect x="250" y="202" width="15" height="50" rx="7" fill="#654321" />

    {/* Person */}
    <circle cx="200" cy="130" r="20" fill="#FDBCB4" />
    <rect
      x="190"
      y="150"
      width="20"
      height="30"
      rx="10"
      fill="url(#person-gradient)"
    />
    <rect x="185" y="155" width="10" height="25" rx="5" fill="#FDBCB4" />
    <rect x="205" y="155" width="10" height="25" rx="5" fill="#FDBCB4" />

    {/* Hair */}
    <path
      d="M180 120 Q200 100 220 120 Q220 140 200 145 Q180 140 180 120"
      fill="#4A5568"
    />

    {/* Laptop */}
    <rect x="170" y="185" width="60" height="6" rx="3" fill="#2D3748" />
    <rect x="175" y="175" width="50" height="10" rx="2" fill="#4A5568" />
    <rect x="177" y="177" width="46" height="6" rx="1" fill="#63B3ED" />

    {/* Screen glow */}
    <rect
      x="177"
      y="177"
      width="46"
      height="6"
      rx="1"
      fill="rgba(99,179,237,0.3)"
    />

    {/* Plant pot */}
    <rect x="145" y="180" width="12" height="10" rx="2" fill="#8B4513" />

    {/* Plant leaves */}
    <ellipse cx="151" cy="175" rx="8" ry="12" fill="#48BB78" />
    <ellipse cx="148" cy="170" rx="6" ry="8" fill="#68D391" />
    <ellipse cx="154" cy="172" rx="5" ry="9" fill="#68D391" />

    {/* Coffee mug */}
    <rect x="245" y="180" width="10" height="8" rx="2" fill="#D69E2E" />
    <ellipse cx="250" cy="176" rx="3" ry="2" fill="#F6E05E" />
    <rect x="255" y="182" width="3" height="4" rx="1" fill="#D69E2E" />

    {/* Floating chat bubbles */}
    <circle cx="120" cy="90" r="12" fill="rgba(255,255,255,0.8)" />
    <circle cx="118" cy="95" r="3" fill="rgba(255,255,255,0.8)" />

    <circle cx="280" cy="110" r="10" fill="rgba(255,255,255,0.7)" />
    <circle cx="278" cy="114" r="2" fill="rgba(255,255,255,0.7)" />

    {/* Chat bubble lines */}
    <rect x="115" y="87" width="8" height="2" rx="1" fill="#CBD5E0" />
    <rect x="115" y="91" width="6" height="2" rx="1" fill="#CBD5E0" />

    {/* Decorative elements */}
    <circle cx="100" cy="180" r="3" fill="rgba(255,255,255,0.4)" />
    <circle cx="300" cy="160" r="4" fill="rgba(255,255,255,0.3)" />
    <circle cx="320" cy="200" r="2" fill="rgba(255,255,255,0.5)" />
  </svg>
);

const Logo = () => (
  <div className="flex items-center">
    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        B
      </div>
    </div>
  </div>
);

const LanguageSelector = () => (
  <div className="flex items-center text-sm opacity-80 cursor-pointer hover:opacity-100 transition-opacity">
    <span>English (UK)</span>
    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

const GoogleIcon = () => (
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
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

type DividerProps = {
  text: string;
};

const Divider = ({ text }: DividerProps) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-3 bg-gray-50 text-gray-500">{text}</span>
    </div>
  </div>
);

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  interface SocialSignupHandler {
    (provider: string): void;
  }

  const handleSocialSignup: SocialSignupHandler = (provider) => {
    console.log(`Signing up with ${provider}`);
    // Handle social signup logic here
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 flex-col[1] justify-center items-center p-8 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-5 rounded-full translate-x-20 translate-y-20"></div>

        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          <Logo />
        </div>

        {/* Language selector */}
        <div className="absolute top-8 right-8 z-10">
          <LanguageSelector />
        </div>

        {/* Main content */}
        <div className="max-w-lg w-full text-center z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            A Buddy for all your Binge watching
          </h1>

          {/* Illustration */}
          <div className="w-full max-w-md h-64 mx-auto">
            <IllustrationSVG />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:flex-1 bg-white flex flex-col[2] justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Create Account
          </h2>

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            <SocialButton
              provider="Google"
              icon={<GoogleIcon />}
              onClick={() => handleSocialSignup("Google")}
            />
            <SocialButton
              provider="Facebook"
              icon={<FacebookIcon />}
              onClick={() => handleSocialSignup("Facebook")}
            />
          </div>

          {/* Divider */}
          <Divider text="OR" />

          {/* Form */}
          <div className="space-y-4">
            <InputField
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange("fullName")}
            />
            <InputField
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange("email")}
            />
            <InputField
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange("password")}
              showPasswordToggle={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Create Account
            </button>
          </div>

          {/* Login link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <a
              href="#"
              className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
