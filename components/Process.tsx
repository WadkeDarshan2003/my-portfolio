import React from 'react';
import { Search, Layers, Code, CheckCircle, Rocket, Settings } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Discovery',
    description: 'Deep dive into goals and user needs to define the core problem.',
    icon: Search,
  },
  {
    id: '02',
    title: 'Design',
    description: 'Crafting pixel-perfect interfaces that align with your brand identity.',
    icon: Layers,
  },
  {
    id: '03',
    title: 'Development',
    description: 'Writing clean, scalable code using modern, robust tech stacks.',
    icon: Code,
  },
  {
    id: '04',
    title: 'Testing',
    description: 'Rigorous QA and performance tuning for flawless execution.',
    icon: CheckCircle,
  },
  {
    id: '05',
    title: 'Launch',
    description: 'Seamless deployment, handoff, and infrastructure setup.',
    icon: Rocket,
  },
  {
    id: '06',
    title: 'Maintenance',
    description: 'Continuous monitoring, updates, and feature enhancements.',
    icon: Settings,
  },
];

export const Process = () => {
  return (
    <section id="process" className="py-24 md:py-32 bg-stone-50 dark:bg-black relative overflow-hidden transition-colors duration-700">
      {/* Live Aurora Background (Matches Expertise section) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-200/20 dark:bg-blue-600/15 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[30%] right-[-15%] w-[60%] h-[60%] bg-purple-200/20 dark:bg-purple-600/15 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] bg-emerald-200/20 dark:bg-emerald-600/10 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
      </div>
      
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-24">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 md:mb-3 block">My Process</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-poppins font-semibold text-slate-900 dark:text-neutral-100 leading-tight max-w-2xl">
            A refined SDLC path from <br />
            <span className="italic text-slate-400">concept to completion.</span>
          </h2>
        </div>

        {/* Desktop Connector Line */}
        <div className="hidden lg:block absolute top-[calc(18rem+28px)] left-0 w-full h-px bg-slate-200 dark:bg-neutral-800 z-0"></div>

        {/* Steps Grid (Responsive: 1-col on mobile, 2-col on small tablets, 6-col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6 relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12">
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className="flex flex-col h-full relative"
            >
              {/* Mobile Vertical Step Connector line for single column */}
              {idx < steps.length - 1 && (
                <div className="sm:hidden absolute left-8 bottom-0 w-0.5 h-4 bg-slate-200 dark:bg-neutral-800 -mb-4 z-0"></div>
              )}

              {/* Card - Optimized for mobile & desktop */}
              <div className="
                flex flex-col items-start
                h-full
                p-5 md:p-6
                bg-white/90
                dark:bg-neutral-900/90
                backdrop-blur-sm
                border border-slate-200/80
                dark:border-neutral-800
                rounded-2xl
                text-left
                transition-all duration-300
                group
                hover:border-blue-300 dark:hover:border-neutral-700
                shadow-sm hover:shadow-md
              ">
                
                {/* Header: Icon & Number */}
                <div className="w-full flex justify-between items-start mb-4 md:mb-6">
                   {/* Icon */}
                   <div className="
                     w-9 h-9 md:w-10 md:h-10 
                     bg-slate-100 
                     dark:bg-neutral-800/80 
                     rounded-xl
                     flex items-center justify-center
                     text-slate-900 dark:text-white
                     group-hover:scale-110 transition-transform duration-300
                   ">
                     <step.icon size={18} strokeWidth={1.75} className="md:w-5 md:h-5" />
                   </div>

                   {/* Number */}
                   <span className="text-3xl md:text-4xl font-poppins font-semibold text-slate-300 dark:text-neutral-700 select-none group-hover:text-slate-400 dark:group-hover:text-neutral-600 transition-colors">
                     {step.id}
                   </span>
                </div>

                {/* Content */}
                <div className="mt-auto w-full">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-neutral-100 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
