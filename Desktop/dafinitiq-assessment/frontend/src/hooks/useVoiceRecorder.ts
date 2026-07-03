import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchMetricAverages,
  finalizeMetrics,
  logMetricsToConsole,
  processAudioStream,
} from "../api/processAudio";
import type { AppStatus, PipelineMetrics, ProcessingStage } from "../types";

const SILENCE_THRESHOLD = 0.015;
const SILENCE_DURATION_MS = 1800;
const MIN_RECORDING_MS = 800;

function computeAverages(history: PipelineMetrics[]): PipelineMetrics | null {
  if (history.length === 0) return null;
  const keys: (keyof PipelineMetrics)[] = [
    "recording_duration_s",
    "stt_latency_s",
    "llm_latency_s",
    "tts_latency_s",
    "processing_latency_s",
    "playback_start_delay_s",
    "end_to_end_latency_s",
  ];
  const result = {} as PipelineMetrics;
  for (const key of keys) {
    result[key] = history.reduce((sum, m) => sum + m[key], 0) / history.length;
  }
  return result;
}

export function useVoiceRecorder() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [poem, setPoem] = useState("");
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(null);
  const [progressMessage, setProgressMessage] = useState("");
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<PipelineMetrics[]>([]);
  const [serverAverages, setServerAverages] = useState<PipelineMetrics | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const recordingStartRef = useRef(0);
  const recordingStopRef = useRef(0);
  const animationFrameRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isProcessingRef = useRef(false);

  const cleanupAudio = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
    silenceStartRef.current = null;
  }, []);

  const runPipeline = useCallback(async (blob: Blob, recordingDurationS: number) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setStatus("processing");
    setError("");
    setProcessingStage(null);
    setProgressMessage("");
    setMetrics(null);

    const pipelineStart = performance.now();

    try {
      const result = await processAudioStream(blob, recordingDurationS, (stage, message) => {
        setProcessingStage(stage as ProcessingStage);
        setProgressMessage(message);
      });

      setTranscript(result.transcript);
      setPoem(result.poem);

      const playbackStart = performance.now();
      const audioUrl = `data:${result.audio_mime_type};base64,${result.audio}`;

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        setStatus("playing");
        await audioRef.current.play();
      }

      const playbackDelayS = (performance.now() - playbackStart) / 1000;
      const processingWallS = (playbackStart - pipelineStart) / 1000;

      const finalMetrics: PipelineMetrics = {
        ...result.metrics,
        playback_start_delay_s: playbackDelayS,
        end_to_end_latency_s: recordingDurationS + processingWallS + playbackDelayS,
      };

      setMetrics(finalMetrics);
      setMetricsHistory((prev) => [...prev.slice(-19), finalMetrics]);
      logMetricsToConsole(finalMetrics);
      await finalizeMetrics(finalMetrics);

      const avg = await fetchMetricAverages();
      if (avg) setServerAverages(avg);

      setStatus("idle");
      setProcessingStage(null);
      setProgressMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      setProcessingStage(null);
      setProgressMessage("");
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  const stopRecording = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);
    recordingStopRef.current = performance.now();

    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    } else {
      cleanupAudio();
      setStatus("idle");
    }
  }, [cleanupAudio]);

  const monitorSilence = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    setVolume(Math.min(1, rms * 8));

    const now = Date.now();
    const elapsed = now - recordingStartRef.current;

    if (rms < SILENCE_THRESHOLD) {
      if (silenceStartRef.current === null) {
        silenceStartRef.current = now;
      } else if (
        elapsed > MIN_RECORDING_MS &&
        now - silenceStartRef.current > SILENCE_DURATION_MS
      ) {
        stopRecording();
        return;
      }
    } else {
      silenceStartRef.current = null;
    }

    animationFrameRef.current = requestAnimationFrame(monitorSilence);
  }, [stopRecording]);

  const startRecording = useCallback(async () => {
    setError("");
    setTranscript("");
    setPoem("");
    setMetrics(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        cleanupAudio();
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const recordingDurationS =
          (recordingStopRef.current - recordingStartRef.current) / 1000;

        if (blob.size > 0) runPipeline(blob, recordingDurationS);
        else setStatus("idle");
      };

      recordingStartRef.current = performance.now();
      silenceStartRef.current = null;
      recorder.start(250);
      setStatus("recording");
      monitorSilence();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Microphone access denied";
      setError(
        message.includes("Permission")
          ? "Microphone permission denied. Please allow microphone access."
          : message
      );
      setStatus("error");
      cleanupAudio();
    }
  }, [cleanupAudio, monitorSilence, runPipeline]);

  const toggleRecording = useCallback(() => {
    if (status === "recording") stopRecording();
    else if (status === "idle" || status === "error") startRecording();
  }, [status, stopRecording, startRecording]);

  useEffect(() => {
    fetchMetricAverages().then((avg) => {
      if (avg) setServerAverages(avg);
    });
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
    };
  }, [cleanupAudio]);

  const localAverages = computeAverages(metricsHistory);
  const displayAverages = localAverages ?? serverAverages;

  return {
    status,
    transcript,
    poem,
    error,
    volume,
    audioRef,
    toggleRecording,
    isBusy: status === "processing" || status === "playing",
    processingStage,
    progressMessage,
    metrics,
    metricAverages: displayAverages,
    runCount: metricsHistory.length,
  };
}
