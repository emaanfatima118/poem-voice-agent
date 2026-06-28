import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Sparkles,
  MessageCircle,
  History,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./ui";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/resumes", icon: FileText, label: "Resumes" },
  { to: "/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/analyze", icon: Sparkles, label: "Analyze" },
  { to: "/interview", icon: MessageCircle, label: "Interview" },
  { to: "/history", icon: History, label: "History" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-accent-500/15 text-accent-400"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="mesh-bg flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/6 bg-surface-900/80 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center border-b border-white/6 px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/6 p-4">
          <div className="mb-3 truncate px-3 text-sm text-gray-400">
            {user?.full_name}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/6 bg-surface-900 transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/6 px-6">
          <Logo />
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/6 bg-surface-900/60 px-4 backdrop-blur-xl lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <Link
            to="/analyze"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-accent-600/20 to-indigo-500/20 px-4 py-2 text-sm font-medium text-accent-400 transition hover:from-accent-600/30 hover:to-indigo-500/30 sm:flex"
          >
            <Sparkles className="h-4 w-4" />
            New Analysis
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg min-h-screen">
      <header className="fixed top-0 z-50 w-full border-b border-white/6 bg-surface-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-gradient-to-r from-accent-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent-600/20 transition hover:brightness-110"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
