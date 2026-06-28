import { useEffect, useState } from "react";
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { getResumes } from "../api/resumes";
import { getJobs } from "../api/jobs";
import { getInterviewSession, generateInterview, generateInterviewForJob, getInterviewSessions } from "../api/interview";
import { Button, Card, Badge, EmptyState } from "../components/ui";
import { ApiError } from "../api/client";
import type { Resume, Job, InterviewSession, InterviewItem } from "../types";

type Mode = "resume" | "job";

const CATEGORY_LABELS: Record<string, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  experience: "Experience",
  role_fit: "Role fit",
  gap: "Gap focus",
};

const CATEGORY_VARIANT: Record<string, "default" | "success" | "warning" | "danger"> = {
  behavioral: "default",
  technical: "success",
  experience: "default",
  role_fit: "warning",
  gap: "danger",
};

function InterviewCard({ item, index }: { item: InterviewItem; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const category = item.category?.toLowerCase().replace(/\s+/g, "_") || "behavioral";

  return (
    <div className="rounded-xl border border-white/6 bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-white/[0.03]"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-400">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <Badge variant={CATEGORY_VARIANT[category] || "default"}>
            {CATEGORY_LABELS[category] || item.category}
          </Badge>
          <p className="mt-2 text-sm font-medium text-white">{item.question}</p>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-gray-500" />
        )}
      </button>

      {open && (
        <div className="border-t border-white/6 px-4 pb-4 pt-3">
          <div className="rounded-xl bg-accent-500/5 border border-accent-500/15 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-400">
              Suggested answer
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              {item.suggested_answer}
            </p>
          </div>
          {item.talking_points?.length > 0 && (
            <div className="mt-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <Lightbulb className="h-3.5 w-3.5" />
                Key talking points from your resume
              </p>
              <ul className="mt-2 space-y-1.5">
                {item.talking_points.map((point, i) => (
                  <li key={i} className="text-sm text-gray-400">• {point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Interview() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pastSessions, setPastSessions] = useState<InterviewSession[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [jobId, setJobId] = useState("");
  const [mode, setMode] = useState<Mode>("job");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<InterviewSession | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([getResumes(), getJobs(), getInterviewSessions()])
      .then(([r, j, sessions]) => {
        setResumes(r);
        setJobs(j);
        setPastSessions(
          sessions.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        );
        if (r.length) setResumeId(r[0]._id);
        if (j.length) setJobId(j[0]._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    if (!resumeId) return;
    if (mode === "job" && !jobId) return;

    setGenerating(true);
    setError("");
    setSession(null);

    try {
      const result =
        mode === "resume"
          ? await generateInterview(resumeId)
          : await generateInterviewForJob(resumeId, jobId);
      setSession(result);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to generate interview prep");
    } finally {
      setGenerating(false);
    }
  };

  const loadPastSession = async (id: string) => {
    try {
      const s = await getInterviewSession(id);
      setSession(s);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Interview Prep</h1>
        <p className="mt-1 text-gray-400">
          AI-generated questions with suggested answers based on your resume.
        </p>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<MessageCircle className="h-8 w-8" />}
            title="Upload a resume first"
            description="Interview questions are tailored to your resume content."
          />
        </Card>
      ) : (
        <Card>
          <div className="mb-6 flex gap-2 rounded-xl bg-white/5 p-1">
            {(["resume", "job"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  mode === m
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {m === "resume" ? "Resume-based" : "Job-targeted"}
              </button>
            ))}
          </div>

          <div className={`grid gap-6 ${mode === "job" ? "lg:grid-cols-2" : ""}`}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Resume</label>
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-surface-800/80 px-4 py-2.5 text-white outline-none focus:border-accent-500/50"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
            {mode === "job" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Job</label>
                {jobs.length === 0 ? (
                  <p className="text-sm text-gray-500">Add a job posting first.</p>
                ) : (
                  <select
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-surface-800/80 px-4 py-2.5 text-white outline-none focus:border-accent-500/50"
                  >
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title}{j.company ? ` — ${j.company}` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={handleGenerate}
              loading={generating}
              size="lg"
              disabled={mode === "job" && jobs.length === 0}
            >
              <Sparkles className="h-5 w-5" />
              {generating ? "Generating..." : "Generate interview prep"}
            </Button>
          </div>
        </Card>
      )}

      {generating && (
        <Card className="py-12 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-gradient-to-r from-indigo-500/30 to-accent-500/30" />
          <p className="mt-4 text-gray-400">Building questions and suggested answers from your resume...</p>
        </Card>
      )}

      {session && !generating && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {session.items.length} questions ready
            </h2>
            <span className="text-xs text-gray-500">
              {new Date(session.created_at).toLocaleString()}
            </span>
          </div>
          <div className="space-y-3">
            {session.items.map((item, i) => (
              <InterviewCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {pastSessions.length > 0 && !session && !generating && (
        <Card>
          <h3 className="font-semibold text-white">Past sessions</h3>
          <div className="mt-4 space-y-2">
            {pastSessions.slice(0, 5).map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => loadPastSession(s._id)}
                className="flex w-full items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3 text-left transition hover:border-indigo-500/30 hover:bg-indigo-500/5"
              >
                <span className="text-sm text-gray-300">
                  {s.items?.length || 0} questions
                  {s.job_id ? " · job-targeted" : " · resume-based"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
