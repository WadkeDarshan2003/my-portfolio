
import React from 'react';
import { Layout, Server, Smartphone, PenTool, Monitor, Database, Globe, CheckSquare, Cpu } from 'lucide-react';
import { SERVICES_WITH_ICONS, STACK_LOGOS } from '../data';

const IconMap: Record<string, React.ElementType> = {
  'Layout': Layout,
  'Server': Server,
  'Smartphone': Smartphone,
  'PenTool': PenTool,
  'Monitor': Monitor,
  'Database': Database,
  'Globe': Globe,
  'CheckSquare': CheckSquare,
};

export const Expertise = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-black py-24 md:py-32 transition-colors duration-500">
       
       {/* --- LIVE AURORA BACKGROUND (No Grain) --- */}
       <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Enhanced gradients for dark mode - Smooth Color Mix */}
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-[120px] animate-float-slow mix-blend-multiply dark:mix-blend-screen"></div>
          <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-purple-200/30 dark:bg-purple-600/20 rounded-full blur-[120px] animate-float-medium mix-blend-multiply dark:mix-blend-screen delay-1000"></div>
          <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] bg-emerald-200/30 dark:bg-emerald-600/10 rounded-full blur-[120px] animate-float-fast mix-blend-multiply dark:mix-blend-screen delay-500"></div>
       </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">Proficiency</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white tracking-tight">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {SERVICES_WITH_ICONS.map((service, idx) => {
                    const Icon = IconMap[service.icon] || Layout;
                    return (
                       <div 
                         key={idx}
                         className="group flex items-center gap-4 p-5 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-2xl hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all duration-300 hover:scale-[1.01] cursor-default shadow-sm hover:shadow-md dark:shadow-none"
                       >
                          <div className="shrink-0 w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-700 dark:text-white transition-colors shadow-sm dark:shadow-none">
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

              <div className="flex-1 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden">
                 {/* Inner gradient for card */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
                 
                 <div className="flex flex-wrap content-start gap-3 relative z-10">
                    {STACK_LOGOS.map((tech, i) => {
                       const isReactNative = tech.name === 'React Native';
                       const iconSrc = isReactNative 
                        ? `https://cdn.simpleicons.org/${tech.slug}/ff3333` 
                        : `https://cdn.simpleicons.org/${tech.slug}`;
                       
                       return (
                          <div 
                            key={i}
                            className="
                              pl-2.5 pr-3.5 py-2 
                              bg-white/70 dark:bg-neutral-800/80 
                              border border-slate-200/50 dark:border-white/10 
                              rounded-xl
                              flex items-center gap-2.5
                              hover:bg-white hover:scale-105 hover:shadow-lg dark:hover:bg-neutral-700 dark:hover:border-white/20
                              transition-all duration-300
                              cursor-default
                            "
                          >
                             <img 
                               src={iconSrc} 
                               alt={tech.name}
                               className="w-4 h-4 object-contain opacity-80 dark:opacity-100 dark:brightness-0 dark:invert transition-all"
                               loading="lazy"
                             />
                             <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
                                {tech.name}
                             </span>
                          </div>
                       )
                    })}
                 </div>

                 <div className="mt-10 pt-6 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest font-bold relative z-10">
                    <span>15+ Technologies Mastered</span>
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
