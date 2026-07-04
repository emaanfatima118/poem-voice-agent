# Voice to Poetry Pipeline

Real-time AI voice transformation: speak into your mic, get a poem spoken back.

```
User Speaks → Mic → Deepgram STT → LLM → ElevenLabs TTS → Playback
```

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + TypeScript |
| Backend | FastAPI + httpx |
| STT | Deepgram Nova-2 |
| LLM | Groq / OpenRouter / Gemini |
| TTS | ElevenLabs Turbo v2.5 |

## Setup

### 1. Environment variables

Copy the example env file to the project root and add your API keys:

```bash
cp .env.example .env
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## Usage

1. Click the microphone button.
2. Speak naturally (e.g. *"Today was a beautiful day and I enjoyed walking in the rain."*).
3. Recording stops after ~1.8s of silence, or click again to stop manually.
4. Transcript and poem appear on screen; the poem plays automatically.

## Project Structure

```
voice-to-poetry/
├── .env                    # API keys (you create this)
├── .env.example
├── backend/
│   ├── main.py             # FastAPI app
│   ├── config.py           # Loads root .env
│   ├── schemas.py
│   ├── routers/process.py
│   └── services/
│       ├── stt.py          # Deepgram
│       ├── llm.py          # Poetry generation
│       └── tts.py          # ElevenLabs
└── frontend/
    └── src/
        ├── App.tsx
        ├── hooks/useVoiceRecorder.ts
        ├── api/processAudio.ts
        └── components/
```

## API Keys

| Variable | Provider |
|----------|----------|
| `DEEPGRAM_API_KEY` | [Deepgram](https://console.deepgram.com/) |
| `ELEVENLABS_API_KEY` | [ElevenLabs](https://elevenlabs.io/) |
| `GROQ_API_KEY` | [Groq](https://console.groq.com/) (recommended) |
| `OPENROUTER_API_KEY` | [OpenRouter](https://openrouter.ai/) (optional) |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) (optional) |
