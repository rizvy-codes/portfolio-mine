import { motion } from "framer-motion";
import { profile } from "../data/profile";

export default function Loader() {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-[#07070d]"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.img
          src={profile.logo}
          alt="Logo"
          className="w-56"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}