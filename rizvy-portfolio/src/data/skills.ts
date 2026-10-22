import type { CSSProperties, ReactNode } from "react";
import {
  Bot,
  Boxes,
  Brain,
  Code2,
  Component as ComponentIcon,
  CreditCard,
  Database,
  FlaskConical,
  Globe,
  KeyRound,
  LayoutTemplate,
  Lightbulb,
  Monitor,
  Network,
  Palette,
  Plug,
  Puzzle,
  Server,
  ShieldCheck,
  Sparkles,
  UserCog,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { FaCss3Alt, FaHtml5 } from "react-icons/fa6";
import {
  SiExpress,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

// Works with both react-icons and lucide-react icons
export type SkillIcon = (props: { size?: number; style?: CSSProperties }) => ReactNode;

// ✏️ EDIT HERE to add / remove skills.
// color  = icon color (null = follows the theme, good for black/white logos)
// isNew  = shows a small green "NEW" badge
export interface Skill {
  name: string;
  Icon: SkillIcon;
  color: string | null;
  isNew?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  Icon: LucideIcon;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Foundation",
    description: "The core web fundamentals everything else is built on.",
    Icon: Code2,
    skills: [
      { name: "HTML5", Icon: FaHtml5, color: "#E34F26" },
      { name: "CSS3", Icon: FaCss3Alt, color: "#1572B6" },
      { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
      { name: "ES6+ & Problem Solving", Icon: Puzzle, color: "#F59E0B" },
    ],
  },
  {
    title: "Frontend",
    description: "Responsive, accessible and animated user interfaces.",
    Icon: Monitor,
    skills: [
      { name: "React.js", Icon: SiReact, color: "#61DAFB" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
      { name: "TypeScript + OOP", Icon: SiTypescript, color: "#3178C6", isNew: true },
      { name: "Next.js", Icon: SiNextdotjs, color: null },
    ],
  },
  {
    title: "UI Libraries",
    description: "Ready-made component systems for faster, consistent UI.",
    Icon: Palette,
    skills: [
      { name: "Hero UI", Icon: LayoutTemplate, color: "#8B5CF6", isNew: true },
      { name: "ShadCN", Icon: ComponentIcon, color: null, isNew: true },
    ],
  },
  {
    title: "Backend",
    description: "Secure REST APIs and clean server-side logic.",
    Icon: Server,
    skills: [
      { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express.js", Icon: SiExpress, color: null },
      { name: "Modular Pattern", Icon: Boxes, color: "#22D3EE", isNew: true },
      { name: "API Integration", Icon: Plug, color: "#F472B6" },
    ],
  },
  {
    title: "Database",
    description: "Designing, modelling and querying data stores.",
    Icon: Database,
    skills: [
      { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
      { name: "Mongoose / ODM", Icon: Network, color: "#E0525B", isNew: true },
      { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
      { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
    ],
  },
  {
    title: "Auth & Security",
    description: "Protecting users, sessions and routes.",
    Icon: ShieldCheck,
    skills: [
      { name: "BetterAuth", Icon: KeyRound, color: "#3B82F6", isNew: true },
      { name: "Role Based Access Control", Icon: UserCog, color: "#A855F7", isNew: true },
    ],
  },
  {
    title: "Payment & Testing",
    description: "Taking payments and making sure code works.",
    Icon: CreditCard,
    skills: [
      { name: "Stripe", Icon: SiStripe, color: "#635BFF", isNew: true },
      { name: "SSLCommerz", Icon: Wallet, color: "#22C55E", isNew: true },
      { name: "Intro to Testing", Icon: FlaskConical, color: "#F97316", isNew: true },
    ],
  },
  {
    title: "Advanced Concepts",
    description: "Browser internals and working smarter with AI.",
    Icon: Brain,
    skills: [
      { name: "DOM vs BOM", Icon: Globe, color: "#0EA5E9" },
      { name: "AI Mindset", Icon: Lightbulb, color: "#FACC15", isNew: true },
      { name: "AI Integration", Icon: Bot, color: "#22D3EE", isNew: true },
      { name: "AI Assisted Coding", Icon: Sparkles, color: "#F472B6", isNew: true },
    ],
  },
  {
    title: "Tools & Deployment",
    description: "Version control, design and shipping to production.",
    Icon: Wrench,
    skills: [
      { name: "Git", Icon: SiGit, color: "#F05032" },
      { name: "GitHub", Icon: SiGithub, color: null },
      { name: "VS Code", Icon: VscVscode, color: "#007ACC" },
      { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
      { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
      { name: "Vercel", Icon: SiVercel, color: null },
      { name: "Netlify", Icon: SiNetlify, color: "#00C7B7" },
    ],
  },
];

export const allSkills: Skill[] = skillCategories.flatMap((c) => c.skills);