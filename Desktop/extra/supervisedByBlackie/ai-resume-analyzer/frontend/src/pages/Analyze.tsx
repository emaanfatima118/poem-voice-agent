import { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { getResumes } from "../api/resumes";
import { getJobs } from "../api/jobs";
import { analyzeResume, analyzeResumeJob } from "../api/analysis";
import { createHistory } from "../api/history";
import { Button, Card, Badge, ScoreRing } from "../components/ui";
import { ApiError } from "../api/client";
import type { Resume, Job, Analysis } from "../types";
import { analysisSummary } from "../types";

type AnalysisMode = "resume" | "job";

export default function Analyze() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [jobId, setJobId] = useState("");
  const [mode, setMode] = useState<AnalysisMode>("job");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);

  useEffect(() => {
    Promise.all([getResumes(), getJobs()])
      .then(([r, j]) => {
        setResumes(r);
        setJobs(j);
        if (r.length) setResumeId(r[0]._id);
        if (j.length) setJobId(j[0]._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAnalyze = async () => {
    if (!resumeId) return;
    if (mode === "job" && !jobId) return;

    setAnalyzing(true);
    setResult(null);
    setError("");

    try {
      let analysis: Analysis;

      if (mode === "resume") {
        analysis = await analyzeResume(resumeId);
      } else {
        const res = await analyzeResumeJob(resumeId, jobId);
        analysis = res.analysis;
      }

      const resume = resumes.find((r) => r._id === resumeId);
      const job = jobs.find((j) => j._id === jobId);
      const summary = analysisSummary(analysis);

      await createHistory({
        query:
          mode === "resume"
            ? `Resume analysis: ${resume?.name || "Resume"}`
            : `Job match: ${resume?.name || "Resume"} → ${job?.title || "Job"}`,
        response: summary,
      }).catch(() => {});

      setResult(analysis);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const selectedResume = resumes.find((r) => r._id === resumeId);
  const selectedJob = jobs.find((j) => j._id === jobId);

  const canAnalyze =
    resumes.length > 0 && (mode === "resume" || jobs.length > 0);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analyze</h1>
        <p className="mt-1 text-gray-400">
          AI-powered resume review or job match analysis.
        </p>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <div className="py-8 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-gray-500" />
            <p className="mt-4 text-gray-400">Upload a resume first to run an analysis.</p>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="mb-6 flex gap-2 rounded-xl bg-white/5 p-1">
              {(["resume", "job"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    mode === m
                      ? "bg-accent-500/20 text-accent-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {m === "resume" ? "Resume only" : "Resume vs Job"}
                </button>
              ))}
            </div>

            <div className={`grid gap-6 ${mode === "job" ? "lg:grid-cols-2" : ""}`}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Select resume</label>
                <select
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-surface-800/80 px-4 py-2.5 text-white outline-none focus:border-accent-500/50"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
                {selectedResume && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedResume.skills?.slice(0, 10).map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {mode === "job" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Select job</label>
                  {jobs.length === 0 ? (
                    <p className="text-sm text-gray-500">Add a job posting first.</p>
                  ) : (
                    <>
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
                      {selectedJob && selectedJob.required_skills?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {selectedJob.required_skills.map((s) => (
                            <Badge key={s} variant="warning">{s}</Badge>
                          ))}
                        </div>
                      )}
                    </>
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
                onClick={handleAnalyze}
                loading={analyzing}
                size="lg"
                disabled={!canAnalyze}
              >
                <Sparkles className="h-5 w-5" />
                {analyzing ? "Analyzing with AI..." : "Run analysis"}
              </Button>
            </div>
          </Card>

          {analyzing && (
            <Card className="py-12 text-center">
              <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-gradient-to-r from-accent-500/30 to-indigo-500/30" />
              <p className="mt-4 text-gray-400">AI is analyzing your resume...</p>
            </Card>
          )}

          {result && !analyzing && (
            <div className="animate-fade-up space-y-6">
              <Card className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-white">Analysis complete</h2>
                  <p className="mt-1 text-gray-400">
                    {mode === "resume"
                      ? selectedResume?.name
                      : `${selectedResume?.name} → ${selectedJob?.title}${selectedJob?.company ? ` at ${selectedJob.company}` : ""}`}
                  </p>
                  {analysisSummary(result) && (
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300">
                      {analysisSummary(result)}
                    </p>
                  )}
                </div>
                <ScoreRing score={result.match_score} size={140} />
              </Card>

              {(result.strengths?.length || result.weaknesses?.length) ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  {result.strengths && result.strengths.length > 0 && (
                    <Card>
                      <div className="flex items-center gap-2 text-accent-400">
                        <ThumbsUp className="h-5 w-5" />
                        <h3 className="font-semibold text-white">Strengths</h3>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-gray-300">• {s}</li>
                        ))}
                      </ul>
                    </Card>
                  )}
                  {result.weaknesses && result.weaknesses.length > 0 && (
                    <Card>
                      <div className="flex items-center gap-2 text-red-400">
                        <ThumbsDown className="h-5 w-5" />
                        <h3 className="font-semibold text-white">Weaknesses</h3>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {result.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-gray-300">• {w}</li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              ) : null}

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <div className="flex items-center gap-2 text-accent-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <h3 className="font-semibold text-white">Matched skills</h3>
                  </div>
                  {result.matched_skills?.length === 0 ? (
                    <p className="mt-3 text-sm text-gray-500">No matched skills found.</p>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.matched_skills?.map((s) => (
                        <Badge key={s} variant="success">{s}</Badge>
                      ))}
                    </div>
                  )}
                </Card>

                <Card>
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle className="h-5 w-5" />
                    <h3 className="font-semibold text-white">Missing skills</h3>
                  </div>
                  {result.missing_skills?.length === 0 ? (
                    <p className="mt-3 text-sm text-gray-500">No missing skills identified.</p>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.missing_skills?.map((s) => (
                        <Badge key={s} variant="danger">{s}</Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              <Card>
                <div className="flex items-center gap-2 text-amber-400">
                  <Lightbulb className="h-5 w-5" />
                  <h3 className="font-semibold text-white">Suggestions</h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {result.suggestions?.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-400">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
