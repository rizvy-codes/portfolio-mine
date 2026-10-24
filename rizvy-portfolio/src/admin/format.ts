export const COLORS = [
  "#22d3ee",
  "#8b5cf6",
  "#f472b6",
  "#34d399",
  "#fbbf24",
  "#fb923c",
  "#60a5fa",
  "#a78bfa",
];

export const capitalize = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 1) return "<1s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m ? `${m}m ${s}s` : `${s}s`;
};

export const durationSec = (v: { startedAt: string; lastSeenAt: string }): number =>
  Math.max(
    0,
    Math.round((new Date(v.lastSeenAt).getTime() - new Date(v.startedAt).getTime()) / 1000)
  );

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const shortDay = (day: string): string =>
  new Date(`${day}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });

let regionNames: Intl.DisplayNames | null = null;
export function countryName(code: string): string {
  if (!code) return "Unknown";
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export const eventLabel: Record<string, string> = {
  resume_download: "Resume download",
  contact_click: "Contact click",
  live_demo: "Live demo",
  github_click: "GitHub click",
  project_open: "Project opened",
  blog_open: "Blog opened",
  contact_submit: "Form submit",
};

export const sectionLabel = (id: string) => capitalize(id);