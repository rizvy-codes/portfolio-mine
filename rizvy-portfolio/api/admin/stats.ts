import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../_lib/auth.js";
import { getDb } from "../_lib/db.js";
import { q } from "../_lib/filters.js";
import {
  dayLabel,
  offsetToString,
  parseOffset,
  rangeStart,
  startOfToday,
} from "../_lib/time.js";

interface Row {
  _id: string | null;
  value: number;
}

interface Facet {
  daily: { day: string; visits: number; visitors: number }[];
  devices: Row[];
  os: Row[];
  browsers: Row[];
  countries: Row[];
  sources: Row[];
  actions: Row[];
  avg: { avgMs: number | null }[];
}

// Groups visits by a field and counts them (biggest first)
const top = (field: string, limit = 8) => [
  { $group: { _id: `$${field}`, value: { $sum: 1 } } },
  { $sort: { value: -1 } },
  { $limit: limit },
];

const named = (rows: Row[] | undefined, fallback = "Unknown") =>
  (rows ?? []).map((row) => ({ name: row._id || fallback, value: row.value }));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false });
  if (!(await requireAdmin(req, res))) return;

  try {
    const rangeParam = parseInt(q(req.query, "range"), 10);
    const range = [7, 30, 90].includes(rangeParam) ? rangeParam : 30;
    const offset = parseOffset(q(req.query, "tz"));
    const timezone = offsetToString(offset);
    const today = startOfToday(offset);
    const since = rangeStart(range, offset);

    const db = await getDb();
    const visits = db.collection("visits");

    const [facetResult, totalVisits, todayVisits, unique, returning] = await Promise.all([
      visits
        .aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $facet: {
              daily: [
                {
                  $group: {
                    _id: {
                      $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone },
                    },
                    visits: { $sum: 1 },
                    visitors: { $addToSet: "$visitorId" },
                  },
                },
                { $project: { _id: 0, day: "$_id", visits: 1, visitors: { $size: "$visitors" } } },
                { $sort: { day: 1 } },
              ],
              devices: top("device.type"),
              os: top("os.name"),
              browsers: top("browser.name"),
              countries: top("geo.country", 10),
              sources: top("source"),
              actions: [
                { $unwind: "$events" },
                { $group: { _id: "$events.type", value: { $sum: 1 } } },
                { $sort: { value: -1 } },
              ],
              avg: [
                {
                  $group: {
                    _id: null,
                    avgMs: { $avg: { $subtract: ["$lastSeenAt", "$startedAt"] } },
                  },
                },
              ],
            },
          },
        ])
        .toArray(),
      visits.countDocuments(),
      visits.countDocuments({ createdAt: { $gte: today } }),
      visits
        .aggregate([
          { $match: { visitorId: { $ne: "" } } },
          { $group: { _id: "$visitorId" } },
          { $count: "n" },
        ])
        .toArray(),
      visits
        .aggregate([
          { $match: { isReturning: true, visitorId: { $ne: "" } } },
          { $group: { _id: "$visitorId" } },
          { $count: "n" },
        ])
        .toArray(),
    ]);

    const facet = (facetResult[0] ?? {}) as Partial<Facet>;

    // Fill days that had no visits with zeros so the line chart has no gaps
    const byDay = new Map((facet.daily ?? []).map((d) => [d.day, d]));
    const daily = Array.from({ length: range }, (_, i) => {
      const day = dayLabel(new Date(since.getTime() + i * 86400000), offset);
      const hit = byDay.get(day);
      return { day, visits: hit?.visits ?? 0, visitors: hit?.visitors ?? 0 };
    });

    return res.status(200).json({
      range,
      totals: {
        totalVisits,
        todayVisits,
        uniqueVisitors: Number(unique[0]?.n ?? 0),
        returningVisitors: Number(returning[0]?.n ?? 0),
        avgDurationSec: Math.round((facet.avg?.[0]?.avgMs ?? 0) / 1000),
      },
      daily,
      devices: named(facet.devices),
      os: named(facet.os),
      browsers: named(facet.browsers),
      countries: named(facet.countries, ""),
      sources: named(facet.sources),
      actions: named(facet.actions),
    });
  } catch (error) {
    console.error("stats error:", error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}