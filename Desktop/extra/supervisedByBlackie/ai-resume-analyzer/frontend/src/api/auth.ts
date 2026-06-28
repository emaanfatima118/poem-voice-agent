import { api, setToken, clearToken } from "./client";
import type { AuthResponse, User } from "../types";

export async function signup(data: {
  full_name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
  setToken(res.access_token);
  return res;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  setToken(res.access_token);
  return res;
}

export function logout() {
  clearToken();
}

export async function getProfile(): Promise<User> {
  return api<User>("/users/me");
}

export async function deleteAccount(): Promise<{ message: string }> {
  return api("/users/me", { method: "DELETE" });
}
