import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, BookOpen, Briefcase, Calendar, GraduationCap, MapPin, ShieldCheck, ArrowDown } from "lucide-react";
import { AchievementCardData } from "../types";

const Meta = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5">
    <Icon size={14} strokeWidth={1.8} />
    {children}
  </span>
);

const getAchievementKey = (card: AchievementCardData, index: number) =>
  `${card.id || `${card.type}-${card.title}`}-${index}`;

const AchievementIcon = ({ card }: { card: AchievementCardData }) => {
  const [imgError, setImgError] = React.useState(false);
  const domain = React.useMemo(() => {
    if (!card.website) return null;
    return card.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
  }, [card.website]);

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-black overflow-hidden relative border border-slate-200 dark:border-neutral-800">
      {domain && !imgError ? (
        <img 
          src={`https://logo.clearbit.com/${domain}?size=100`} 
          alt="Logo" 
          className="w-full h-full object-cover bg-white"
          onError={() => setImgError(true)}
        />
      ) : (
        card.type === "experience" ? <Briefcase size={22} /> : card.type === "education" ? <GraduationCap size={22} /> : <ShieldCheck size={22} />
      )}
    </div>
  );
};

export const ScrollCard = ({ card, index }: { card: AchievementCardData; index: number }) => {
  return (
    <div className="flex h-screen w-full items-center">
      <motion.article
        initial={{ y: 36, scale: 0.96, opacity: 0 }}
        whileInView={{ y: 0, scale: 1, opacity: 1 }}
        viewport={{ margin: "-100px", once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          zIndex: 10 + index,
        }}
        className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-6 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 md:p-8"
      >
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-3">
            <AchievementIcon card={card} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                {card.eyebrow}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:border-neutral-800 dark:text-neutral-400">
            Stack
          </span>
        </div>

        <div className="mt-9">
          <h3 className="text-2xl font-poppins font-semibold leading-tight text-slate-950 dark:text-white md:text-4xl">
            {card.title}
          </h3>

          {card.type === "education" || card.type === "experience" ? (
            <>
              <p className="mt-3 text-base text-slate-700 dark:text-neutral-300 md:text-lg">
                {card.organization}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-neutral-500">
                <Meta icon={Calendar}>{card.period}</Meta>
                {card.location && <Meta icon={MapPin}>{card.location}</Meta>}
              </div>
              <p className="mt-7 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-neutral-300 md:text-base">
                {card.description}
              </p>
              {card.highlights && card.highlights.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-2">
                  {card.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-neutral-900 dark:text-neutral-300"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mt-3 text-base text-slate-700 dark:text-neutral-300 md:text-lg">
                {card.issuer} · {card.issued}
              </p>
              {card.credentialId && (
                <p className="mt-4 text-xs font-mono text-slate-400 dark:text-neutral-600">
                  Credential ID: {card.credentialId}
                </p>
              )}
              {card.skills && card.skills.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-2">
                  {card.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-neutral-900 dark:text-neutral-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-10 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent dark:from-neutral-800 dark:via-neutral-700" />
        <div className="mt-5 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-600">
          <span>{card.type === "experience" ? "Professional Track" : card.type === "education" ? "Academic Track" : "Verified Learning"}</span>
          <BookOpen size={16} />
        </div>
      </motion.article>
    </div>
  );
};

const AchievementSection = ({ achievements }: { achievements: AchievementCardData[] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  
  const transformEnd = `-${(achievements.length - 1) * 100}vh`;
  const rightTrackY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vh", transformEnd]
  );

  return (
    <section
      ref={sectionRef}
      id="achievement"
      className="relative isolate bg-stone-50 dark:bg-black transition-colors duration-700 h-auto lg:h-[var(--section-height)]"
      style={{ "--section-height": `${achievements.length * 100}vh` } as React.CSSProperties}
    >
      {/* Live Aurora Background (Matches Expertise section) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-200/20 dark:bg-blue-600/15 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[30%] right-[-15%] w-[60%] h-[60%] bg-purple-200/20 dark:bg-purple-600/15 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] bg-emerald-200/20 dark:bg-emerald-600/10 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* Desktop Sticky View */}
      <div className="hidden lg:block sticky top-0 z-10 h-screen overflow-hidden">
        <div className="mx-auto grid h-full max-w-7xl px-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] items-center gap-10 lg:gap-16">
          <aside className="z-10 h-full flex flex-col justify-center">
            <div className="flex max-w-xl flex-col justify-start">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 dark:border-neutral-800 dark:bg-white/[0.04]">
              <Award size={14} className="text-slate-500 dark:text-neutral-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">
                Achievement
              </span>
            </div>

            <h2 className="mt-5 text-3xl md:text-5xl font-poppins font-bold leading-tight text-slate-950 dark:text-white">
              Learning milestones that stack into real product craft.
            </h2>

            <div className="mt-10 relative">

              <div className="mt-3 inline-flex items-center gap-2 text-xl md:text-2xl font-poppins font-semibold text-slate-950 dark:text-white">
                <Briefcase size={22} />
                Journey
              </div>
              <div className="mt-8 h-1 w-48 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-slate-900 dark:bg-white" 
                  style={{ scaleX: scrollYProgress, transformOrigin: "left" }} 
                />
              </div>
              <button 
                onClick={() => {
                  const el = sectionRef.current;
                  if (el) window.scrollTo({ top: el.offsetTop + el.offsetHeight, behavior: 'smooth' });
                }}
                className="mt-8 flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all hover:scale-105 hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                Skip Section <ArrowDown size={14} />
              </button>
            </div>
          </div>
          </aside>

          <div className="relative h-screen overflow-hidden">
            <motion.div style={{ y: rightTrackY }}>
              {achievements.map((card, index) => (
                <ScrollCard key={getAchievementKey(card, index)} card={card} index={index} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Stacked View */}
      <div className="lg:hidden mx-auto max-w-7xl px-6 py-20">
        <aside className="mb-12">
          <div className="flex max-w-xl flex-col justify-start">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 dark:border-neutral-800 dark:bg-white/[0.04]">
              <Award size={14} className="text-slate-500 dark:text-neutral-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">
                Achievement
              </span>
            </div>

            <h2 className="mt-5 text-3xl md:text-5xl font-poppins font-bold leading-tight text-slate-950 dark:text-white">
              Learning milestones that stack into real product craft.
            </h2>

            <div className="mt-10">
              <div className="mt-3 inline-flex items-center gap-2 text-xl md:text-2xl font-poppins font-semibold text-slate-950 dark:text-white">
                <Briefcase size={22} />
                Journey
              </div>
              <button 
                onClick={() => {
                  const el = sectionRef.current;
                  if (el) window.scrollTo({ top: el.offsetTop + el.offsetHeight, behavior: 'smooth' });
                }}
                className="mt-6 flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all hover:scale-105 hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                Skip Section <ArrowDown size={14} />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-8">
          {achievements.map((card, index) => (
            <div key={getAchievementKey(card, index)} className="flex w-full items-center">
              <motion.article
                initial={{ y: 36, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ margin: "-50px", once: true }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-6 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 md:p-8"
              >
                {/* Mobile card content */}
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-center gap-3">
                    <AchievementIcon card={card} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                        {card.eyebrow}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-9">
                  <h3 className="text-2xl font-poppins font-semibold leading-tight text-slate-950 dark:text-white md:text-4xl">
                    {card.title}
                  </h3>

                  {card.type === "education" || card.type === "experience" ? (
                    <>
                      <p className="mt-3 text-base text-slate-700 dark:text-neutral-300 md:text-lg">
                        {card.organization}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-neutral-500">
                        <Meta icon={Calendar}>{card.period}</Meta>
                        <Meta icon={MapPin}>{card.location}</Meta>
                      </div>
                      <p className="mt-7 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-neutral-300 md:text-base">
                        {card.description}
                      </p>
                      {card.highlights && card.highlights.length > 0 && (
                        <div className="mt-7 flex flex-wrap gap-2">
                          {card.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-neutral-900 dark:text-neutral-300"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-base text-slate-700 dark:text-neutral-300 md:text-lg">
                        {card.issuer} · {card.issued}
                      </p>
                      {card.credentialId && (
                        <p className="mt-4 text-xs font-mono text-slate-400 dark:text-neutral-600">
                          Credential ID: {card.credentialId}
                        </p>
                      )}
                      {card.skills && card.skills.length > 0 && (
                        <div className="mt-7 flex flex-wrap gap-2">
                          {card.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-neutral-900 dark:text-neutral-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const parseDateString = (dateStr?: string) => {
  if (!dateStr) return 0;
  // If it's a period like "Apr 2025 - Present", split and take the first part
  const firstDateStr = dateStr.split(' - ')[0];
  const parsedDate = new Date(firstDateStr);
  return isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
};

export const Achievement = ({ achievements = [] }: { achievements: AchievementCardData[] }) => {
  if (achievements.length === 0) {
    return null;
  }

  const sortedAchievements = [...achievements].sort((a, b) => {
    // 1. Sort by type
    const typeOrder: Record<string, number> = { education: 1, experience: 2, certification: 3 };
    const orderA = typeOrder[a.type] || 99;
    const orderB = typeOrder[b.type] || 99;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // 2. Sort by date ascending within type
    const dateA = parseDateString(a.period || a.issued);
    const dateB = parseDateString(b.period || b.issued);
    
    return dateA - dateB;
  });

  return <AchievementSection achievements={sortedAchievements} />;
};
