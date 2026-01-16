import React from 'react';
import { ArrowDown } from 'lucide-react';
import { DEVELOPER_INFO } from '../data';

export const Hero = () => {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center bg-[#F0F7FF] relative px-6 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply"></div>

      <div className="z-10 text-center max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <h2 className="text-sm md:text-base tracking-[0.3em] uppercase text-slate-500 font-medium">
          Portfolio 2024
        </h2>
        
        <h1 className="text-5xl md:text-8xl font-serif text-slate-800 tracking-tight leading-tight">
          {DEVELOPER_INFO.name}
          <span className="block text-3xl md:text-5xl text-slate-400 mt-4 italic font-light">
            {DEVELOPER_INFO.role}
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-slate-600 text-lg md:text-xl font-light leading-relaxed">
          {DEVELOPER_INFO.bio}
        </p>

        {/* Visual Skills Chips */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {DEVELOPER_INFO.skills.map((skill) => (
            <span 
              key={skill} 
              className="px-5 py-2 bg-white/60 border border-blue-100/50 text-slate-600 rounded-full text-sm font-medium tracking-wide shadow-sm hover:bg-white hover:text-blue-600 hover:shadow-md transition-all cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 animate-bounce">
        <ArrowDown className="w-6 h-6 text-slate-400" />
      </div>
    </section>
  );
};
