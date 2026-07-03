import type { PipelineMetrics, ProcessResult, StreamEvent } from "../types";

export type ProgressCallback = (stage: string, message: string) => void;

export async function processAudioStream(
  blob: Blob,
  recordingDurationS: number,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const formData = new FormData();
  formData.append("audio", blob, "recording.webm");
  formData.append("recording_duration_s", recordingDurationS.toFixed(3));

  const response = await fetch("/api/process/stream", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Processing failed");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response stream");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      const event: StreamEvent = JSON.parse(line);

      if (event.type === "progress" && event.stage && event.message) {
        onProgress(event.stage, event.message);
      }

      if (event.type === "error") {
        throw new Error(event.error || "Pipeline failed");
      }

      if (event.type === "complete" && event.data) {
        return event.data;
      }
    }
  }

  throw new Error("Stream ended without result");
}

export async function finalizeMetrics(metrics: PipelineMetrics): Promise<void> {
  await fetch("/api/metrics/finalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metrics),
  });
}

export async function fetchMetricAverages(): Promise<PipelineMetrics | null> {
  const response = await fetch("/api/metrics/averages");
  const data = await response.json();
  if (!data.averages) return null;
  const { run_count: _runCount, ...metrics } = data.averages;
  return metrics as PipelineMetrics;
}

export function logMetricsToConsole(metrics: PipelineMetrics): void {
  const fmt = (s: number) => `${s.toFixed(2)} s`;
  console.log(
    "%c========== AI Voice Pipeline Metrics ==========",
    "color: #f9a8d4; font-weight: bold"
  );
  console.log(`%cRecording Duration      : ${fmt(metrics.recording_duration_s)}`, "color: #86efac");
  console.log(`%cSTT Latency             : ${fmt(metrics.stt_latency_s)}`, "color: #fde68a");
  console.log(`%cLLM Latency             : ${fmt(metrics.llm_latency_s)}`, "color: #fde68a");
  console.log(`%cTTS Latency             : ${fmt(metrics.tts_latency_s)}`, "color: #fde68a");
  console.log(`%cPlayback Start Delay    : ${fmt(metrics.playback_start_delay_s)}`, "color: #c4b5fd");
  console.log("%c-----------------------------------------------", "color: #666");
  console.log(`%cEnd-to-End Latency      : ${fmt(metrics.end_to_end_latency_s)}`, "color: #f472b6; font-weight: bold");
  console.log("%c===============================================", "color: #f9a8d4; font-weight: bold");
}
