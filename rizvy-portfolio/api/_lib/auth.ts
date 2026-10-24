import crypto from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SignJWT, jwtVerify } from "jose";
import { header } from "./utils.js";

const COOKIE = "admin_token";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is missing or shorter than 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secretKey());
}

/** Compares passwords in constant time (safe against timing attacks). */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

const secureFlag = () => (process.env.NODE_ENV === "production" ? "; Secure" : "");

export function setAuthCookie(res: VercelResponse, token: string) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${MAX_AGE_SECONDS}${secureFlag()}`
  );
}

export function clearAuthCookie(res: VercelResponse) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secureFlag()}`
  );
}

function readToken(req: VercelRequest): string {
  const cookies = header(req.headers, "cookie").split(";");
  for (const part of cookies) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE) return rest.join("=");
  }
  return "";
}

/** Call at the top of every admin endpoint. Returns false (and replies 401) if not logged in. */
export async function requireAdmin(
  req: VercelRequest,
  res: VercelResponse
): Promise<boolean> {
  res.setHeader("Cache-Control", "no-store");

  let key: Uint8Array;
  try {
    key = secretKey();
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Server is not configured (JWT_SECRET)." });
    return false;
  }

  try {
    const token = readToken(req);
    if (!token) throw new Error("no token");
    await jwtVerify(token, key, { algorithms: ["HS256"] });
    return true;
  } catch {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return false;
  }
}