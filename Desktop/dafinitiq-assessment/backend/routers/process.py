import base64

from fastapi import APIRouter, File, UploadFile

from schemas import ProcessResponse
from services import llm, stt, tts

router = APIRouter(prefix="/api", tags=["process"])

MIN_AUDIO_BYTES = 1000


@router.post("/process", response_model=ProcessResponse)
async def process_audio(audio: UploadFile = File(...)) -> ProcessResponse:
    data = await audio.read()
    mime_type = audio.content_type or "audio/webm"

    if len(data) < MIN_AUDIO_BYTES:
        raise ValueError("Recording too short. Please speak longer.")

    transcript = await stt.transcribe(data, mime_type)
    poem = await llm.generate_poem(transcript)
    speech = await tts.synthesize(poem)

    return ProcessResponse(
        transcript=transcript,
        poem=poem,
        audio=base64.b64encode(speech).decode(),
    )
