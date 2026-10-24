import type { VercelRequest } from "@vercel/node";
import type { Document, Filter } from "mongodb";
import { parseOffset, rangeStart } from "./time.js";

const DEVICES = ["mobile", "tablet", "desktop", "smarttv", "other"];

export const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Reads one query-string value as a plain string. */
export const q = (query: VercelRequest["query"], name: string): string => {
  const value = query[name];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

export function buildFilter(query: VercelRequest["query"]): Filter<Document> {
  const filter: Filter<Document> = {};

  const range = parseInt(q(query, "range"), 10);
  if ([7, 30, 90].includes(range)) {
    filter.createdAt = { $gte: rangeStart(range, parseOffset(q(query, "tz"))) };
  }

  const device = q(query, "device");
  if (DEVICES.includes(device)) filter["device.type"] = device;

  const visitor = q(query, "visitor");
  if (visitor === "new") filter.isReturning = false;
  if (visitor === "returning") filter.isReturning = true;

  const source = q(query, "source").slice(0, 40);
  if (source) filter.source = source;

  const country = q(query, "country").slice(0, 4);
  if (country) filter["geo.country"] = country;

  const search = q(query, "search").trim().slice(0, 50);
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [
      "os.name",
      "browser.name",
      "device.brand",
      "device.model",
      "geo.city",
      "geo.country",
      "geo.region",
      "source",
      "language",
      "timezone",
    ].map((field) => ({ [field]: regex }));
  }

  return filter;
}