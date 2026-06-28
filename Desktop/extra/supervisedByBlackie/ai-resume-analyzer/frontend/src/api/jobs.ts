import { api } from "./client";
import type { Job } from "../types";

export async function getJobs(): Promise<Job[]> {
  return api<Job[]>("/jobs/");
}

export async function getJob(id: string): Promise<Job> {
  return api<Job>(`/jobs/${id}`);
}

export async function parseJob(description: string): Promise<Job> {
  return api<Job>("/jobs/parse", {
    method: "POST",
    body: JSON.stringify({ description }),
  });
}

export async function deleteJob(id: string): Promise<{ message: string }> {
  return api(`/jobs/${id}`, { method: "DELETE" });
}
