export interface User {
  _id: string;
  full_name: string;
  email: string;
  profile_picture?: string;
  created_at: string;
}

export interface Education {
  degree: string;
  institution: string;
  year?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration?: string;
  description?: string;
}

export interface Project {
  title: string;
  description?: string;
  technologies?: string[];
}

export interface Resume {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  certifications?: string[];
  languages?: string[];
  raw_text: string;
  uploaded_at: string;
}

export interface Job {
  _id: string;
  user_id?: string;
  title: string;
  company?: string | null;
  location?: string | null;
  employment_type?: string | null;
  experience_required?: string | null;
  education_required?: string | null;
  required_skills: string[];
  preferred_skills?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  description: string;
  created_at?: string;
}

export interface Analysis {
  _id: string;
  user_id: string;
  resume_id: string;
  job_id?: string;
  ai_response?: string;
  analysis_summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
  created_at: string;
  interview_questions?: string[]; // legacy analyses only
}

export interface InterviewItem {
  category: string;
  question: string;
  suggested_answer: string;
  talking_points: string[];
}

export interface InterviewSession {
  _id: string;
  user_id: string;
  resume_id: string;
  job_id?: string;
  items: InterviewItem[];
  created_at: string;
}

export interface QueryHistory {
  _id: string;
  user_id: string;
  query: string;
  response: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
}

export function analysisSummary(a: Analysis): string {
  return a.ai_response || a.analysis_summary || "";
}
