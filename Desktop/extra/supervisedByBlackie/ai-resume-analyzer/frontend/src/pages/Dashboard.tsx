import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Briefcase, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getResumes } from "../api/resumes";
import { getJobs } from "../api/jobs";
import { getAnalyses } from "../api/analysis";
import { Card, Badge, ScoreRing } from "../components/ui";
import type { Analysis } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ resumes: 0, jobs: 0, analyses: 0 });
  const [recent, setRecent] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getResumes(), getJobs(), getAnalyses()])
      .then(([resumes, jobs, analyses]) => {
        setCounts({
          resumes: resumes.length,
          jobs: jobs.length,
          analyses: analyses.length,
        });
        setRecent(
          analyses
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3)
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Resumes", value: counts.resumes, icon: FileText, to: "/resumes", color: "text-blue-400" },
    { label: "Jobs", value: counts.jobs, icon: Briefcase, to: "/jobs", color: "text-purple-400" },
    { label: "Analyses", value: counts.analyses, icon: Sparkles, to: "/analyze", color: "text-accent-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Welcome back, {user?.full_name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-1 text-gray-400">
          Here's an overview of your resume analysis activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card hover className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{s.label}</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? "—" : s.value}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Quick actions</h2>
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { to: "/resumes", label: "Add a resume", desc: "Upload your profile and skills" },
              { to: "/jobs", label: "Add a job posting", desc: "Paste a job description to compare" },
              { to: "/analyze", label: "Run analysis", desc: "Get your match score and insights" },
              { to: "/interview", label: "Interview prep", desc: "Questions with suggested answers" },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-4 transition hover:border-white/12 hover:bg-white/[0.04]"
              >
                <div>
                  <p className="font-medium text-white">{action.label}</p>
                  <p className="text-sm text-gray-400">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-white">Recent analyses</h2>
          {loading ? (
            <p className="mt-4 text-sm text-gray-500">Loading...</p>
          ) : recent.length === 0 ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">No analyses yet</p>
              <Link
                to="/analyze"
                className="mt-3 inline-flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300"
              >
                Run your first analysis <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recent.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      Analysis #{a._id.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={a.match_score >= 75 ? "success" : a.match_score >= 50 ? "warning" : "danger"}>
                      {a.match_score}% match
                    </Badge>
                    <ScoreRing score={a.match_score} size={56} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
