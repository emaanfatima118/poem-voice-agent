import httpx

from config import DEEPGRAM_API_KEY


async def transcribe(audio: bytes, mime_type: str) -> str:
    if not DEEPGRAM_API_KEY:
        raise ValueError("DEEPGRAM_API_KEY is not configured")

    params = {"model": "nova-2", "smart_format": "true", "language": "en"}

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            "https://api.deepgram.com/v1/listen",
            params=params,
            headers={
                "Authorization": f"Token {DEEPGRAM_API_KEY}",
                "Content-Type": mime_type or "audio/webm",
            },
            content=audio,
        )

    if response.status_code != 200:
        body = response.text
        if "ASR_PAYMENT_REQUIRED" in body or "INSUFFICIENT_CREDITS" in body:
            raise ValueError(
                "Deepgram credits exhausted. Add credits or enable overage at "
                "https://console.deepgram.com/"
            )
        raise ValueError(f"Deepgram STT failed: {body}")

    transcript = (
        response.json()
        .get("results", {})
        .get("channels", [{}])[0]
        .get("alternatives", [{}])[0]
        .get("transcript", "")
        .strip()
    )

    if not transcript:
        raise ValueError("No speech detected. Please try speaking again.")

    return transcript
