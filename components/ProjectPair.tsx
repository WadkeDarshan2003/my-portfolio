import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { Clock, Layers, ArrowUpRight } from 'lucide-react';

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
    ? "w-full h-full relative flex flex-col overflow-hidden transition-colors duration-700 ease-out cursor-default border border-slate-200 dark:border-white/10"
    : "w-full md:w-1/2 aspect-square relative flex flex-col overflow-hidden transition-transform transition-colors duration-700 ease-out cursor-pointer rounded-2xl md:rounded-none";

  return (
    <div 
      ref={containerRef}
      className={`${containerClasses} bg-transparent`}
      style={{
        contain: 'layout paint',
        containIntrinsicSize: '1000px 1000px',
        contentVisibility: 'auto'
      }}
    >
      {/* DARK MODE SPECIFIC - Background Layers */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none overflow-hidden">


         {/* Top Spotlight Gradient (randomized based on project id) */}
         <div className="absolute inset-0 animate-pulse-slow" style={{
           backgroundImage: `radial-gradient(ellipse 80% 60% at 50% -10%, ${
             [
               "rgba(120,119,198,0.18)", // purple
               "rgba(56,189,248,0.15)",  // sky
               "rgba(52,211,153,0.15)",  // emerald
               "rgba(244,114,182,0.15)", // pink
               "rgba(250,204,21,0.12)"   // yellow
             ][(typeof project.id === 'number' ? project.id : String(project.id).charCodeAt(0)) % 5]
           }, rgba(255,255,255,0))`
         }}></div>
         
         {/* Ambient blur on hover */}
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-500/8 blur-[28px] rounded-full mix-blend-screen transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>


      {/* --- CONTENT CONTAINER --- */}
      <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-between relative z-20">
        


        {/* Central Image - Adjusted for cleaner look */}
        <div 
          className="absolute inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-full md:w-[90%] md:h-[70%] opacity-20 md:opacity-100 transition-all duration-700 pointer-events-auto z-10 flex items-center justify-center p-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={isPreview ? undefined : onClick}
        >
           <div className={`relative w-full md:w-full h-auto aspect-video md:h-full overflow-hidden shadow-md transition-transform duration-300 rounded-lg md:rounded-lg border border-white/20 dark:border-white/5 will-change-transform ${isHovered ? 'scale-[1.03] shadow-lg' : 'scale-100'}`}>
             {project.image ? (
                 <OptimizedImage 
                 ref={imageRef}
                 src={project.image}
                 srcSet={generateSrcSet(project.image)}
                 sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 50vw"
                 alt={project.title} 
                   className="object-cover md:object-cover transition-transform duration-300 md:scale-105 will-change-transform"
               />
             ) : (
               <div className="w-full h-full bg-pastel-4 dark:bg-neutral-900 flex items-center justify-center text-slate-400">No Image</div>
             )}

             {/* Overlay: Hover Only */}
             {!isPreview && (
               <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col gap-3 items-center justify-center transition-opacity duration-300 ease-in-out z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                 {project.websiteUrl ? (
                   <a 
                     href={project.websiteUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className={`px-5 py-2.5 w-44 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white border border-transparent dark:border-white/20 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all duration-500 ease-in-out flex items-center justify-center gap-2 ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
                   >
                     View Website <ArrowUpRight size={14} />
                   </a>
                 ) : (
                   <button 
                     onClick={(e) => e.stopPropagation()}
                     className={`px-5 py-2.5 w-44 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white border border-transparent dark:border-white/20 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all duration-500 ease-in-out flex items-center justify-center gap-2 ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
                   >
                     View Website <ArrowUpRight size={14} />
                   </button>
                 )}
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     if (onClick) onClick();
                   }}
                   className={`px-5 py-2.5 w-44 bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all duration-500 ease-in-out flex items-center justify-center gap-2 ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
                   style={{ transitionDelay: '50ms' }}
                 >
                   View Details
                 </button>
               </div>
             )}

             {/* Info Overlay at the bottom of the image */}
             <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 pt-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex flex-col justify-end transform transition-transform duration-500">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-semibold text-white mb-2 md:mb-3 leading-tight drop-shadow-md">
                  {project.title || "Project Title"}
                </h3>
                <div className="flex items-center gap-3">
                   <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-white/20 rounded-md bg-white/10 text-white backdrop-blur-sm">
                     {project.category || "Category"}
                   </span>
                   <span className="hidden sm:flex px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-white/20 rounded-md bg-white/10 text-white items-center gap-1 backdrop-blur-sm">
                     <Clock size={12} /> {project.duration || "Duration"}
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
    <section
      className="flex flex-col md:flex-row w-full gap-10 md:gap-0 px-2 py-2 md:px-0 md:py-0"
      style={{
        contain: 'layout paint',
        containIntrinsicSize: '2400px 1200px'
      }}
    >
      <ProjectCard project={projectLeft} onClick={() => onProjectClick(projectLeft)} />
      {projectRight ? (
        <ProjectCard project={projectRight} onClick={() => onProjectClick(projectRight)} />
      ) : (
        <div className="hidden md:block w-1/2 aspect-square bg-transparent">
        </div>
      )}
    </section>
  );
};
