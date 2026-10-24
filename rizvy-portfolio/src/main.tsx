import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// The admin dashboard (and Recharts) only downloads when someone opens /admin
const AdminApp = lazy(() => import("./admin/AdminApp"));
const isAdmin = window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense
        fallback={<div className="grid min-h-screen place-items-center text-muted">Loading...</div>}
      >
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>
);