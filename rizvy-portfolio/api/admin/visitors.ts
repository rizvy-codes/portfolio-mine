import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../_lib/auth.js";
import { getDb } from "../_lib/db.js";
import { buildFilter, q } from "../_lib/filters.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false });
  if (!(await requireAdmin(req, res))) return;

  try {
    const page = Math.max(1, parseInt(q(req.query, "page"), 10) || 1);
    const sizeParam = parseInt(q(req.query, "pageSize"), 10);
    const pageSize = [10, 20, 50].includes(sizeParam) ? sizeParam : 20;
    const filter = buildFilter(req.query);

    const db = await getDb();
    const visits = db.collection("visits");

    const [items, total, sources, countries] = await Promise.all([
      visits
        .find(filter, { projection: { _id: 0, ipHash: 0 } }) // never send the IP hash to the browser
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray(),
      visits.countDocuments(filter),
      visits.distinct("source"),
      visits.distinct("geo.country"),
    ]);

    return res.status(200).json({
      items,
      total,
      page,
      pageSize,
      sources: (sources as string[]).filter(Boolean).sort(),
      countries: (countries as string[]).filter(Boolean).sort(),
    });
  } catch (error) {
    console.error("visitors error:", error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}