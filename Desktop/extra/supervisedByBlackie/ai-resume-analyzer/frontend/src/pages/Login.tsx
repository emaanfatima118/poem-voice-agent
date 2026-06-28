import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Logo, Button, Input } from "../components/ui";
import { ApiError } from "../api/client";

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-6 text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to continue to ResuMind</p>
        </div>

        <form onSubmit={handleSubmit} className="glass space-y-5 rounded-2xl p-8">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent-400 hover:text-accent-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
