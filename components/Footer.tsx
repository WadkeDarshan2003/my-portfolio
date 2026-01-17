import React from 'react';
import { ArrowUpRight, Github, Linkedin, Twitter, Instagram, Settings } from 'lucide-react';
import { DEVELOPER_INFO } from '../data';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer = ({ onAdminClick }: FooterProps) => {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 md:pt-32 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 mb-16 md:mb-20">
          
          {/* CTA Section */}
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-slate-900 leading-tight">
              Have an idea? <br />
              <span className="text-slate-400 italic">Let's build it.</span>
            </h2>
            <a 
              href={`mailto:${DEVELOPER_INFO.email}`} 
              className="inline-flex items-center gap-3 text-lg md:text-2xl font-medium text-slate-800 hover:text-[#2f8d46] transition-colors border-b-2 border-slate-200 hover:border-[#2f8d46] pb-1"
            >
              {DEVELOPER_INFO.email}
              <ArrowUpRight size={20} className="md:w-6 md:h-6" />
            </a>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            <div>
              <h4 className="text-xs md:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 md:mb-6">Socials</h4>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
                <li>
                  <a href={DEVELOPER_INFO.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                    <Github size={16} className="md:w-[18px] md:h-[18px]" /> GitHub
                  </a>
                </li>
                <li>
                  <a href={DEVELOPER_INFO.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                    <Linkedin size={16} className="md:w-[18px] md:h-[18px]" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a href={DEVELOPER_INFO.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                    <Twitter size={16} className="md:w-[18px] md:h-[18px]" /> Twitter
                  </a>
                </li>
                 <li>
                  <a href={DEVELOPER_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                    <Instagram size={16} className="md:w-[18px] md:h-[18px]" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs md:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 md:mb-6">Services</h4>
               <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-slate-600">
                {DEVELOPER_INFO.services.slice(0, 4).map((service, idx) => (
                   <li key={idx}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-slate-500">
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Available for new projects
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-4">
             <span>© {new Date().getFullYear()} {DEVELOPER_INFO.name}</span>
             <span className="hidden md:inline text-slate-300">•</span>
             <span className="font-serif italic">Designed & Built with Gemini</span>
             {onAdminClick && (
               <button onClick={onAdminClick} className="ml-4 text-slate-400 hover:text-slate-800 transition-colors uppercase font-bold text-xs tracking-widest flex items-center gap-1">
                 <Settings size={12} /> ADMIN PANEL
               </button>
             )}
           </div>
        </div>
      </div>
    </footer>
  );
};