import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Mail, Phone, MapPin, Briefcase, GraduationCap, Loader2, ArrowLeft } from "lucide-react";
import { getMyResume } from "../api/resumes";
import { ApiError } from "../api/client";
import { Badge, Button, Card, EmptyState } from "../components/ui";
import type { Resume } from "../types";

export default function MyResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyResume()
      .then(setResume)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Failed to load resume");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <Card>
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No resume found"
          description={error || "Upload a resume to see it here."}
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/resumes">
                <Button>Upload Resume</Button>
              </Link>
              <Link to="/profile">
                <Button variant="secondary">Back to Profile</Button>
              </Link>
            </div>
          }
        />
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/profile"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          <h1 className="text-2xl font-semibold text-white">My Resume</h1>
          <p className="mt-1 text-gray-400">Your uploaded resume profile.</p>
        </div>
        <Link to="/resumes">
          <Button variant="secondary">Manage Resumes</Button>
        </Link>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-white">{resume.name}</h2>
        <div className="mt-4 space-y-2 text-sm text-gray-300">
          {resume.email && (
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" /> {resume.email}
            </p>
          )}
          {resume.phone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" /> {resume.phone}
            </p>
          )}
          {resume.location && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" /> {resume.location}
            </p>
          )}
        </div>

        {resume.skills?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {resume.skills.map((s) => (
                <Badge key={s} variant="success">{s}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {resume.experience && resume.experience.length > 0 && (
        <Card>
          <div className="mb-4 flex items-center gap-2 text-white">
            <Briefcase className="h-5 w-5 text-accent-400" />
            <h3 className="font-semibold">Experience</h3>
          </div>
          <div className="space-y-4">
            {resume.experience.map((exp, i) => (
              <div key={i} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
                <p className="font-medium text-white">{exp.role}</p>
                <p className="text-sm text-accent-400">{exp.company}</p>
                {exp.duration && <p className="mt-1 text-xs text-gray-500">{exp.duration}</p>}
                {exp.description && <p className="mt-2 text-sm text-gray-400">{exp.description}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {resume.education && resume.education.length > 0 && (
        <Card>
          <div className="mb-4 flex items-center gap-2 text-white">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
            <h3 className="font-semibold">Education</h3>
          </div>
          <div className="space-y-4">
            {resume.education.map((edu, i) => (
              <div key={i} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
                <p className="font-medium text-white">{edu.degree}</p>
                <p className="text-sm text-gray-400">{edu.institution}</p>
                {edu.year && <p className="mt-1 text-xs text-gray-500">{edu.year}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
