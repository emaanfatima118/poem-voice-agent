import { api } from "./client";
import type { InterviewSession } from "../types";

export async function getInterviewSessions(): Promise<InterviewSession[]> {
  return api<InterviewSession[]>("/interview/");
}

export async function getInterviewSession(id: string): Promise<InterviewSession> {
  return api<InterviewSession>(`/interview/${id}`);
}

export async function generateInterview(resumeId: string): Promise<InterviewSession> {
  return api<InterviewSession>(`/interview/generate/${resumeId}`, { method: "POST" });
}

export async function generateInterviewForJob(
  resumeId: string,
  jobId: string
): Promise<InterviewSession> {
  return api<InterviewSession>(`/interview/generate/${resumeId}/${jobId}`, { method: "POST" });
}
