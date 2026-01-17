import React, { useState } from 'react';
import { Project } from '../types';
import { Clock, Layers, Star } from 'lucide-react';
import { getTechUrl } from '../data';

interface ProjectPairProps {
  projectLeft: Project;
  projectRight?: Project;
  onProjectClick: (project: Project) => void;
}

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

  // If in preview mode, we force the card to fill the container and remove viewport-dependent heights.
  // We use h-full so it adapts to the container defined in AdminPanel.
  const containerClasses = isPreview
    ? "w-full h-full relative flex flex-col overflow-hidden transition-colors duration-700 ease-in-out group cursor-default"
    : "w-full md:w-1/2 h-[50vh] md:h-auto md:aspect-square lg:h-screen lg:aspect-auto relative flex flex-col overflow-hidden transition-colors duration-700 ease-in-out group cursor-pointer";

  return (
    <div 
      className={`${containerClasses} ${project.bgColor}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isPreview ? undefined : onClick}
    >
      {/* Content Container - Padded */}
      <div className="flex-1 p-6 md:p-10 lg:p-16 flex flex-col justify-between relative z-20">
        
        {/* Header */}
        <div className="transform transition-transform duration-500 translate-y-0">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-2 py-1 md:px-3 text-[10px] md:text-xs font-medium uppercase tracking-wider border border-slate-200 rounded-full bg-white/50 text-slate-500">
               {project.category || "Category"}
             </span>
             <span className="px-2 py-1 md:px-3 text-[10px] md:text-xs font-medium uppercase tracking-wider border border-slate-200 rounded-full bg-white/50 text-slate-500 flex items-center gap-1">
               <Clock size={12} /> {project.duration || "Duration"}
             </span>
          </div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-800 mb-2 group-hover:underline decoration-1 underline-offset-8 decoration-slate-300">
            {project.title || "Project Title"}
          </h3>
          {!isPreview && (
            <span className="text-xs md:text-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Case Study &rarr;
            </span>
          )}
        </div>

        {/* Middle - Image */}
        <div className="absolute inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-full md:w-[70%] md:h-[40%] opacity-10 md:opacity-100 transition-all duration-700 pointer-events-none">
           <div className={`w-full h-full overflow-hidden shadow-2xl transition-all duration-700 ${isHovered ? 'scale-105 shadow-xl' : 'scale-100'}`}>
             {project.image ? (
               <img 
                 src={project.image} 
                 alt={project.title} 
                 className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
               />
             ) : (
               <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
             )}
           </div>
        </div>

        {/* Footer Details */}
        <div className="mt-auto transform transition-all duration-500 delay-100">
           <div className="bg-white/60 backdrop-blur-sm p-4 md:p-6 rounded-none shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-600 mb-4 md:mb-6 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
                {project.description || "Project description goes here..."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-2 text-xs md:text-sm">
                    <Layers size={14} /> Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 3).map(tech => (
                      <span
                        key={tech} 
                        className="text-slate-500 text-[10px] md:text-xs bg-slate-100 px-2 py-1 rounded transition-all relative z-30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-2 text-xs md:text-sm">
                    <Star size={14} /> Highlight
                  </h4>
                  <span className="text-slate-500 text-xs italic">
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

export const ProjectPair = ({ projectLeft, projectRight, onProjectClick }: ProjectPairProps) => {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-screen">
      <ProjectCard project={projectLeft} onClick={() => onProjectClick(projectLeft)} />
      {projectRight && <ProjectCard project={projectRight} onClick={() => onProjectClick(projectRight)} />}
    </section>
  );
};