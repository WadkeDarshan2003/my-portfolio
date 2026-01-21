
import React, { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { ProjectPair } from "./components/ProjectPair";
import { ProjectDetail } from "./components/ProjectDetail";
import { AIChat } from "./components/AIChat";
import { Footer } from "./components/Footer";
import { AdminPanel } from "./components/AdminPanel";
import { Navbar } from "./components/Navbar";
import { CustomCursor } from "./components/CustomCursor";
import { Process } from "./components/Process";
import { Expertise } from "./components/Expertise";
import { PROJECTS as INITIAL_PROJECTS, DEVELOPER_INFO } from "./data";
import { Project } from "./types";
import { Sun, Moon } from "lucide-react";

const App = () => {
  // State for Projects (Simulating Database)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // Navigation State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or logic here if needed, default is light
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- CRUD Operations for CMS ---
  
  const handleAddProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleDeleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // --- Render Logic ---

  // 1. Admin CMS View
  if (isAdminMode) {
    return (
      <AdminPanel 
        projects={projects}
        onAdd={handleAddProject}
        onUpdate={handleUpdateProject}
        onDelete={handleDeleteProject}
        onExit={() => setIsAdminMode(false)}
      />
    );
  }

  // 2. Project Detail View
  if (selectedProject) {
    return (
      <main className="w-full relative bg-stone-50 dark:bg-black min-h-screen transition-colors duration-300">
        <CustomCursor />
        
        {/* Top Right Actions - Fixed for consistency */}
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-3">
           <a 
              href={`mailto:${DEVELOPER_INFO.email}`}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs md:text-sm font-medium rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span> Hire Me
            </a>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-3xl border border-white/40 dark:border-neutral-800 shadow-lg text-slate-700 dark:text-neutral-200 hover:scale-110 transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>

        <ProjectDetail 
          project={selectedProject} 
          onBack={() => setSelectedProject(null)} 
        />
        <AIChat />
      </main>
    );
  }

  // 3. Main Portfolio View (Standard Scroll)
  
  // Filter for published projects
  const publishedProjects = projects.filter(p => p.status === 'published');

  // Group projects into pairs for the split layout
  const projectPairs: { left: Project; right?: Project }[] = [];
  for (let i = 0; i < publishedProjects.length; i += 2) {
    projectPairs.push({
      left: publishedProjects[i],
      right: publishedProjects[i + 1] || undefined
    });
  }

  return (
    <main className="w-full relative min-h-screen bg-stone-50 dark:bg-black transition-colors duration-300">
      <CustomCursor />
      <Navbar />

      {/* Top Right Actions - Fixed */}
      <div className="fixed top-6 right-6 z-[60] flex items-center gap-3">
         <a 
            href={`mailto:${DEVELOPER_INFO.email}`}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs md:text-sm font-medium rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span> Hire Me
          </a>
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-3xl border border-white/40 dark:border-neutral-800 shadow-lg text-slate-700 dark:text-neutral-200 hover:scale-110 transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
      </div>

      <Hero />

      <div className="flex flex-col bg-stone-50 dark:bg-black transition-colors duration-300">
        {projectPairs.map((pair, index) => (
          <ProjectPair 
            key={index} 
            projectLeft={pair.left} 
            projectRight={pair.right}
            onProjectClick={setSelectedProject}
          />
        ))}
        {publishedProjects.length === 0 && (
          <div className="py-32 text-center text-slate-400 min-h-[50vh] flex items-center justify-center">
            <p>No published projects to display yet.</p>
          </div>
        )}
      </div>

      <Process />
      
      <Expertise />

      <Footer onAdminClick={() => setIsAdminMode(true)} />

      <AIChat />
    </main>
  );
};

export default App;
