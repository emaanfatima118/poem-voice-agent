import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
