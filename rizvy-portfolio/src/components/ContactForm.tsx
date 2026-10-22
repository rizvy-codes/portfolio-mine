import { useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { AlertCircle, Loader2, Send } from "lucide-react";

type FieldName = "name" | "email" | "subject" | "message";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "sending" | "success" | "error";

const initialValues: Values = { name: "", email: "", subject: "", message: "" };

const validate = (v: Values): Errors => {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (v.subject.trim().length < 3) errors.subject = "Subject must be at least 3 characters.";
  if (v.message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
  return errors;
};

/* ---------- One input with a floating label ---------- */
function Field({
  id,
  label,
  value,
  error,
  type = "text",
  multiline = false,
  onChange,
  onBlur,
}: {
  id: FieldName;
  label: string;
  value: string;
  error?: string;
  type?: string;
  multiline?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
}) {
  const inputClass =
    "peer w-full bg-card px-4 pb-2 pt-6 text-fg outline-none placeholder-transparent";

  return (
    <div>
      <div
        className={`relative overflow-hidden rounded-2xl border transition-shadow focus-within:shadow-[0_0_0_4px_rgba(34,211,238,0.15)] ${
          error ? "border-red-400" : "border-line focus-within:border-brand-cyan"
        }`}
      >
        {multiline ? (
          <textarea
            id={id}
            name={id}
            rows={5}
            placeholder=" "
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`${inputClass} resize-none pt-7`}
          />
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            placeholder=" "
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={inputClass}
          />
        )}

        {/* Floating label (must come AFTER the input) */}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-4 origin-left text-muted transition-all duration-200 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-brand-cyan peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-75"
        >
          {label}
        </label>

        {/* Animated gradient line on focus */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink transition-all duration-500 peer-focus:w-full"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle size={13} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Success screen: drawn checkmark + confetti ---------- */
function SuccessPanel({ onReset }: { onReset: () => void }) {
  const colors = ["#22d3ee", "#8b5cf6", "#f472b6"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex min-h-[420px] flex-col items-center justify-center text-center"
    >
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 52 52" className="h-24 w-24" aria-hidden>
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M14 27 l8 8 l16 -17"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </svg>

        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
              style={{ background: colors[i % 3] }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(angle) * 90,
                y: Math.sin(angle) * 90,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            />
          );
        })}
      </div>

      <h3 className="mt-6 font-display text-2xl font-bold">
        Message <span className="text-gradient">sent!</span>
      </h3>
      <p className="mt-2 max-w-xs text-muted">
        Thank you for reaching out. I&apos;ll get back to you as soon as possible.
      </p>
      <button
        onClick={onReset}
        className="glass mt-6 rounded-full px-6 py-2.5 text-sm font-medium transition hover:border-brand-cyan"
      >
        Send another message
      </button>
    </motion.div>
  );
}

/* ---------- The form ---------- */
export default function ContactForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState(""); // hidden field that only bots fill in

  const errors = validate(values);
  const showError = (f: FieldName) => (touched[f] || submitted ? errors[f] : undefined);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    if (honeypot) {
      setStatus("success"); // looks successful to bots, but nothing is sent
      return;
    }

    setStatus("sending");

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: values.name,
            from_email: values.email,
            reply_to: values.email,
            subject: values.subject,
            message: values.message,
          },
          { publicKey }
        );
      } else {
        // Demo mode: no keys yet, so we just pretend to send
        console.info("EmailJS keys are missing, running in DEMO mode (no email sent).");
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      setStatus("success");
      setValues(initialValues);
      setTouched({});
      setSubmitted(false);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <SuccessPanel key="success" onReset={() => setStatus("idle")} />
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Contact form"
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="name"
                label="Your Name"
                value={values.name}
                error={showError("name")}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
              <Field
                id="email"
                label="Your Email"
                type="email"
                value={values.email}
                error={showError("email")}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
            </div>

            <Field
              id="subject"
              label="Subject"
              value={values.subject}
              error={showError("subject")}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
            />

            <Field
              id="message"
              label="Your Message"
              multiline
              value={values.message}
              error={showError("message")}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            />

            {/* Honeypot: hidden from people, bots fill it in */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-400"
                >
                  <AlertCircle size={16} />
                  Something went wrong. Please try again or contact me on WhatsApp or Telegram.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === "sending"}
              data-track="contact-submit"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-8 py-4 font-semibold text-white shadow-lg shadow-brand-violet/30 transition hover:shadow-brand-violet/50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send
                    size={18}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}