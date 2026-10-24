import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 });

  useEffect(() => {
    const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasMouse || reduceMotion) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setHovering(
        Boolean(target?.closest("a, button, [role='button'], input, textarea, select, label, summary"))
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Small dot (follows the mouse exactly) */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-0 w-0"
      >
        <span className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cyan" />
      </motion.div>

      {/* Ring (follows with a soft delay and grows over links and buttons) */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-0 w-0"
      >
        <motion.span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-violet"
          animate={{
            width: hovering ? 56 : 36,
            height: hovering ? 56 : 36,
            scale: pressed ? 0.8 : 1,
            backgroundColor: hovering ? "rgba(139, 92, 246, 0.18)" : "rgba(139, 92, 246, 0)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        />
      </motion.div>
    </>
  );
}