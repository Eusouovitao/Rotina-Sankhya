import { QueryClient, QueryFunction } from "@tanstack/react-query";
import type { Routine, InsertRoutine } from "@shared/schema";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    await throwIfResNotOk(res);
    return res;
  } catch (e) {
    if (typeof window !== "undefined" && url.startsWith("/api/routines")) {
      const r = await mockApi(method, url, data as any);
      return r;
    }
    throw e;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T>({ on401: unauthorizedBehavior }: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    try {
      const res = await fetch(url, {
        credentials: "include",
      });
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null as T;
      }
      await throwIfResNotOk(res);
      return (await res.json()) as T;
    } catch (e) {
      if (typeof window !== "undefined" && url.startsWith("/api/routines")) {
        const data = mockGet(url) as T;
        return data;
      }
      throw e;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const MOCK_KEY = "mock:routines";

function mockList(): Routine[] {
  try {
    const raw = window.localStorage.getItem(MOCK_KEY);
    return raw ? (JSON.parse(raw) as Routine[]) : [];
  } catch {
    return [];
  }
}

function mockSave(list: Routine[]) {
  window.localStorage.setItem(MOCK_KEY, JSON.stringify(list));
}

function mockCreate(data: InsertRoutine): Routine {
  const id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
  const routine: Routine = { ...data, id };
  const list = mockList();
  list.push(routine);
  mockSave(list);
  return routine;
}

function mockUpdate(id: string, updates: Partial<InsertRoutine>): Routine | undefined {
  const list = mockList();
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return undefined;
  const updated: Routine = { ...list[idx], ...updates };
  list[idx] = updated;
  mockSave(list);
  return updated;
}

function mockUpdateStatus(id: string, isActive: boolean): Routine | undefined {
  return mockUpdate(id, { isActive });
}

function mockDelete(id: string): boolean {
  const list = mockList();
  const next = list.filter(r => r.id !== id);
  const changed = next.length !== list.length;
  if (changed) mockSave(next);
  return changed;
}

function parseId(url: string): string | null {
  const parts = url.split("/").filter(Boolean);
  const idx = parts.findIndex(p => p === "routines");
  if (idx === -1) return null;
  return parts[idx + 1] ?? null;
}

function mockGet(url: string): unknown {
  if (url === "/api/routines") {
    return mockList();
  }
  const id = parseId(url);
  if (id) {
    const list = mockList();
    return list.find(r => r.id === id) ?? null;
  }
  return null;
}

async function mockApi(method: string, url: string, data?: any): Promise<Response> {
  if (method === "GET" && url === "/api/routines") {
    return new Response(JSON.stringify(mockList()), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  if (method === "POST" && url === "/api/routines") {
    const created = mockCreate(data as InsertRoutine);
    return new Response(JSON.stringify(created), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  if (method === "PATCH" && url.startsWith("/api/routines/") && url.endsWith("/status")) {
    const id = parseId(url);
    const updated = id ? mockUpdateStatus(id, (data as { isActive: boolean }).isActive) : undefined;
    if (!updated) return new Response(JSON.stringify({ error: "Routine not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  if (method === "PATCH" && url.startsWith("/api/routines/")) {
    const id = parseId(url);
    const updated = id ? mockUpdate(id, data as Partial<InsertRoutine>) : undefined;
    if (!updated) return new Response(JSON.stringify({ error: "Routine not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  if (method === "DELETE" && url.startsWith("/api/routines/")) {
    const id = parseId(url);
    const ok = id ? mockDelete(id) : false;
    return new Response(null, { status: ok ? 204 : 404 });
  }
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 400, headers: { "Content-Type": "application/json" } });
}
