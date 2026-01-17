export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  stack: string[];
  duration: string;
  speciality: string;
  image: string;
  theme: 'light' | 'dark';
  bgColor: string;
  status: 'published' | 'draft';
  gallery?: string[];
  details?: { title: string; content: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}