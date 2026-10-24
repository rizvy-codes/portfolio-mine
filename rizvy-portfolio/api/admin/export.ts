import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../_lib/auth.js";
import { getDb } from "../_lib/db.js";
import { buildFilter } from "../_lib/filters.js";

const MAX_ROWS = 5000;

// Wraps a value for CSV, and neutralises "=cmd" style formulas that spreadsheets would run
const cell = (value: unknown): string => {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

interface Doc {
  createdAt?: Date;
  visitId?: string;
  isReturning?: boolean;
  device?: { type?: string; brand?: string; model?: string };
  os?: { name?: string; version?: string };
  browser?: { name?: string; version?: string };
  screen?: { width?: number; height?: number };
  viewport?: { width?: number; height?: number };
  geo?: { country?: string; region?: string; city?: string };
  language?: string;
  timezone?: string;
  source?: string;
  referrerHost?: string;
  sections?: string[];
  events?: { type: string; label: string }[];
  startedAt?: Date;
  lastSeenAt?: Date;
}

const HEADERS = [
  "Time (UTC)",
  "Visit ID",
  "Visitor type",
  "Device type",
  "Device brand",
  "Device model",
  "OS",
  "OS version",
  "Browser",
  "Browser version",
  "Screen",
  "Viewport",
  "Country",
  "Region",
  "City",
  "Language",
  "Timezone",
  "Source",
  "Referrer host",
  "Sections viewed",
  "Actions",
  "Time spent (sec)",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false });
  if (!(await requireAdmin(req, res))) return;

  try {
    const db = await getDb();
    const docs = (await db
      .collection("visits")
      .find(buildFilter(req.query), { projection: { _id: 0, ipHash: 0 } })
      .sort({ createdAt: -1 })
      .limit(MAX_ROWS)
      .toArray()) as Doc[];

    const rows = docs.map((d) => {
      const seconds =
        d.startedAt && d.lastSeenAt
          ? Math.max(0, Math.round((d.lastSeenAt.getTime() - d.startedAt.getTime()) / 1000))
          : 0;
      return [
        d.createdAt?.toISOString(),
        d.visitId,
        d.isReturning ? "Returning" : "New",
        d.device?.type,
        d.device?.brand,
        d.device?.model,
        d.os?.name,
        d.os?.version,
        d.browser?.name,
        d.browser?.version,
        d.screen ? `${d.screen.width}x${d.screen.height}` : "",
        d.viewport ? `${d.viewport.width}x${d.viewport.height}` : "",
        d.geo?.country,
        d.geo?.region,
        d.geo?.city,
        d.language,
        d.timezone,
        d.source,
        d.referrerHost,
        (d.sections ?? []).join(" | "),
        (d.events ?? []).map((e) => (e.label ? `${e.type}:${e.label}` : e.type)).join(" | "),
        seconds,
      ]
        .map(cell)
        .join(",");
    });

    const csv = "\uFEFF" + [HEADERS.map(cell).join(","), ...rows].join("\r\n");
    const date = new Date().toISOString().slice(0, 10);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="visitors-${date}.csv"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error("export error:", error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}