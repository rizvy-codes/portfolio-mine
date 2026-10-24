import { ArrowRight } from "lucide-react";
import type { Project } from "../data/projects";
import TiltCard from "./ui/TiltCard";

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const visibleTags = project.tech.slice(0, 4);
  const extra = project.tech.length - visibleTags.length;

  return (
    <TiltCard className="gradient-border glass group rounded-3xl">
      <div className="relative flex h-full flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={project.thumbnail}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {project.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl font-bold">{project.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
            {project.shortDescription}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan"
              >
                {tag}
              </li>
            ))}
            {extra > 0 && (
              <li className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                +{extra}
              </li>
            )}
          </ul>

          <button
            onClick={onOpen}
            data-track="project"
            data-project={project.id}
            aria-label={`Open details for ${project.title}`}
            className="group/btn mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-brand-violet/40"
          >
            Project Details
            <ArrowRight
              size={16}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </div>
    </TiltCard>
  );
}