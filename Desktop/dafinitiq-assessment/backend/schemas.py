from pydantic import BaseModel


class ProcessResponse(BaseModel):
    transcript: str
    poem: str
    audio: str
    audio_mime_type: str = "audio/mpeg"


class ErrorResponse(BaseModel):
    error: str
