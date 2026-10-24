import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { checkSession } from "./api";
import Dashboard from "./Dashboard";
import Login from "./Login";

type Auth = "checking" | "out" | "in";

export default function AdminApp() {
  const [auth, setAuth] = useState<Auth>("checking");

  // Keep this page out of search engines
  useEffect(() => {
    document.title = "Admin | Analytics";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    checkSession()
      .then(() => setAuth("in"))
      .catch(() => setAuth("out"));
  }, []);

  const goOut = useCallback(() => setAuth("out"), []);

  if (auth === "checking") {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="animate-spin text-brand-cyan" size={32} />
      </div>
    );
  }

  return auth === "in" ? (
    <Dashboard onLogout={goOut} />
  ) : (
    <Login onSuccess={() => setAuth("in")} />
  );
}