
import React, { Suspense, lazy, useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { CircularProjectSlider } from "./components/CircularProjectSlider";
import { AIChat } from "./components/AIChat";
import { Footer } from "./components/Footer";
import Navbar from "./components/Navbar";
import { CustomCursor } from "./components/CustomCursor";
import { AudioPlayer } from "./components/AudioPlayer";
import { Process } from "./components/Process";
import { Expertise } from "./components/Expertise";
import { Achievement } from "./components/Achievement";
import { DEVELOPER_INFO } from "./data";
import { Project, AchievementCardData } from "./types";
import { Sun, Moon } from "lucide-react";
import { subscribeToProjects, addProject, updateProject, deleteProject } from "./src/services/projectService";
import { subscribeToAchievements, addAchievement, updateAchievement, deleteAchievement } from "./src/services/achievementService";
import { onUserAuthStateChanged } from "./src/services/authService";
import { User } from "firebase/auth";

const ProjectDetail = lazy(() =>
  import("./components/ProjectDetail").then((module) => ({ default: module.ProjectDetail }))
);
const AdminPanel = lazy(() =>
  import("./components/AdminPanel").then((module) => ({ default: module.AdminPanel }))
);
const AdminLogin = lazy(() =>
  import("./components/AdminLogin").then((module) => ({ default: module.AdminLogin }))
);

const ViewFallback = () => (
  <main className="w-full min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-neutral-700 dark:border-t-white animate-spin" />
  </main>
);

const App = () => {
  // State for Projects (ONLY from Firebase - no fallback)
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<AchievementCardData[]>([]);
  const [loading, setLoading] = useState(true);
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
  
  // Load projects and achievements from Firebase only. Migration scripts are not
  // run from the website to avoid creating duplicates on normal page loads.
  // Load projects and achievements using real-time cache-first listeners
  useEffect(() => {
    let projectsLoaded = false;
    let achievementsLoaded = false;

    const checkDone = () => {
      if (projectsLoaded && achievementsLoaded) {
        setLoading(false);
        setFirebaseStatus({ connected: true });
      }
    };

    setLoading(true);

    const unsubProjects = subscribeToProjects(
      (data) => {
        setProjects(data);
        if (!projectsLoaded) {
          projectsLoaded = true;
          checkDone();
        }
      },
      (error) => {
        console.error('Failed to load projects:', error);
        setFirebaseStatus({ connected: false, error: error.message });
        setLoading(false);
      }
    );

    const unsubAchievements = subscribeToAchievements(
      (data) => {
        setAchievements(data);
        if (!achievementsLoaded) {
          achievementsLoaded = true;
          checkDone();
        }
      },
      (error) => {
        console.error('Failed to load achievements:', error);
        setFirebaseStatus({ connected: false, error: error.message });
        setLoading(false);
      }
    );

    return () => {
      unsubProjects();
      unsubAchievements();
    };
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

  // --- CRUD Operations for Achievements ---
  const handleAddAchievement = async (newAchievement: AchievementCardData) => {
    try {
      const achievementId = await addAchievement(newAchievement);
      if (achievementId) {
        const achievementWithId = { ...newAchievement, id: achievementId };
        setAchievements(prev => [achievementWithId, ...prev]);
      } else {
        throw new Error('Achievement was not created');
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  const handleUpdateAchievement = async (updatedAchievement: AchievementCardData) => {
    try {
      const achievementId = updatedAchievement.id.toString();
      if (achievementId) {
        const success = await updateAchievement(achievementId, updatedAchievement);
        if (!success) {
          throw new Error('Achievement was not updated');
        }
        setAchievements(prev => prev.map(a => a.id === updatedAchievement.id ? updatedAchievement : a));
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  const handleDeleteAchievement = async (id: number | string) => {
    try {
      const achievementId = id.toString();
      if (achievementId) {
        const success = await deleteAchievement(achievementId);
        if (!success) {
          throw new Error('Achievement was not deleted');
        }
        setAchievements(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  // --- Render Logic ---

  // Loading State - Restored full screen block to prevent CLS
  if (loading) {
    return (
      <>
        {/* Run theme switch immediately in loading state too */}
        <main className="w-full relative min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center transition-colors duration-700">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-900 dark:border-white mb-4"></div>
            <p className="text-slate-900 dark:text-white font-medium">
              Loading the tech
            </p>
            <p className="text-slate-600 dark:text-neutral-400 text-sm mt-2">
              Preparing your experience
            </p>
          </div>
        </main>
      </>
    );
  }

  // Firebase Connection Error
  if (!firebaseStatus.connected) {
    return (
      <main className="w-full relative min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center transition-colors duration-700 p-8">
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
      <Suspense fallback={<ViewFallback />}>
        <AdminLogin 
          onLoginSuccess={() => {
            setShowAdminLogin(false);
            setIsAdminMode(true);
          }}
        />
      </Suspense>
    );
  }

  // 2. Admin CMS View (only accessible after login)
  if (isAdminMode && adminUser) {
    return (
      <main className="w-full relative min-h-screen bg-white transition-colors duration-700">
        <CustomCursor />
        <Suspense fallback={<ViewFallback />}>
          <AdminPanel 
            projects={projects}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            achievements={achievements}
            onAddAchievement={handleAddAchievement}
            onUpdateAchievement={handleUpdateAchievement}
            onDeleteAchievement={handleDeleteAchievement}
            onExit={() => setIsAdminMode(false)}
          />
        </Suspense>
      </main>
    );
  }

  // 3. Main and Project Detail Views
  
  // Filter for published projects
  const publishedProjects = projects.filter(p => p.status === 'published');

  return (
    <>
      <CustomCursor />
      <AIChat />

      {/* Top Right Actions - Shared fixed overlay */}
      <div className="fixed top-6 right-6 z-[60] flex items-center gap-3">
         <a 
            href={`mailto:${DEVELOPER_INFO.email}`}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs md:text-sm font-medium rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span> Hire Me
          </a>
          <AudioPlayer />
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white/80 dark:bg-black/75 backdrop-blur-sm border border-white/40 dark:border-neutral-800 shadow-lg text-slate-700 dark:text-neutral-200 hover:scale-110 transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
      </div>

      {selectedProject ? (
        <main className="w-full relative bg-stone-50 dark:bg-black min-h-screen transition-colors duration-700">
          <Suspense fallback={<ViewFallback />}>
            <ProjectDetail 
              project={selectedProject} 
              onBack={() => setSelectedProject(null)} 
            />
          </Suspense>
        </main>
      ) : (
        <main className="w-full relative min-h-screen bg-stone-50 dark:bg-black transition-colors duration-700">
          <Navbar projects={projects} />
          
          {/* Parallax Hero Wrapper (Using fixed instead of sticky to prevent Safari/Chrome flashing bugs) */}
          <div className="fixed top-0 left-0 h-screen w-full z-0 overflow-hidden transform-gpu pointer-events-none">
            <div className="pointer-events-auto h-full w-full">
              <Hero />
            </div>
          </div>
          
          {/* Main Content Wrapper (Slides over Hero) */}
          <div className="relative z-20 isolate transform-gpu bg-stone-50 dark:bg-black transition-colors duration-700 mt-[100vh]">
            {/* Opaque seam cover — prevents fixed hero from ever showing through at the join */}
            <div className="absolute -top-1 left-0 w-full h-4 bg-stone-50 dark:bg-black transition-colors duration-700 z-10" />
            <Achievement achievements={achievements.filter(a => a.status === 'published')} />
            
            <div id="projects">
              {publishedProjects.length === 0 ? (
                <div className="py-32 text-center text-slate-400 min-h-[50vh] flex items-center justify-center relative z-10">
                  <p>No published projects to display yet.</p>
                </div>
              ) : (
                <CircularProjectSlider 
                  projects={publishedProjects} 
                  onProjectClick={setSelectedProject} 
                />
              )}
            </div>
            <Process />
            <Expertise />
            <Footer onAdminClick={() => setShowAdminLogin(true)} />
          </div>
        </main>
      )}
    </>
  );
};

export default App;
