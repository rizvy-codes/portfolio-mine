import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "./format";
import type { NamedValue } from "./types";

const tooltipProps = {
  contentStyle: {
    background: "var(--bg)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    fontSize: 12,
  },
  labelStyle: { color: "var(--fg)" },
  itemStyle: { color: "var(--fg)" },
};

const tick = { fill: "var(--muted)", fontSize: 12 };

export function ChartCard({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`glass rounded-3xl p-5 ${className}`}>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      <div className="mt-4 h-64">{children}</div>
    </section>
  );
}

function Empty() {
  return (
    <div className="grid h-full place-items-center text-sm text-muted">No data yet</div>
  );
}

export function VisitsChart({
  data,
}: {
  data: { label: string; visits: number; visitors: number }[];
}) {
  if (!data.length) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} />
        <Tooltip {...tooltipProps} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="visits"
          name="Visits"
          stroke="#22d3ee"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="visitors"
          name="Unique visitors"
          stroke="#f472b6"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Donut (innerRadius > 0) or full pie (innerRadius = 0). */
export function PieBreakdown({
  data,
  donut = true,
}: {
  data: NamedValue[];
  donut?: boolean;
}) {
  if (!data.length) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={donut ? 55 : 0}
          outerRadius={85}
          paddingAngle={donut ? 3 : 1}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipProps} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBars({ data, offset = 0 }: { data: NamedValue[]; offset?: number }) {
  if (!data.length) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={tick} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={96}
          tick={tick}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip {...tooltipProps} cursor={{ fill: "var(--card)" }} />
        <Bar dataKey="value" name="Visits" radius={[0, 8, 8, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[(i + offset) % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}