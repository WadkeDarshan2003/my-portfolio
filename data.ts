
import { DeveloperHistory } from "./types";

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
  "Shopify": "https://www.shopify.com/",
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
  { title: "Customized Plugins", icon: "Puzzle" },
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
    { name: "GitHub", slug: "github" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Python", slug: "python" },
  { name: "React Native", slug: "react" }, // Moved here to separate from React
  { name: "Generative AI", slug: "google" }, // Using Google as proxy for GenAI/Gemini
  { name: "Firebase", slug: "firebase" },
  { name: "SQL", slug: "mysql" }, // Using MySQL as generic SQL logo
  { name: "GitLab", slug: "gitlab" },
  { name: "WordPress", slug: "wordpress" },
  { name: "Shopify", slug: "shopify" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Bootstrap", slug: "bootstrap" },
  { name: "Framer Motion", slug: "framer" },
  { name: "JavaScript", slug: "javascript" }
];

export const DEVELOPER_INFO = {
  name: "Darshan Wadke",
  role: "Full Stack Developer",
  tagline: "AI Workflows | Automation | Modern Web Applications | Portfolio Websites | ERP Solutions | E-Commerce Websites | AWS | Firebase",
  bio: "I craft digital solutions with precision and clarity. My work bridges the gap between complex engineering and intuitive user experience, ensuring scalable and performant applications.",
  // Technologies (How I build)
  skills: [
    "React", "React Native", "Node.js", "Express.js", "MongoDB", "TypeScript", 
    "JavaScript", "Python",
    "Generative AI", "Firebase", "SQL",
    "GitLab", "GitHub", "WordPress", "Shopify", "Tailwind CSS", "Bootstrap", "Framer Motion"
  ],
  // Deliverables (What I build)
  services: [
    "Mobile Applications",
    "Windows Applications",
    "CMS Systems",
    "Portfolio Websites",
    "Customized Plugins",
    "Business Web Presence",
    "ERP Solutions",
    "To-Do Applications"
  ],
  socials: {
    github: "https://github.com/WadkeDarshan2003",
    linkedin: "https://www.linkedin.com/in/darshan-wadke-57a45b234/",
    whatsapp: "https://wa.me/919307710946",
    instagram: "https://www.instagram.com/_darshan_sachin_wadke/"
  },
  location: "India",
  phone: "+91 9307710946",
  email: "wadkedarshan2003@gmail.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
};

export const DEVELOPER_HISTORY: DeveloperHistory = {
  education: [
    {
      role: "Master of Computer Applications",
      organization: "Sinhgad Institute Of Management",
      period: "Not listed",
      location: "Not listed",
      description: "Masters in Computer Application with focus on computer programming and specific software applications.",
      highlights: [
        "Program: Computer Application",
        "Specialization: Computer Programming, Specific Applications"
      ]
    }
  ],
  experience: [
    {
      role: "Full Stack Developer",
      organization: "Kydoscope",
      period: "Apr 2025 - Present",
      location: "Pune District, Maharashtra, India",
      description: "Working on full-stack development of a platform that empowers interior designers.",
      highlights: [
        "Employment type: Full-time",
        "LinkedIn visible skills include WordPress and JavaScript"
      ]
    },
    {
      role: "Front End Intern",
      organization: "INFOTRIXS",
      period: "Jul 2023 - Aug 2023",
      location: "Pune District, Maharashtra, India (Remote)",
      description: "Contributed as a front-end intern on short-cycle deliverables and reviews.",
      highlights: [
        "Employment type: Internship",
        "LinkedIn visible skills include Code Review and Web Design"
      ]
    }
  ]
};

export const DEVELOPER_CERTIFICATIONS = [
  {
    title: "Certificate of completion: Introduction to subagents",
    issuer: "Anthropic",
    issued: "May 2026",
    credentialId: "to3jt7dxdvdz",
    skills: ["AI Subagents", "Claude Code Subagents"]
  },
  {
    title: "Introduction to Cyber Security",
    issuer: "Infosys Springboard",
    issued: "Feb 2026",
    skills: ["Cybersecurity"]
  },
  {
    title: "Cloud Platform Job Simulation",
    issuer: "Verizon Communications Inc. (Forage)",
    issued: "Aug 2025",
    credentialId: "TAx37kEuQeTC3Qs2a",
    skills: ["Cloud Platform"]
  }
];
