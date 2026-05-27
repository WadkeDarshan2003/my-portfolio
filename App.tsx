
import React, { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { ProjectPair } from "./components/ProjectPair";
import { ProjectDetail } from "./components/ProjectDetail";
import { AIChat } from "./components/AIChat";
import { Footer } from "./components/Footer";
import { AdminPanel } from "./components/AdminPanel";
import { AdminLogin } from "./components/AdminLogin";
import Navbar from "./components/Navbar";
import { CustomCursor } from "./components/CustomCursor";
import { Process } from "./components/Process";
import { Expertise } from "./components/Expertise";
import { PROJECTS as INITIAL_PROJECTS, DEVELOPER_INFO } from "./data";
import { Project } from "./types";
import { Sun, Moon } from "lucide-react";
import { getProjects, addProject, updateProject, deleteProject } from "./src/services/projectService";
import { testFirebaseConnection } from "./src/services/firebaseTest";
import { migrateProjectsToFirebase, getMigrationStatus } from "./src/services/migrationService";
import { onUserAuthStateChanged } from "./src/services/authService";
import { User } from "firebase/auth";

const App = () => {
  // State for Projects (ONLY from Firebase - no fallback)
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<{
    connected: boolean;
    error?: string;
  }>({ connected: false });
  
  // Authentication State
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Monitor admin authentication state
  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged((user) => {
      setAdminUser(user);
      if (!user) {
        // User logged out, exit admin mode
        setIsAdminMode(false);
        setShowAdminLogin(false);
      }
    });

    return () => unsubscribe();
  }, []);
  
  // Load projects from Firebase ONLY with auto-migration
  useEffect(() => {
    const loadFirebaseProjects = async () => {
      try {
        setLoading(true);
        console.log('🔍 Testing Firebase connection...');
        const connectionTest = await testFirebaseConnection();
        
        setFirebaseStatus({
          connected: connectionTest.connected,
          error: connectionTest.error,
        });
        
        if (connectionTest.connected) {
          console.log('✅ Firebase connected, loading projects...');
          
          // Try to load existing projects first
          const firebaseProjects = await getProjects();
          console.log(`📊 Found ${firebaseProjects.length} projects in Firebase`);
          
          // Only migrate if database is empty
          if (firebaseProjects.length === 0) {
            console.log('📦 Database empty, starting auto-migration...');
            setMigrating(true);
            
            const migrationResult = await migrateProjectsToFirebase(INITIAL_PROJECTS);
            
            if (migrationResult.success) {
              console.log(`✅ Migration complete! ${migrationResult.migrated} projects added`);
              
              // Reload projects after migration
              const newProjects = await getProjects();
              setProjects(newProjects);
              console.log(`📦 Loaded ${newProjects.length} projects after migration`);
            } else {
              console.error(`❌ Migration failed:`, migrationResult.errors);
            }
            
            setMigrating(false);
          } else {
            // Database has projects, use them
            setProjects(firebaseProjects);
          }
        } else {
          console.error('❌ Firebase connection failed:', connectionTest.error);
        }
      } catch (error) {
        console.error('Failed to load Firebase projects:', error);
        setFirebaseStatus({
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadFirebaseProjects();
  }, []);
  
  // Navigation State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Theme State - Initialize based on system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Otherwise check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply theme to document and body
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Force repaint to fix backdrop-filter bug in some browsers during theme switch
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.opacity = '0.99';
      setTimeout(() => {
        navbar.style.opacity = '1';
      }, 0);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log('Toggling theme from', isDarkMode ? 'dark' : 'light', 'to', isDarkMode ? 'light' : 'dark');
    setIsDarkMode(!isDarkMode);
  };

  // --- CRUD Operations for CMS ---
  
  const handleAddProject = async (newProject: Project) => {
    try {
      const projectId = await addProject(newProject);
      if (projectId) {
        const projectWithId = { ...newProject, id: projectId };
        setProjects(prev => [projectWithId, ...prev]);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const projectId = typeof updatedProject.id === 'string' 
        ? updatedProject.id 
        : updatedProject.id?.toString() || '';
      
      if (projectId) {
        await updateProject(projectId, updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id: number | string) => {
    try {
      const projectId = typeof id === 'string' ? id : id?.toString() || '';
      
      if (projectId) {
        await deleteProject(projectId);
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // --- Render Logic ---

  // Loading State
  if (loading) {
    return (
      <>
        {/* Run theme switch immediately in loading state too */}
        <main className="w-full relative min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center transition-colors duration-300">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-900 dark:border-white mb-4"></div>
            <p className="text-slate-900 dark:text-white font-medium">
              {migrating ? '📦 Migrating projects...' : 'Loading the tech'}
            </p>
            <p className="text-slate-600 dark:text-neutral-400 text-sm mt-2">
              {migrating ? 'First-time setup, please wait' : 'Preparing your experience'}
            </p>
          </div>
        </main>
      </>
    );
  }

  // Firebase Connection Error
  if (!firebaseStatus.connected) {
    return (
      <main className="w-full relative min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center transition-colors duration-300 p-8">
        <div className="max-w-2xl text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Firebase Connection Failed</h1>
          <p className="text-slate-700 dark:text-neutral-300 mb-6">{firebaseStatus.error || 'Unable to connect to Firebase'}</p>
          <div className="bg-slate-100 dark:bg-neutral-900 rounded-lg p-6 text-left">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Troubleshooting Steps:</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-neutral-300 text-sm">
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Firebase Console</a></li>
              <li>Select your project: <strong>darshanwadke-portfolio</strong></li>
              <li>Go to Firestore Database → Create Database (if not created)</li>
              <li>Choose "Test Mode" for security rules</li>
              <li>Click "Publish" and wait 60 seconds</li>
              <li>Refresh this page</li>
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg hover:scale-105 transition-transform"
          >
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  // 1. Admin Login View
  if (showAdminLogin) {
    return (
      <AdminLogin 
        onLoginSuccess={() => {
          setShowAdminLogin(false);
          setIsAdminMode(true);
        }}
      />
    );
  }

  // 2. Admin CMS View (only accessible after login)
  if (isAdminMode && adminUser) {
    return (
      <main className="w-full relative min-h-screen bg-white transition-colors duration-300">
        <CustomCursor />
        <AdminPanel 
          projects={projects}
          onAdd={handleAddProject}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          onExit={() => setIsAdminMode(false)}
        />
      </main>
    );
  }

  // 3. Project Detail View
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
    <main className="w-full relative min-h-screen bg-stone-50 dark:bg-black transition-colors duration-300 overflow-x-hidden">
      <CustomCursor />

      <Navbar projects={projects} />

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

      <div className="relative flex flex-col bg-stone-50 dark:bg-black transition-colors duration-300 gap-10 md:gap-0 px-2 py-2 md:px-0 md:py-0 overflow-x-hidden">
        {/* Project Section Background Decoration - Dark Mode Only */}
        <div className="hidden dark:block absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full"></div>
           <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full"></div>
        </div>

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

      <Footer onAdminClick={() => setShowAdminLogin(true)} />

      <AIChat />
    </main>
  );
};

export default App;
