import type { Resume, Job } from "../types";

function normalize(skill: string): string {
  return skill.toLowerCase().trim().replace(/[.\s]+/g, "");
}

function skillsMatch(resumeSkill: string, jobSkill: string): boolean {
  const r = normalize(resumeSkill);
  const j = normalize(jobSkill);
  return r.includes(j) || j.includes(r) || r === j;
}

export function runSkillAnalysis(resume: Resume, job: Job) {
  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of job.required_skills) {
    const found = resume.skills.some((s) => skillsMatch(s, req));
    if (found) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  const score =
    job.required_skills.length === 0
      ? 75
      : Math.round((matched.length / job.required_skills.length) * 100);

  const suggestions: string[] = [];
  if (missing.length > 0) {
    suggestions.push(
      `Add experience or projects highlighting: ${missing.slice(0, 3).join(", ")}.`
    );
  }
  if (score < 60) {
    suggestions.push(
      "Consider tailoring your resume summary to align with the job description keywords."
    );
    suggestions.push(
      "Quantify achievements in your experience section with metrics and outcomes."
    );
  } else if (score < 85) {
    suggestions.push(
      "Strengthen your skills section by grouping related technologies together."
    );
    suggestions.push(
      "Add a brief project that demonstrates your top missing skills."
    );
  } else {
    suggestions.push(
      "Your profile is a strong match — emphasize leadership and impact in your cover letter."
    );
    suggestions.push(
      "Prepare specific examples for each matched skill using the STAR method."
    );
  }

  const interview_questions = [
    `Describe your experience with ${matched[0] || job.required_skills[0] || "the core technologies"} in a production environment.`,
    `How would you approach a challenge mentioned in the ${job.title} role at ${job.company}?`,
    missing.length > 0
      ? `You don't list ${missing[0]} — how would you ramp up quickly if hired?`
      : "Walk us through a project you're most proud of and your specific contributions.",
    "Tell us about a time you had to learn a new technology under a tight deadline.",
    `Why are you interested in the ${job.title} position at ${job.company}?`,
  ];

  const ai_response = `Based on comparing your resume against the ${job.title} role at ${job.company}, you have a ${score}% skill match. You align on ${matched.length} of ${job.required_skills.length} required skills${missing.length > 0 ? `, with gaps in ${missing.join(", ")}` : ""}. ${score >= 75 ? "This is a competitive profile — focus on storytelling in interviews." : "Consider upskilling in the missing areas and reframing adjacent experience."}`;

  return {
    match_score: score,
    matched_skills: matched,
    missing_skills: missing,
    suggestions,
    interview_questions,
    ai_response,
  };
}
