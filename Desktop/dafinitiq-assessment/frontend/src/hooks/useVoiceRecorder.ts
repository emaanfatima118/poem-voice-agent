import { useCallback, useEffect, useRef, useState } from "react";
import { processAudio } from "../api/processAudio";
import type { AppStatus } from "../types";

const SILENCE_THRESHOLD = 0.015;
const SILENCE_DURATION_MS = 1800;
const MIN_RECORDING_MS = 800;

export function useVoiceRecorder() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [poem, setPoem] = useState("");
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const recordingStartRef = useRef(0);
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

  const runPipeline = useCallback(async (blob: Blob) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setStatus("processing");
    setError("");

    try {
      const result = await processAudio(blob);
      setTranscript(result.transcript);
      setPoem(result.poem);

      const audioUrl = `data:${result.audio_mime_type};base64,${result.audio}`;
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        setStatus("playing");
        await audioRef.current.play();
        setStatus("idle");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  const stopRecording = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);

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
        if (blob.size > 0) runPipeline(blob);
        else setStatus("idle");
      };

      recordingStartRef.current = Date.now();
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
    return () => {
      cleanupAudio();
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
    };
  }, [cleanupAudio]);

  return {
    status,
    transcript,
    poem,
    error,
    volume,
    audioRef,
    toggleRecording,
    isBusy: status === "processing" || status === "playing",
  };
}
