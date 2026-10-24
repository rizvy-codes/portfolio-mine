import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Eye,
  LogOut,
  Moon,
  RefreshCw,
  Radio,
  Repeat,
  Sun,
  Timer,
  Users,
} from "lucide-react";
import { profile } from "../data/profile";
import { useTheme } from "../hooks/useTheme";
import { ApiError, exportUrl, getLive, getStats, getVisitors, logout } from "./api";
import { ChartCard, HorizontalBars, PieBreakdown, VisitsChart } from "./Charts";
import {
  capitalize,
  countryName,
  eventLabel,
  formatDuration,
  sectionLabel,
  shortDay,
} from "./format";
import StatCard from "./StatCard";
import type { Filters, LiveData, Stats, VisitorsResponse } from "./type";
import VisitorsTable from "./VisitorsTable";

const emptyFilters: Filters = { search: "", device: "", visitor: "", source: "", country: "" };
const RANGES = [7, 30, 90];

const selectClass = "glass rounded-xl px-3 py-2.5 text-sm outline-none transition focus:border-brand-cyan";

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { theme, toggle } = useTheme();

  const [range, setRange] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [live, setLive] = useState<LiveData | null>(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [visitors, setVisitors] = useState<VisitorsResponse | null>(null);
  const [loadingTable, setLoadingTable] = useState(true);

  // If the session expired, go back to the login screen
  const fail = useCallback(
    (e: unknown) => {
      if (e instanceof ApiError && e.status === 401) {
        onLogout();
        return;
      }
      setError(e instanceof Error ? e.message : "Something went wrong");
    },
    [onLogout]
  );

  // Stats + charts (refreshed every minute)
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      getStats(range)
        .then((data) => {
          if (!cancelled) {
            setStats(data);
            setError("");
          }
        })
        .catch((e) => !cancelled && fail(e));
    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [range, refreshKey, fail]);

  // Live visitors (every 5 seconds while the tab is visible)
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (document.visibilityState !== "visible") return;
      getLive()
        .then((data) => !cancelled && setLive(data))
        .catch((e) => !cancelled && fail(e));
    };
    load();
    const id = window.setInterval(load, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [fail]);

  // Wait a moment after typing or changing a filter, then go back to page 1
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setApplied(filters);
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [filters]);

  // Visitors table
  useEffect(() => {
    let cancelled = false;
    setLoadingTable(true);
    getVisitors({ ...applied, range, page, pageSize })
      .then((data) => {
        if (!cancelled) {
          setVisitors(data);
          setLoadingTable(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadingTable(false);
          fail(e);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [applied, range, page, pageSize, refreshKey, fail]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      onLogout();
    }
  };

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const t = stats?.totals;
  const returningShare =
    t && t.uniqueVisitors > 0 ? Math.round((t.returningVisitors / t.uniqueVisitors) * 100) : 0;

  const cards = [
    { label: "Total visits", value: t?.totalVisits, hint: "All time", Icon: Eye, color: "#22d3ee" },
    { label: "Today's visits", value: t?.todayVisits, hint: "Since midnight", Icon: CalendarDays, color: "#8b5cf6" },
    { label: "Unique visitors", value: t?.uniqueVisitors, hint: "All time", Icon: Users, color: "#f472b6" },
    {
      label: "Returning visitors",
      value: t?.returningVisitors,
      hint: t ? `${returningShare}% of unique visitors` : "",
      Icon: Repeat,
      color: "#34d399",
    },
    { label: "Live right now", value: live?.count, hint: "Active in the last 40 seconds", Icon: Radio, color: "#fb923c", live: true },
    {
      label: "Avg. time on site",
      value: t ? formatDuration(t.avgDurationSec) : undefined,
      hint: `Last ${range} days`,
      Icon: Timer,
      color: "#60a5fa",
    },
  ];

  const dailyData = (stats?.daily ?? []).map((d) => ({
    label: shortDay(d.day),
    visits: d.visits,
    visitors: d.visitors,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <div aria-hidden className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-violet/15 blur-3xl" />
      <div aria-hidden className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-brand-cyan/10 blur-3xl" />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-3">
          <div className="rounded-xl border border-white/10 bg-black/60 px-2.5 py-1.5">
            <img src={profile.logo} alt="Logo" className="h-6 w-auto" />
          </div>
          <h1 className="font-display text-lg font-bold sm:text-xl">
            Analytics <span className="text-gradient">Dashboard</span>
          </h1>

          <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Live: {live?.count ?? "-"}
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="glass flex rounded-xl p-1" role="group" aria-label="Date range">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setPage(1);
                  }}
                  aria-pressed={range === r}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    range === r
                      ? "bg-gradient-to-r from-brand-cyan to-brand-violet text-white"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              aria-label="Refresh data"
              className="glass grid h-9 w-9 place-items-center rounded-xl transition hover:border-brand-cyan"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={toggle}
              aria-label="Toggle light and dark theme"
              className="glass grid h-9 w-9 place-items-center rounded-xl transition hover:border-brand-cyan"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a
              href="/"
              className="glass hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition hover:border-brand-cyan sm:flex"
            >
              <ArrowLeft size={14} />
              Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/25"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl space-y-6 px-5 pt-8">
        {error && (
          <p role="alert" className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {cards.map((card, i) => (
            <StatCard key={card.label} index={i} {...card} />
          ))}
        </div>

        {/* Live visitors */}
        <section className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Live visitors</h2>
            <span className="text-xs text-muted">Updates every 5 seconds</span>
          </div>
          {!live || live.visitors.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nobody is on the site right now.</p>
          ) : (
            <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {live.visitors.map((v) => {
                const where =
                  [v.geo.city, v.geo.country ? countryName(v.geo.country) : ""]
                    .filter(Boolean)
                    .join(", ") || "Unknown location";
                const current = v.sections[v.sections.length - 1];
                return (
                  <motion.li
                    key={v.visitId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-line bg-card p-4 text-sm"
                  >
                    <p className="flex items-center gap-2 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {[v.os.name, v.browser.name].filter(Boolean).join(" / ") || "Unknown device"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {where} · from {v.source} · {capitalize(v.device.type)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {current ? `Viewing: ${sectionLabel(current)}` : "Just arrived"}
                    </p>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Charts */}
        <div className="grid gap-5 lg:grid-cols-3">
          <ChartCard
            title="Visits over time"
            subtitle={`Last ${range} days`}
            className="lg:col-span-2"
          >
            <VisitsChart data={dailyData} />
          </ChartCard>

          <ChartCard title="Device split">
            <PieBreakdown
              data={(stats?.devices ?? []).map((d) => ({ ...d, name: capitalize(d.name) }))}
            />
          </ChartCard>

          <ChartCard title="Operating systems">
            <HorizontalBars data={stats?.os ?? []} />
          </ChartCard>

          <ChartCard title="Browsers">
            <HorizontalBars data={stats?.browsers ?? []} offset={2} />
          </ChartCard>

          <ChartCard title="Traffic sources">
            <PieBreakdown data={stats?.sources ?? []} donut={false} />
          </ChartCard>

          <ChartCard title="Top countries" className="lg:col-span-2">
            <HorizontalBars
              data={(stats?.countries ?? []).map((c) => ({ ...c, name: countryName(c.name) }))}
              offset={1}
            />
          </ChartCard>

          <ChartCard title="Top actions" subtitle="What visitors clicked">
            <HorizontalBars
              data={(stats?.actions ?? []).map((a) => ({ ...a, name: eventLabel[a.name] ?? a.name }))}
              offset={3}
            />
          </ChartCard>
        </div>

        {/* Visitors table */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold">
              Recent <span className="text-gradient">visitors</span>
            </h2>
            <a
              href={exportUrl(applied, range)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/30 transition hover:scale-105"
            >
              <Download size={16} />
              Export CSV
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search OS, browser, city, source..."
              aria-label="Search visitors"
              className="glass min-w-[220px] flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition focus:border-brand-cyan"
            />
            <select
              value={filters.device}
              onChange={(e) => setFilter("device", e.target.value)}
              aria-label="Filter by device"
              className={selectClass}
            >
              <option value="">All devices</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
              <option value="desktop">Desktop</option>
            </select>
            <select
              value={filters.visitor}
              onChange={(e) => setFilter("visitor", e.target.value)}
              aria-label="Filter by visitor type"
              className={selectClass}
            >
              <option value="">New + returning</option>
              <option value="new">New only</option>
              <option value="returning">Returning only</option>
            </select>
            <select
              value={filters.source}
              onChange={(e) => setFilter("source", e.target.value)}
              aria-label="Filter by source"
              className={selectClass}
            >
              <option value="">All sources</option>
              {(visitors?.sources ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filters.country}
              onChange={(e) => setFilter("country", e.target.value)}
              aria-label="Filter by country"
              className={selectClass}
            >
              <option value="">All countries</option>
              {(visitors?.countries ?? []).map((c) => (
                <option key={c} value={c}>
                  {countryName(c)}
                </option>
              ))}
            </select>
          </div>

          <VisitorsTable
            items={visitors?.items ?? []}
            loading={loadingTable}
            total={visitors?.total ?? 0}
            page={page}
            pageSize={pageSize}
            onPage={setPage}
            onPageSize={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </section>
      </main>
    </div>
  );
}