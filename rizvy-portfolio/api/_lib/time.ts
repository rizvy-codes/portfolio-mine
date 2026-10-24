export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/** The browser sends getTimezoneOffset() (minutes, UTC minus local time). */
export const parseOffset = (value: unknown): number => {
  const raw = Array.isArray(value) ? value[0] : value ?? "";
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) ? clamp(n, -840, 840) : 0;
};

/** Offset as text for MongoDB, for example -360 becomes "+06:00". */
export const offsetToString = (offset: number): string => {
  const sign = offset <= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${sign}${hh}:${mm}`;
};

/** The moment today started in the visitor's own timezone. */
export const startOfToday = (offset: number, now = new Date()): Date => {
  const localMs = now.getTime() - offset * 60000;
  const localMidnight = Math.floor(localMs / 86400000) * 86400000;
  return new Date(localMidnight + offset * 60000);
};

/** First moment of the first day in a "last N days" range (today counts as a day). */
export const rangeStart = (days: number, offset: number): Date =>
  new Date(startOfToday(offset).getTime() - (days - 1) * 86400000);

/** "2026-10-23" style label for a day start. */
export const dayLabel = (date: Date, offset: number): string =>
  new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);