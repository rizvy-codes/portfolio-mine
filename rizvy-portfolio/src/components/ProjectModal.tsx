import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  Target,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project } from "../data/projects";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const total = project.images.length;

  const paginate = (dir: number) =>
    setIndex((i) => (i + dir + total) % total);

  // Esc to close, arrow keys for the slider
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  // Stop the page behind from scrolling while the modal is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-8"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative mx-auto my-4 max-w-4xl rounded-3xl border border-line bg-bg shadow-2xl"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-30 flex items-center justify-between gap-4 rounded-t-3xl border-b border-line bg-bg/85 px-6 py-4 backdrop-blur-md">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-brand-cyan">
              {project.category}
            </p>
            <h3 className="truncate font-display text-xl font-bold sm:text-2xl">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project details"
            autoFocus
            className="glass grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:rotate-90 hover:border-brand-pink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-10 p-6 sm:p-8">
          {/* Gallery */}
          <div>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
              <AnimatePresence mode="wait">
                <motion.img
                  key={index}
                  src={project.images[index]}
                  alt={`${project.title} screenshot ${index + 1} of ${total}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {total > 1 && (
                <>
                  <button
                    onClick={() => paginate(-1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-brand-violet"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-brand-violet"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                    {index + 1} / {total}
                  </span>
                </>
              )}
            </div>

            {total > 1 && (
              <div className="mt-3 flex justify-center gap-3">
                {project.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`h-14 w-24 overflow-hidden rounded-lg border-2 transition ${
                      i === index
                        ? "border-brand-cyan"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-3 font-display text-lg font-bold">
              About this <span className="text-gradient">project</span>
            </h4>
            <div className="space-y-3 leading-relaxed text-muted">
              {project.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          {/* Why + Use cases */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-pink/15 text-brand-pink">
                  <Lightbulb size={20} />
                </span>
                <h4 className="font-display font-bold">Why this project was built</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted">{project.why}</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-cyan/15 text-brand-cyan">
                  <Target size={20} />
                </span>
                <h4 className="font-display font-bold">Where it can be used</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted">
                {project.useCases.map((u) => (
                  <li key={u} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technologies timeline */}
          <div>
            <h4 className="mb-6 font-display text-lg font-bold">
              Technologies <span className="text-gradient">used</span>
            </h4>
            <ol className="relative ml-4 space-y-6 border-l border-line">
              {project.techSteps.map((step, i) => (
                <motion.li
                  key={step.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.1 }}
                  className="relative pl-8"
                >
                  <span className="absolute -left-[17px] top-0 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet text-xs font-bold text-white shadow-lg shadow-brand-violet/30">
                    {i + 1}
                  </span>
                  <p className="font-display font-semibold">{step.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.detail}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 border-t border-line pt-8">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              data-track="live-demo"
              data-project={project.id}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-violet/30 transition hover:scale-105"
            >
              <ExternalLink size={18} />
              Live Demo
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              data-track="github"
              data-project={project.id}
              className="glass flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition hover:scale-105 hover:border-brand-cyan"
            >
              <FaGithub size={18} />
              GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}