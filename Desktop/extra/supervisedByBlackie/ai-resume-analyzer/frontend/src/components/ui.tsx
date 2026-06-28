import { Link } from "react-router-dom";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:
    "bg-gradient-to-r from-accent-600 to-indigo-500 text-white shadow-lg shadow-accent-600/20 hover:shadow-accent-600/30 hover:brightness-110",
  secondary:
    "glass-light text-white hover:bg-white/8 border border-white/10",
  ghost: "text-gray-300 hover:text-white hover:bg-white/5",
  danger: "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <input
        className={`w-full rounded-xl border border-white/10 bg-surface-800/80 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 ${error ? "border-red-500/50" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <textarea
        className={`w-full rounded-xl border border-white/10 bg-surface-800/80 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 resize-y min-h-[100px] ${error ? "border-red-500/50" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover }: CardProps) {
  return (
    <div
      className={`glass rounded-2xl p-6 ${hover ? "transition hover:border-white/12 hover:bg-white/[0.04]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const colors = {
    default: "bg-white/8 text-gray-300",
    success: "bg-accent-500/15 text-accent-400",
    warning: "bg-warm/15 text-amber-400",
    danger: "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-indigo-500 shadow-lg shadow-indigo-500/25">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth="2">
          <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 012 2v14l-4-3-4 3-4-3-4 3V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-lg font-semibold tracking-tight">
        Resu<span className="gradient-text">Mind</span>
      </span>
    </Link>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#34d399" : score >= 50 ? "#f59e0b" : "#f87171";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-gray-400">match</span>
      </div>
    </div>
  );
}
