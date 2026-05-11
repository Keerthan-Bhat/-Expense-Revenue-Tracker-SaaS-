"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: "demo-user-1",
  name: "Demo User",
  email: "demo@tracker.com",
  currency: "USD",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ert_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    // Demo auth: accept demo@tracker.com or any email
    if (email === "demo@tracker.com" || email.length > 0) {
      const u = email === "demo@tracker.com" ? DEMO_USER : { ...DEMO_USER, email, id: "demo-user-1" };
      localStorage.setItem("ert_user", JSON.stringify(u));
      setUser(u);
    } else {
      throw new Error("Invalid credentials");
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    const u = { ...DEMO_USER, name, email };
    localStorage.setItem("ert_user", JSON.stringify(u));
    setUser(u);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("ert_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
