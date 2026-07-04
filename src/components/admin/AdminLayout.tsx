"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getFrontendHomeUrl } from "@/lib/frontendPreview";
import { FileText, LogOut, Home, Search, ShieldAlert, Users, Tag, UserCircle, Mail, LayoutTemplate } from "lucide-react";
import { CmsModeToggle } from "@/components/admin/CmsModeToggle";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
        }}
      >
        <div style={{ color: "#D09947", fontSize: "18px" }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show access denied if user is not admin
  if (!isAdmin) {
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
        <div
          style={{
            background: "#2a2a2a",
            padding: "48px",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "450px",
            border: "1px solid rgba(208,153,71,0.2)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <ShieldAlert size={32} style={{ color: "#ef4444" }} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px" }}>
            Access Denied
          </h1>
          <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
            You don&apos;t have admin access. Please contact an administrator if you believe this is an error.
          </p>
          <p style={{ color: "#666", fontSize: "13px", marginBottom: "24px" }}>
            Signed in as: <span style={{ color: "#C5C6C9" }}>{user.email}</span>
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={async () => {
                await signOut();
                router.push("/admin/login");
              }}
              style={{
                padding: "12px 24px",
                background: "#D09947",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Sign Out
            </button>
            {getFrontendHomeUrl() && (
              <Link
                href={getFrontendHomeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "12px 24px",
                  background: "#333",
                  color: "#C5C6C9",
                  border: "none",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                打开前台站点
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#121212" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          background: "#1a1a1a",
          borderRight: "1px solid #333",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "0 24px 24px",
            borderBottom: "1px solid #333",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#D09947",
            }}
          >
            Suhu Custom Admin
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.email}
          </p>
        </div>

        <nav style={{ flex: 1, padding: "0 12px" }}>
          <Link
            href="/admin/content"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              textDecoration: "none",
              borderRadius: "8px",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LayoutTemplate size={18} />
            <span>页面内容</span>
          </Link>

          <Link
            href="/admin/inquiries"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              textDecoration: "none",
              borderRadius: "8px",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Mail size={18} />
            <span>客户询盘</span>
          </Link>

          <Link
            href="/admin/blog"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              textDecoration: "none",
              borderRadius: "8px",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <FileText size={18} />
            <span>Blog Posts</span>
          </Link>

          <Link
            href="/admin/categories"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              textDecoration: "none",
              borderRadius: "8px",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Tag size={18} />
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/authors"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              textDecoration: "none",
              borderRadius: "8px",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <UserCircle size={18} />
            <span>Authors</span>
          </Link>

          <Link
            href="/admin/seo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              textDecoration: "none",
              borderRadius: "8px",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Search size={18} />
            <span>SEO Settings</span>
          </Link>

          <Link
            href="/admin/users"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              textDecoration: "none",
              borderRadius: "8px",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Users size={18} />
            <span>Users</span>
          </Link>

          <Link
            href={getFrontendHomeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              textDecoration: "none",
              borderRadius: "8px",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Home size={18} />
            <span>前台站点</span>
          </Link>
        </nav>

        <div style={{ padding: "0 12px" }}>
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "8px",
              borderTop: "1px solid #333",
              paddingTop: "16px",
            }}
          >
            <p style={{ color: "#666", fontSize: "11px", marginBottom: "8px", lineHeight: 1.5 }}>
              开启后，登录状态下访问前台 About Us 等页面会出现 Edit 按钮；普通访客看不到。
            </p>
            <CmsModeToggle />
          </div>
          <button
            onClick={handleSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              color: "#C5C6C9",
              background: "transparent",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
