// ✏️ EDIT THIS FILE to change your blog posts.
//
// 📸 To use real cover images:
//   1. Put images in  public/images/blogs/   (e.g. react-vite.png)
//   2. Replace  placeholder(...)  with  "/images/blogs/react-vite.png"
//
// Article content is a list of "blocks". Available block types:
//   { type: "heading", text: "..." }
//   { type: "paragraph", text: "..." }
//   { type: "list", items: ["...", "..."] }
//   { type: "quote", text: "...", author: "optional" }
//   { type: "code", language: "tsx", code: `...` }

const placeholder = (label: string, from: string, to: string) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='1200' height='630' fill='url(#g)'/><text x='600' y='330' font-family='Arial, sans-serif' font-size='54' font-weight='700' fill='white' fill-opacity='0.92' text-anchor='middle'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; author?: string }
  | { type: "code"; language: string; code: string };

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string; // YYYY-MM-DD
  readTime: string;
  category: string;
  tags: string[];
  content: Block[];
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const blogs: Blog[] = [
  {
    id: "react-vite-quick-start",
    title: "Getting Started with React and Vite in 5 Minutes",
    excerpt:
      "Skip the slow setup. Learn how to create a blazing-fast React and TypeScript project with Vite and build your first component.",
    cover: placeholder("React + Vite", "#22d3ee", "#8b5cf6"),
    date: "2026-09-12",
    readTime: "5 min read",
    category: "React",
    tags: ["React", "Vite", "TypeScript"],
    content: [
      {
        type: "paragraph",
        text: "If you have ever waited a long time for a project to start, Vite will feel like magic. It starts instantly and updates your browser the moment you save a file. In this guide we will create a React and TypeScript app from scratch.",
      },
      { type: "heading", text: "Why Vite?" },
      {
        type: "list",
        items: [
          "Instant dev server start, even on large projects",
          "Lightning-fast hot module replacement",
          "Optimized production builds out of the box",
          "First-class TypeScript support",
        ],
      },
      { type: "heading", text: "Create the project" },
      {
        type: "paragraph",
        text: "Open your terminal and run the following commands. They create the project, install the packages and start the development server.",
      },
      {
        type: "code",
        language: "powershell",
        code: `npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev`,
      },
      { type: "heading", text: "Your first component" },
      {
        type: "paragraph",
        text: "Create a file called Counter.tsx inside the src folder. It uses the useState hook to remember how many times a button was clicked.",
      },
      {
        type: "code",
        language: "tsx",
        code: `import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
      },
      {
        type: "quote",
        text: "Start small, ship often. A tiny working component teaches more than hours of reading.",
      },
      { type: "heading", text: "What to learn next" },
      {
        type: "paragraph",
        text: "Once the basics feel comfortable, explore props, useEffect, routing and state management. Build something real, even a small to-do app, and your skills will grow quickly.",
      },
    ],
  },
  {
    id: "express-mongodb-rest-api",
    title: "Building a REST API with Express and MongoDB",
    excerpt:
      "A beginner-friendly walkthrough of creating a clean REST API: connecting MongoDB, defining a schema and writing your first route.",
    cover: placeholder("Express + MongoDB", "#34d399", "#0ea5e9"),
    date: "2026-08-20",
    readTime: "7 min read",
    category: "Backend",
    tags: ["Node.js", "Express", "MongoDB"],
    content: [
      {
        type: "paragraph",
        text: "Almost every web app needs a backend. A REST API lets your frontend create, read, update and delete data in a database. Let's build a small one for managing books.",
      },
      { type: "heading", text: "What you will need" },
      {
        type: "list",
        items: [
          "Node.js installed on your computer",
          "A free MongoDB Atlas account",
          "The express and mongoose packages",
        ],
      },
      { type: "heading", text: "Install the packages" },
      {
        type: "code",
        language: "powershell",
        code: `npm init -y
npm install express mongoose dotenv`,
      },
      { type: "heading", text: "The server" },
      {
        type: "paragraph",
        text: "This single file connects to MongoDB, defines a Book model and exposes a route that returns every book. Remember to add type module to your package.json to use import syntax.",
      },
      {
        type: "code",
        language: "js",
        code: `import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

await mongoose.connect(process.env.MONGO_URI);

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
});
const Book = mongoose.model("Book", bookSchema);

app.get("/api/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.listen(5000, () => console.log("Server running on port 5000"));`,
      },
      {
        type: "quote",
        text: "Never commit your database password. Keep secrets in a .env file and add it to .gitignore.",
      },
      { type: "heading", text: "Next steps" },
      {
        type: "paragraph",
        text: "Add POST, PUT and DELETE routes, validate incoming data and protect private routes with JWT authentication. Test every endpoint with Postman as you go.",
      },
    ],
  },
  {
    id: "tailwind-clean-layouts",
    title: "5 Tailwind CSS Tips for Cleaner, Faster Layouts",
    excerpt:
      "Stop fighting your CSS. These practical Tailwind habits will make your layouts more responsive, readable and easier to maintain.",
    cover: placeholder("Tailwind CSS Tips", "#38bdf8", "#6366f1"),
    date: "2026-07-15",
    readTime: "4 min read",
    category: "CSS",
    tags: ["Tailwind CSS", "CSS", "Design"],
    content: [
      {
        type: "paragraph",
        text: "Tailwind CSS lets you style directly in your markup, which is fast, but messy habits can creep in. Here are five tips that keep my interfaces clean and consistent.",
      },
      { type: "heading", text: "1. Design mobile first" },
      {
        type: "paragraph",
        text: "Write the mobile layout first, then add larger screens with breakpoint prefixes such as md and lg. This keeps your code short and your layouts reliable.",
      },
      {
        type: "code",
        language: "html",
        code: `<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <!-- cards go here -->
</div>`,
      },
      { type: "heading", text: "2. Extract repeated patterns into components" },
      {
        type: "paragraph",
        text: "If you copy the same long list of classes more than twice, make it a React component instead of repeating it everywhere.",
      },
      {
        type: "code",
        language: "html",
        code: `<div class="rounded-2xl border p-6 shadow-lg transition hover:-translate-y-1">
  <h3 class="text-xl font-bold">Title</h3>
  <p class="mt-2 text-sm text-gray-500">Description</p>
</div>`,
      },
      { type: "heading", text: "3. Use a consistent spacing scale" },
      {
        type: "list",
        items: [
          "Stick to a few values like gap-4, gap-6 and gap-8",
          "Use space-y-* for vertical rhythm inside a container",
          "Avoid random pixel values unless truly needed",
        ],
      },
      { type: "heading", text: "4. Respect accessibility" },
      {
        type: "paragraph",
        text: "Check color contrast, keep focus styles visible and use semantic HTML. Beautiful design should work for everyone.",
      },
      { type: "heading", text: "5. Add motion with purpose" },
      {
        type: "quote",
        text: "Good animation guides attention. If it does not help the user, remove it.",
      },
    ],
  },
  {
    id: "my-full-stack-journey",
    title: "My Journey Learning Full Stack Development",
    excerpt:
      "From my first line of HTML to building complete web apps: the lessons, mistakes and habits that shaped me as a developer.",
    cover: placeholder("My Dev Journey", "#f472b6", "#fb923c"),
    date: "2026-06-02",
    readTime: "6 min read",
    category: "Career",
    tags: ["Career", "Learning", "Full Stack"],
    content: [
      {
        type: "paragraph",
        text: "Every developer remembers the first time a page they built appeared in the browser. Mine was a simple HTML page, and I was hooked. This is the story of how that curiosity turned into full stack development.",
      },
      { type: "heading", text: "Starting with the basics" },
      {
        type: "paragraph",
        text: "I began with HTML, CSS and JavaScript. Progress felt slow at first, but building small projects every week made concepts finally click.",
      },
      {
        type: "quote",
        text: "You do not need to know everything. You need to keep building and keep learning.",
      },
      { type: "heading", text: "What helped me the most" },
      {
        type: "list",
        items: [
          "Building real projects instead of only watching tutorials",
          "Reading error messages carefully before searching for help",
          "Using Git and GitHub from the very beginning",
          "Learning one new thing at a time and practicing it",
        ],
      },
      { type: "heading", text: "Where I am heading" },
      {
        type: "paragraph",
        text: "Today I enjoy building complete products, from interface to database. Next I want to go deeper into testing, system design and working with AI tools to write better code faster.",
      },
    ],
  },
];