import json

from utils.client import client, GROQ_MODEL

SYSTEM_PROMPT = (
    "You are an expert interview coach. "
    "Return only valid JSON. "
    "Ground every suggested_answer in facts from the candidate's resume — "
    "use real projects, skills, companies, and metrics when available. "
    "If the resume lacks detail for a question, say what to admit honestly and how to pivot."
)


def _parse_response(content: str) -> dict:
    cleaned = (
        content.replace("```json", "")
        .replace("```", "")
        .strip()
    )
    return json.loads(cleaned)


def _call_ai(prompt: str) -> dict:
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0,
        response_format={"type": "json_object"},
        max_tokens=8192,
    )
    return _parse_response(response.choices[0].message.content.strip())


def generate_interview_prep(resume_data: dict, job_data: dict | None = None) -> dict:
    job_section = ""
    job_rules = ""
    if job_data:
        job_section = f"""
        Job title: {job_data.get("title", "")}
        Company: {job_data.get("company", "")}
        Required skills: {", ".join(job_data.get("required_skills") or [])}

        Job description:
        {job_data.get("description", "")}
        """
        job_rules = """
        - Include 3-4 role-fit questions referencing this specific job title and responsibilities.
        - Include 3-4 questions probing gaps between job requirements and the resume.
        """

    prompt = f"""
Generate interview preparation for this candidate.

Return JSON with this exact structure:
{{
  "items": [
    {{
      "category": "behavioral | technical | experience | role_fit | gap",
      "question": "The interview question",
      "suggested_answer": "A strong 4-8 sentence answer draft using STAR where appropriate, citing specific resume details",
      "talking_points": ["bullet 1 from resume", "bullet 2"]
    }}
  ]
}}

Rules:
- Generate exactly 12-15 items.
- Mix: 3-4 behavioral, 4-5 technical, 3-4 experience deep-dive, remainder role-fit or gap-focused.
- suggested_answer must reference actual resume content (projects, companies, skills, dates).
- talking_points: 2-4 short bullets the candidate should mention.
- Questions must be specific — no generic "tell me about yourself" without tailoring.
{job_rules}

Resume:
{json.dumps(resume_data, indent=2, default=str)}
{job_section}
"""
    return _call_ai(prompt)
