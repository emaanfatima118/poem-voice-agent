import httpx

from config import (
    GROQ_API_KEY,
    POEM_SYSTEM_PROMPT,
)


async def generate_poem(transcript: str) -> str:
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": POEM_SYSTEM_PROMPT},
            {"role": "user", "content": f'Transform this into a poem:\n\n"{transcript}"'},
        ],
        "temperature": 0.8,
        "max_tokens": 300,
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
        )

    if response.status_code != 200:
        raise ValueError(f"Groq LLM failed: {response.text}")

    poem = response.json()["choices"][0]["message"]["content"].strip()
    if not poem:
        raise ValueError("LLM returned empty poem")
    return poem