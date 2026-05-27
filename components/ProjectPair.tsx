
import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { Clock, Layers, Star, ArrowUpRight } from 'lucide-react';

interface ProjectPairProps {
  projectLeft: Project;
  projectRight?: Project;
  onProjectClick: (project: Project) => void;
}

// Helper to generate srcSet for Unsplash images for better performance
const generateSrcSet = (url: string) => {
  if (!url || !url.includes('images.unsplash.com')) return undefined;
  try {
     const newUrl = new URL(url);
     const widths = [320, 640, 768, 1024, 1280, 1536];
     return widths.map(w => {
       newUrl.searchParams.set('w', w.toString());
       newUrl.searchParams.set('q', '75');
       newUrl.searchParams.set('auto', 'format');
       newUrl.searchParams.set('fit', 'crop');
       return `${newUrl.toString()} ${w}w`;
     }).join(', ');
  } catch (e) {
    return undefined;
  }
};

const truncateWords = (text: string | undefined, maxWords: number) => {
  if (!text) return "Project description goes here...";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

export const ProjectCard = ({ 
  project, 
  onClick, 
  isPreview = false 
}: { 
  project: Project; 
  onClick?: () => void;
  isPreview?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Layout classes
  const containerClasses = isPreview
    ? "w-full h-full relative flex flex-col overflow-hidden transition-all duration-500 ease-out group cursor-default border border-slate-200 dark:border-white/10"
    : "w-full md:w-1/2 aspect-square relative flex flex-col overflow-hidden transition-all duration-500 ease-out group cursor-pointer border border-slate-100 dark:border-white/[0.06] rounded-2xl md:rounded-none";

  return (
    <div 
      ref={containerRef}
      className={`${containerClasses} ${project.bgColor} dark:bg-[#020202]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isPreview ? undefined : onClick}
    >
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* LIGHT MODE SPECIFIC */}
          <div className="dark:hidden absolute inset-0">
             {/* Subtle gradient to give depth to pastel colors */}
             <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent opacity-80"></div>
             {/* Noise Texture */}
             <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>
          </div>

          {/* DARK MODE SPECIFIC - Modern Tech/Grid Look */}
          <div className="hidden dark:block absolute inset-0">
             {/* Base Grid Pattern */}
             <div 
                className="absolute inset-0 opacity-[0.08]" 
                style={{ 
                  backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', 
                  backgroundSize: '40px 40px',
                  maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
             ></div>

             {/* Top Spotlight Gradient (Vercel-style) - Increased visibility */}
             <div className={`absolute inset-0 ${project.darkGradient || "bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(120,119,198,0.25),rgba(255,255,255,0))]"}`}></div>
             
             {/* Subtle ambient colors from project theme (optional, kept very low) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-between relative z-20">
        
        {/* Header Section */}
        <div className="transform transition-transform duration-500 translate-y-0 group-hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2 md:mb-3">
             <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-slate-900/5 dark:border-white/10 rounded-md bg-pastel-1/50 dark:bg-white/5 text-slate-600 dark:text-neutral-400 backdrop-blur-sm">
               {project.category || "Category"}
             </span>
             <span className="hidden sm:flex px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-slate-900/5 dark:border-white/10 rounded-md bg-pastel-1/50 dark:bg-white/5 text-slate-600 dark:text-neutral-400 items-center gap-1 backdrop-blur-sm">
               <Clock size={12} /> {project.duration || "Duration"}
             </span>
          </div>
          <h3 
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-900 dark:text-white mb-0 leading-tight drop-shadow-sm dark:drop-shadow-none"
            style={{ fontFamily: project.titleFont || 'inherit' }}
          >
            {project.title || "Project Title"}
          </h3>
        </div>

        {/* Central Image - Adjusted for cleaner look */}
        <div className="absolute inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-full md:w-[60%] md:h-[45%] opacity-20 md:opacity-100 transition-all duration-700 pointer-events-none md:pointer-events-auto z-10 flex items-center justify-center p-4">
           <div className={`relative w-full md:w-full h-auto aspect-video md:h-full overflow-hidden shadow-2xl transition-all duration-700 rounded-lg md:rounded-lg border border-white/20 dark:border-white/5 ${isHovered ? 'scale-105 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]' : 'scale-100'}`}>
             {project.image ? (
               <img 
                 ref={imageRef}
                 src={project.image}
                 srcSet={generateSrcSet(project.image)}
                 sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 50vw"
                 alt={project.title} 
                 loading="lazy"
                 decoding="async"
                 className="w-full h-full object-cover md:object-cover transition-all duration-700 md:scale-110"
               />
             ) : (
               <div className="w-full h-full bg-pastel-4 dark:bg-neutral-900 flex items-center justify-center text-slate-400">No Image</div>
             )}

             {/* Overlay: Hover Only */}
             {!isPreview && (
               <div className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center transition-all duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                 {project.websiteUrl ? (
                   <a 
                     href={project.websiteUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className={`px-5 py-2.5 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white border border-transparent dark:border-white/20 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all duration-500 ease-in-out flex items-center gap-2 ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
                   >
                     View Website <ArrowUpRight size={14} />
                   </a>
                 ) : (
                   <button 
                     onClick={(e) => e.stopPropagation()}
                     className={`px-5 py-2.5 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white border border-transparent dark:border-white/20 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all duration-500 ease-in-out flex items-center gap-2 ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
                   >
                     View Website <ArrowUpRight size={14} />
                   </button>
                 )}
               </div>
             )}
           </div>
        </div>

        {/* Footer Info Card - Refined Glassmorphism */}
        <div className="mt-auto transform transition-all duration-500 ease-in-out relative z-20 group-hover:translate-y-0 translate-y-3">
           <div className="bg-pastel-1/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-pastel-1/50 dark:border-white/10 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <p 
                className="text-slate-700 dark:text-neutral-300 mb-4 text-sm leading-relaxed font-normal"
                style={{ fontFamily: project.descriptionFont || 'inherit' }}
              >
                {truncateWords(project.description, 25)}
              </p>
              
              <div className="flex flex-col gap-3">
                {/* Tech Stack - Minimal Chips */}
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span
                      key={tech} 
                      className="text-slate-600 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider bg-pastel-4/50 dark:bg-white/5 px-2 py-1 rounded border border-pastel-4/50 dark:border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Highlight */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                  <Star size={12} className="text-amber-500" />
                  <span className="text-slate-600 dark:text-neutral-300 text-xs italic font-medium">
                    {project.speciality || "Speciality"}
                  </span>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export const ProjectPair: React.FC<ProjectPairProps> = ({ projectLeft, projectRight, onProjectClick }) => {
  return (
    <section id="projects" className="flex flex-col md:flex-row w-full gap-10 md:gap-0 px-2 py-2 md:px-0 md:py-0">
      <ProjectCard project={projectLeft} onClick={() => onProjectClick(projectLeft)} />
      {projectRight ? (
        <ProjectCard project={projectRight} onClick={() => onProjectClick(projectRight)} />
      ) : (
        <div className="hidden md:block w-1/2 aspect-square bg-pastel-1 dark:bg-[#020202] border-b border-pastel-4 dark:border-white/[0.06]">
           {/* Placeholder for uneven number of projects - continues the grid pattern */}
           <div className="w-full h-full relative overflow-hidden">
              <div className="hidden dark:block absolute inset-0 opacity-[0.08]" 
                style={{ 
                  backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', 
                  backgroundSize: '40px 40px',
                  maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
              ></div>
           </div>
        </div>
      )}
    </section>
  );
};
