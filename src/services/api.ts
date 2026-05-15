const BASE_URL = import.meta.env.VITE_API_URL;

export type ApiError = { status: number; message: string };
export type ApiErrorResponse = { status?: number; message?: string };

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  
  // Don't send token for auth endpoints (login, register)
  if (token && !path.includes("/auth/")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text || res.statusText;

    try {
      const data = JSON.parse(text) as ApiErrorResponse;
      if (typeof data.message === "string" && data.message.trim()) {
        message = data.message;
      }
    } catch {
      // Keep the raw response text when the backend does not return JSON.
    }

    const err: ApiError = { status: res.status, message };
    throw err;
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return {} as T;

  return (await res.json()) as T;
}
