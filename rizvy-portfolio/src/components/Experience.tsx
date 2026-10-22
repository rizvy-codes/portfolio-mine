import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { experiences, type Experience as ExperienceItem } from "../data/experience";
import SectionHeading from "./ui/SectionHeading";

function ExperienceCard({
  item,
  index,
}: {
  item: ExperienceItem;
  index: number;
}) {
  const isLeft = index % 2 === 0; // even = left side on desktop

  return (
    <div
      className={`relative pl-12 md:w-1/2 md:pl-0 ${
        isLeft ? "md:pr-12" : "md:ml-auto md:pl-12"
      }`}
    >
      {/* Timeline dot */}
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
        className={`absolute left-4 top-8 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet text-white shadow-lg shadow-brand-violet/40 ${
          isLeft
            ? "md:left-auto md:right-0 md:translate-x-1/2"
            : "md:left-0 md:-translate-x-1/2"
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-brand-violet/40"
        />
        <Briefcase size={16} className="relative" />
      </motion.span>

      {/* Card */}
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        whileHover={{ y: -8 }}
        className="gradient-border glass group relative overflow-hidden rounded-3xl p-7"
      >
        <div
          aria-hidden
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-violet/20 blur-3xl transition-colors duration-500 group-hover:bg-brand-cyan/30"
        />

        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <Calendar size={14} className="text-brand-cyan" />
              {item.duration}
            </span>
            <span className="rounded-full bg-brand-pink/10 px-3 py-1.5 text-xs font-medium text-brand-pink">
              {item.type}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold leading-snug">{item.role}</h3>
          <p className="mt-1 flex items-center gap-2 font-medium text-brand-cyan">
            {item.company}
            {item.placeholder && (
              <span className="rounded-full border border-dashed border-line px-2 py-0.5 text-[10px] font-normal text-muted">
                placeholder
              </span>
            )}
          </p>

          <ul className="mt-5 space-y-3">
            {item.responsibilities.map((text, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-cyan" />
                {text}
              </motion.li>
            ))}
          </ul>

          <div className="mt-6 border-t border-line pt-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">
              Tech used
            </p>
            <ul className="flex flex-wrap gap-2">
              {item.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);

  // The colored line fills up as you scroll through the timeline
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="relative overflow-hidden px-6 py-28 md:pr-24">
      <div
        aria-hidden
        className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-pink/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading eyebrow="My journey" title="Work" highlight="Experience" />

        <div ref={timelineRef} className="relative space-y-12">
          {/* Base line */}
          <div
            aria-hidden
            className="absolute bottom-0 left-4 top-0 w-0.5 -translate-x-1/2 bg-line md:left-1/2"
          />
          {/* Animated fill line */}
          <motion.div
            aria-hidden
            style={{ scaleY }}
            className="absolute bottom-0 left-4 top-0 w-0.5 origin-top -translate-x-1/2 bg-gradient-to-b from-brand-cyan via-brand-violet to-brand-pink md:left-1/2"
          />

          {experiences.map((item, i) => (
            <ExperienceCard key={`${item.role}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}