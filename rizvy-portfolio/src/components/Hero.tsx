import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { profile } from "../data/profile";
import { useTypewriter } from "../hooks/useTypewriter";
import Magnetic from "./ui/Magnetic";

const socials = [
  { label: "LinkedIn", href: profile.socials.linkedin, Icon: FaLinkedinIn },
  { label: "Twitter", href: profile.socials.twitter, Icon: FaXTwitter },
  { label: "Facebook", href: profile.socials.facebook, Icon: FaFacebookF },
  { label: "GitHub", href: profile.socials.github, Icon: FaGithub },
];

// delayChildren waits for the intro loader to finish
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 2.0 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function FloatingChip({
  label,
  className,
  delay = 0,
}: {
  label: string;
  className: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={`glass absolute z-20 rounded-full px-4 py-2 text-xs font-semibold shadow-xl ${className}`}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {label}
    </motion.span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const typed = useTypewriter(profile.roles);

  // Parallax for the giant background word
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  // 3D tilt for the photo
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const onTilt = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 16);
    rotateX.set(-py * 16);
  };
  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const goToProjects = () =>
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  const goToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-6 md:pr-24"
    >
      {/* ---------- Background ---------- */}
      <div className="grid-bg absolute inset-0" aria-hidden />
      <motion.div
        aria-hidden
        className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-violet/30 blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-brand-cyan/25 blur-3xl"
        animate={{ x: [0, -70, 0], y: [0, -50, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-brand-pink/20 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: textY }}
          className="text-outline select-none whitespace-nowrap font-display text-[22vw] font-bold leading-none"
        >
          WELCOME
        </motion.div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 pb-28 pt-32 lg:grid-cols-2 lg:pb-16">
        {/* Left: text */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Available for work
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
          >
            <span className="mb-2 block text-2xl font-medium text-muted sm:text-3xl">
              Hi, I&apos;m
            </span>
            <span className="text-gradient">{profile.name}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 h-10 font-display text-2xl font-medium sm:text-3xl"
            aria-label={profile.roles.join(", ")}
          >
            {typed}
            <span className="ml-1 inline-block h-7 w-[3px] translate-y-1 animate-pulse bg-brand-cyan" />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted"
          >
            {profile.description}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <button
                onClick={goToProjects}
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-violet/30"
              >
                View Projects
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={goToContact}
                className="glass rounded-full px-7 py-3.5 font-semibold transition hover:border-brand-cyan"
              >
                Hire Me
              </button>
            </Magnetic>
          </motion.div>

          <motion.ul variants={item} className="mt-10 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -6, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass grid h-12 w-12 place-items-center rounded-full text-muted transition-colors hover:border-brand-cyan hover:text-brand-cyan"
                >
                  <Icon size={18} />
                </motion.a>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 2.2, ease: "easeOut" }}
          className="relative mx-auto w-72 sm:w-96"
          style={{ perspective: 1000 }}
          onMouseMove={onTilt}
          onMouseLeave={resetTilt}
        >
          <motion.div
            style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
            className="relative aspect-square"
          >
            {/* Rotating gradient ring */}
            <div
              aria-hidden
              className="ring-spin absolute -inset-2 bg-[conic-gradient(from_0deg,#22d3ee,#8b5cf6,#f472b6,#22d3ee)] blur-[2px]"
            />
            {/* Photo inside a morphing blob mask */}
            <div className="blob-morph absolute inset-0 overflow-hidden bg-[#07070d]">
              <img
                src={profile.photo}
                alt={`${profile.name}, ${profile.roles[0]}`}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-violet/20 via-transparent to-transparent" />
            </div>

            {/* Floating tech chips */}
            <FloatingChip label="React" className="-left-6 top-10" />
            <FloatingChip label="TypeScript" className="-right-8 top-24" delay={0.8} />
            <FloatingChip label="Node.js" className="-left-10 bottom-16" delay={1.6} />
            <FloatingChip label="Next.js" className="-right-4 bottom-4" delay={2.4} />

            {/* Decorative shapes */}
            <motion.div
              aria-hidden
              className="absolute -top-6 right-10 h-8 w-8 rounded-lg border-2 border-brand-pink"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              aria-hidden
              className="absolute -bottom-6 left-16 h-5 w-5 rounded-full bg-brand-cyan"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted md:flex">
        Scroll
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </div>
    </section>
  );
}