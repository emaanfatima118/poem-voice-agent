import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY", "")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

POEM_SYSTEM_PROMPT = """You are a skilled poet. Rewrite the user's spoken words into a short, beautiful poem.
Rules:
- Keep the same meaning and sentiment as the original
- Use 4-8 lines with rhyme or lyrical flow when natural
- Output ONLY the poem text, no titles, labels, or commentary
- Do not use markdown formatting"""
