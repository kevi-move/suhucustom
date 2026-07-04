"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    user,
    isAdmin,
    loading: authLoading,
    signIn,
    signInWithLocalGate,
    signInWithGoogle,
    isConfigured,
    isLocalGateEnabled,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin/inquiries";

  useEffect(() => {
    if (searchParams.get("error") === "forbidden") {
      setError("Your account does not have admin access. Contact a site administrator.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.push(redirectTo);
    }
  }, [user, isAdmin, authLoading, router, redirectTo]);

  if (authLoading) {
    return <LoginShell message="Loading..." />;
  }

  if (user && isAdmin) {
    return <LoginShell message="Redirecting..." />;
  }

  if (!isLocalGateEnabled && !isConfigured) {
    return (
      <LoginShell>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
            Supabase 未配置
          </h1>
          <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>
            请在 .env.local 中设置 Supabase 环境变量，或开启 NEXT_PUBLIC_ADMIN_LOCAL_GATE。
          </p>
        </div>
      </LoginShell>
    );
  }

  const handleLocalGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithLocalGate(username.trim(), password);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "账号或密码错误");
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(redirectTo);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle(redirectTo);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(redirectTo);
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLocalGateEnabled) {
    return (
      <LoginShell>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8, textAlign: "center" }}>
          Suhu Custom 后台
        </h1>
        <p style={{ color: "#888", fontSize: 14, textAlign: "center", marginBottom: 12 }}>
          请输入管理员账号和密码
        </p>
        <p
          style={{
            color: "#666",
            fontSize: 12,
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          仅管理员可进入后台。登录后可在左侧开启「前台编辑」，再打开 About Us 等页面修改内容。
        </p>

        {error && <AlertBox tone="error">{error}</AlertBox>}

        <form onSubmit={handleLocalGateSubmit}>
          <Field label="账号">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              style={inputStyle}
            />
          </Field>

          <Field label="密码">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={inputStyle}
            />
          </Field>

          <button type="submit" disabled={loading} style={buttonStyle(loading)}>
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </LoginShell>
    );
  }

  return (
    <LoginShell>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8, textAlign: "center" }}>
        Admin Login
      </h1>
      <p style={{ color: "#888", fontSize: 14, textAlign: "center", marginBottom: 32 }}>
        Sign in with an authorized admin account
      </p>

      {error && <AlertBox tone="error">{error}</AlertBox>}

      <button type="button" onClick={handleGoogleSignIn} disabled={loading} style={googleButtonStyle(loading)}>
        Continue with Google
      </button>

      <Divider />

      <form onSubmit={handleSupabaseSubmit}>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>

        <button type="submit" disabled={loading} style={buttonStyle(loading)}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </LoginShell>
  );
}

function LoginShell({
  children,
  message,
}: {
  children?: React.ReactNode;
  message?: string;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1512 0%, #2d1f15 50%, #1a1512 100%)",
      }}
    >
      {message ? (
        <div style={{ color: "#D09947", fontSize: 18 }}>{message}</div>
      ) : (
        <div
          style={{
            background: "#2a2a2a",
            padding: 48,
            borderRadius: 16,
            width: "100%",
            maxWidth: 400,
            border: "1px solid rgba(208,153,71,0.2)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", color: "#C5C6C9", fontSize: 14, marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

function AlertBox({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  const isError = tone === "error";
  return (
    <div
      style={{
        background: isError ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
        border: isError ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)",
        color: isError ? "#ef4444" : "#22c55e",
        padding: "12px 16px",
        borderRadius: 8,
        marginBottom: 24,
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#444" }} />
      <span style={{ color: "#666", fontSize: 14 }}>or</span>
      <div style={{ flex: 1, height: 1, background: "#444" }} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "#1a1a1a",
  border: "1px solid #444",
  borderRadius: 8,
  color: "#fff",
  fontSize: 16,
  outline: "none",
};

function buttonStyle(loading: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: 14,
    background: loading ? "#666" : "#D09947",
    color: "#000",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
  };
}

function googleButtonStyle(loading: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: 14,
    background: "#fff",
    color: "#333",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 500,
    cursor: loading ? "not-allowed" : "pointer",
    marginBottom: 0,
  };
}

function LoadingFallback() {
  return <LoginShell message="Loading..." />;
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}
