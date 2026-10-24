import { UAParser } from "ua-parser-js";
import { sectionIds } from "../data/profile";

// ✏️ SETTINGS
// true  = track only after the visitor clicks "Accept" (GDPR-friendly)
// false = track every visitor (Decline still opts a person out)
const REQUIRE_CONSENT = true;
const PING_INTERVAL = 15_000; // heartbeat every 15 seconds
const API = "/api/track";

const KEY_CONSENT = "portfolio_consent";
const KEY_VISITOR = "portfolio_vid";
const KEY_OWNER = "portfolio_owner";

type Consent = "accepted" | "declined";

const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked */
  }
};
const remove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage blocked */
  }
};

/* ---------- Owner exclusion ----------
   Open  yoursite.com/?notrack=on   once on each of your devices to hide your own visits.
   Open  yoursite.com/?notrack=off  to start counting yourself again. */
(function handleOwnerFlag() {
  const params = new URLSearchParams(window.location.search);
  const flag = params.get("notrack");
  if (flag === "on") write(KEY_OWNER, "1");
  if (flag === "off") remove(KEY_OWNER);
  if (flag) {
    params.delete("notrack");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (query ? `?${query}` : "") + window.location.hash
    );
  }
})();

const isOwner = () => read(KEY_OWNER) === "1";
const doNotTrack = () => navigator.doNotTrack === "1";

export function getConsent(): Consent | null {
  const value = read(KEY_CONSENT);
  return value === "accepted" || value === "declined" ? value : null;
}

export const shouldShowBanner = () => !isOwner() && !doNotTrack() && getConsent() === null;

function canTrack(): boolean {
  if (isOwner() || doNotTrack() || navigator.webdriver) return false;
  const consent = getConsent();
  if (consent === "declined") return false;
  if (REQUIRE_CONSENT && consent !== "accepted") return false;
  return true;
}

export function setConsent(value: Consent) {
  write(KEY_CONSENT, value);
  if (value === "accepted") initTracking();
}

/* ---------- Collect device info ---------- */
async function collectEnvironment() {
  const result = new UAParser(navigator.userAgent).getResult();

  const t = result.device.type;
  const type =
    t === "mobile" || t === "tablet"
      ? t
      : t === "smarttv"
      ? "smarttv"
      : t
      ? "other"
      : "desktop";

  const device = {
    type,
    brand: result.device.vendor ?? "",
    model: result.device.model ?? "",
  };
  const os = { name: result.os.name ?? "", version: result.os.version ?? "" };
  const browser = {
    name: result.browser.name ?? "",
    version: (result.browser.version ?? "").split(".")[0],
  };

  // Chrome hides details in the user-agent, so ask for them politely (Client Hints)
  const uaData = (
    navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues?: (hints: string[]) => Promise<Record<string, string>>;
      };
    }
  ).userAgentData;

  if (uaData?.getHighEntropyValues) {
    try {
      const hints = await uaData.getHighEntropyValues(["model", "platformVersion"]);
      if (hints.model) device.model = hints.model;
      if (hints.platformVersion) {
        if (os.name === "Windows") {
          os.version = parseInt(hints.platformVersion, 10) >= 13 ? "11" : "10";
        } else if (os.name === "Android" || os.name === "macOS") {
          os.version = hints.platformVersion;
        }
      }
    } catch {
      /* not available, keep the basic values */
    }
  }

  return { device, os, browser };
}

function getVisitor() {
  let id = read(KEY_VISITOR);
  const isReturning = Boolean(id);
  if (!id) {
    id = crypto.randomUUID();
    write(KEY_VISITOR, id);
  }
  return { id, isReturning };
}

function post(payload: Record<string, unknown>, beacon = false): Promise<unknown> {
  const body = JSON.stringify(payload);
  if (beacon && navigator.sendBeacon) {
    navigator.sendBeacon(API, new Blob([body], { type: "application/json" }));
    return Promise.resolve();
  }
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined); // tracking must never break the site
}

// data-track value  ->  event name saved in the database
const EVENT_MAP: Record<string, string> = {
  resume: "resume_download",
  "live-demo": "live_demo",
  github: "github_click",
  project: "project_open",
  blog: "blog_open",
  "contact-submit": "contact_submit",
};

let started = false;

export function initTracking() {
  if (started || !canTrack()) return;
  started = true;

  const visitId = crypto.randomUUID();
  const visitor = getVisitor();

  // Everything else waits until the "start" request has been sent
  const ready = collectEnvironment().then((environment) =>
    post({
      type: "start",
      visitId,
      visitorId: visitor.id,
      isReturning: visitor.isReturning,
      referrer: document.referrer,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: { width: window.screen.width, height: window.screen.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      ...environment,
    })
  );

  const send = (payload: Record<string, unknown>, beacon = false) => {
    void ready.then(() => post({ ...payload, visitId }, beacon));
  };

  // Heartbeat: proves the visitor is still here (powers "live visitors" and time spent)
  const ping = () => {
    if (document.visibilityState === "visible") send({ type: "ping" });
  };
  window.setInterval(ping, PING_INTERVAL);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") ping();
    else send({ type: "ping" }, true);
  });

  // Which sections did the visitor scroll to?
  const seen = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !seen.has(entry.target.id)) {
          seen.add(entry.target.id);
          send({ type: "section", section: entry.target.id });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Which buttons were clicked? (any element with a data-track attribute)
  document.addEventListener("click", (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
    if (!el) return;

    const key = el.dataset.track ?? "";
    const event = EVENT_MAP[key] ?? (key.startsWith("contact-") ? "contact_click" : "");
    if (!event) return;

    const label =
      event === "contact_click"
        ? key.replace("contact-", "")
        : el.dataset.project ?? el.dataset.blog ?? key;
    send({ type: "event", event, label });
  });
}