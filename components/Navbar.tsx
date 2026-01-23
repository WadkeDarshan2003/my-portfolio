
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DEVELOPER_INFO } from '../data';
import { Project } from '../types';
import profileImage from '../Public/image.png';
import { Toast, useToast } from './Toast';

interface NavbarProps {
  projects?: Project[];
}

export const Navbar = ({ projects = [] }: NavbarProps) => {
  const navItems = [
    { label: 'Projects', id: 'projects' },
    { label: 'Path Way', id: 'process' },
    { label: 'Expertise', id: 'expertise' },
    { label: 'Testimonials', id: 'testimonials' }
  ];
  const [mounted, setMounted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = (id: string) => {
    // Check if it's Projects section and no projects exist
    if (id === 'projects' && projects.length === 0) {
      toast.info('No projects available yet. Check back soon!');
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Developer Profile Circle - Left Side */}
      <div 
        className={`
          fixed top-4 md:top-6 left-4 md:left-6 z-50 transition-all duration-700
          ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
        `}
      >
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 dark:border-white/20 shadow-lg bg-white/20 dark:bg-black/30 backdrop-blur-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <img 
            src={profileImage} 
            alt={DEVELOPER_INFO.name}
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Center Navigation */}
      <nav 
        className={`
          fixed bottom-6 md:top-6 md:bottom-auto left-1/2 -translate-x-1/2 z-50 transition-all duration-700 w-[90%] md:w-auto
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 md:-translate-y-4'}
        `}
      >
        <div className="relative px-1 md:px-2 py-1.5 md:py-2 flex items-center justify-center gap-1">
          {/* iPhone Style Glass Backdrop - Stabilized */}
          <div 
            className="absolute inset-0 rounded-full border border-white/20 dark:border-white/10 shadow-xl -z-10 bg-white/40 dark:bg-black/50 backdrop-blur-2xl saturate-150 will-change-[backdrop-filter]"
            style={{ 
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            }}
          />

          {/* Links */}
          <ul className="flex items-center gap-0.5 md:gap-1 relative z-10 w-full md:w-auto justify-between md:justify-start">
            {navItems.map((item) => (
              <li key={item.id} className="flex-1 md:flex-none text-center">
                <button 
                  onClick={() => handleScroll(item.id)}
                  className="w-full md:w-auto px-3 md:px-5 py-2 md:py-2.5 text-[10px] md:text-sm font-semibold md:font-medium text-slate-800 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/10 rounded-full transition-all duration-300 whitespace-nowrap"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Toast Notifications - Rendered at the end of DOM tree */}
      {ReactDOM.createPortal(
        <Toast messages={toast.messages} onRemove={toast.removeToast} />,
        document.body
      )}
    </>
  );
};
