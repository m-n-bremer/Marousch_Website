import Cookies from "js-cookie";
import api from "./api";
import type { User } from "./types";

export async function login(email: string, password: string, rememberMe?: boolean): Promise<string> {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data.access_token;
  Cookies.set("token", token, { expires: rememberMe ? 30 : 1 });
  return token;
}

export function logout() {
  Cookies.remove("token");
}

export function getToken(): string | undefined {
  return Cookies.get("token");
}

export async function fetchCurrentUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
}
