const API_BASE = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const body = await res.json();
      message = body.detail || body.message || message;
      if (Array.isArray(message)) {
        message = message.map((e: { msg?: string }) => e.msg).join(", ");
      }
    } catch {
      message = res.statusText;
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}
