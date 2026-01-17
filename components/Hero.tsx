import React from 'react';
import { ArrowDown } from 'lucide-react';
import { DEVELOPER_INFO, getTechUrl } from '../data';

export const Hero = () => {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0F7FF] relative px-6 py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply"></div>

      <div className="z-10 text-center max-w-5xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up flex flex-col items-center">
        
        <h2 className="text-xs md:text-base tracking-[0.3em] uppercase text-slate-500 font-medium">
          Portfolio 2024
        </h2>
        
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-slate-800 tracking-tight leading-tight">
          {DEVELOPER_INFO.name}
          <span className="block text-xl md:text-4xl lg:text-5xl text-slate-400 mt-2 md:mt-4 italic font-light">
            {DEVELOPER_INFO.role}
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-slate-600 text-base md:text-xl font-light leading-relaxed px-4">
          {DEVELOPER_INFO.bio}
        </p>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4"></div>

        <div className="flex flex-col gap-8 w-full">
          
          {/* Section: What I Build (Services) */}
          <div className="flex flex-col items-center gap-4">
             <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Expertise</span>
             <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {DEVELOPER_INFO.services.map((service) => (
                <div 
                  key={service} 
                  className="px-4 py-2 md:px-6 md:py-3 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 text-slate-700 text-xs md:text-sm font-semibold hover:border-slate-300 hover:text-slate-900 hover:-translate-y-1 transition-all duration-300 cursor-default"
                >
                  {service}
                </div>
              ))}
             </div>
          </div>

          {/* Section: How I Build (Tech Stack) */}
          <div className="flex flex-col items-center gap-4">
             <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Tech Stack</span>
             <div className="flex flex-wrap justify-center gap-2 md:max-w-3xl opacity-90">
              {DEVELOPER_INFO.skills.map((skill) => (
                <a 
                  key={skill} 
                  href={getTechUrl(skill)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-500 text-[10px] md:text-xs font-medium hover:bg-stone-200 hover:border-stone-300 hover:text-stone-800 hover:shadow-sm transition-all duration-300 cursor-pointer"
                >
                  {skill}
                </a>
              ))}
             </div>
          </div>
        </div>

      </div>

      <div className="absolute bottom-8 animate-bounce hidden md:block">
        <ArrowDown className="w-6 h-6 text-slate-400" />
      </div>
    </section>
  );
};