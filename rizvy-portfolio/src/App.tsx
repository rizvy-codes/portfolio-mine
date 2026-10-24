import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import About from "./components/About";
import Blogs from "./components/Blogs";
import Contact from "./components/Contact";
import ConsentBanner from "./components/ConsentBanner";
import CustomCursor from "./components/CustomCursor";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import ScrollProgress from "./components/ScrollProgress";
import Skills from "./components/Skills";
import { initTracking } from "./lib/tracker";

export default function App() {
  const [loading, setLoading] = useState(true);

  // Intro loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  // Visitor tracking (only starts if the visitor has accepted)
  useEffect(() => {
    initTracking();
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>

      <div className="grain" aria-hidden />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <ConsentBanner />

      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Blogs />
        <Contact />
      </main>

      <Footer />
    </>
  );
}