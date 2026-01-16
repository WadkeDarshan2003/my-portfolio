import { Project } from "./types";

export const DEVELOPER_INFO = {
  name: "Darshan Wadke",
  role: "Full-Stack Developer",
  tagline: "Building digital experiences that matter.",
  bio: "I craft digital solutions with precision and clarity. My work bridges the gap between complex engineering and intuitive user experience, ensuring scalable and performant applications.",
  skills: ["React", "Node.js", "Generative AI", "WordPress", "Firebase"],
  location: "San Francisco, CA",
  email: "darshan@example.com"
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-Commerce Reimagined",
    category: "Web Application",
    description: "A headless commerce platform built for speed and conversion. Features real-time inventory and AI-driven recommendations.",
    stack: ["Next.js", "Shopify API", "Tailwind"],
    duration: "3 Months",
    speciality: "Performance Optimization",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#F5F5F4]" // Stone 100
  },
  {
    id: 2,
    title: "FinTech Dashboard",
    category: "Dashboard",
    description: "Complex data visualization tool for a fintech startup. Handles millions of data points with smooth D3.js transitions.",
    stack: ["React", "D3.js", "Firebase"],
    duration: "2 Months",
    speciality: "Data Visualization",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#F0F9FF]" // Sky 50
  },
  {
    id: 3,
    title: "AI Content Generator",
    category: "SaaS Product",
    description: "An AI-powered writing assistant helping marketers generate copy in seconds. Integrated with OpenAI and Gemini.",
    stack: ["Python", "FastAPI", "React"],
    duration: "4 Months",
    speciality: "LLM Integration",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#FDF4FF]" // Fuchsia 50
  },
  {
    id: 4,
    title: "Botanical Store",
    category: "E-commerce",
    description: "A boutique plant shop website with a focus on serene aesthetics and user experience.",
    stack: ["Vue.js", "Nuxt", "Stripe"],
    duration: "6 Weeks",
    speciality: "UX/UI Design",
    image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2670&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#ECFEFF]" // Cyan 50
  },
  {
    id: 5,
    title: "Crypto Wallet App",
    category: "Mobile App",
    description: "A cross-platform mobile wallet for managing crypto assets securely.",
    stack: ["React Native", "TypeScript", "Redux"],
    duration: "5 Months",
    speciality: "Security Architecture",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2555&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#FFFBEB]" // Amber 50
  },
  {
    id: 6,
    title: "Travel Journal",
    category: "Social Platform",
    description: "A community for travelers to share stories and map out their journeys.",
    stack: ["MERN Stack", "Mapbox"],
    duration: "3 Months",
    speciality: "Geospatial Data",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2670&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#F8FAFC]" // Slate 50
  }
];
