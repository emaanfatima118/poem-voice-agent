import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Logo, Button, Input } from "../components/ui";
import { ApiError } from "../api/client";

export default function Signup() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup({ full_name: fullName, email, password });
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-6 text-2xl font-semibold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-gray-400">Start analyzing your resume in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="glass space-y-5 rounded-2xl p-8">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-400 hover:text-accent-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
