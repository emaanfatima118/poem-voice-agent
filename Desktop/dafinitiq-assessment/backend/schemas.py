from pydantic import BaseModel


class PipelineMetrics(BaseModel):
    recording_duration_s: float = 0.0
    stt_latency_s: float
    llm_latency_s: float
    tts_latency_s: float
    processing_latency_s: float
    playback_start_delay_s: float = 0.0
    end_to_end_latency_s: float


class ProcessResponse(BaseModel):
    transcript: str
    poem: str
    audio: str
    audio_mime_type: str = "audio/mpeg"
    metrics: PipelineMetrics


class ErrorResponse(BaseModel):
    error: str
