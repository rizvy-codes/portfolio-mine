import { ArrowRight, Calendar, Clock } from "lucide-react";
import { formatDate, type Blog } from "../data/blogs";
import TiltCard from "./ui/TiltCard";

export default function BlogCard({
  blog,
  onOpen,
}: {
  blog: Blog;
  onOpen: () => void;
}) {
  return (
    <TiltCard className="gradient-border glass group rounded-3xl">
      <article className="relative flex h-full flex-col">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={blog.cover}
            alt={`Cover image for ${blog.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {blog.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-brand-cyan" />
              <time dateTime={blog.date}>{formatDate(blog.date)}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-brand-pink" />
              {blog.readTime}
            </span>
          </div>

          <h3 className="font-display text-xl font-bold leading-snug">{blog.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
            {blog.excerpt}
          </p>

          <button
            onClick={onOpen}
            data-track="blog"
            data-blog={blog.id}
            aria-label={`Read ${blog.title}`}
            className="group/btn mt-6 flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-brand-violet/40"
          >
            View Details
            <ArrowRight
              size={16}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </article>
    </TiltCard>
  );
}