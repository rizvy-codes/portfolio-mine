import { motion } from "framer-motion";
import { about, education } from "../data/about";
import { profile } from "../data/profile";
import EducationCard from "./EducationCard";
import Counter from "./ui/Counter";
import SectionHeading from "./ui/SectionHeading";

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-28 md:pr-24"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-40 bottom-20 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="Who I am" title="About" highlight="Me" />

        <div className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-72 sm:w-80"
          >
            <div
              aria-hidden
              className="absolute -inset-3 rotate-3 rounded-3xl bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-pink opacity-70 blur-sm"
            />
            <div className="relative overflow-hidden rounded-3xl border border-line bg-[#07070d]">
              <img
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -bottom-5 -right-5 rounded-2xl px-5 py-3 shadow-xl"
            >
              <p className="font-display text-2xl font-bold text-gradient">1+ Year</p>
              <p className="text-xs text-muted">of professional experience</p>
            </motion.div>
          </motion.div>

          {/* Bio + counters */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display text-2xl font-bold sm:text-3xl">
              Hi, I&apos;m {profile.name}, {" "}
              <span className="text-gradient">Full Stack Web Developer</span>
            </h3>

            <div className="mt-5 space-y-4 leading-relaxed text-muted">
              {about.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-4">
              {about.stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -6, scale: 1.04 }}
                  className="glass rounded-2xl p-4 text-center sm:p-5"
                >
                  <p className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                    <Counter to={stat.to} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Education */}
        <div className="mt-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center font-display text-2xl font-bold sm:text-3xl"
          >
            My <span className="text-gradient">Education</span>
          </motion.h3>

          <div className="grid gap-6 md:grid-cols-2">
            {education.map((item, i) => (
              <EducationCard key={item.degree} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}