import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, X } from "lucide-react";
import { getResumes, deleteResume, uploadResume } from "../api/resumes";
import { Button, Card, Badge, EmptyState } from "../components/ui";
import { PdfUpload } from "../components/PdfUpload";
import { ApiError } from "../api/client";
import type { Resume } from "../types";

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const load = () => {
    setLoading(true);
    getResumes()
      .then(setResumes)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setPdfFile(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!pdfFile) {
      setError("Please upload a PDF resume");
      return;
    }
    setSubmitting(true);
    try {
      await uploadResume(pdfFile);
      resetForm();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume?")) return;
    try {
      await deleteResume(id);
      load();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Resumes</h1>
          <p className="mt-1 text-gray-400">Upload your resume as a PDF.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Upload resume
        </Button>
      </div>

      {showForm && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Upload resume</h2>
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
            <PdfUpload file={pdfFile} onFileChange={setPdfFile} />
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>Upload</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-gray-500">Loading resumes...</p>
      ) : resumes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No resumes yet"
            description="Upload your first PDF resume to get started."
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" /> Upload resume
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => (
            <Card key={r._id} hover>
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">{r.name}</h3>
                  <p className="text-sm text-gray-400">{r.email}</p>
                  {r.location && <p className="mt-1 text-xs text-gray-500">{r.location}</p>}
                </div>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {r.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {r.skills.slice(0, 6).map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                  {r.skills.length > 6 && <Badge>+{r.skills.length - 6}</Badge>}
                </div>
              )}
              <p className="mt-3 text-xs text-gray-500">
                Added {new Date(r.uploaded_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
