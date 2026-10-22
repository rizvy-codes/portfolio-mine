// ✏️ EDIT THIS FILE to change your projects.
//
// 📸 To use real screenshots:
//   1. Put images in  public/images/projects/   (e.g. shopverse-1.png)
//   2. Replace  placeholder(...)  with  "/images/projects/shopverse-1.png"

// Makes a colored placeholder image (no image file needed)
const placeholder = (label: string, from: string, to: string) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750' viewBox='0 0 1200 750'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='1200' height='750' fill='url(#g)'/><text x='600' y='390' font-family='Arial, sans-serif' font-size='56' font-weight='700' fill='white' fill-opacity='0.9' text-anchor='middle'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const shots = (title: string, from: string, to: string) => [
  placeholder(`${title} - Home`, from, to),
  placeholder(`${title} - Dashboard`, to, from),
  placeholder(`${title} - Mobile`, from, "#0f172a"),
];

export interface TechStep {
  name: string;
  detail: string;
}

export interface Project {
  id: string;
  title: string;
  category: "Full Stack" | "Frontend" | "Backend";
  thumbnail: string;
  images: string[];
  shortDescription: string;
  description: string[];
  why: string;
  useCases: string[];
  tech: string[]; // tags shown on the card
  techSteps: TechStep[]; // step-by-step timeline in the modal
  liveUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: "shopverse",
    title: "ShopVerse",
    category: "Full Stack",
    thumbnail: placeholder("ShopVerse", "#22d3ee", "#8b5cf6"),
    images: shots("ShopVerse", "#22d3ee", "#8b5cf6"),
    shortDescription:
      "A modern e-commerce platform with product search, cart, secure checkout and an admin panel.",
    description: [
      "ShopVerse is a complete online store where customers can browse products, filter by category, add items to a cart and pay securely with Stripe.",
      "Admins get a protected dashboard to manage products, orders and customers, with role-based access control and real-time order status updates.",
    ],
    why: "Small businesses often rely on expensive or rigid platforms. I built ShopVerse to show how a fast, fully customizable store can be created from scratch with the MERN stack.",
    useCases: [
      "Small and medium online shops",
      "Fashion, electronics or grocery stores",
      "Portfolio proof of full-stack skills",
      "Base template for custom marketplaces",
    ],
    tech: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Stripe"],
    techSteps: [
      { name: "React + TypeScript", detail: "Built a type-safe, component-based storefront with reusable UI parts." },
      { name: "Tailwind CSS", detail: "Designed a responsive, mobile-first layout with a consistent design system." },
      { name: "Node.js + Express", detail: "Created REST APIs for products, users, carts and orders." },
      { name: "MongoDB + Mongoose", detail: "Modelled products, orders and users with validation and indexes." },
      { name: "Stripe", detail: "Integrated secure card payments and webhook-based order confirmation." },
    ],
    liveUrl: "https://example.com", // 👈 placeholder
    githubUrl: "https://github.com/your-username/shopverse", // 👈 placeholder
  },
  {
    id: "taskflow",
    title: "TaskFlow",
    category: "Full Stack",
    thumbnail: placeholder("TaskFlow", "#f472b6", "#8b5cf6"),
    images: shots("TaskFlow", "#f472b6", "#8b5cf6"),
    shortDescription:
      "A drag-and-drop task board with real-time sync, labels, deadlines and team collaboration.",
    description: [
      "TaskFlow is a Kanban-style productivity app. Users create boards, add tasks, drag them between columns and set deadlines and priorities.",
      "Everything syncs in real time through Firebase, so teammates see changes instantly without refreshing.",
    ],
    why: "I wanted a simple, distraction-free alternative to heavy project tools, and a chance to practice real-time data and drag-and-drop interactions.",
    useCases: [
      "Student and personal planning",
      "Small team sprint boards",
      "Freelancer client tracking",
      "Learning real-time apps",
    ],
    tech: ["React", "Firebase", "Tailwind CSS", "Framer Motion"],
    techSteps: [
      { name: "React", detail: "Built the board, columns and task cards as reusable components." },
      { name: "Framer Motion", detail: "Added smooth drag-and-drop and layout animations." },
      { name: "Firebase Auth", detail: "Added email and Google sign-in for personal boards." },
      { name: "Firestore", detail: "Stored tasks with real-time listeners for instant sync." },
    ],
    liveUrl: "https://example.com", // 👈 placeholder
    githubUrl: "https://github.com/your-username/taskflow", // 👈 placeholder
  },
  {
    id: "weathernow",
    title: "WeatherNow",
    category: "Frontend",
    thumbnail: placeholder("WeatherNow", "#38bdf8", "#6366f1"),
    images: shots("WeatherNow", "#38bdf8", "#6366f1"),
    shortDescription:
      "A clean weather dashboard with 7-day forecast charts, city search and animated backgrounds.",
    description: [
      "WeatherNow shows current conditions and a 7-day forecast for any city. Temperature, rain and wind are displayed in interactive charts.",
      "The background and icons change with the weather, and the last searched cities are saved for quick access.",
    ],
    why: "A great way to practice working with third-party APIs, loading and error states, and turning raw data into clear visuals.",
    useCases: [
      "Daily weather checking",
      "Travel planning",
      "Embeddable widget for websites",
      "Learning API and chart integration",
    ],
    tech: ["React", "TypeScript", "Recharts", "REST API"],
    techSteps: [
      { name: "React + TypeScript", detail: "Typed API responses and built the search and forecast views." },
      { name: "Weather API", detail: "Fetched live data with loading, empty and error handling." },
      { name: "Recharts", detail: "Visualized temperature and rain probability with responsive charts." },
      { name: "localStorage", detail: "Saved recent searches for a faster return experience." },
    ],
    liveUrl: "https://example.com", // 👈 placeholder
    githubUrl: "https://github.com/your-username/weathernow", // 👈 placeholder
  },
  {
    id: "devblog",
    title: "DevBlog CMS",
    category: "Full Stack",
    thumbnail: placeholder("DevBlog CMS", "#34d399", "#0ea5e9"),
    images: shots("DevBlog CMS", "#34d399", "#0ea5e9"),
    shortDescription:
      "A blog platform with a rich-text editor, authentication, comments and SEO-friendly pages.",
    description: [
      "DevBlog lets authors write, edit and publish articles with a rich-text editor. Readers can browse by tag, search and leave comments.",
      "Pages are server-rendered for fast loading and good search-engine ranking.",
    ],
    why: "I wanted to understand how content platforms work end to end: authentication, content storage, server rendering and SEO.",
    useCases: [
      "Personal or company blogs",
      "Documentation and tutorial sites",
      "News and magazine sites",
      "Headless CMS experiments",
    ],
    tech: ["Next.js", "MongoDB", "Tailwind CSS", "NextAuth"],
    techSteps: [
      { name: "Next.js", detail: "Used server-side rendering and dynamic routes for fast, SEO-ready pages." },
      { name: "NextAuth", detail: "Added secure login with protected author routes." },
      { name: "MongoDB", detail: "Stored posts, tags and comments with search support." },
      { name: "Tailwind CSS", detail: "Styled a clean, readable article layout with dark mode." },
    ],
    liveUrl: "https://example.com", // 👈 placeholder
    githubUrl: "https://github.com/your-username/devblog", // 👈 placeholder
  },
  {
    id: "libraryapi",
    title: "LibraryAPI",
    category: "Backend",
    thumbnail: placeholder("LibraryAPI", "#fbbf24", "#ef4444"),
    images: shots("LibraryAPI", "#fbbf24", "#ef4444"),
    shortDescription:
      "A secure REST API for managing books, members and borrowing, with JWT auth and role-based access.",
    description: [
      "LibraryAPI exposes endpoints to manage books, members and loans. It includes pagination, search, validation and clear error messages.",
      "Access is protected with JWT authentication, and only librarians can create or delete records.",
    ],
    why: "Backend fundamentals matter most. This project let me practice clean architecture, validation, security and documenting an API properly.",
    useCases: [
      "School and community libraries",
      "Backend for a web or mobile app",
      "Learning REST API design",
      "Interview and practice project",
    ],
    tech: ["Node.js", "Express", "MongoDB", "JWT", "Postman"],
    techSteps: [
      { name: "Express.js", detail: "Structured routes, controllers and middleware in a modular pattern." },
      { name: "MongoDB + Mongoose", detail: "Defined schemas for books, members and loans with validation." },
      { name: "JWT + RBAC", detail: "Protected routes and restricted actions by user role." },
      { name: "Postman", detail: "Tested every endpoint and exported a shareable collection." },
    ],
    liveUrl: "https://example.com", // 👈 placeholder
    githubUrl: "https://github.com/your-username/libraryapi", // 👈 placeholder
  },
  {
    id: "foodiehub",
    title: "FoodieHub",
    category: "Frontend",
    thumbnail: placeholder("FoodieHub", "#fb923c", "#ec4899"),
    images: shots("FoodieHub", "#fb923c", "#ec4899"),
    shortDescription:
      "A mouth-watering restaurant website with animated menu, reservations and smooth scroll effects.",
    description: [
      "FoodieHub is a visually rich restaurant landing page with an animated menu, a gallery and an online table-reservation form.",
      "Scroll-triggered animations and micro-interactions make the experience feel premium on every device.",
    ],
    why: "A focused UI project to sharpen my design sense, animation skills and attention to responsive details.",
    useCases: [
      "Restaurants and cafes",
      "Event and hospitality businesses",
      "Landing page template for clients",
      "Practicing animation and layout",
    ],
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    techSteps: [
      { name: "React", detail: "Split the page into clean, reusable sections." },
      { name: "Tailwind CSS", detail: "Built a fully responsive layout with a warm color system." },
      { name: "Framer Motion", detail: "Added scroll reveals, hover effects and page transitions." },
    ],
    liveUrl: "https://example.com", // 👈 placeholder
    githubUrl: "https://github.com/your-username/foodiehub", // 👈 placeholder
  },
];