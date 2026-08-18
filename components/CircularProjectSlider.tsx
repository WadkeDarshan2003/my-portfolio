import React, { useRef, useEffect } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { ArrowUpRight, Clock } from 'lucide-react';
import { Project } from '../types';

interface CircularProjectSliderProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export const CircularProjectSlider = ({ projects, onProjectClick }: CircularProjectSliderProps) => {
  const n = projects.length;
  const stageRef   = useRef<HTMLDivElement>(null);   // overflow:hidden stage
  // Two refs per card: outer (positioning) + inner (3-D effect)
  const outerRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs  = useRef<(HTMLDivElement | null)[]>([]);

  // Animation state — kept in refs to avoid React re-renders
  const posRef    = useRef(0);    // current visual position (float, card-index units)
  const targetRef = useRef(0);    // snap target (integer card index)
  const rafId     = useRef(0);
  // Exposed navigate function — called by the prev/next buttons
  const navigateFn = useRef<(dir: 1 | -1) => void>(() => {});

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || n === 0) return;

    // Wrap a value to [0, n)
    const wrap = (v: number) => ((v % n) + n) % n;

    // ── paint ─────────────────────────────────────────────────────────
    // Reads the stage and card widths each frame (handles resize automatically).
    const paint = () => {
      const stageW = stage.offsetWidth;
      const cardW  = outerRefs.current[0]?.offsetWidth ?? stageW * 0.55;
      // X-offset that places a card (dist=0) dead-centre in the stage
      const centreX = (stageW - cardW) / 2;
      const p = posRef.current;

      outerRefs.current.forEach((outer, i) => {
        const inner = innerRefs.current[i];
        if (!outer || !inner) return;

        // Shortest circular distance from current position to card i
        let dist = i - p;
        while (dist >  n / 2) dist -= n;
        while (dist < -n / 2) dist += n;

        // Position the outer wrapper (0.82 multiplier brings slides closer together)
        outer.style.transform = `translateX(${centreX + dist * (cardW * 0.82)}px)`;

        // 3-D lens effect on the inner card
        const pp      = Math.max(-1, Math.min(1, dist / 1.2));
        const scale   = 1.05 - Math.abs(pp) * 0.30;             // 1.05 → 0.75
        const opacity = Math.max(0.15, 1 - Math.abs(pp) * 0.85);
        const rotY    = pp * -45;                                 // ±45°
        const tz      = -Math.abs(pp) * 180;

        inner.style.transform = `scale(${scale}) rotateY(${rotY}deg) translateZ(${tz}px)`;
        inner.style.opacity   = String(opacity);
      });
    };

    // ── rAF loop: lerp pos → target, then paint ───────────────────────
    const tick = () => {
      // Find the shortest arc on the circle from pos to target
      let diff = targetRef.current - posRef.current;
      while (diff >  n / 2) diff -= n;
      while (diff < -n / 2) diff += n;

      posRef.current += diff * 0.06;          // slow, smooth lerp
      posRef.current  = wrap(posRef.current);
      paint();
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    // ── Navigate function: move ±1 card ─────────────────────────────
    const navigate = (dir: 1 | -1) => {
      targetRef.current = wrap(Math.round(posRef.current) + dir);
    };
    navigateFn.current = navigate;

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, [n]);

  // Touch swipe support for mobile
  const touchStartRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    // Swipe left (next) vs Swipe right (prev) with a 40px threshold
    if (diff > 40) {
      navigateFn.current(1);
    } else if (diff < -40) {
      navigateFn.current(-1);
    }
  };

  if (!projects || n === 0) return null;

  return (
    <section className="relative w-full min-h-0 md:min-h-[100vh] bg-stone-50 dark:bg-black flex flex-col justify-center pt-6 pb-2 md:py-20" style={{ overflowX: 'clip' }}>
      {/* Live Aurora Background (Matches Expertise section) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-200/25 dark:bg-blue-600/15 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-purple-200/25 dark:bg-purple-600/15 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] bg-emerald-200/25 dark:bg-emerald-600/10 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* Header */}
      <div className="px-6 md:px-12 mb-6 md:mb-16 relative z-10 max-w-[1400px] mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-poppins font-bold text-slate-900 dark:text-white leading-tight mb-2 md:mb-5">
          Selected Works
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed">
          A showcase of my recent projects, featuring glassmorphism and circular parallax interaction.
        </p>
      </div>

      {/* Stage Wrapper with side buttons - Full viewport width, ignoring container margins/paddings */}
      <div className="relative w-full">
        {/* Prev (Left) Button */}
        <button
          onClick={() => navigateFn.current(-1)}
          aria-label="Previous project"
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-slate-300/80 dark:border-neutral-700/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-slate-800 dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next (Right) Button */}
        <button
          onClick={() => navigateFn.current(1)}
          aria-label="Next project"
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-slate-300/80 dark:border-neutral-700/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-slate-800 dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Stage - Supports Touch Swipe */}
        <div
          ref={stageRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative z-10 w-full h-[250px] sm:h-[320px] md:h-[58vh]"
          style={{ touchAction: 'pan-y', overflowX: 'clip', overflowY: 'visible', paddingTop: '10px', paddingBottom: '0px' }}
        >
        {projects.map((project, i) => (
          /* Outer: JS sets translateX to position the card in the ring */
          <div
            key={project.id}
            ref={el => { outerRefs.current[i] = el; }}
            className="absolute top-0 left-0 h-full w-[82vw] sm:w-[72vw] md:w-[60vw] lg:w-[48vw]"
            style={{ perspective: '1200px', willChange: 'transform' }}
          >
            {/* Inner: JS applies scale / rotateY / translateZ + opacity (the 3-D lens effect) */}
            <div
              ref={el => { innerRefs.current[i] = el; }}
              onClick={() => onProjectClick(project)}
              className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer group bg-black shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/25 transition-[border-color] duration-300"
              style={{ willChange: 'transform, opacity', transformStyle: 'preserve-3d' }}
            >
              {/* Project image */}
              <div className="absolute inset-0">
                {project.image ? (
                  <OptimizedImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">No Image</div>
                )}
              </div>

              {/* Hover CTA overlay */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col gap-3 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                {project.websiteUrl ? (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="px-5 py-2.5 w-44 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    View Website <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <button
                    onClick={e => e.stopPropagation()}
                    className="px-5 py-2.5 w-44 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    View Website <ArrowUpRight size={14} />
                  </button>
                )}
                <button
                  onClick={e => { e.stopPropagation(); onProjectClick(project); }}
                  className="px-5 py-2.5 w-44 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  style={{ transitionDelay: '50ms' }}
                >
                  View Details
                </button>
              </div>

              {/* Title bar */}
              <div className="absolute bottom-0 left-0 w-full px-3.5 sm:px-6 md:px-8 pb-3.5 sm:pb-6 pt-10 sm:pt-16 md:pt-24 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10">
                <h3 className="text-base sm:text-2xl md:text-4xl font-poppins font-semibold text-white mb-1.5 sm:mb-3 leading-tight drop-shadow-md">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest border border-white/20 rounded-md bg-white/10 text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                  {project.duration && (
                    <span className="hidden sm:flex px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-white/20 rounded-md bg-white/10 text-white items-center gap-1">
                      <Clock size={12} /> {project.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};
