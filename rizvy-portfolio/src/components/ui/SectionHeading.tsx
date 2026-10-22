import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="mb-14 text-center"
    >
      <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-brand-cyan">
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
        {title} <span className="text-gradient">{highlight}</span>
      </h2>
    </motion.div>
  );
}