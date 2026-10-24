import type { Filters, LiveData, Stats, VisitorsResponse } from "./type";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* no JSON body */
    }
    throw new ApiError(response.status, message);
  }
  return (await response.json()) as T;
}

const tz = () => String(new Date().getTimezoneOffset());

const toQuery = (params: Record<string, string | number>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined) search.set(key, String(value));
  });
  return search.toString();
};

export const login = (password: string) =>
  request<{ ok: true }>("/api/admin/login", "POST", { password });
export const logout = () => request<{ ok: true }>("/api/admin/logout", "POST");
export const checkSession = () => request<{ ok: true }>("/api/admin/me");

export const getStats = (range: number) =>
  request<Stats>(`/api/admin/stats?${toQuery({ range, tz: tz() })}`);

export const getLive = () => request<LiveData>("/api/admin/live");

export interface TableQuery extends Filters {
  range: number;
  page: number;
  pageSize: number;
}

export const getVisitors = (query: TableQuery) =>
  request<VisitorsResponse>(`/api/admin/visitors?${toQuery({ ...query, tz: tz() })}`);

export const exportUrl = (filters: Filters, range: number) =>
  `/api/admin/export?${toQuery({ ...filters, range, tz: tz() })}`;