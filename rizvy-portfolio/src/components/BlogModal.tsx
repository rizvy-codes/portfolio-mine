import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, Check, CheckCircle2, Clock, Copy, Quote } from "lucide-react";
import { formatDate, type Block, type Blog } from "../data/blogs";

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked, ignore */
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d16] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-3 text-xs uppercase tracking-wider text-white/50">
            {language}
          </span>
        </div>
        <button
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed text-cyan-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2 key={i} className="mb-4 mt-12 font-display text-2xl font-bold sm:text-3xl">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p key={i} className="my-5 text-[17px] leading-8 text-fg/80">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="my-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[17px] leading-7 text-fg/80">
              <CheckCircle2 size={20} className="mt-1 shrink-0 text-brand-cyan" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={i}
          className="glass relative my-8 rounded-2xl border-l-4 border-l-brand-violet p-6 pl-8"
        >
          <Quote size={28} className="absolute left-4 top-4 text-brand-violet/30" />
          <p className="relative font-display text-xl font-medium italic leading-relaxed">
            {block.text}
          </p>
          {block.author && (
            <footer className="mt-3 text-sm text-muted">- {block.author}</footer>
          )}
        </blockquote>
      );
    case "code":
      return <CodeBlock key={i} language={block.language} code={block.code} />;
  }
}

export default function BlogModal({
  blog,
  onClose,
}: {
  blog: Blog;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reading progress is based on this modal's own scroll area
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <motion.div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-label={blog.title}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-0 z-[70] overflow-y-auto bg-bg"
    >
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[80] h-1 w-full origin-left bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink"
      />

      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <button
            onClick={onClose}
            autoFocus
            className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:border-brand-cyan"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <p className="min-w-0 flex-1 truncate text-sm text-muted">{blog.title}</p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        {/* Cover */}
        <div className="overflow-hidden rounded-3xl border border-line">
          <img
            src={blog.cover}
            alt={`Cover image for ${blog.title}`}
            className="aspect-[16/8] w-full object-cover"
          />
        </div>

        {/* Meta */}
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan">
            {blog.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-brand-cyan" />
            <time dateTime={blog.date}>{formatDate(blog.date)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-brand-pink" />
            {blog.readTime}
          </span>
        </div>

        <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-5xl">
          {blog.title}
        </h1>

        <ul className="mt-5 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted"
            >
              #{tag}
            </li>
          ))}
        </ul>

        <hr className="my-10 border-line" />

        {/* Article body */}
        <div>{blog.content.map(renderBlock)}</div>

        {/* End of article */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-line pt-10 text-center">
          <p className="text-muted">Thanks for reading!</p>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-7 py-3 font-semibold text-white shadow-lg shadow-brand-violet/30 transition hover:scale-105"
          >
            <ArrowLeft size={18} />
            Back to all blogs
          </button>
        </div>
      </article>
    </motion.div>
  );
}