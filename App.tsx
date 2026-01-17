import React, { useState } from "react";
import { Hero } from "./components/Hero";
import { ProjectPair } from "./components/ProjectPair";
import { ProjectDetail } from "./components/ProjectDetail";
import { AIChat } from "./components/AIChat";
import { Footer } from "./components/Footer";
import { AdminPanel } from "./components/AdminPanel";
import { PROJECTS as INITIAL_PROJECTS } from "./data";
import { Project } from "./types";

const App = () => {
  // State for Projects (Simulating Database)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // Navigation State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

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
      <main className="w-full relative bg-stone-50 min-h-screen">
        <ProjectDetail 
          project={selectedProject} 
          onBack={() => setSelectedProject(null)} 
        />
        <AIChat />
      </main>
    );
  }

  // 3. Main Portfolio View
  
  // Filter for published projects
  const publishedProjects = projects.filter(p => p.status === 'published');

  // Group projects into pairs for the split layout
  const projectPairs = [];
  for (let i = 0; i < publishedProjects.length; i += 2) {
    projectPairs.push({
      left: publishedProjects[i],
      right: publishedProjects[i + 1] || undefined
    });
  }

  return (
    <main className="w-full relative bg-stone-50 min-h-screen">
      <Hero />
      
      <div className="flex flex-col">
        {projectPairs.map((pair, index) => (
          <ProjectPair 
            key={index} 
            projectLeft={pair.left} 
            projectRight={pair.right}
            onProjectClick={setSelectedProject}
          />
        ))}
        {publishedProjects.length === 0 && (
          <div className="py-32 text-center text-slate-400">
            <p>No published projects to display yet.</p>
          </div>
        )}
      </div>

      <Footer onAdminClick={() => setIsAdminMode(true)} />

      <AIChat />
    </main>
  );
};

export default App;