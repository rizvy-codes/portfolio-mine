import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Code2,
  FileDown,
  FolderKanban,
  Home,
  Mail,
  Moon,
  Sun,
  User,
  type LucideIcon,
} from "lucide-react";
import { navItems, profile, sectionIds } from "../data/profile";
import { useActiveSection } from "../hooks/useActiveSections";
import { useTheme } from "../hooks/useTheme";

const icons: Record<string, LucideIcon> = {
  home: Home,
  about: User,
  skills: Code2,
  projects: FolderKanban,
  experience: Briefcase,
  blogs: BookOpen,
  contact: Mail,
};

const goTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Navbar() {
  const active = useActiveSection(sectionIds);
  const { theme, toggle } = useTheme();

  return (
    <>
      {/* Logo (top-left) */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          goTo("home");
        }}
        aria-label="Go to top"
        className="fixed left-5 top-5 z-50 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md"
      >
        <img src={profile.logo} alt="Rizvy logo" className="h-8 w-auto" />
      </a>

      {/* Resume button (top-right) + mobile theme toggle */}
      <div className="fixed right-5 top-5 z-50 flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Toggle light and dark theme"
          className="glass grid h-10 w-10 place-items-center rounded-full md:hidden"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
          download
          data-track="resume"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/30 transition hover:scale-105"
        >
          <FileDown size={16} />
        Resume
        </a>
      </div>

      {/* Desktop: floating vertical navbar on the RIGHT */}
      <nav
        aria-label="Main navigation"
        className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 md:block"
      >
        <ul className="glass flex flex-col items-center gap-1 rounded-full p-2 shadow-2xl shadow-black/30">
          {navItems.map((item) => {
            const Icon = icons[item.id];
            const isActive = active === item.id;
            return (
              <li key={item.id} className="group relative">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(item.id);
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="relative grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:text-fg"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={19}
                    className={`relative z-10 ${isActive ? "text-white" : ""}`}
                  />
                </a>
                {/* Tooltip */}
                <span className="glass pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 transition-all group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100">
                  {item.label}
                </span>
              </li>
            );
          })}

          <li className="my-1 h-px w-6 bg-line" aria-hidden />
          <li>
            <button
              onClick={toggle}
              aria-label="Toggle light and dark theme"
              className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:text-fg"
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile: bottom bar */}
      <nav
        aria-label="Mobile navigation"
        className="glass fixed inset-x-3 bottom-3 z-50 flex justify-around rounded-2xl p-2 md:hidden"
      >
        {navItems.map((item) => {
          const Icon = icons[item.id];
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(item.id);
              }}
              aria-label={item.label}
              className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                isActive
                  ? "bg-gradient-to-br from-brand-cyan to-brand-violet text-white"
                  : "text-muted"
              }`}
            >
              <Icon size={18} />
            </a>
          );
        })}
      </nav>
    </>
  );
}