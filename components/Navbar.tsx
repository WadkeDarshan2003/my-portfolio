
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DEVELOPER_INFO } from '../data';
import { Project } from '../types';
import { Toast, useToast } from './Toast';

interface NavbarProps {
  projects?: Project[];
}

export const Navbar = ({ projects = [] }: NavbarProps) => {
  const navItems = [
    { label: 'Projects', id: 'projects' },
    { label: 'Path Way', id: 'process' },
    { label: 'Expertise', id: 'expertise' }
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
          className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 dark:border-white/20 shadow-lg bg-white/80 dark:bg-black/75 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <img 
            src="/image.png" 
            alt={DEVELOPER_INFO.name}
            className="w-full h-full object-cover"
            decoding="async"
          />
        </button>
      </div>

      {/* Center Navigation */}
      <nav 
        className={`
          fixed bottom-6 md:top-6 md:bottom-auto inset-x-0 z-50 transition-all duration-700 flex justify-center px-4 md:px-0
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 md:-translate-y-4'}
        `}
      >
        <div className="relative w-fit max-w-full px-1.5 md:px-2 py-1.5 md:py-2 flex items-center justify-center overflow-hidden rounded-full">
          {/* Glass Backdrop */}
          <div 
            className="absolute inset-0 rounded-full border -z-10 backdrop-blur-sm saturate-125
              bg-white/80 border-white/40 shadow-xl
              dark:bg-neutral-900/90 dark:border-white/15 dark:shadow-lg"
            style={{ 
              WebkitBackdropFilter: 'blur(6px) saturate(125%)',
            }}
          />

          {/* Links */}
          <ul className="flex items-center gap-px md:gap-1 relative z-10 w-auto justify-center">
            {navItems.map((item) => (
              <li key={item.id} className="flex-none text-center">
                <button 
                  onClick={() => handleScroll(item.id)}
                  className="px-2 md:px-5 py-2.5 text-[10px] md:text-sm font-semibold md:font-medium
                    text-slate-700 hover:text-slate-900 hover:bg-slate-900/8
                    dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10
                    rounded-full transition-all duration-300 whitespace-nowrap"
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

export default Navbar;
