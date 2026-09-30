import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Briefcase, GraduationCap, ShieldCheck, Calendar, MapPin, ChevronLeft, ChevronRight, BadgeCheck, Building2 } from 'lucide-react';
import { AchievementCardData } from '../types';
import { getOptimizedImageUrl } from '../utils/cdn';

interface AchievementSliderProps {
  achievements: AchievementCardData[];
}

const AchievementIcon = ({ card }: { card: AchievementCardData }) => {
  const [imgError, setImgError] = useState(false);
  const domain = useMemo(() => {
    if (card.website) {
      return card.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    }
    const org = (card.organization || card.issuer || "").toLowerCase();
    if (org.includes("anthropic")) return "anthropic.com";
    if (org.includes("infosys")) return "infosys.com";
    if (org.includes("verizon")) return "verizon.com";
    if (org.includes("kydoscope")) return "kydoscope.com";
    if (org.includes("sinhgad")) return "sinhgad.edu";
    if (org.includes("infotrixs")) return "infotrixs.in";
    return null;
  }, [card.website, card.organization, card.issuer]);

  const logoUrl = useMemo(() => {
    if (!domain) return '';
    return getOptimizedImageUrl(`https://logo.clearbit.com/${domain}?size=100`, { width: 100 });
  }, [domain]);

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black overflow-hidden relative border border-slate-200/20 dark:border-neutral-800 shadow-md">
      {domain && !imgError && logoUrl ? (
        <img
          src={logoUrl}
          alt={`${card.organization || card.issuer || 'Logo'}`}
          className="w-full h-full object-cover bg-white"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />
      ) : card.type === "experience" ? (
        <Building2 size={22} className="text-sky-400 dark:text-sky-500" />
      ) : card.type === "education" ? (
        <GraduationCap size={22} className="text-purple-400 dark:text-purple-500" />
      ) : (
        <Award size={22} className="text-amber-400 dark:text-amber-500" />
      )}
    </div>
  );
};

// Motion variants for content slide inside static card shell
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
  }),
};

export const AchievementSlider = ({ achievements = [] }: AchievementSliderProps) => {
  // Continuous page tracking [pageIndex, slideDirection] for infinite circular navigation
  const [[page, direction], setPage] = useState([0, 0]);
  const touchStartRef = useRef(0);

  // Filter published items (default to showing if status is not explicitly set to 'draft')
  const publishedAchievements = useMemo(() => {
    return achievements.filter(a => !a.status || a.status === 'published' || a.status !== 'draft');
  }, [achievements]);

  const total = publishedAchievements.length;

  if (total === 0) {
    return null;
  }

  // Wrap continuous page index to actual item index [0, total - 1]
  const currentIndex = ((page % total) + total) % total;
  const currentCard = publishedAchievements[currentIndex];

  const handlePrev = () => {
    setPage(([prevPage]) => [prevPage - 1, -1]);
  };

  const handleNext = () => {
    setPage(([prevPage]) => [prevPage + 1, 1]);
  };

  const handleDotClick = (targetIdx: number) => {
    if (targetIdx === currentIndex) return;
    const diff = targetIdx - currentIndex;
    setPage(([prevPage]) => [prevPage + diff, diff > 0 ? 1 : -1]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
  };

  return (
    <section id="achievement" className="py-20 md:py-28 bg-transparent relative overflow-hidden transition-colors duration-700">
      <div className="px-6 md:px-12 mb-8 md:mb-12 relative z-10 max-w-350 mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-slate-900 dark:text-white leading-tight mb-2 md:mb-4">
          Learning & Achievements
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed">
          Milestones & Journey
        </p>
      </div>

      {/* Static Card Container Shell */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-3xl mx-auto rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-neutral-800/90 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl transition-colors duration-300 min-h-95 sm:min-h-90 flex flex-col justify-between overflow-hidden"
      >
        {/* Animated Slide Content inside static shell */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 350, damping: 30 },
              opacity: { duration: 0.25 }
            }}
            className="w-full flex-1 flex flex-col justify-between"
          >
            <div>
              {/* Card Top Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <AchievementIcon card={currentCard} />
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                      {currentCard.eyebrow || currentCard.type}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-neutral-300">
                      {currentCard.organization || currentCard.issuer || ''}
                    </h4>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-neutral-800 bg-slate-100/80 dark:bg-neutral-900/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                  {currentCard.type === "experience" ? "Work Track" : currentCard.type === "education" ? "Academic Track" : "Certification"}
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-slate-900 dark:text-white leading-snug">
                  {currentCard.title}
                </h3>

                {/* Metadata line */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium">
                  {(currentCard.period || currentCard.issued) && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {currentCard.period || currentCard.issued}
                    </span>
                  )}
                  {currentCard.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {currentCard.location}
                    </span>
                  )}
                  {currentCard.credentialId && (
                    <span className="font-mono text-xs text-slate-400 dark:text-neutral-500">
                      ID: {currentCard.credentialId}
                    </span>
                  )}
                </div>

                {/* Description */}
                {currentCard.description && (
                  <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base md:text-lg leading-relaxed pt-2">
                    {currentCard.description}
                  </p>
                )}

                {/* Skill Badges / Highlights */}
                {((currentCard.highlights && currentCard.highlights.length > 0) || (currentCard.skills && currentCard.skills.length > 0)) && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {(currentCard.highlights || currentCard.skills || []).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card Bottom Border Indicator */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-neutral-900 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-600">
              <span className="flex items-center gap-2">
                <BadgeCheck size={15} className="text-emerald-500 dark:text-emerald-400" /> Verified Milestone
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Slider Controls: Left Arrow + Pagination Dots + Right Arrow */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-4 sm:gap-6 mt-8">
          <button
            onClick={handlePrev}
            aria-label="Previous achievement card"
            className="p-2.5 rounded-full border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-slate-800 dark:text-white shadow-md hover:scale-110 active:scale-95 transition-all outline-none focus:outline-none cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {publishedAchievements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
                    ? 'w-8 bg-slate-900 dark:bg-white'
                    : 'w-2 bg-slate-300 dark:bg-neutral-700 hover:bg-slate-400 dark:hover:bg-neutral-600'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next achievement card"
            className="p-2.5 rounded-full border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-slate-800 dark:text-white shadow-md hover:scale-110 active:scale-95 transition-all outline-none focus:outline-none cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

    </section>
  );
};
