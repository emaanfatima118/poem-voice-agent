import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Trash2, FileText, ArrowRight, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { deleteAccount, logout } from "../api/auth";
import { Button, Card } from "../components/ui";
import { ApiError } from "../api/client";

export default function Profile() {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all data.")) return;
    setDeleting(true);
    setError("");
    try {
      await deleteAccount();
      authLogout();
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    authLogout();
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-gray-400">Manage your account settings.</p>
      </div>

      <Card>
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500/30 to-indigo-500/30 text-2xl font-bold text-white">
            {user?.full_name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.full_name}</h2>
            <p className="text-sm text-gray-400">ResuMind member</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-white/6 pt-6">
          <div className="flex items-center gap-3 text-gray-300">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{user?.full_name}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{user?.email}</span>
          </div>
          {user?.created_at && (
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-white">Your resume</h3>
        <p className="mt-1 text-sm text-gray-400">
          View your parsed profile or upload a new PDF.
        </p>
        <div className="mt-4 space-y-3">
          <Link
            to="/resumes/me"
            className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-4 transition hover:border-accent-500/30 hover:bg-accent-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">My Resume</p>
                <p className="text-sm text-gray-400">View skills, experience & education</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </Link>
          <Link
            to="/resumes"
            className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-4 transition hover:border-white/12 hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-gray-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Manage Resumes</p>
                <p className="text-sm text-gray-400">Upload or delete resume files</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </Link>
          <Link
            to="/interview"
            className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-4 transition hover:border-indigo-500/30 hover:bg-indigo-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Interview Prep</p>
                <p className="text-sm text-gray-400">Questions with suggested answers</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </Link>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-white">Account actions</h3>
        {error && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={handleLogout}>
            Sign out
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            <Trash2 className="h-4 w-4" />
            Delete account
          </Button>
        </div>
      </Card>
    </div>
  );
}
