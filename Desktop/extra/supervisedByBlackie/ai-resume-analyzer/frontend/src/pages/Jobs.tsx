import { useEffect, useState } from "react";
import { Briefcase, Plus, Trash2, X } from "lucide-react";
import { getJobs, parseJob, deleteJob } from "../api/jobs";
import { Button, Card, Textarea, Badge, EmptyState } from "../components/ui";
import { ApiError } from "../api/client";
import type { Job } from "../types";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");

  const load = () => {
    setLoading(true);
    getJobs()
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setDescription("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!description.trim()) {
      setError("Job description is required");
      return;
    }
    setSubmitting(true);
    try {
      await parseJob(description.trim());
      resetForm();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to parse job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    try {
      await deleteJob(id);
      load();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Jobs</h1>
          <p className="mt-1 text-gray-400">Paste a job description — AI will extract title, skills & more.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add job
        </Button>
      </div>

      {showForm && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">New job posting</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <Textarea
              label="Job description"
              placeholder="Paste the full job description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[200px]"
            />
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>
                {submitting ? "Parsing..." : "Parse & save"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Briefcase className="h-8 w-8" />}
            title="No jobs yet"
            description="Paste a job description to start analyzing how well your resume matches."
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" /> Add job
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((j) => (
            <Card key={j._id} hover>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">{j.title || "Job Posting"}</h3>
                  {j.company && <p className="text-sm text-accent-400">{j.company}</p>}
                  {j.location && <p className="mt-1 text-xs text-gray-500">{j.location}</p>}
                </div>
                <button
                  onClick={() => handleDelete(j._id)}
                  className="shrink-0 rounded-lg p-1.5 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-gray-400">{j.description}</p>
              {j.required_skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {j.required_skills.slice(0, 8).map((s) => (
                    <Badge key={s} variant="warning">{s}</Badge>
                  ))}
                  {j.required_skills.length > 8 && (
                    <Badge>+{j.required_skills.length - 8}</Badge>
                  )}
                </div>
              )}
              {j.created_at && (
                <p className="mt-3 text-xs text-gray-500">
                  Added {new Date(j.created_at).toLocaleDateString()}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
