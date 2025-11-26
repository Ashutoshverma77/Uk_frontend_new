"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  initialized: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedToken = window.localStorage.getItem("session_token");
      const rawUser = window.localStorage.getItem("pharmacy_user");

      if (storedToken) setToken(storedToken);
      if (rawUser) setUser(JSON.parse(rawUser));
    } catch {
      // ignore
    } finally {
      setInitialized(true);
    }
  }, []);

  const setAuth = (nextUser: AuthUser, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("session_token", nextToken);
      window.localStorage.setItem("pharmacy_user", JSON.stringify(nextUser));
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("session_token");
      window.localStorage.removeItem("pharmacy_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setAuth,
        clearAuth,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
