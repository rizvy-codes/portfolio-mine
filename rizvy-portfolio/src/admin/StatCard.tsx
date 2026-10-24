import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  hint,
  Icon,
  color,
  index,
  live = false,
}: {
  label: string;
  value: number | string | undefined;
  hint?: string;
  Icon: LucideIcon;
  color: string;
  index: number;
  live?: boolean;
}) {
  const display =
    value === undefined ? "-" : typeof value === "number" ? value.toLocaleString() : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass relative overflow-hidden rounded-2xl p-5"
    >
      <div
        aria-hidden
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl"
        style={{ background: color }}
      />
      <div className="relative flex items-start justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span
          className="relative grid h-9 w-9 place-items-center rounded-xl text-white"
          style={{ background: color }}
        >
          {live && (
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-xl opacity-40"
              style={{ background: color }}
            />
          )}
          <Icon size={18} className="relative" />
        </span>
      </div>
      <p className="relative mt-3 font-display text-3xl font-bold">{display}</p>
      {hint && <p className="relative mt-1 text-xs text-muted">{hint}</p>}
    </motion.div>
  );
}