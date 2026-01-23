import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, Layers, Star, ExternalLink, Github } from 'lucide-react';
import { Project } from '../types';
import { getTechUrl } from '../data';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  isPreview?: boolean;
}

// Helper to generate srcSet for Unsplash images for better performance
const generateSrcSet = (url: string) => {
  if (!url || !url.includes('images.unsplash.com')) return undefined;
  try {
     const newUrl = new URL(url);
     const widths = [640, 1024, 1280, 1920];
     return widths.map(w => {
       newUrl.searchParams.set('w', w.toString());
       newUrl.searchParams.set('q', '80');
       newUrl.searchParams.set('auto', 'format');
       return `${newUrl.toString()} ${w}w`;
     }).join(', ');
  } catch (e) {
    return undefined;
  }
};

export const ProjectDetail = ({ project, onBack, isPreview = false }: ProjectDetailProps) => {
  // Scroll to top when mounting only if not in preview mode to avoid jumping
  useEffect(() => {
    if (!isPreview) {
      window.scrollTo(0, 0);
    }
  }, [isPreview]);

  const navPositionClass = isPreview ? "absolute" : "fixed";
  const containerClass = isPreview ? "h-full overflow-y-auto" : "min-h-screen";

  return (
    <div className={`${containerClass} bg-white dark:bg-black animate-fade-in-up relative transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`${navPositionClass} top-0 left-0 w-full z-50 px-4 md:px-6 py-4 md:py-6 flex justify-between items-center pointer-events-none`}>
        <button 
          onClick={onBack}
          aria-label="Go back to projects"
          title="Go back to projects"
          className="pointer-events-auto bg-white/80 dark:bg-black/80 backdrop-blur-md border border-slate-200 dark:border-neutral-800 shadow-sm p-2 md:p-3 rounded-full hover:bg-white dark:hover:bg-neutral-900 hover:scale-105 transition-all text-slate-700 dark:text-neutral-200 group"
        >
          <ArrowLeft size={20} className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Hero Header */}
      <header className={`relative w-full pt-24 pb-12 md:pt-32 md:pb-20 px-4 md:px-6 ${project.bgColor} dark:bg-neutral-900 transition-colors duration-500`}>
        {/* Background Layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Dark Mode Grid & Spotlight */}
             <div className="hidden dark:block absolute inset-0">
                <div 
                    className="absolute inset-0 opacity-[0.08]" 
                    style={{ 
                    backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', 
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                    }}
                ></div>
                <div className={`absolute inset-0 ${project.darkGradient || ""}`}></div>
            </div>
            
            {/* Light Mode Noise/Texture */}
             <div className="dark:hidden absolute inset-0">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent opacity-80"></div>
                 <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>
            </div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-slate-900/10 dark:border-white/10 rounded-full bg-white/40 dark:bg-white/5 text-slate-600 dark:text-neutral-300">
                {project.category || "Category"}
              </span>
              <span className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-xs md:text-sm font-medium">
                <Calendar size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" /> {project.duration || "Duration"}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-slate-900 dark:text-white leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {project.title || "Project Title"}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Image */}
      <div className="w-full px-4 md:px-6 -mt-8 md:-mt-12 relative z-10">
        <div className="max-w-6xl mx-auto h-[40vh] md:h-[70vh] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white dark:border-neutral-900 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
           {project.image ? (
              <img 
                src={project.image}
                srcSet={generateSrcSet(project.image)}
                sizes="(max-width: 1280px) 100vw, 1280px"
                alt={project.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" 
                loading="eager"
                decoding="async"
                // @ts-ignore - fetchPriority is standard but types might be outdated
                fetchPriority="high"
              />
           ) : (
              <div className="w-full h-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-300 dark:text-neutral-600">No Image Available</div>
           )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-20">
          
          {/* Main Description */}
          <div className="md:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div>
              <h3 className="text-xl md:text-2xl font-serif text-slate-800 dark:text-neutral-100 mb-6">Project Overview</h3>
              <p className="text-base md:text-xl text-slate-600 dark:text-neutral-300 leading-relaxed font-light">
                {project.description || "No description provided."}
              </p>
            </div>
            
            {/* Dynamic Content Sections */}
            {project.details && project.details.length > 0 ? (
              <div className="space-y-6 mt-8 border-t border-slate-100 dark:border-neutral-800 pt-8">
                {project.details.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-base md:text-lg font-bold text-slate-800 dark:text-neutral-100">
                      {section.title}
                    </h4>
                    <p className="text-sm md:text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
               // Fallback if no details provided
               <p className="text-sm md:text-base text-slate-500 leading-relaxed italic mt-4">
                 Additional details coming soon...
               </p>
            )}
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              {project.websiteUrl ? (
                <a 
                  href={project.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors text-sm md:text-base w-full sm:w-auto"
                >
                  <ExternalLink size={18} /> Live Demo
                </a>
              ) : (
                <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors text-sm md:text-base w-full sm:w-auto">
                  <ExternalLink size={18} /> Live Demo
                </button>
              )}
              {project.sourceCodeUrl ? (
                <a 
                  href={project.sourceCodeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-slate-400 dark:hover:border-neutral-600 transition-colors text-sm md:text-base w-full sm:w-auto"
                >
                  <Github size={18} /> Source Code
                </a>
              ) : (
                <button className="px-6 py-3 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-slate-400 dark:hover:border-neutral-600 transition-colors text-sm md:text-base w-full sm:w-auto">
                  <Github size={18} /> Source Code
                </button>
              )}
            </div>
          </div>

          {/* Sidebar / Details */}
          <div className="space-y-8 md:space-y-10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            
            {/* Tech Stack */}
            <div>
              <h4 className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 md:mb-4">
                <Layers size={14} className="md:w-4 md:h-4" /> Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <a 
                    key={tech} 
                    href={getTechUrl(tech)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-md text-xs md:text-sm text-slate-600 dark:text-neutral-300 font-medium hover:bg-stone-200 dark:hover:bg-neutral-800 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 transition-all cursor-pointer"
                    title={`Learn about ${tech}`}
                  >
                    {tech}
                  </a>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="p-4 md:p-6 bg-stone-50 dark:bg-neutral-900 rounded-xl md:rounded-2xl border border-stone-100 dark:border-neutral-800">
              <h4 className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 md:mb-3">
                <Star size={14} className="md:w-4 md:h-4" /> Key Highlight
              </h4>
              <p className="text-slate-700 dark:text-neutral-200 font-serif italic text-base md:text-lg">
                "{project.speciality || "N/A"}"
              </p>
            </div>

            {/* Credits / Info */}
            <div>
               <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 md:mb-4">
                Details
              </h4>
              <dl className="space-y-3 md:space-y-4 text-xs md:text-sm">
                <div className="flex justify-between border-b border-slate-100 dark:border-neutral-800 pb-2">
                  <dt className="text-slate-500">Role</dt>
                  <dd className="text-slate-800 dark:text-neutral-200 font-medium">Lead Developer</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-neutral-800 pb-2">
                  <dt className="text-slate-500">Timeline</dt>
                  <dd className="text-slate-800 dark:text-neutral-200 font-medium">{project.duration || "TBD"}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-neutral-800 pb-2">
                  <dt className="text-slate-500">Theme</dt>
                  <dd className="text-slate-800 dark:text-neutral-200 font-medium capitalize">{project.theme}</dd>
                </div>
              </dl>
            </div>

          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="w-full bg-slate-50 dark:bg-neutral-900 py-16 md:py-24 border-t border-slate-200 dark:border-neutral-800 transition-colors duration-300">
           <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h3 className="text-xl md:text-2xl font-serif text-slate-800 dark:text-neutral-100 mb-8 md:mb-12 flex items-center gap-4">
                <span className="w-8 md:w-12 h-px bg-slate-300 dark:bg-neutral-700"></span>
                Visuals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 {project.gallery.map((img, idx) => (
                   <div key={idx} className={`rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ${idx % 3 === 0 ? 'md:col-span-2' : ''}`}>
                      <img 
                        src={img}
                        srcSet={generateSrcSet(img)}
                        sizes="(max-width: 768px) 100vw, 50vw" 
                        alt={`${project.title} screenshot ${idx + 1}`} 
                        className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                   </div>
                 ))}
              </div>
           </div>
        </section>
      )}

    </div>
  );
};