import { api, ApiError } from "./client";
import type { Resume } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function getResumes(): Promise<Resume[]> {
  return api<Resume[]>("/resumes/");
}

export async function getMyResume(): Promise<Resume> {
  return api<Resume>("/resumes/me");
}

export async function getResume(id: string): Promise<Resume> {
  return api<Resume>(`/resumes/${id}`);
}

export async function createResume(data: Omit<Resume, "_id" | "user_id">): Promise<{ id: string }> {
  return api("/resumes/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteResume(id: string): Promise<{ message: string }> {
  return api(`/resumes/${id}`, { method: "DELETE" });
}

export async function uploadResume(
  file: File
): Promise<{ filename: string; content_type: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/resumes/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    let message = "Upload failed";
    try {
      const body = await res.json();
      message = body.detail || body.message || message;
      if (Array.isArray(message)) {
        message = message.map((e: { msg?: string }) => e.msg).join(", ");
      }
    } catch {
      message = res.statusText;
    }
    throw new ApiError(res.status, message);
  }

  return res.json();
}
