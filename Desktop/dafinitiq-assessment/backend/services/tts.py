import httpx

from config import ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID


async def synthesize(poem: str) -> bytes:
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY is not configured")

    payload = {
        "text": poem,
        "model_id": "eleven_turbo_v2_5",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}",
            headers={
                "xi-api-key": ELEVENLABS_API_KEY,
                "Content-Type": "application/json",
                "Accept": "audio/mpeg",
            },
            json=payload,
        )

    if response.status_code != 200:
        raise ValueError(f"ElevenLabs TTS failed: {response.text}")

    return response.content
