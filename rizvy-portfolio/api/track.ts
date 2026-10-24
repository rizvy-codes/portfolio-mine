import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isbot } from "isbot";
import { getDb } from "./_lib/db.js";
import {
  classifyReferrer,
  getGeo,
  getIp,
  hashIp,
  header,
  num,
  obj,
  oneOf,
  str,
} from "./_lib/utils.js";

const SECTIONS = new Set([
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "blogs",
  "contact",
]);

const EVENTS = new Set([
  "resume_download",
  "contact_click",
  "live_demo",
  "github_click",
  "project_open",
  "blog_open",
  "contact_submit",
]);

const DEVICE_TYPES = ["mobile", "tablet", "desktop", "smarttv", "other"] as const;
const RATE_LIMIT_PER_MINUTE = 90; // requests per IP per minute

interface RateDoc {
  _id: string;
  count: number;
  expireAt: Date;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  // 1) Ignore bots and crawlers silently
  const userAgent = header(req.headers, "user-agent").slice(0, 400);
  if (!userAgent || isbot(userAgent)) return res.status(204).end();

  // 2) Read and validate the body
  let raw: unknown = req.body;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = null;
    }
  }
  const body = obj(raw);
  const type = str(body.type, 20);
  const visitId = str(body.visitId, 64);
  if (!/^[A-Za-z0-9-]{8,64}$/.test(visitId)) {
    return res.status(400).json({ ok: false });
  }

  try {
    const db = await getDb();
    const ipHash = hashIp(getIp(req.headers, req.socket?.remoteAddress));

    // 3) Rate limit (stored in MongoDB so it also works on serverless)
    const bucket = Math.floor(Date.now() / 60000);
    const limit = await db.collection<RateDoc>("ratelimits").findOneAndUpdate(
      { _id: `${ipHash}:${bucket}` },
      {
        $inc: { count: 1 },
        $setOnInsert: { expireAt: new Date(Date.now() + 120000) },
      },
      { upsert: true, returnDocument: "after" }
    );
    if ((limit?.count ?? 0) > RATE_LIMIT_PER_MINUTE) {
      return res.status(429).json({ ok: false });
    }

    const visits = db.collection("visits");
    const now = new Date();

    // 4) Handle each event type
    if (type === "start") {
      const device = obj(body.device);
      const os = obj(body.os);
      const browser = obj(body.browser);
      const screen = obj(body.screen);
      const viewport = obj(body.viewport);
      const { source, host } = classifyReferrer(
        str(body.referrer, 300),
        header(req.headers, "host")
      );

      await visits.updateOne(
        { visitId },
        {
          $setOnInsert: {
            visitorId: str(body.visitorId, 64),
            isReturning: body.isReturning === true,
            startedAt: now,
            lastSeenAt: now,
            createdAt: now,
            device: {
              type: oneOf(device.type, DEVICE_TYPES, "other"),
              brand: str(device.brand, 40),
              model: str(device.model, 60),
            },
            os: { name: str(os.name, 40), version: str(os.version, 30) },
            browser: { name: str(browser.name, 40), version: str(browser.version, 30) },
            screen: { width: num(screen.width), height: num(screen.height) },
            viewport: { width: num(viewport.width), height: num(viewport.height) },
            geo: getGeo(req.headers),
            language: str(body.language, 20),
            timezone: str(body.timezone, 60),
            source,
            referrerHost: host,
            ipHash,
            sections: [],
            events: [],
          },
        },
        { upsert: true }
      );
    } else if (type === "ping") {
      await visits.updateOne({ visitId }, { $set: { lastSeenAt: now } });
    } else if (type === "section") {
      const section = str(body.section, 20);
      if (SECTIONS.has(section)) {
        await visits.updateOne(
          { visitId },
          { $set: { lastSeenAt: now }, $addToSet: { sections: section } }
        );
      }
    } else if (type === "event") {
      const event = str(body.event, 30);
      if (EVENTS.has(event)) {
        await visits.updateOne(
          { visitId },
          {
            $set: { lastSeenAt: now },
            $push: {
              events: { $each: [{ type: event, label: str(body.label, 60), at: now }], $slice: -100 },
            },
          }
        );
      }
    } else {
      return res.status(400).json({ ok: false });
    }

    return res.status(204).end();
  } catch (error) {
    console.error("track error:", error);
    return res.status(500).json({ ok: false });
  }
}