import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib/db.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return res.status(200).json({ ok: true, database: "connected" });
  } catch (error) {
    console.error("health error:", error);
    return res.status(500).json({
      ok: false,
      database: "error",
      hint: "Check MONGODB_URI in .env.local and Network Access in Atlas.",
    });
  }
}