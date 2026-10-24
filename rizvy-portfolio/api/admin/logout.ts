import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearAuthCookie } from "../_lib/auth.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  clearAuthCookie(res);
  return res.status(200).json({ ok: true });
}