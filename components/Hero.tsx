
import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { DEVELOPER_INFO } from '../data';

export const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#050505] transition-colors duration-700 perspective-1000"
      style={{ perspective: '1200px' }}
    >
      
      {/* --- BACKGROUND FX LAYERS --- */}
      
      {/* Light Mode: Aurora / Watercolour Effect */}
      <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-1000 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[120px] animate-float-slow mix-blend-multiply"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full blur-[120px] animate-float-medium mix-blend-multiply delay-700"></div>
         <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-teal-200/40 rounded-full blur-[100px] animate-float-fast mix-blend-multiply delay-1500"></div>
         {/* Subtle Noise for texture */}
         <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
      </div>

      {/* Dark Mode: Cyber / Space Glows */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-black"></div>
         <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse mix-blend-screen"></div>
         <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000 mix-blend-screen"></div>
      </div>


      {/* --- 3D INTERACTIVE SPACE --- */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none transform-style-3d will-change-transform"
        style={{
          transform: `rotateX(${20 - mousePos.y * 6}deg) rotateY(${mousePos.x * 6}deg) translateY(${scrolled * 0.15}px)`
        }}
      >
        
        {/* Infinite Grid Floor (Double Layered) */}
        <div 
          className="absolute -left-[100%] -top-[50%] w-[300%] h-[300%] transform-style-3d"
          style={{
            transform: 'rotateX(90deg) translateZ(-250px)',
            maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 60%)'
          }}
        >
            {/* Major Grid Lines */}
            <div 
              className="absolute inset-0 opacity-20 dark:opacity-20 text-slate-400 dark:text-slate-600"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
              }}
            />
            {/* Minor Grid Lines */}
            <div 
              className="absolute inset-0 opacity-10 dark:opacity-10 text-slate-400 dark:text-slate-600"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
        </div>

        {/* Central 3D Gyroscope / Tesseract */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 transform-style-3d animate-spin-slow">
           
           {/* Ring 1 (Vertical) */}
           <div className="absolute inset-0 border border-slate-300/40 dark:border-slate-700/40 rounded-full transform rotate-y-45 animate-spin-reverse-slow" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_currentColor]"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full -translate-x-1/2 translate-y-1/2 shadow-[0_0_10px_currentColor]"></div>
           </div>

           {/* Ring 2 (Horizontal) */}
           <div className="absolute inset-[10%] border border-slate-300/40 dark:border-slate-700/40 rounded-full transform rotate-x-60 animate-spin-slow" style={{ animationDuration: '15s' }}>
               <div className="absolute left-0 top-1/2 w-2 h-2 bg-blue-400/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute right-0 top-1/2 w-2 h-2 bg-blue-400/50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
           </div>

           {/* Inner Cube Frame */}
           <div className="absolute inset-[25%] transform-style-3d animate-spin-slow" style={{ animationDuration: '30s' }}>
              <div className="absolute inset-0 border border-slate-400/30 dark:border-blue-500/30 transform translate-z-12 transition-colors duration-500"></div>
              <div className="absolute inset-0 border border-slate-400/30 dark:border-blue-500/30 transform -translate-z-12 transition-colors duration-500"></div>
              <div className="absolute inset-0 border border-slate-400/30 dark:border-blue-500/30 transform rotate-y-90 translate-z-12 transition-colors duration-500"></div>
              <div className="absolute inset-0 border border-slate-400/30 dark:border-blue-500/30 transform rotate-y-90 -translate-z-12 transition-colors duration-500"></div>
              <div className="absolute inset-0 border border-slate-400/30 dark:border-blue-500/30 transform rotate-x-90 translate-z-12 transition-colors duration-500"></div>
              <div className="absolute inset-0 border border-slate-400/30 dark:border-blue-500/30 transform rotate-x-90 -translate-z-12 transition-colors duration-500"></div>
              
              {/* Core Light */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 dark:bg-white rounded-full shadow-[0_0_40px_rgba(59,130,246,0.6)] animate-pulse"></div>
           </div>

        </div>

      </div>

      {/* --- CONTENT LAYER (Glass Card Effect) --- */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-5xl mx-auto">
        
        {/* Title Group with Badge Aligned Start */}
        <div className="flex flex-col items-start mb-8 md:mb-10">
            {/* Availability Badge */}
            <div className="mb-2 ml-1 md:ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/60 dark:border-neutral-800/60 bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-sm animate-fade-in-down hover:scale-105 transition-transform duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-700 dark:text-neutral-300 uppercase">
                System Online
              </span>
            </div>

            {/* Titles */}
            <div className="relative">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 dark:text-white tracking-tighter leading-none relative z-10 drop-shadow-lg dark:drop-shadow-none flex flex-wrap gap-3 md:gap-4">
                <span className="animate-fade-in-up mix-blend-overlay dark:mix-blend-normal opacity-90" style={{ animationDelay: '0.1s' }}>
                  {DEVELOPER_INFO.name.split(' ')[0]}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-500 to-slate-800 dark:from-neutral-200 dark:to-neutral-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {DEVELOPER_INFO.name.split(' ')[1]}
                </span>
              </h1>
              
              {/* Decorative Text Behind (Parallax Depth) */}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9rem] md:text-[15rem] tracking-tighter font-bold text-slate-900/5 dark:text-white/5 -z-10 whitespace-nowrap pointer-events-none blur-sm select-none">
                DEVELOPER
              </span>
            </div>
        </div>

        {/* Subtitle / Bio */}
        <div className="max-w-4xl mx-auto animate-fade-in-up mb-8 md:mb-10 text-center" style={{ animationDelay: '0.3s' }}>
          <p className="text-lg md:text-xl text-slate-600 dark:text-neutral-400 font-light leading-relaxed backdrop-blur-sm p-4 rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-white/5 transition-all whitespace-nowrap overflow-x-auto no-scrollbar">
            {DEVELOPER_INFO.role} <span className="mx-2 text-slate-300 dark:text-neutral-700">|</span> {DEVELOPER_INFO.tagline}
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
             {["React", "WebGL", "Node.js", "AI"].map((tech, i) => (
               <span 
                 key={tech} 
                 className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 rounded-full bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-800 hover:scale-110 transition-all cursor-default shadow-sm"
                 style={{ transitionDelay: `${i * 50}ms` }}
               >
                 {tech}
               </span>
             ))}
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 animate-bounce z-20 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-center gap-2">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-600">Scroll</span>
           <ArrowDown className="w-5 h-5 text-slate-800 dark:text-white" />
        </div>
      </div>

    </section>
  );
};
