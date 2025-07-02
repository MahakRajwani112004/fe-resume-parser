export interface Contact {
  email: string;
  phone: string;
  linkedin: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  duration: string;
  responsibilities: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ParsedResumeData {
  name: string;
  contact: Contact;
  summary: string;
  totalExperienceYears: number | null;
  skills: string[];
  workExperience: WorkExperience[];
  projects: Project[];
  education: Education[];
}

export interface PreviewUrl {
  name: string;
  resume_url: string;
}

export interface SearchResult {
  agent_used: string;
  answer: string;
  matched_candidates: string[];
  preview_urls?: PreviewUrl[];
}

export interface ResumeDatabase {
  id: string;
  filename: string;
  uploadDate: string;
  parsedData: ParsedResumeData;
  relevanceScore: number;
  rawText: string;
  processingStatus: 'processing' | 'completed' | 'error';
}