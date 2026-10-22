import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import About from "./components/About";
import ScrollProgress from "./components/ScrollProgress";

function Placeholder({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="grid min-h-screen place-items-center px-6">
      <h2 className="font-display text-3xl text-muted md:text-4xl">
        {title}: coming in the next step
      </h2>
    </section>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>

      <div className="grain" aria-hidden />
      <ScrollProgress />
      <Navbar />
      <About />

      <main>
        <Hero />
        <Placeholder id="about" title="About Me" />
        <Placeholder id="skills" title="Skills" />
        <Placeholder id="projects" title="Projects" />
        <Placeholder id="experience" title="Experience" />
        <Placeholder id="blogs" title="Blogs" />
        <Placeholder id="contact" title="Contact Me" />
      </main>
    </>
  );
}