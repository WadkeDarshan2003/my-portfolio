export interface Project {
  id: string | number;
  title: string;
  category: string;
  description: string;
  stack: string[];
  duration: string;
  speciality: string;
  image: string;
  theme: 'light' | 'dark';
  bgColor: string;
  darkGradient?: string;
  status: 'published' | 'draft';
  gallery?: string[];
  details?: { title: string; content: string }[];
  websiteUrl?: string;
  sourceCodeUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface HistoryItem {
  role: string;
  organization: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface AchievementCardData {
  id: string | number;
  type: "experience" | "education" | "certification";
  eyebrow: string;
  title: string;
  organization?: string;
  issuer?: string;
  period?: string;
  issued?: string;
  location?: string;
  description?: string;
  highlights?: string[];
  skills?: string[];
  credentialId?: string;
  website?: string; // Used behind the scenes to fetch logos via Clearbit
  status: 'published' | 'draft';
  order?: number; // Optional order for manual sorting
}
export interface DeveloperHistory {
  education: HistoryItem[];
  experience: HistoryItem[];
  certifications?: {
    title: string;
    issuer: string;
    issued: string;
    credentialId?: string;
    skills?: string[];
  }[];
}
