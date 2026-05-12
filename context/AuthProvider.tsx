"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const AUTH_KEY = "klarhilfe_auth_v1";

type AuthState = {
  email: string;
};

type AuthContextValue = {
  user: AuthState | null;
  login: (email: string, _password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readAuth(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthState;
    if (parsed && typeof parsed.email === "string" && parsed.email.length > 0) {
      return { email: parsed.email };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState | null>(null);

  useEffect(() => {
    setUser(readAuth());
  }, []);

  const login = useCallback((email: string, _password: string) => {
    const next = { email: email.trim() || "user@example.com" };
    setUser(next);
    try {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
