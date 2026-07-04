import { MicControls, Pipeline } from "./components/MicControls";
import { MetricsPanel } from "./components/MetricsPanel";
import { ResultCard } from "./components/ResultCard";
import { useVoiceRecorder } from "./hooks/useVoiceRecorder";
import "./App.css";

export default function App() {
  const {
    status,
    transcript,
    poem,
    error,
    volume,
    audioRef,
    toggleRecording,
    isBusy,
    processingStage,
    progressMessage,
    metrics,
    metricAverages,
    runCount,
  } = useVoiceRecorder();

  return (
    <main className="app">
      <div className="app__stars" aria-hidden />
      <div className="app__glow" aria-hidden />

      <div className="app__container">
        <header className="header">
          <h1 className="header__title">
            Voice to <span className="header__accent">Poetry</span>
          </h1>
          <p className="header__subtitle">
            whisper your thoughts — i&apos;ll turn them into a little poem, just for you ♡
          </p>
        </header>

        <MicControls
          status={status}
          volume={volume}
          isBusy={isBusy}
          onToggle={toggleRecording}
          processingStage={processingStage}
          progressMessage={progressMessage}
        />

        {error && (
          <div className="error-box" role="alert">
            <span className="error-box__icon">♡</span>
            {error}
          </div>
        )}

        <section className="results">
          <ResultCard
            label="Your Words"
            icon="🎀"
            content={transcript}
            placeholder="say something sweet… your words will land here"
            visible={!!transcript}
          />
          <ResultCard
            label="Your Poem"
            icon="✨"
            content={poem}
            placeholder="your magical poem will bloom here…"
            visible={!!poem}
            highlight
            poem
          />
        </section>

        <MetricsPanel
          metrics={metrics}
          averages={metricAverages}
          runCount={runCount}
        />

        <Pipeline
          isRecording={status === "recording"}
          isProcessing={status === "processing"}
          isPlaying={status === "playing"}
        />
      </div>

      <audio ref={audioRef} className="hidden-audio" />
    </main>
  );
}
