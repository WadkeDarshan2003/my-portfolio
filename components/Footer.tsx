import React from 'react';
import { ArrowUpRight, Github, Linkedin, MessageCircle, Instagram, Settings } from 'lucide-react';
import { DEVELOPER_INFO } from '../data';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer = ({ onAdminClick }: FooterProps) => {
  return (
    <footer className="bg-pastel-1 dark:bg-black pt-16 md:pt-20 pb-10 flex flex-col justify-center relative shadow-inner dark:shadow-none border-t border-pastel-4 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 mb-16 md:mb-20">
          
          {/* CTA Section */}
          <div className="space-y-6 md:space-y-8 flex flex-col justify-center text-center md:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-slate-900 dark:text-neutral-100 leading-tight">
              Have an idea? <br />
              <span className="text-slate-400 italic" style={{ fontFamily: 'Merienda, serif', letterSpacing: '-0.02em' }}>Let's build it.</span>
            </h2>
            <div>
              <a 
                href={`mailto:${DEVELOPER_INFO.email}`} 
                className="inline-flex items-center gap-3 text-xl md:text-2xl font-medium text-slate-800 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors border-b-2 border-slate-200 dark:border-neutral-700 hover:border-slate-900 dark:hover:border-white pb-1"
              >
                {DEVELOPER_INFO.email}
                <ArrowUpRight size={20} className="md:w-6 md:h-6" />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 md:gap-12 content-center">
            <div>
              <h4 className="text-xs md:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 md:mb-6">Socials</h4>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
                <li>
                  <a href={DEVELOPER_INFO.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Github size={16} className="md:w-[18px] md:h-[18px]" /> GitHub
                  </a>
                </li>
                <li>
                  <a href={DEVELOPER_INFO.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Linkedin size={16} className="md:w-[18px] md:h-[18px]" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a href={DEVELOPER_INFO.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <MessageCircle size={16} className="md:w-[18px] md:h-[18px]" /> WhatsApp
                  </a>
                </li>
                 <li>
                  <a href={DEVELOPER_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Instagram size={16} className="md:w-[18px] md:h-[18px]" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs md:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 md:mb-6">Services</h4>
               <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-slate-600 dark:text-neutral-400">
                {DEVELOPER_INFO.services.slice(0, 4).map((service, idx) => (
                   <li key={idx}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-slate-500 dark:text-neutral-500">
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Available for new projects
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-4">
             <span>© {new Date().getFullYear()} {DEVELOPER_INFO.name}</span>
             {onAdminClick && (
               <button onClick={onAdminClick} className="ml-4 text-slate-400 hover:text-slate-800 dark:hover:text-neutral-200 transition-colors uppercase font-bold text-xs tracking-widest flex items-center gap-1">
                 <Settings size={12} /> ADMIN PANEL
               </button>
             )}
           </div>
        </div>
      </div>
    </footer>
  );
};