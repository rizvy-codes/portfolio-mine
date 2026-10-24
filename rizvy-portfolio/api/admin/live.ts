import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../_lib/auth.js";
import { getDb } from "../_lib/db.js";

const LIVE_WINDOW_MS = 40_000; // the tracker pings every 15 seconds

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false });
  if (!(await requireAdmin(req, res))) return;

  try {
    const db = await getDb();
    const visits = db.collection("visits");
    const since = new Date(Date.now() - LIVE_WINDOW_MS);

    const [count, docs] = await Promise.all([
      visits.countDocuments({ lastSeenAt: { $gte: since } }),
      visits
        .find(
          { lastSeenAt: { $gte: since } },
          {
            projection: {
              _id: 0,
              visitId: 1,
              device: 1,
              os: 1,
              browser: 1,
              geo: 1,
              source: 1,
              sections: 1,
              lastSeenAt: 1,
              startedAt: 1,
            },
          }
        )
        .sort({ lastSeenAt: -1 })
        .limit(10)
        .toArray(),
    ]);

    return res.status(200).json({ count, visitors: docs });
  } catch (error) {
    console.error("live error:", error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}