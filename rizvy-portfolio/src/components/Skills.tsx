import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { allSkills, skillCategories, type Skill } from "../data/skills";
import Marquee from "./ui/Marquee";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

function SkillTile({ skill, index }: { skill: Skill; index: number }) {
  const { Icon, name, color, isNew } = skill;
  const glow = color ?? "#8b5cf6";

  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ y: -6, scale: 1.08 }}
      style={{ "--glow": glow } as CSSProperties}
      title={name}
      className="relative flex w-[88px] flex-col items-center gap-2 rounded-2xl border border-line bg-card px-2 py-3 text-center transition-[box-shadow,border-color] duration-300 hover:shadow-[0_0_26px_var(--glow)] hover:[border-color:var(--glow)]"
    >
    
       
      
      <Icon size={30} style={{ color: color ?? undefined }} />
      <span className="break-words text-[11px] font-medium leading-tight">{name}</span>
    </motion.li>
  );
}

export default function Skills() {
  const half = Math.ceil(allSkills.length / 2);

  return (
    <section id="skills" className="relative overflow-hidden px-6 py-28 md:pr-24">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-pink/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="What I use" title="My" highlight="Skills" />

        {/* Infinite marquees (move in opposite directions) */}
        <div className="-mx-6 mb-16 space-y-4 md:-mr-24">
          <Marquee skills={allSkills.slice(0, half)} duration={60} />
          <Marquee skills={allSkills.slice(half)} duration={65} reverse />
        </div>

        {/* Category cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.12 }}
            >
              <TiltCard className="glass rounded-3xl p-6">
                <div className="relative">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-violet text-white shadow-lg shadow-brand-violet/30">
                      <category.Icon size={22} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold leading-tight">
                        {category.title}
                      </h3>
                      <p className="text-xs text-muted">{category.description}</p>
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-3">
                    {category.skills.map((skill, index) => (
                      <SkillTile key={skill.name} skill={skill} index={index} />
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}