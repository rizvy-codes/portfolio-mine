import crypto from "node:crypto";
import type { IncomingHttpHeaders } from "node:http";

/** Safe string: trimmed and length-limited. Anything that is not a string becomes "". */
export const str = (value: unknown, max = 100): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

/** Safe number: rounded and kept between min and max. */
export const num = (value: unknown, min = 0, max = 100000): number => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(Math.max(Math.round(n), min), max) : 0;
};

/** Treats any value as a plain object (or an empty one). */
export const obj = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

/** Returns the value only if it is in the allowed list. */
export function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

export const header = (headers: IncomingHttpHeaders, name: string): string => {
  const value = headers[name];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

export function getIp(headers: IncomingHttpHeaders, fallback = ""): string {
  const forwarded = header(headers, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return header(headers, "x-real-ip") || fallback;
}

/** The raw IP is never stored: it is hashed with a secret and cut short. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "dev-only-salt";
  return crypto.createHmac("sha256", salt).update(ip).digest("hex").slice(0, 16);
}

const decode = (value: string): string => {
  try {
    return decodeURIComponent(value).slice(0, 80);
  } catch {
    return value.slice(0, 80);
  }
};

/** Country / region / city come from the hosting platform's headers (Vercel or Cloudflare). */
export function getGeo(headers: IncomingHttpHeaders) {
  return {
    country: decode(header(headers, "x-vercel-ip-country") || header(headers, "cf-ipcountry")),
    region: decode(header(headers, "x-vercel-ip-country-region")),
    city: decode(header(headers, "x-vercel-ip-city")),
  };
}

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/duckduckgo\.com$/, "DuckDuckGo"],
  [/linkedin\.com$|lnkd\.in$/, "LinkedIn"],
  [/facebook\.com$|fb\.com$|fb\.me$/, "Facebook"],
  [/(^|\.)twitter\.com$|(^|\.)x\.com$|^t\.co$/, "Twitter / X"],
  [/github\.com$/, "GitHub"],
  [/youtube\.com$|youtu\.be$/, "YouTube"],
  [/(^|\.)t\.me$|telegram\./, "Telegram"],
  [/whatsapp\./, "WhatsApp"],
  [/instagram\.com$/, "Instagram"],
  [/reddit\.com$/, "Reddit"],
];

/** Turns a referrer URL into a friendly source name. Only the host is kept, never the full URL. */
export function classifyReferrer(referrer: string, ownHost: string) {
  if (!referrer) return { source: "Direct", host: "" };

  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return { source: "Direct", host: "" };
  }

  const own = ownHost.split(":")[0].replace(/^www\./, "");
  if (!host || host === own) return { source: "Direct", host: "" };

  const match = SOURCES.find(([pattern]) => pattern.test(host));
  return { source: match ? match[1] : host, host };
}