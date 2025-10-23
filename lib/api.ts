import { withBaseUrl } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions extends RequestInit {
  json?: unknown;
}

async function request<T>(path: string, method: HttpMethod, options: RequestOptions = {}): Promise<T> {
  const url = withBaseUrl(path);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `HTTP ${response.status} ${response.statusText}`);
  }

  // Try to parse JSON; fallback to undefined
  try {
    return (await response.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, "GET", options),
  post: <T>(path: string, json?: unknown, options?: RequestOptions) => request<T>(path, "POST", { ...options, json }),
  put: <T>(path: string, json?: unknown, options?: RequestOptions) => request<T>(path, "PUT", { ...options, json }),
  patch: <T>(path: string, json?: unknown, options?: RequestOptions) => request<T>(path, "PATCH", { ...options, json }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, "DELETE", options),
};


