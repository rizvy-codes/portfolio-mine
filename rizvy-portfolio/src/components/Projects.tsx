import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "../data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import SectionHeading from "./ui/SectionHeading";

const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

export default function Projects() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="relative overflow-hidden px-6 py-28 md:pr-24">
      <div
        aria-hidden
        className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="My work" title="Featured" highlight="Projects" />

        {/* Category filter */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="mb-12 flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={active === category}
              onClick={() => setActive(category)}
              className="relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
            >
              {active === category && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  active === category ? "text-white" : "text-muted hover:text-fg"
                }`}
              >
                {category}
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard project={project} onOpen={() => setSelected(project)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal
            key={selected.id}
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}