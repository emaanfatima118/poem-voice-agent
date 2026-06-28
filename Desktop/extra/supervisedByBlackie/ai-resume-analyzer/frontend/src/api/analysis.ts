import { api } from "./client";
import type { Analysis } from "../types";

export async function getAnalyses(): Promise<Analysis[]> {
  return api<Analysis[]>("/analysis/");
}

export async function analyzeResume(resumeId: string): Promise<Analysis> {
  return api<Analysis>(`/analysis/analyze/${resumeId}`, { method: "POST" });
}

export async function analyzeResumeJob(
  resumeId: string,
  jobId: string
): Promise<{ analysis_id: string; analysis: Analysis }> {
  return api(`/analysis/analyze-job/${resumeId}/${jobId}`, { method: "POST" });
}
