import type { ProcessResult } from "../types";

export async function processAudio(blob: Blob): Promise<ProcessResult> {
  const formData = new FormData();
  formData.append("audio", blob, "recording.webm");

  const response = await fetch("/api/process", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Processing failed");
  }

  return data;
}
