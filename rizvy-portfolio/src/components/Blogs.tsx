import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { blogs, type Blog } from "../data/blogs";
import BlogCard from "./BlogCard";
import BlogModal from "./BlogModal";
import SectionHeading from "./ui/SectionHeading";

export default function Blogs() {
  const [selected, setSelected] = useState<Blog | null>(null);

  return (
    <section id="blogs" className="relative overflow-hidden px-6 py-28 md:pr-24">
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-pink/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="My writing" title="Latest" highlight="Blogs" />

        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.15 }}
            >
              <BlogCard blog={blog} onOpen={() => setSelected(blog)} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <BlogModal
            key={selected.id}
            blog={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}