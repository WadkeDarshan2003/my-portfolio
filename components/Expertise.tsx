
import React, { useRef } from 'react';
import { Layout, Server, Smartphone, PenTool, Monitor, Database, Globe, CheckSquare, Cpu, Puzzle } from 'lucide-react';
import { SERVICES_WITH_ICONS, STACK_LOGOS } from '../data';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IconMap: Record<string, React.ElementType> = {
  'Layout': Layout,
  'Server': Server,
  'Smartphone': Smartphone,
  'PenTool': PenTool,
  'Monitor': Monitor,
  'Database': Database,
  'Globe': Globe,
  'CheckSquare': CheckSquare,
  'Puzzle': Puzzle,
};

export const Expertise = () => {
  const containerRef = useRef<HTMLElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Title animation
    gsap.fromTo(titleGroupRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleGroupRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Stagger services
    if (servicesRef.current) {
      gsap.fromTo(servicesRef.current.children,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }

    // Tech Stack animation
    gsap.fromTo(techStackRef.current,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: techStackRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="expertise" className="relative overflow-hidden bg-pastel-1 dark:bg-black py-24 md:py-32 transition-colors duration-500">
       
       {/* --- LIVE AURORA BACKGROUND (No Grain) --- */}
       <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Enhanced gradients for dark mode - Smooth Color Mix */}
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-[120px] animate-float-slow mix-blend-multiply dark:mix-blend-screen"></div>
          <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-purple-200/30 dark:bg-purple-600/20 rounded-full blur-[120px] animate-float-medium mix-blend-multiply dark:mix-blend-screen delay-1000"></div>
          <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] bg-emerald-200/30 dark:bg-emerald-600/10 rounded-full blur-[120px] animate-float-fast mix-blend-multiply dark:mix-blend-screen delay-500"></div>
       </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div ref={titleGroupRef} className="mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-pastel-1/50 dark:bg-white/5 border border-pastel-4 dark:border-white/10 backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">Proficiency</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: 'Merienda, serif' }}>
              Expertise & Toolkit
            </h2>
        </div>

        {/* --- COMPACT SPLIT LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12">
           
           {/* LEFT: Capabilities */}
           <div className="lg:col-span-7">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                 <PenTool size={14} /> Capabilities
              </h3>
              
              <div ref={servicesRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {SERVICES_WITH_ICONS.map((service, idx) => {
                    const Icon = IconMap[service.icon] || Layout;
                    return (
                       <div 
                         key={idx}
                         className="group flex items-center gap-4 p-5 bg-transparent backdrop-blur-xl border border-pastel-4/60 dark:border-white/5 rounded-2xl hover:bg-pastel-1/30 dark:hover:bg-white/5 transition-all duration-300 hover:scale-[1.01] cursor-default shadow-sm hover:shadow-md dark:shadow-none"
                       >
                          <div className="shrink-0 w-10 h-10 bg-pastel-1 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-700 dark:text-white transition-colors shadow-sm dark:shadow-none">
                             <Icon size={20} strokeWidth={1.5} />
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-100 transition-colors">
                                {service.title}
                             </h4>
                             <p className="text-[11px] text-slate-500 dark:text-neutral-500 mt-1">
                                Professional workflow
                             </p>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>

            {/* RIGHT: Tech Stack */}
            <div className="lg:col-span-5 flex flex-col">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                  <Cpu size={14} /> Technology
               </h3>

               <div ref={techStackRef} className="flex-1 bg-transparent backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-lg dark:shadow-blue-900/10 transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Inner gradient for card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
                 
                 <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-5 md:gap-x-6 md:gap-y-8 relative z-10 py-4">
                    {STACK_LOGOS.map((tech, i) => {
                       const isReactNative = tech.name === 'React Native';
                       const iconSrc = isReactNative 
                        ? `https://cdn.simpleicons.org/${tech.slug}/ff3333` 
                        : `https://cdn.simpleicons.org/${tech.slug}`;
                       
                       // Async "Scattered" effect using index-based offsets - Reduced offsets
                       const offsets = [
                         "mt-0", "mt-4", "-mt-2", "mt-6", "-mt-4", "mt-2"
                       ];
                       const offsetClass = offsets[i % offsets.length];
                       
                       return (
                          <div 
                            key={i}
                            className={`group relative flex items-center justify-center transition-all duration-500 hover:scale-125 ${offsetClass}`}
                          >
                             <img 
                               src={iconSrc} 
                               alt={tech.name}
                               className="w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-300 group-hover:opacity-0 group-hover:scale-50"
                               loading="lazy"
                               decoding="async"
                             />
                             {/* Hover Name Overlay */}
                             <span className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[9px] font-black text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap uppercase tracking-tighter pointer-events-none">
                                {tech.name}
                             </span>
                          </div>
                       )
                    })}
                 </div>

                 <div className="mt-10 pt-6 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest font-bold relative z-10">
                    <span>15+ Technologies in Practice</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Constantly Updating</span>
                 </div>
              </div>
           </div>
        </div>

        {/* BOTTOM TEXT */}
        <div className="flex justify-center border-t border-slate-200/50 dark:border-white/5 pt-8">
            <p className="text-slate-500 dark:text-neutral-500 text-sm italic font-medium">
               Versatile development capabilities meets high-performance tech.
            </p>
        </div>

      </div>
    </section>
  );
};
