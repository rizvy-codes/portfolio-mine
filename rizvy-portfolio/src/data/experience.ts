// ✏️ EDIT THIS FILE to change your work experience.
// Put the newest experience first.

export interface Experience {
  role: string;
  company: string;
  type: string; // Full-time, Freelance, Internship, etc.
  duration: string;
  responsibilities: string[];
  tech: string[];
  placeholder?: boolean; // shows a "placeholder" tag, set to false or delete once edited
}

export const experiences: Experience[] = [
  {
    role: "Full Stack Web Developer",
    company: "Your Company Name", // 👈 placeholder
    type: "Freelance",
    duration: "Jan 2025 - Present", // 👈 placeholder
    responsibilities: [
      "Designed and built responsive web applications for clients using React, Next.js and Node.js.",
      "Created secure REST APIs with Express and MongoDB, including authentication and role-based access.",
      "Integrated third-party services such as Stripe payments and email notifications.",
      "Deployed projects to Vercel and Netlify and fixed performance and SEO issues.",
    ],
    tech: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    placeholder: true,
  },
  {
    role: "Junior Frontend Developer",
    company: "Your Company Name", // 👈 placeholder
    type: "Internship",
    duration: "Jun 2024 - Dec 2024", // 👈 placeholder
    responsibilities: [
      "Turned Figma designs into pixel-perfect, mobile-first interfaces.",
      "Built reusable React components and improved page load speed with lazy loading.",
      "Worked with the team using Git, GitHub pull requests and code reviews.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "React", "Figma", "Git"],
    placeholder: true,
  },
];