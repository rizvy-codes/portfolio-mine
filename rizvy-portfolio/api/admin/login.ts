import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createToken, passwordMatches, setAuthCookie } from "../_lib/auth.js";
import { getDb } from "../_lib/db.js";
import { addHit, getHits } from "../_lib/rateLimit.js";
import { getIp, hashIp, obj, str } from "../_lib/utils.js";

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  try {
    if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ ok: false, error: "Server is not configured (ADMIN_PASSWORD / JWT_SECRET)." });
    }

    const db = await getDb();
    const ipHash = hashIp(getIp(req.headers, req.socket?.remoteAddress));
    const key = `login:${ipHash}:${Math.floor(Date.now() / WINDOW_MS)}`;

    if ((await getHits(db, key)) >= MAX_FAILED_ATTEMPTS) {
      return res
        .status(429)
        .json({ ok: false, error: "Too many attempts. Please try again in 15 minutes." });
    }

    let raw: unknown = req.body;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        raw = null;
      }
    }
    const password = str(obj(raw).password, 200);

    if (!passwordMatches(password)) {
      await addHit(db, key, WINDOW_MS);
      await sleep(600); // slows down guessing
      return res.status(401).json({ ok: false, error: "Incorrect password." });
    }

    setAuthCookie(res, await createToken());
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ ok: false, error: "Server error. Check the terminal." });
  }
}