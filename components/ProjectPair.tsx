import React, { useRef, useState } from 'react';
import { Project } from '../types';
import { ArrowUpRight, Clock, Layers, Star } from 'lucide-react';

interface ProjectPairProps {
  projectLeft: Project;
  projectRight?: Project;
}

const ProjectCard = ({ project }: { project: Project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`h-[50vh] md:h-screen w-full md:w-1/2 relative flex flex-col overflow-hidden transition-colors duration-700 ease-in-out ${project.bgColor} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content Container - Padded */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-between relative z-20">
        
        {/* Header */}
        <div className="transform transition-transform duration-500 translate-y-0">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider border border-slate-200 rounded-full bg-white/50 text-slate-500">
               {project.category}
             </span>
             <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider border border-slate-200 rounded-full bg-white/50 text-slate-500 flex items-center gap-1">
               <Clock size={12} /> {project.duration}
             </span>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif text-slate-800 mb-2 group-hover:underline decoration-1 underline-offset-8 decoration-slate-300">
            {project.title}
          </h3>
        </div>

        {/* Middle - Image */}
        <div className="absolute inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-full md:w-[70%] md:h-[40%] opacity-10 md:opacity-100 transition-all duration-700 pointer-events-none">
           <div className={`w-full h-full overflow-hidden shadow-2xl transition-all duration-700 ${isHovered ? 'scale-105 shadow-xl' : 'scale-100'}`}>
             <img 
               src={project.image} 
               alt={project.title} 
               className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
             />
           </div>
        </div>

        {/* Footer Details */}
        <div className="mt-auto transform transition-all duration-500 delay-100">
           <div className="bg-white/60 backdrop-blur-sm p-6 rounded-none border-l-4 border-slate-300 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-600 mb-6 leading-relaxed">
                {project.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                    <Layers size={14} /> Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map(tech => (
                      <span key={tech} className="text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                    <Star size={14} /> Highlight
                  </h4>
                  <span className="text-slate-500 text-xs italic">
                    {project.speciality}
                  </span>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export const ProjectPair = ({ projectLeft, projectRight }: ProjectPairProps) => {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-screen">
      <ProjectCard project={projectLeft} />
      {projectRight && <ProjectCard project={projectRight} />}
    </section>
  );
};
