
import React, { useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { DEVELOPER_INFO } from '../data';

export const Hero = () => {
  // Use refs + rAF to avoid React re-renders on every mouse/scroll event
  const sectionRef = React.useRef<HTMLElement>(null);
  const hero3dRef = React.useRef<HTMLDivElement>(null);
  const mouseRef = React.useRef({ x: 0, y: 0 });
  const rafRef = React.useRef<number | null>(null);

  useEffect(() => {
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafRef.current) {
          rafRef.current = requestAnimationFrame(update);
        } else if (!isVisible && rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;

      if (sectionRef.current) {
        sectionRef.current.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
        sectionRef.current.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
      }
    };

    const update = () => {
      if (!isVisible) return;
      const el = hero3dRef.current;
      if (el) {
        const { x, y } = mouseRef.current;
        el.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] perspective-1000 transition-colors duration-700"
      style={{
        perspective: '1200px',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      
      {/* --- BACKGROUND FX LAYERS --- */}
      {/* Base Gradient (Same for both modes) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#ff5722] via-[#d84315] to-[#bf360c] z-0 transition-colors duration-700"></div>
      
      {/* Dark Mode: Theme Modifier Vignette (Dynamic Spotlight - Black) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 opacity-0 dark:opacity-100 z-0"
        style={{ background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 20%, rgba(0,0,0,0.7) 100%)' }}
      ></div>

      {/* Additional Subtle Noise for both modes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-30 z-0">
         <div className="absolute inset-0 bg-[url('/noise.svg')] brightness-100 contrast-150"></div>
      </div>


      {/* --- 3D INTERACTIVE SPACE --- */}
      <div 
        ref={hero3dRef}
        className="absolute inset-0 w-full h-full pointer-events-none hero-3d"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
      >
        
        {/* Infinite Grid Floor (Double Layered) */}
        <div 
          className="absolute -left-[100%] -top-[50%] w-[300%] h-[300%] transform-style-3d"
          style={{
            transform: 'rotateX(75deg) translateZ(-150px)',
            maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 60%)'
          }}
        >
            {/* Major Grid Lines */}
            <div 
              className="absolute inset-0 opacity-40 text-white/50"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
              }}
            />
            {/* Minor Grid Lines */}
            <div 
              className="absolute inset-0 opacity-20 text-white/30"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
        </div>

        {/* Floating Asymmetric Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute top-[20%] left-[15%] w-24 h-24 border-[1.5px] border-white/40 rounded-full animate-float-slow opacity-30" style={{ transform: 'translateZ(100px)', willChange: 'transform' }}></div>
          <div className="absolute top-[60%] right-[20%] w-16 h-16 border-[1.5px] border-white/40 rotate-45 animate-float-slow opacity-30" style={{ transform: 'translateZ(150px)', animationDelay: '-1s', willChange: 'transform' }}></div>
          <div className="absolute top-[30%] right-[25%] w-20 h-20 border-[1.5px] border-white/40 opacity-30 animate-float-slow" style={{ transform: 'translateZ(50px) rotate(-15deg)', animationDelay: '-2s', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', willChange: 'transform' }}></div>
          <div className="absolute bottom-[20%] left-[25%] w-40 h-40 border-[1.5px] border-dashed border-white/40 rounded-full animate-float-slow opacity-30" style={{ transform: 'translateZ(-50px)', animationDelay: '-3s', willChange: 'transform' }}></div>
        </div>

        {/* Central Rotating Rings around Title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[800px] h-[350px] md:h-[800px] pointer-events-none opacity-30 select-none z-0">
           {/* Ring 1 - Outer Slow */}
           <div className="absolute inset-0 border-[1.5px] border-white/40 rounded-full hero-spin-reverse opacity-40" style={{ willChange: 'transform' }}>
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
           </div>
           
           {/* Ring 2 - Middle Medium */}
           <div className="absolute inset-[10%] border-[1.5px] border-dashed border-white/50 rounded-full hero-spin opacity-60" style={{ willChange: 'transform' }}>
           </div>

           {/* Ring 3 - Inner Fast with Dot */}
           <div className="absolute inset-[25%] border-[1.5px] border-white/60 rounded-full hero-spin" style={{ willChange: 'transform' }}>
              <div className="absolute -top-1 left-1/2 w-3 h-3 bg-white border-2 border-white/80 rounded-full z-10 shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
           </div>
        </div>

      </div>

      {/* --- CONTENT LAYER (Glass Card Effect) --- */}
      <div className="relative z-40 flex flex-col items-center px-4 md:px-6 max-w-none w-full mx-auto text-center md:text-left overflow-visible">
        
        {/* Title Group with Badge Aligned Start */}
        <div className="flex flex-col items-center justify-center w-full relative mb-1 md:mb-2">
            {/* Availability Badge */}
            <div className="mb-4 md:mb-6 inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md shadow-sm animate-fade-in-down hover:scale-105 transition-all duration-300 z-20">
              <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 md:h-2.5 w-2 md:w-2.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
              </span>
              <span className="text-[10px] md:text-xs font-mono font-semibold tracking-wider text-white uppercase transition-colors duration-700">
                System Under Maintenance
              </span>
            </div>

            {/* Titles - Centered in Rings */}
            <div className="relative isolate text-center z-30 p-0">
              <h1
                className="relative z-50 overflow-visible text-white tracking-[0.02em] leading-[1.8] md:leading-[1.6] pb-2 md:pb-2 drop-shadow-lg dark:drop-shadow-none flex items-baseline justify-center gap-4 md:gap-6 whitespace-nowrap flex-nowrap transition-colors duration-700"
                style={{ fontFamily: '"Space Grotesk", "Manrope", ui-sans-serif, system-ui, sans-serif', fontSize: 'clamp(2.5rem, 7.5vw, 6.5rem)' }}
              >
                <span className="animate-fade-in-up opacity-95" style={{ animationDelay: '0.1s' }}>
                  {DEVELOPER_INFO.name.split(' ')[0]}
                </span>
                {/* Surname: Unified white color due to dark background */}
                <span className="relative inline-grid">
                  <span className="col-start-1 row-start-1 text-white/90 transition-opacity duration-700">
                    {DEVELOPER_INFO.name.split(' ')[1]}
                  </span>
                </span>
              </h1>
              {/* Decorative Text Behind (Parallax Depth) */}
              <span className="hidden lg:inline-block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-5xl lg:text-[13rem] tracking-tighter font-bold text-white/10 z-0 whitespace-nowrap pointer-events-none blur-sm select-none px-4 md:px-24 transition-colors duration-700">
                DEVELOPER
              </span>
            </div>
        </div>

        {/* Subtitle / Bio */}
        <div className="max-w-4xl mx-auto animate-fade-in-up mb-6 md:mb-5 text-center" style={{ animationDelay: '0.3s' }}>
          <p className="text-base md:text-xl text-white/90 dark:text-white/80 font-medium leading-relaxed p-2 md:p-4 rounded-2xl transition-colors duration-700 w-full overflow-x-hidden">
            {DEVELOPER_INFO.role} | {DEVELOPER_INFO.tagline}
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
             {["React", "Firebase", "Node.js", "Gen AI"].map((tech, i) => (
               <span 
                 key={tech} 
                 className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white border border-white/30 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-110 transition-all cursor-default shadow-sm duration-700"
                 style={{ transitionDelay: `${i * 50}ms` }}
               >
                 {tech}
               </span>
             ))}
        </div>

      </div>

      {/* Scroll Indicator */}
      <div 
        onClick={() => {
          const nextSection = document.getElementById('achievement') || document.getElementById('projects');
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }
        }}
        className="absolute bottom-12 animate-bounce z-40 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
      >
        <div className="flex flex-col items-center gap-2">
           <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 transition-colors duration-700">Scroll</span>
           <ArrowDown className="w-5 h-5 text-white transition-colors duration-700" />
        </div>
      </div>

      {/* Smooth Transition to Next Section (Dark Mode Only) */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-transparent dark:from-black to-transparent pointer-events-none z-30 transition-opacity duration-700 opacity-0 dark:opacity-100"></div>

    </section>
  );
};
