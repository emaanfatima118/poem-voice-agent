import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import login_illustration from "../assets/signup_illustration.png";
import Logo from "../components/Logo";
import Slogan from "../components/Slogan";

// Illustration Component
const Illustration = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-64 h-64 flex items-center justify-center">
        <img
          src={login_illustration}
          alt="Signup Illustration"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

// Signup Form Component
const SignupForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          status: "pending",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
        return;
      }

      const data = await response.json();
      console.log("✅ Signup successful:", data);
      alert("Account created successfully!");
    } catch (err) {
      console.error("❌ Signup failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome to ForeSyte
          </h2>
          <p className="text-gray-600 text-sm">Create your account</p>
        </div>

        <div className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white text-sm"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Username Field */}
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white text-sm"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white text-sm"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-gray-700">
              I agree to the{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSubmit}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
             bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] 
             hover:from-[#b39cff] hover:to-[#5a49d1]
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)]
             transition duration-200 transform hover:scale-105"
          >
            Sign Up
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Left Side Component
const LeftSide = () => {
  return (
    <div className="w-1/3 bg-[#2a2b33] flex flex-col p-6">
      <div className="self-start mb-4">
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
    <div className="w-2/3 bg-white flex items-center justify-center p-6">
      <SignupForm />
    </div>
  );
};

// Main Signup Page Component
const SignupPage = () => {
  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      <LeftSide />
      <RightSide />
      {/* Illustration positioned at the boundary between left and right sides */}
      <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <Illustration />
      </div>
    </div>
  );
};

export default SignupPage;
