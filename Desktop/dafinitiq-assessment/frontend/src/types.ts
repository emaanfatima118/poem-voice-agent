export type AppStatus = "idle" | "recording" | "processing" | "playing" | "error";

export type ProcessingStage = "stt" | "llm" | "tts" | null;

export interface PipelineMetrics {
  recording_duration_s: number;
  stt_latency_s: number;
  llm_latency_s: number;
  tts_latency_s: number;
  processing_latency_s: number;
  playback_start_delay_s: number;
  end_to_end_latency_s: number;
}

export interface ProcessResult {
  transcript: string;
  poem: string;
  audio: string;
  audio_mime_type: string;
  metrics: PipelineMetrics;
}

export interface StreamEvent {
  type: "progress" | "metric" | "complete" | "error";
  stage?: "stt" | "llm" | "tts";
  message?: string;
  duration_s?: number;
  data?: ProcessResult;
  error?: string;
}
