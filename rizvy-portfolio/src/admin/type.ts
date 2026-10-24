export interface Visitor {
  visitId: string;
  createdAt: string;
  startedAt: string;
  lastSeenAt: string;
  isReturning: boolean;
  device: { type: string; brand: string; model: string };
  os: { name: string; version: string };
  browser: { name: string; version: string };
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  geo: { country: string; region: string; city: string };
  language: string;
  timezone: string;
  source: string;
  referrerHost: string;
  sections: string[];
  events: { type: string; label: string; at: string }[];
}

export interface NamedValue {
  name: string;
  value: number;
}

export interface Stats {
  range: number;
  totals: {
    totalVisits: number;
    todayVisits: number;
    uniqueVisitors: number;
    returningVisitors: number;
    avgDurationSec: number;
  };
  daily: { day: string; visits: number; visitors: number }[];
  devices: NamedValue[];
  os: NamedValue[];
  browsers: NamedValue[];
  countries: NamedValue[];
  sources: NamedValue[];
  actions: NamedValue[];
}

export interface LiveVisitor {
  visitId: string;
  device: { type: string; brand: string; model: string };
  os: { name: string; version: string };
  browser: { name: string; version: string };
  geo: { country: string; region: string; city: string };
  source: string;
  sections: string[];
  lastSeenAt: string;
  startedAt: string;
}

export interface LiveData {
  count: number;
  visitors: LiveVisitor[];
}

export interface VisitorsResponse {
  items: Visitor[];
  total: number;
  page: number;
  pageSize: number;
  sources: string[];
  countries: string[];
}

export interface Filters {
  search: string;
  device: string;
  visitor: string;
  source: string;
  country: string;
}
