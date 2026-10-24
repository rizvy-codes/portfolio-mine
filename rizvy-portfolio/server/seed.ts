import { config } from "dotenv";
import { getDb } from "../api/_lib/db.js";

config({ path: ".env.local" });

const db = await getDb();
const visits = db.collection("visits");

if (process.argv[2] === "clear") {
  const result = await visits.deleteMany({ isSeed: true });
  console.log(`Removed ${result.deletedCount} fake visits.`);
  process.exit(0);
}

const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
const between = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const devices = [
  { type: "mobile", brand: "Samsung", model: "SM-S918B", os: "Android", osVersion: "14", browser: "Chrome", bv: "141" },
  { type: "mobile", brand: "Apple", model: "iPhone", os: "iOS", osVersion: "18.1", browser: "Safari", bv: "18" },
  { type: "mobile", brand: "Xiaomi", model: "23049PCD8G", os: "Android", osVersion: "13", browser: "Chrome", bv: "140" },
  { type: "desktop", brand: "", model: "", os: "Windows", osVersion: "11", browser: "Chrome", bv: "141" },
  { type: "desktop", brand: "", model: "", os: "Windows", osVersion: "10", browser: "Edge", bv: "141" },
  { type: "desktop", brand: "Apple", model: "Macintosh", os: "macOS", osVersion: "15.0", browser: "Safari", bv: "18" },
  { type: "desktop", brand: "", model: "", os: "Linux", osVersion: "", browser: "Firefox", bv: "132" },
  { type: "tablet", brand: "Apple", model: "iPad", os: "iOS", osVersion: "17.5", browser: "Safari", bv: "17" },
] as const;

const places = [
  { country: "BD", cities: ["Dhaka", "Chattogram", "Sylhet"] },
  { country: "IN", cities: ["Kolkata", "Mumbai", "Delhi"] },
  { country: "US", cities: ["New York", "San Francisco", "Austin"] },
  { country: "GB", cities: ["London", "Manchester"] },
  { country: "DE", cities: ["Berlin", "Munich"] },
  { country: "CA", cities: ["Toronto", "Vancouver"] },
  { country: "SA", cities: ["Riyadh", "Jeddah"] },
  { country: "AE", cities: ["Dubai"] },
  { country: "SG", cities: ["Singapore"] },
  { country: "AU", cities: ["Sydney", "Melbourne"] },
] as const;

const sources = ["Direct", "Direct", "Google", "Google", "LinkedIn", "LinkedIn", "GitHub", "Facebook", "Twitter / X", "Telegram"];
const sectionOrder = ["home", "about", "skills", "projects", "experience", "blogs", "contact"];
const eventTypes = ["resume_download", "project_open", "project_open", "blog_open", "live_demo", "github_click", "contact_click", "contact_submit"];
const timezones = ["Asia/Dhaka", "Asia/Kolkata", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Dubai", "Asia/Singapore", "Australia/Sydney"];

const visitorPool = Array.from({ length: 90 }, () => crypto.randomUUID());
const total = 220;
const now = Date.now();

// Newer days get more traffic
const times = Array.from({ length: total }, () => {
  const daysAgo = Math.floor(Math.pow(Math.random(), 1.6) * 30);
  return now - daysAgo * 86400000 - between(0, 86399) * 1000;
}).sort((a, b) => a - b);

const seen = new Set<string>();
const docs = times.map((time) => {
  const d = pick(devices);
  const place = pick(places);
  const visitorId = pick(visitorPool);
  const isReturning = seen.has(visitorId);
  seen.add(visitorId);

  const started = new Date(time);
  const lastSeen = new Date(time + between(8, 420) * 1000);
  const sections = sectionOrder.slice(0, between(1, 7));
  const events = Array.from({ length: between(0, 3) }, () => ({
    type: pick(eventTypes),
    label: "",
    at: new Date(time + between(5, 200) * 1000),
  }));
  const source = pick(sources);
  const mobile = d.type === "mobile";

  return {
    isSeed: true,
    visitId: crypto.randomUUID(),
    visitorId,
    isReturning,
    startedAt: started,
    lastSeenAt: lastSeen,
    createdAt: started,
    device: { type: d.type, brand: d.brand, model: d.model },
    os: { name: d.os, version: d.osVersion },
    browser: { name: d.browser, version: d.bv },
    screen: mobile ? { width: 412, height: 915 } : { width: 1920, height: 1080 },
    viewport: mobile ? { width: 412, height: 780 } : { width: 1536, height: 730 },
    geo: { country: place.country, region: "", city: pick(place.cities) },
    language: "en-US",
    timezone: pick(timezones),
    source,
    referrerHost: source === "Direct" ? "" : source.toLowerCase().replace(/[^a-z]/g, "") + ".com",
    ipHash: "seed",
    sections,
    events,
  };
});

await visits.insertMany(docs);
console.log(`Added ${docs.length} fake visits. Remove them later with: npm run seed:clear`);
process.exit(0);