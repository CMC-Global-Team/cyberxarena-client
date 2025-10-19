// Centralized API configuration for switching environments

export type ApiEnvironment = "production" | "local";

// Base URLs
const BASE_URLS: Record<ApiEnvironment, string> = {
  production: "https://cyberxarena-server.onrender.com/api/v1",
  local: "http://localhost:8080/api/v1",
};

// Determine environment from NEXT_PUBLIC_API_ENV or NODE_ENV
const envFlag = (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_ENV : undefined) as
  | ApiEnvironment
  | undefined;

export const API_ENV: ApiEnvironment = envFlag ?? (process.env.NODE_ENV === "production" ? "production" : "local");

export const API_BASE_URL = BASE_URLS[API_ENV];

export const withBaseUrl = (path: string): string => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};


