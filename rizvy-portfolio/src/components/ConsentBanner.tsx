import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { setConsent, shouldShowBanner } from "../lib/tracker";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(shouldShowBanner);

  const choose = (value: "accepted" | "declined") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Privacy notice"
          initial={{ y: 80, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 2.4, type: "spring", stiffness: 200, damping: 22 },
          }}
          exit={{ y: 80, opacity: 0, transition: { duration: 0.3 } }}
          className="glass fixed inset-x-3 bottom-24 z-[65] rounded-2xl p-5 shadow-2xl shadow-black/30 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-sm"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-violet text-white">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="font-display font-bold">Privacy-friendly analytics</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                I collect basic visit info (device, browser, country, pages viewed) to
                improve this site. Your IP address is never stored in readable form, and
                there are no ads or third-party trackers.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => choose("accepted")}
              className="flex-1 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
            >
              Accept
            </button>
            <button
              onClick={() => choose("declined")}
              className="glass flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition hover:border-brand-pink"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}