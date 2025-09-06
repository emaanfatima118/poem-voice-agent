import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import login_illustration from "../assets/login_illustration.png";
import Logo from "../components/Logo";
import Slogan from "../components/Slogan";
// Illustration Component
const Illustration = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-80 h-80 flex items-center justify-center">
        <img
          src={login_illustration}
          alt="Login Illustration"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  interface LoginFormState {
    username: string;
    password: string;
    showPassword: boolean;
  }

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
        return;
      }

      const data = await response.json();
      console.log("✅ Login successful:", data);
      alert("Login successful!");
    } catch (err) {
      console.error("❌ Login failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white 
             bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] 
             hover:from-[#b39cff] hover:to-[#5a49d1]
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)]
             transition duration-200 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Sign up here
            </a>
          </p>
        </div>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Left Side Component
const LeftSide = () => {
  return (
    <div className="w-1/3 bg-[#2a2b33] flex flex-col p-8 min-h-screen">
      <div className="self-start">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Slogan />
      </div>
    </div>
  );
};

// Right Side Component
const RightSide = () => {
  return (
    <div className="w-2/3 bg-white flex items-center justify-center p-8 min-h-screen">
      <LoginForm />
    </div>
  );
};

// Main Login Page Component
const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-white relative">
      <LeftSide />
      <RightSide />
      {/* Illustration positioned at the boundary between left and right sides */}
      <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <Illustration />
      </div>
    </div>
  );
};

export default LoginPage;
