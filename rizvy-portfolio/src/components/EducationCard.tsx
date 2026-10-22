import { motion } from "framer-motion";
import { Calendar, GraduationCap, School } from "lucide-react";
import type { EducationItem } from "../data/about";

export default function EducationCard({
  item,
  index,
}: {
  item: EducationItem;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      className="gradient-border glass group relative overflow-hidden rounded-3xl p-7"
    >
      {/* Soft glow in the corner */}
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-violet/20 blur-3xl transition-opacity duration-500 group-hover:bg-brand-cyan/30"
      />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-violet text-white shadow-lg shadow-brand-violet/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
            <GraduationCap size={26} />
          </span>
          <span className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Calendar size={14} className="text-brand-cyan" />
            {item.year}
          </span>
        </div>

        <h3 className="font-display text-xl font-bold leading-snug">{item.degree}</h3>

        <p className="mt-2 flex items-center gap-2 text-muted">
          <School size={16} className="shrink-0 text-brand-pink" />
          {item.school}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan">
            {item.group}
          </span>
          {item.placeholder && (
            <span className="rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted">
              placeholder: edit in data/about.ts
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
    </motion.article>
  );
}