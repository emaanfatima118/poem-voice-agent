import json
from utils.client import client, GROQ_MODEL
def extract_resume_structured(raw_text: str, user_id: str = None):

    prompt = f"""
You are an expert resume parser.

Extract structured data from the resume text below.

STRICT RULES:
- Return ONLY valid JSON
- No explanations
- No markdown
- Follow this exact schema structure
- If field is missing, use null or empty list []

SCHEMA:
{{
  "user_id": "{user_id}",
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "skills": [],
  "education": [
    {{
      "degree": "",
      "institution": "",
      "year": ""
    }}
  ],
  "experience": [
    {{
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }}
  ],
  "projects": [
    {{
      "title": "",
      "description": "",
      "technologies": []
    }}
  ],
  "certifications": [],
  "languages": [],
  "attachments": [],
  "raw_text": "{raw_text}"
}}

RESUME TEXT:
{raw_text}
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": "You are a strict JSON generator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )

    result = response.choices[0].message.content

    return json.loads(result)