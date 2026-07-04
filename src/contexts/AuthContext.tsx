"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isUserAdmin } from "@/lib/admin";
import { syncUserFromAuth } from "@/lib/users";
import { SITE_EMAIL } from "@/lib/siteContact";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithLocalGate: (username: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
  isLocalGateEnabled: boolean;
  checkAdminStatus: () => Promise<void>;
  refreshLocalGateSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isLocalGateEnabled = process.env.NEXT_PUBLIC_ADMIN_LOCAL_GATE === "true";
const localGateDisplayEmail =
  process.env.NEXT_PUBLIC_ADMIN_LOCAL_DISPLAY_EMAIL?.trim() || SITE_EMAIL;

function createLocalGateUser(): User {
  return {
    id: "local-gate-admin",
    email: localGateDisplayEmail,
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date(0).toISOString(),
  } as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshLocalGateSession = async (): Promise<boolean> => {
    if (!isLocalGateEnabled) return false;

    try {
      const res = await fetch("/api/admin-local-gate/status", { credentials: "same-origin" });
      if (!res.ok) return false;
      const data = (await res.json()) as { ok?: boolean };
      if (data.ok) {
        setUser(createLocalGateUser());
        setSession(null);
        setIsAdmin(true);
        return true;
      }
    } catch {
      // ignore
    }

    return false;
  };

  const checkAdminStatus = async () => {
    if (isLocalGateEnabled) {
      const ok = await refreshLocalGateSession();
      if (ok) return;
    }

    if (user?.email) {
      setIsAdmin(await isUserAdmin(user.email));
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      if (isLocalGateEnabled) {
        await refreshLocalGateSession();
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const supabase = createBrowserSupabaseClient();

      const applySession = async (nextSession: Session | null) => {
        setSession(nextSession);
        const nextUser = nextSession?.user ?? null;
        setUser(nextUser);

        if (nextUser?.email) {
          await syncUserFromAuth(
            nextUser.email,
            nextUser.user_metadata?.full_name ?? nextUser.user_metadata?.name ?? null
          );
          setIsAdmin(await isUserAdmin(nextUser.email));
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      };

      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      await applySession(initialSession);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, s) => {
        void applySession(s);
      });

      unsubscribe = () => subscription.unsubscribe();
    };

    void init();

    return () => {
      unsubscribe?.();
    };
  }, []);

  const signInWithLocalGate = async (username: string, password: string) => {
    const res = await fetch("/api/admin-local-gate/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      throw new Error(data.error || "Invalid username or password");
    }

    setUser(createLocalGateUser());
    setSession(null);
    setIsAdmin(true);
  };

  const signIn = async (email: string, password: string) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async (redirectPath = "/admin/blog") => {
    const supabase = createBrowserSupabaseClient();
    const next = redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`;
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (isLocalGateEnabled) {
      await fetch("/api/admin-local-gate/logout", { method: "POST" });
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    setIsAdmin(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signInWithLocalGate,
        signUp,
        signInWithGoogle,
        signOut,
        isConfigured: isSupabaseConfigured,
        isLocalGateEnabled,
        checkAdminStatus,
        refreshLocalGateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
