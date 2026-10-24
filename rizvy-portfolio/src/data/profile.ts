// ✏️ EDIT THIS FILE to change your name, roles, links, etc.

export const profile = {
  name: "Redowan Ahmed Rizvy", // 👈 change to your name
  roles: [
    "Full Stack Web Developer",
    "React & Next.js Developer",
    "Node.js Backend Developer",
    "Aspiring Software Developer",
  ],
  description:
    "I turn ideas into fast, accessible and delightful web apps, from pixel-perfect React interfaces to scalable Node.js APIs.",
  photo: "/images/profile/profile.webp",
  photo2: "/images/profile/redowan.png",
  logo: "/images/logo/rizvy-logo.png",
  resume: "/resume.pdf", // 👈 put your PDF in the /public folder as resume.pdf
  socials: {
    linkedin: "https://www.linkedin.com/in/redowan-ahmed-rizvy-292534305/?isSelfProfile=true", // 👈 placeholder
    twitter: "https://x.com/RidowanR83136", // 👈 placeholder
    facebook: "https://www.facebook.com/profile.php?id=61558451184712", // 👈 placeholder
    github: "https://github.com/rizvy-codes", // 👈 placeholder
  },
};

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "blogs", label: "Blogs" },
  { id: "contact", label: "Contact Me" },
];

export const sectionIds = navItems.map((item) => item.id);