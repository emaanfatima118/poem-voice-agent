import json

from utils.client import client, GROQ_MODEL

def analyze_resume(resume_data):

    prompt = f"""
        You are an expert ATS recruiter and technical hiring manager.

        Analyze the following resume.

        IMPORTANT RULES:
        - Return ONLY valid JSON.
        - Do NOT wrap the response inside ```json.
        - Do NOT include explanations.
        - If information is unavailable, use null or [].
        - The response MUST exactly follow the schema below.

        JSON Schema:

        {{
        "ai_response": "Brief overall summary of the candidate.",
        "strengths": [],
        "weaknesses": [],
        "match_score": 0,
        "matched_skills": [],
        "missing_skills": [],
        "suggestions": []
        }}

        Instructions:

        1. Give an ATS match score from 0-100 based on the overall quality of the resume.
        2. Identify the candidate's strengths.
        3. Identify weaknesses or missing information.
        4. List all major technical and soft skills found in the resume under matched_skills.
        5. Suggest important missing skills that would improve employability.
        6. Give actionable improvement suggestions (4-6 items).
        7. Write a concise professional summary in ai_response.
        8. Do NOT include interview questions — those are handled separately.

        Resume:

        {json.dumps(resume_data, indent=2, default=str)}
        """

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert ATS system. "
                    "Always respond with valid JSON only."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0,
        response_format={"type": "json_object"},
        max_tokens=4096,
    )

    content = response.choices[0].message.content.strip()

    return json.loads(content)

def analyze_resume_job(resume_data, job_data):
    prompt = f"""
        You are a senior ATS recruiter.

        Compare the candidate's resume against the job description.

        Return ONLY valid JSON.

        Format:

        {{
            "strengths": [],
            "weaknesses": [],
            "match_score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "suggestions": [],
            "ai_response": ""
        }}

        Rules:

        - match_score must be between 0 and 100.
        - matched_skills should contain only skills present in BOTH resume and job.
        - missing_skills should contain skills required in the job but missing from the resume.
        - suggestions: 4-6 actionable items to improve the resume for this job.
        - ai_response: concise recruiter-style evaluation (3-6 sentences).
        - Do NOT include interview questions.
        - Return ONLY JSON.

        Resume:

        {json.dumps(resume_data, indent=2, default=str)}

        -------------------------------------

        Job Description:

        {job_data["description"]}
        """
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": "Return only valid JSON.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0,
        response_format={"type": "json_object"},
        max_tokens=4096,
    )

    content = (
        response.choices[0]
        .message
        .content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(content)
