import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { contactCards, contactEmail } from "../data/contact";
import ContactForm from "./ContactForm";
import SectionHeading from "./ui/SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 md:pr-24">
      <div
        aria-hidden
        className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="Contact me" title="Let's Work" highlight="Together" />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: contact cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display text-2xl font-bold sm:text-3xl">
              Have a project in <span className="text-gradient">mind?</span>
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              I&apos;m open to freelance work, full-time roles and collaborations. Send me a
              message on your favourite app or use the form.
            </p>

            <ul className="mt-8 space-y-4">
              {contactCards.map(({ id, name, value, href, Icon, color }) => (
                <li key={id}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    data-track={`contact-${id}`}
                    whileHover={{ x: 8 }}
                    style={{ "--glow": color } as CSSProperties}
                    className="gradient-border glass group relative flex items-center gap-5 rounded-2xl p-5 transition-shadow duration-300 hover:shadow-[0_0_30px_-5px_var(--glow)]"
                  >
                    <span
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                      style={{ background: color }}
                    >
                      <Icon size={26} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold">{name}</p>
                      <p className="truncate text-sm text-muted">{value}</p>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-muted transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg"
                    />
                  </motion.a>
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${contactEmail}`}
              data-track="contact-email"
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-brand-cyan"
            >
              <Mail size={16} />
              Or email me at {contactEmail}
            </a>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}