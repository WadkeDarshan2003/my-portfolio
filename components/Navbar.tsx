
import React from 'react';

export const Navbar = () => {
  const navItems = ['Workflow', 'Process', 'Capabilities', 'Testimonials'];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
      <div className="px-2 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-[40px] saturate-150 border border-white/30 dark:border-white/10 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex items-center gap-1 transition-all duration-300">
        {/* Links */}
        <ul className="flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item}>
              <button className="px-5 py-2.5 text-xs md:text-sm font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/10 rounded-full transition-all duration-300">
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
