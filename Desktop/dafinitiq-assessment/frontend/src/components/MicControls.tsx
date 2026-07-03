import { MicIcon, SpeakerIcon } from "./Icons";
import type { AppStatus } from "../types";

const STATUS_LABELS: Record<AppStatus, string> = {
  idle: "tap to whisper ♡",
  recording: "listening… (stops when you're quiet)",
  processing: "weaving your poem… ✨",
  playing: "playing your poem ♪",
  error: "let's try again ♡",
};

interface MicControlsProps {
  status: AppStatus;
  volume: number;
  isBusy: boolean;
  onToggle: () => void;
}

export function MicControls({ status, volume, isBusy, onToggle }: MicControlsProps) {
  const isRecording = status === "recording";
  const isProcessing = status === "processing";
  const isPlaying = status === "playing";

  return (
    <section className="mic-section">
      <div className="mic-section__wrapper">
        {isRecording && (
          <>
            <span
              className="mic-section__pulse"
              style={{ opacity: 0.3 + volume * 0.7 }}
            />
            <span className="mic-section__pulse mic-section__pulse--delay" />
          </>
        )}
        <button
          className={`mic-button ${isRecording ? "mic-button--recording" : ""} ${isBusy ? "mic-button--disabled" : ""}`}
          onClick={onToggle}
          disabled={isBusy}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isProcessing ? (
            <span className="spinner" />
          ) : isPlaying ? (
            <SpeakerIcon />
          ) : (
            <MicIcon recording={isRecording} />
          )}
        </button>
      </div>

      <div className="volume-bar">
        <div
          className="volume-bar__fill"
          style={{ width: isRecording ? `${volume * 100}%` : "0%" }}
        />
      </div>

      <p
        className={`status-text ${isRecording ? "status-text--recording" : ""} ${isProcessing ? "status-text--processing" : ""}`}
      >
        {STATUS_LABELS[status]}
      </p>
    </section>
  );
}

interface PipelineProps {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
}

export function Pipeline({ isRecording, isProcessing, isPlaying }: PipelineProps) {
  return (
    <footer className="pipeline">
      <Step active={isRecording} icon="🎙" label="Mic" />
      <span className="pipeline__arrow">♡</span>
      <Step active={isProcessing} icon="✨" label="Magic" />
      <span className="pipeline__arrow">♡</span>
      <Step active={isPlaying} icon="♪" label="Playback" />
    </footer>
  );
}

function Step({ active, icon, label }: { active: boolean; icon: string; label: string }) {
  return (
    <div className={`pipeline__step ${active ? "pipeline__step--active" : ""}`}>
      <span className="pipeline__icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
