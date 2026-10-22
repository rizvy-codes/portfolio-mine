// ✏️ EDIT THIS FILE to change your bio, stats and education.

export const about = {
  bio: [
    "I'm a Full Stack Web Developer who loves turning ideas into clean, fast and user-friendly web applications. I work across the whole stack, from designing responsive interfaces with React and Tailwind CSS to building secure REST APIs with Node.js, Express and MongoDB.",
    "I care about details: smooth animations, accessible layouts, readable code and great performance. I'm always learning new tools and enjoy solving real problems with software.",
  ],
  // Counters: "to" is the final number, "suffix" is shown after it
  stats: [
    { label: "Projects", to: 10, suffix: "+" },
    { label: "Year Experience", to: 1, suffix: "+" },
    { label: "Happy Clients", to: 5, suffix: "+" },
  ],
};

export interface EducationItem {
  degree: string;
  school: string;
  group: string;
  year: string;
  description: string;
  placeholder?: boolean; // shows a "placeholder" tag, set to false or delete once edited
}

export const education: EducationItem[] = [
  {
    degree: "Secondary School Certificate (SSC)",
    school: "Govt. Muslim High School",
    group: "Science Group",
    year: "2023",
    description:
      "Studied dedicatedly in the science group and achieved a good result, building a strong foundation in logic, mathematics and problem solving.",
  },
  {
    degree: "Diploma",
    school: "Chattogram Gvnt Polytechnic Institute", // 👈 placeholder
    group: "Computer Science and Technology", // 👈 placeholder
    year: "2024 - Present", // 👈 placeholder
    description:
      "Add a short sentence about your college studies, achievements or the skills you are building here.", // 👈 placeholder
  },
];