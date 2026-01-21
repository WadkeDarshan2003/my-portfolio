
import { Project } from "./types";

export const TECH_LINKS: Record<string, string> = {
  "React": "https://react.dev/",
  "React Native": "https://reactnative.dev/",
  "Node.js": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
  "Express.js": "https://expressjs.com/",
  "MongoDB": "https://www.mongodb.com/",
  "TypeScript": "https://www.geeksforgeeks.org/typescript/typescript-tutorial/",
  "Generative AI": "https://generativeai.net/",
  "Firebase": "https://firebase.google.com/",
  "SQL": "https://www.w3schools.com/sql/",
  "GitLab": "https://about.gitlab.com/",
  "GitHub": "https://github.com/",
  "WordPress": "https://wordpress.com/",
  "CSS": "https://www.w3schools.com/css/",
  "Tailwind CSS": "https://tailwindcss.com/",
  "Tailwind": "https://tailwindcss.com/",
  "Framer Motion": "https://www.npmjs.com/package/framer-motion"
};

export const getTechUrl = (tech: string) => {
  return TECH_LINKS[tech] || `https://www.geeksforgeeks.org/?s=${encodeURIComponent(tech)}`;
};

// Original Services mapped to Icons
export const SERVICES_WITH_ICONS = [
  { title: "Mobile Applications", icon: "Smartphone" },
  { title: "Windows Applications", icon: "Monitor" },
  { title: "CMS Systems", icon: "Database" },
  { title: "Portfolio Websites", icon: "Layout" },
  { title: "Business Web Presence", icon: "Globe" },
  { title: "ERP Solutions", icon: "Server" },
  { title: "To-Do Applications", icon: "CheckSquare" }
];

// Original Skills mapped to SimpleIcons Slugs
export const STACK_LOGOS = [
  { name: "React", slug: "react" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Express.js", slug: "express" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "TypeScript", slug: "typescript" },
  { name: "React Native", slug: "react" }, // Moved here to separate from React
  { name: "Generative AI", slug: "google" }, // Using Google as proxy for GenAI/Gemini
  { name: "Firebase", slug: "firebase" },
  { name: "SQL", slug: "mysql" }, // Using MySQL as generic SQL logo
  { name: "GitLab", slug: "gitlab" },
  { name: "GitHub", slug: "github" },
  { name: "WordPress", slug: "wordpress" },
  { name: "CSS", slug: "css3" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Framer Motion", slug: "framer" }
];

export const DEVELOPER_INFO = {
  name: "Darshan Wadke",
  role: "Full-Stack Developer",
  tagline: "Building digital experiences that matter.",
  bio: "I craft digital solutions with precision and clarity. My work bridges the gap between complex engineering and intuitive user experience, ensuring scalable and performant applications.",
  // Technologies (How I build)
  skills: [
    "React", "React Native", "Node.js", "Express.js", "MongoDB", "TypeScript", 
    "Generative AI", "Firebase", "SQL",
    "GitLab", "GitHub", "WordPress", "CSS", "Tailwind CSS", "Framer Motion"
  ],
  // Deliverables (What I build)
  services: [
    "Mobile Applications",
    "Windows Applications",
    "CMS Systems",
    "Portfolio Websites",
    "Business Web Presence",
    "ERP Solutions",
    "To-Do Applications"
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com"
  },
  location: "San Francisco, CA",
  email: "darshan@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Zenith Fitness",
    category: "Mobile Application",
    description: "A comprehensive health tracking app featuring workout plans, calorie counting, and real-time heart rate monitoring via Bluetooth integration.",
    stack: ["React Native", "Firebase", "HealthKit"],
    duration: "4 Months",
    speciality: "Cross-Platform Mobile",
    image: "https://images.unsplash.com/photo-1526502900729-6804dc3d4672?q=80&w=2555&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#FFF1F2]", // Rose 50
    status: 'published',
    gallery: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2574&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2669&auto=format&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Titan Asset Manager",
    category: "Windows Application",
    description: "Native desktop software for enterprise IT asset management. Features local network scanning, hardware auditing, and report generation.",
    stack: ["C#", ".NET MAUI", "SQL Server"],
    duration: "6 Months",
    speciality: "Desktop Architecture",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#F5F3FF]", // Violet 50
    status: 'published',
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2676&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    title: "Nova Press CMS",
    category: "CMS System",
    description: "A headless content management system designed for digital newsrooms. Supports custom workflows, multi-role editing, and instant API deployment.",
    stack: ["Node.js", "GraphQL", "MongoDB"],
    duration: "5 Months",
    speciality: "Backend Scalability",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2674&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#ECFEFF]", // Cyan 50
    status: 'published',
    gallery: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop"
    ]
  },
  {
    id: 4,
    title: "Lens & Light",
    category: "Portfolio Website",
    description: "An immersive portfolio for an award-winning photographer. Uses heavy GPU acceleration for smooth transitions between high-res galleries.",
    stack: ["Astro", "Three.js", "Tailwind"],
    duration: "3 Weeks",
    speciality: "Creative Interactions",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2574&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#FAFAF9]", // Stone 50
    status: 'published',
    gallery: [
       "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?q=80&w=2672&auto=format&fit=crop"
    ]
  },
  {
    id: 5,
    title: "Apex Consulting",
    category: "Business Web Presence",
    description: "Corporate website for a top-tier consultancy firm. Focuses on accessibility, SEO dominance, and fast load times for global clients.",
    stack: ["Next.js", "Sanity", "Vercel"],
    duration: "2 Months",
    speciality: "SEO & Performance",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#F0FDFA]", // Teal 50
    status: 'published',
    gallery: [
      "https://images.unsplash.com/photo-1486406141726-eda6378800ee?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
    ]
  },
  {
    id: 6,
    title: "Global Chain ERP",
    category: "ERP Solution",
    description: "Large-scale Enterprise Resource Planning system for logistics. Modules include supply chain tracking, warehouse management, and HR.",
    stack: ["Angular", "Java Spring", "PostgreSQL"],
    duration: "8 Months",
    speciality: "Complex Data Handling",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#F1F5F9]", // Slate 100
    status: 'published',
    gallery: [
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566576912906-253c72323a63?q=80&w=2670&auto=format&fit=crop"
    ]
  },
  {
    id: 7,
    title: "TaskFlow Pro",
    category: "To-Do Application",
    description: "A productivity app focusing on the flow state. Features Kanban boards, pomodoro timers, and offline-first synchronization.",
    stack: ["Vue.js", "Pinia", "PWA"],
    duration: "6 Weeks",
    speciality: "Local-First State",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2672&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#FFF7ED]", // Orange 50
    status: 'published',
    gallery: [
      "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=2671&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=2676&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=2632&auto=format&fit=crop"
    ]
  },
  {
    id: 8,
    title: "Botanical Store",
    category: "E-Commerce",
    description: "A boutique plant shop website with a focus on serene aesthetics and user experience.",
    stack: ["Shopify", "Liquid", "JS"],
    duration: "4 Weeks",
    speciality: "E-commerce UX",
    image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2670&auto=format&fit=crop",
    theme: 'light',
    bgColor: "bg-[#F0FFF4]", // Green 50
    status: 'published',
    gallery: [
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1463320898484-cdee8141c787?q=80&w=2670&auto=format&fit=crop"
    ]
  }
];
