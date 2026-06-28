import json

from utils.client import client, GROQ_MODEL

def parse_job_description(job_description: str):

    prompt = f"""
You are an expert technical recruiter.

Extract structured information from the following job description.

IMPORTANT RULES

- Return ONLY valid JSON.
- No markdown.
- No explanations.
- If information is unavailable use null or [].
- Do not invent information.

Return JSON with this exact structure:

{{
    "title": "",
    "company": "",
    "location": "",
    "employment_type": "",
    "experience_required": "",
    "education_required": "",
    "required_skills": [],
    "preferred_skills": [],
    "responsibilities": [],
    "qualifications": [],
    "description": ""
}}

Job Description:

{job_description}
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role":"system",
                "content":"Return only valid JSON."
            },
            {
                "role":"user",
                "content":prompt
            }
        ],
        temperature=0
    )

    content = (
        response
        .choices[0]
        .message
        .content
        .replace("```json","")
        .replace("```","")
        .strip()
    )

    return json.loads(content)