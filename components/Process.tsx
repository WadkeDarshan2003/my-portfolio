import React from 'react';
import { Search, PenTool, Code, CheckCircle, Rocket } from 'lucide-react';

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
    icon: PenTool,
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
    description: 'Seamless deployment, handoff, and post-launch support.',
    icon: Rocket,
  },
];

export const Process = () => {
  return (
    <section className="py-24 md:py-32 bg-stone-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-3 block">My Process</span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-neutral-100 leading-tight max-w-2xl">
            A refined path from <br />
            <span className="italic text-slate-400">concept to completion.</span>
          </h2>
        </div>

        {/* Desktop Connector Line */}
        <div className="hidden md:block absolute top-[calc(18rem+28px)] left-0 w-full h-px bg-slate-200 dark:bg-neutral-800 z-0"></div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="flex flex-col h-full"
            >
              {/* Card - Static, clean look */}
              <div className="
                flex flex-col items-start
                h-full
                p-6
                bg-white
                dark:bg-neutral-900
                border border-slate-200
                dark:border-neutral-800
                rounded-xl
                text-left
                transition-colors duration-300
                group
                hover:border-blue-200 dark:hover:border-neutral-700
              ">
                
                {/* Header: Icon & Number */}
                <div className="w-full flex justify-between items-start mb-6">
                   {/* Icon */}
                   <div className="
                     w-10 h-10 
                     bg-slate-50 
                     dark:bg-neutral-800 
                     rounded-lg
                     flex items-center justify-center
                     text-slate-900 dark:text-white
                     group-hover:scale-110 transition-transform duration-300
                   ">
                     <step.icon size={20} strokeWidth={1.5} />
                   </div>

                   {/* Number */}
                   <span className="text-4xl font-serif text-slate-100 dark:text-neutral-800 select-none group-hover:text-slate-200 dark:group-hover:text-neutral-700 transition-colors">
                     {step.id}
                   </span>
                </div>

                {/* Content */}
                <div className="mt-auto w-full">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
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