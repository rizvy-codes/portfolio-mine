import { Fragment, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Monitor, Smartphone, Tablet, Tv } from "lucide-react";
import {
  capitalize,
  countryName,
  durationSec,
  eventLabel,
  formatDateTime,
  formatDuration,
  sectionLabel,
} from "./format";
import type { Visitor } from "./type";

const deviceIcons: Record<string, typeof Monitor> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
  smarttv: Tv,
  other: Monitor,
};

const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ");

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 text-sm">{value || "-"}</p>
    </div>
  );
}

function Row({ visitor }: { visitor: Visitor }) {
  const [open, setOpen] = useState(false);
  const Icon = deviceIcons[visitor.device.type] ?? Monitor;
  const deviceName = join(visitor.device.brand, visitor.device.model) || capitalize(visitor.device.type);
  const location =
    [visitor.geo.city, visitor.geo.country ? countryName(visitor.geo.country) : ""]
      .filter(Boolean)
      .join(", ") || "Unknown";

  return (
    <Fragment>
      <tr
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer border-t border-line transition-colors hover:bg-card"
      >
        <td className="whitespace-nowrap px-4 py-3">
          <p>{formatDateTime(visitor.createdAt)}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
              visitor.isReturning
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-brand-cyan/15 text-brand-cyan"
            }`}
          >
            {visitor.isReturning ? "Returning" : "New"}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Icon size={16} className="text-brand-violet" />
            {deviceName}
          </span>
          <span className="text-xs text-muted">{capitalize(visitor.device.type)}</span>
        </td>
        <td className="whitespace-nowrap px-4 py-3">
          {join(visitor.os.name, visitor.os.version) || "Unknown"}
        </td>
        <td className="whitespace-nowrap px-4 py-3">
          {join(visitor.browser.name, visitor.browser.version) || "Unknown"}
        </td>
        <td className="whitespace-nowrap px-4 py-3">{location}</td>
        <td className="whitespace-nowrap px-4 py-3">{visitor.source}</td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap items-center gap-1">
            {visitor.sections.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-brand-violet/15 px-2 py-0.5 text-[11px] text-brand-violet">
                {sectionLabel(s)}
              </span>
            ))}
            {visitor.sections.length > 3 && (
              <span className="text-xs text-muted">+{visitor.sections.length - 3}</span>
            )}
            {visitor.sections.length === 0 && <span className="text-xs text-muted">-</span>}
          </div>
        </td>
        <td className="px-3 py-3 text-muted">
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </td>
      </tr>

      {open && (
        <tr className="bg-card">
          <td colSpan={8} className="px-6 py-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Time spent" value={formatDuration(durationSec(visitor))} />
              <Detail label="Screen" value={`${visitor.screen.width} x ${visitor.screen.height}`} />
              <Detail label="Viewport" value={`${visitor.viewport.width} x ${visitor.viewport.height}`} />
              <Detail label="Language" value={visitor.language} />
              <Detail label="Timezone" value={visitor.timezone} />
              <Detail label="Referrer" value={visitor.referrerHost || "Direct"} />
              <Detail label="Region" value={visitor.geo.region} />
              <Detail
                label="Sections viewed"
                value={visitor.sections.map(sectionLabel).join(", ")}
              />
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wider text-muted">Actions</p>
              {visitor.events.length === 0 ? (
                <p className="mt-1 text-sm text-muted">No clicks recorded.</p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {visitor.events.map((e, i) => (
                    <li key={i} className="glass rounded-full px-3 py-1 text-xs">
                      {eventLabel[e.type] ?? e.type}
                      {e.label && e.label !== e.type ? `: ${e.label}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

export default function VisitorsTable({
  items,
  loading,
  total,
  page,
  pageSize,
  onPage,
  onPageSize,
}: {
  items: Visitor[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const numbers = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div>
      <div className={`glass overflow-x-auto rounded-2xl transition-opacity ${loading ? "opacity-60" : ""}`}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted">
              {["Time", "Device", "OS", "Browser", "Location", "Source", "Pages viewed", ""].map(
                (heading, i) => (
                  <th key={i} className="px-4 py-3 font-medium">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((visitor) => (
              <Row key={visitor.visitId} visitor={visitor} />
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted">
                  {loading ? "Loading..." : "No visitors match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          Showing {from}-{to} of {total.toLocaleString()}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            aria-label="Rows per page"
            className="glass rounded-xl px-3 py-2 outline-none"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>

          <button
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="glass grid h-9 w-9 place-items-center rounded-xl disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          {numbers.map((n) => (
            <button
              key={n}
              onClick={() => onPage(n)}
              aria-current={n === page ? "page" : undefined}
              className={`grid h-9 w-9 place-items-center rounded-xl text-sm ${
                n === page
                  ? "bg-gradient-to-br from-brand-cyan to-brand-violet font-semibold text-white"
                  : "glass"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => onPage(page + 1)}
            disabled={page >= pages}
            aria-label="Next page"
            className="glass grid h-9 w-9 place-items-center rounded-xl disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}