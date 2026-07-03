import base64
import json
import time
from typing import AsyncGenerator

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse

from schemas import PipelineMetrics, ProcessResponse
from services import llm, metrics, stt, tts

router = APIRouter(prefix="/api", tags=["process"])

MIN_AUDIO_BYTES = 1000

STAGE_MESSAGES = {
    "stt": "Transcribing...",
    "llm": "Generating poem...",
    "tts": "Synthesizing speech...",
}


async def _run_pipeline(
    data: bytes,
    mime_type: str,
    recording_duration_s: float,
    playback_start_delay_s: float = 0.0,
) -> ProcessResponse:
    processing_start = time.perf_counter()

    t0 = time.perf_counter()
    transcript = await stt.transcribe(data, mime_type)
    stt_latency_s = time.perf_counter() - t0

    t0 = time.perf_counter()
    poem = await llm.generate_poem(transcript)
    llm_latency_s = time.perf_counter() - t0

    t0 = time.perf_counter()
    speech = await tts.synthesize(poem)
    tts_latency_s = time.perf_counter() - t0

    processing_latency_s = time.perf_counter() - processing_start
    end_to_end_latency_s = (
        recording_duration_s + processing_latency_s + playback_start_delay_s
    )

    pipeline_metrics = PipelineMetrics(
        recording_duration_s=recording_duration_s,
        stt_latency_s=stt_latency_s,
        llm_latency_s=llm_latency_s,
        tts_latency_s=tts_latency_s,
        processing_latency_s=processing_latency_s,
        playback_start_delay_s=playback_start_delay_s,
        end_to_end_latency_s=end_to_end_latency_s,
    )

    return ProcessResponse(
        transcript=transcript,
        poem=poem,
        audio=base64.b64encode(speech).decode(),
        metrics=pipeline_metrics,
    )


@router.post("/process", response_model=ProcessResponse)
async def process_audio(
    audio: UploadFile = File(...),
    recording_duration_s: float = Form(0.0),
) -> ProcessResponse:
    data = await audio.read()
    mime_type = audio.content_type or "audio/webm"

    if len(data) < MIN_AUDIO_BYTES:
        raise ValueError("Recording too short. Please speak longer.")

    return await _run_pipeline(data, mime_type, recording_duration_s)


@router.post("/process/stream")
async def process_audio_stream(
    audio: UploadFile = File(...),
    recording_duration_s: float = Form(0.0),
) -> StreamingResponse:
    data = await audio.read()
    mime_type = audio.content_type or "audio/webm"

    if len(data) < MIN_AUDIO_BYTES:
        raise ValueError("Recording too short. Please speak longer.")

    async def event_stream() -> AsyncGenerator[str, None]:
        def emit(payload: dict) -> str:
            return json.dumps(payload) + "\n"

        try:
            yield emit({"type": "progress", "stage": "stt", "message": STAGE_MESSAGES["stt"]})
            t0 = time.perf_counter()
            transcript = await stt.transcribe(data, mime_type)
            stt_latency_s = time.perf_counter() - t0
            yield emit({
                "type": "metric",
                "stage": "stt",
                "duration_s": round(stt_latency_s, 3),
                "message": "Transcription complete",
            })

            yield emit({"type": "progress", "stage": "llm", "message": STAGE_MESSAGES["llm"]})
            t0 = time.perf_counter()
            poem = await llm.generate_poem(transcript)
            llm_latency_s = time.perf_counter() - t0
            yield emit({
                "type": "metric",
                "stage": "llm",
                "duration_s": round(llm_latency_s, 3),
                "message": "Poem generated",
            })

            yield emit({"type": "progress", "stage": "tts", "message": STAGE_MESSAGES["tts"]})
            t0 = time.perf_counter()
            speech = await tts.synthesize(poem)
            tts_latency_s = time.perf_counter() - t0
            yield emit({
                "type": "metric",
                "stage": "tts",
                "duration_s": round(tts_latency_s, 3),
                "message": "Speech synthesized",
            })

            processing_latency_s = stt_latency_s + llm_latency_s + tts_latency_s
            pipeline_metrics = PipelineMetrics(
                recording_duration_s=recording_duration_s,
                stt_latency_s=stt_latency_s,
                llm_latency_s=llm_latency_s,
                tts_latency_s=tts_latency_s,
                processing_latency_s=processing_latency_s,
                playback_start_delay_s=0.0,
                end_to_end_latency_s=recording_duration_s + processing_latency_s,
            )

            result = ProcessResponse(
                transcript=transcript,
                poem=poem,
                audio=base64.b64encode(speech).decode(),
                metrics=pipeline_metrics,
            )

            yield emit({"type": "complete", "data": result.model_dump()})
        except Exception as exc:
            yield emit({"type": "error", "error": str(exc)})

    return StreamingResponse(event_stream(), media_type="application/x-ndjson")


@router.post("/metrics/finalize")
async def finalize_metrics(payload: PipelineMetrics):
    metrics_dict = payload.model_dump()
    metrics.log_pipeline_metrics(metrics_dict)
    metrics.save_metrics(metrics_dict)
    return {"status": "ok"}


@router.get("/metrics/averages")
async def metrics_averages():
    averages = metrics.get_average_metrics()
    if not averages:
        return {"message": "No metrics recorded yet", "averages": None}
    return {"averages": averages}
