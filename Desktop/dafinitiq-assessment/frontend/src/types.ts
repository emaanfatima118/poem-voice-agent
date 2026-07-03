export type AppStatus = "idle" | "recording" | "processing" | "playing" | "error";

export interface ProcessResult {
  transcript: string;
  poem: string;
  audio: string;
  audio_mime_type: string;
}
