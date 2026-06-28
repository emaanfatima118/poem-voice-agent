import { Link } from "react-router-dom";
import { LandingLayout } from "../components/Layout";
import {
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Smart Skill Matching",
    description:
      "Instantly compare your resume skills against job requirements and see exactly where you stand.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Get tailored suggestions, gap analysis, and interview questions to help you stand out.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Save analyses, monitor improvements over time, and build a stronger profile with every application.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your resumes and job data are stored securely with JWT authentication protecting your account.",
  },
];

const steps = [
  "Upload or create your resume profile",
  "Add target job descriptions",
  "Run an analysis and get your match score",
  "Follow personalized recommendations",
];

export default function Landing() {
  return (
    <LandingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute top-20 right-0 h-[300px] w-[400px] rounded-full bg-accent-500/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300">
            <Sparkles className="h-4 w-4 text-accent-400" />
            AI-powered career intelligence
          </div>

          <h1 className="animate-fade-up animate-delay-1 font-display text-5xl leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Land your dream job with{" "}
            <em className="gradient-text not-italic">smarter</em> resumes
          </h1>

          <p className="animate-fade-up animate-delay-2 mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            ResuMind analyzes your resume against any job description, scores your
            fit, identifies skill gaps, and prepares you with interview-ready insights.
          </p>

          <div className="animate-fade-up animate-delay-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 to-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-accent-600/25 transition hover:brightness-110"
            >
              Start analyzing free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-medium text-gray-300 transition hover:bg-white/8 hover:text-white"
            >
              Sign in to your account
            </Link>
          </div>

          {/* Mock score card */}
          <div className="animate-fade-up animate-delay-4 relative mx-auto mt-16 max-w-lg">
            <div className="glass rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm text-gray-400">Match Score</p>
                  <p className="font-display text-4xl text-white">87%</p>
                  <p className="mt-1 text-sm text-accent-400">Strong match</p>
                </div>
                <div className="h-24 w-24 rounded-full border-4 border-accent-500/30 p-1">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-accent-500/10">
                    <span className="text-2xl font-bold text-accent-400">87</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "AWS"].map((s) => (
                  <span key={s} className="rounded-full bg-accent-500/15 px-3 py-1 text-xs text-accent-400">
                    {s}
                  </span>
                ))}
                <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-400">
                  Kubernetes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Everything you need to <em className="gradient-text not-italic">win</em> the interview
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              From skill gap analysis to interview prep — ResuMind gives you a competitive edge.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass group rounded-2xl p-6 transition hover:border-white/12 hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-indigo-500/20 text-accent-400 transition group-hover:scale-110">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                Four steps to a <em className="gradient-text not-italic">better</em> application
              </h2>
              <p className="mt-4 text-gray-400">
                No complex setup. Create your profile, add jobs, and get actionable insights in seconds.
              </p>
              <Link
                to="/signup"
                className="mt-8 inline-flex items-center gap-2 text-accent-400 transition hover:text-accent-300"
              >
                Create your account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="glass flex items-start gap-4 rounded-xl p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-sm font-bold text-accent-400">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-gray-300">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/6 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="glass rounded-3xl p-10 sm:p-14">
            <CheckCircle2 className="mx-auto h-10 w-10 text-accent-400" />
            <h2 className="mt-4 font-display text-3xl text-white">
              Ready to optimize your career?
            </h2>
            <p className="mt-3 text-gray-400">
              Join ResuMind and start matching your resume to your dream roles today.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 to-indigo-500 px-8 py-3.5 font-semibold text-white shadow-xl shadow-accent-600/25 transition hover:brightness-110"
            >
              Get started — it's free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ResuMind. AI Resume Analyzer.
      </footer>
    </LandingLayout>
  );
}
