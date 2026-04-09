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
  titleFont?: string;
  descriptionFont?: string;
  sectionTitleFont?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}