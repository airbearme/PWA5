import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockApi } from '@/lib/mock-api';
import { getSupabaseClient } from "./supabase-client";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

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
  if (USE_MOCK_API) {
    if (method === 'GET') {
      return mockApi.get(url);
    }
    if (method === 'POST') {
      return mockApi.post(url, data);
    }
  }

  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } };

  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } };
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(queryKey.join("/") as string, {
        headers,
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
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
