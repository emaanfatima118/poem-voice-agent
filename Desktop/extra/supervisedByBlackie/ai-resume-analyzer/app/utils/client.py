from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

client = Groq(
    api_key=os.getenv("API_KEY")
)