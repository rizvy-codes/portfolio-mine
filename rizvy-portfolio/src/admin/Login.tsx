import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { profile } from "../data/profile";
import { login } from "./api";

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div aria-hidden className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-brand-violet/30 blur-3xl" />
      <div aria-hidden className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-brand-cyan/25 blur-3xl" />

      <motion.form
        onSubmit={submit}
        noValidate
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass relative w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-black/30"
      >
        <div className="mx-auto mb-6 w-fit rounded-2xl border border-white/10 bg-black/60 px-4 py-3">
          <img src={profile.logo} alt="Logo" className="h-10 w-auto" />
        </div>

        <h1 className="text-center font-display text-3xl font-bold">
          Admin <span className="text-gradient">Login</span>
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Private analytics dashboard. Enter your password to continue.
        </p>

        <div className="relative mt-8">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
            autoFocus
            className="w-full rounded-2xl border border-line bg-card py-4 pl-12 pr-12 outline-none transition focus:border-brand-cyan focus:shadow-[0_0_0_4px_rgba(34,211,238,0.15)]"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-fg"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-400"
          >
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-8 py-4 font-semibold text-white shadow-lg shadow-brand-violet/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Checking...
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <a href="/" className="mt-6 block text-center text-sm text-muted transition hover:text-brand-cyan">
          Back to portfolio
        </a>
      </motion.form>
    </div>
  );
}