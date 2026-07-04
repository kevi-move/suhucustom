"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

type SetupStatus = {
  supabasePublic: boolean;
  supabaseAdmin: boolean;
  emailNotify: boolean;
  notifyToEmail?: string;
  siteContactEmail?: string;
  resendTestMode?: boolean;
  supabaseUrl: string | null;
};

const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "新询盘",
  processing: "跟进中",
  closed: "已关闭",
};

const STATUS_COLORS: Record<InquiryStatus, string> = {
  new: "#D09947",
  processing: "#3b82f6",
  closed: "#6b7280",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [setup, setSetup] = useState<SetupStatus | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadSetup = useCallback(async () => {
    const res = await fetch("/api/setup/status");
    const data = (await res.json()) as SetupStatus;
    setSetup(data);
    return data;
  }, []);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = (await res.json()) as {
        inquiries?: Inquiry[];
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        if (data.error === "missing_service_role") {
          setError("还差一步：请在 .env.local 里填写 SUPABASE_SERVICE_ROLE_KEY（见下方说明）");
        } else {
          setError(data.message || data.error || "加载失败");
        }
        setInquiries([]);
        return;
      }

      setInquiries(
        (data.inquiries || []).map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
      );
    } catch {
      setError("网络错误，请刷新重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSetup();
    void loadInquiries();
  }, [loadSetup, loadInquiries]);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("update failed");
      setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    } catch {
      alert("更新状态失败，请重试");
    } finally {
      setUpdatingId(null);
    }
  };

  const newCount = inquiries.filter((item) => item.status === "new").length;

  return (
    <AdminLayout>
      <div style={{ maxWidth: 960 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              客户询盘
            </h1>
            <p style={{ color: "#888", fontSize: 14 }}>
              用户在 Contact Us 提交的表单会出现在这里
              {newCount > 0 ? ` · ${newCount} 条未处理` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadInquiries()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              background: "#2a2a2a",
              color: "#C5C6C9",
              border: "1px solid #444",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            <RefreshCw size={16} />
            刷新
          </button>
        </div>

        {setup && (
          <div
            style={{
              marginBottom: 24,
              padding: 16,
              background: "#1f1f1f",
              border: "1px solid #333",
              borderRadius: 12,
            }}
          >
            <p style={{ color: "#D09947", fontWeight: 600, marginBottom: 12, fontSize: 14 }}>
              配置状态（表单要能用，前两项必须是绿色）
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              <StatusRow ok={setup.supabasePublic} label="Supabase 连接（用户能提交表单）" />
              <StatusRow ok={setup.supabaseAdmin} label="后台能查看询盘（service_role key）" />
              <StatusRow ok={setup.emailNotify} label="邮件通知（可选，配 Resend 后自动发到你邮箱）" />
            </div>
            {setup.emailNotify && setup.notifyToEmail && (
              <p style={{ color: "#aaa", fontSize: 13, marginTop: 12, lineHeight: 1.6 }}>
                询盘通知会发到：<strong style={{ color: "#D09947" }}>{setup.notifyToEmail}</strong>
                {setup.siteContactEmail && setup.notifyToEmail !== setup.siteContactEmail && (
                  <>
                    {" "}
                   （网站页脚显示的是 <strong>{setup.siteContactEmail}</strong>，两者不是同一个邮箱）
                  </>
                )}
              </p>
            )}
            {setup.emailNotify && setup.resendTestMode && (
              <p
                style={{
                  color: "#fcd34d",
                  fontSize: 13,
                  marginTop: 12,
                  lineHeight: 1.6,
                  padding: "10px 12px",
                  background: "rgba(234,179,8,0.08)",
                  border: "1px solid rgba(234,179,8,0.25)",
                  borderRadius: 8,
                }}
              >
                Resend 测试模式：用 <code>onboarding@resend.dev</code> 发信时，只能发到 Resend
                注册账号邮箱（当前是 {setup.notifyToEmail}）。若要发到{" "}
                {setup.siteContactEmail || "其他邮箱"}，需在 Resend 验证域名并改用{" "}
                <code>no-reply@你的域名.com</code> 作为发件地址。
              </p>
            )}
            {!setup.supabasePublic && (
              <p style={{ color: "#aaa", fontSize: 13, marginTop: 12, lineHeight: 1.6 }}>
                打开 Supabase → Project Settings → API，复制 <strong>anon public</strong> key，
                粘贴到项目 <code style={{ color: "#D09947" }}>.env.local</code> 的{" "}
                <code style={{ color: "#D09947" }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>，保存后重启
                npm run dev。
              </p>
            )}
            {setup.supabasePublic && !setup.supabaseAdmin && (
              <p style={{ color: "#aaa", fontSize: 13, marginTop: 12, lineHeight: 1.6 }}>
                同一页面再复制 <strong>service_role</strong> key（secret），粘贴到{" "}
                <code style={{ color: "#D09947" }}>SUPABASE_SERVICE_ROLE_KEY</code>。
                这个 key 只放服务器，不要公开。
              </p>
            )}
          </div>
        )}

        {loading && (
          <div style={{ padding: 48, textAlign: "center", color: "#888" }}>加载中...</div>
        )}

        {!loading && error && (
          <div
            style={{
              padding: 20,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 12,
              color: "#fca5a5",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && inquiries.length === 0 && (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              background: "#1f1f1f",
              borderRadius: 12,
              border: "1px solid #333",
            }}
          >
            <Mail size={40} style={{ color: "#444", margin: "0 auto 16px" }} />
            <p style={{ color: "#888", fontSize: 15 }}>还没有询盘</p>
            <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>
              配置完成后，让用户访问 /contact-us 提交表单测试
            </p>
          </div>
        )}

        {!loading && !error && inquiries.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {inquiries.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#1f1f1f",
                  border: item.status === "new" ? "1px solid #D09947" : "1px solid #333",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <strong style={{ color: "#fff", fontSize: 16 }}>{item.fullName}</strong>
                    <span style={{ color: "#666", marginLeft: 12, fontSize: 13 }}>
                      {item.createdAt.toLocaleString("zh-CN")}
                    </span>
                  </div>
                  <select
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={(e) => void updateStatus(item.id, e.target.value as InquiryStatus)}
                    style={{
                      background: "#2a2a2a",
                      color: STATUS_COLORS[item.status],
                      border: "1px solid #444",
                      borderRadius: 6,
                      padding: "6px 10px",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {(["new", "processing", "closed"] as InquiryStatus[]).map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gap: 6, fontSize: 14, color: "#C5C6C9" }}>
                  <p>
                    <span style={{ color: "#888" }}>邮箱：</span>
                    <a href={`mailto:${item.email}`} style={{ color: "#D09947" }}>
                      {item.email}
                    </a>
                  </p>
                  {item.company && (
                    <p>
                      <span style={{ color: "#888" }}>公司：</span>
                      {item.company}
                    </p>
                  )}
                  {item.phone && (
                    <p>
                      <span style={{ color: "#888" }}>电话：</span>
                      {item.phone}
                    </p>
                  )}
                  {item.productCategory && (
                    <p>
                      <span style={{ color: "#888" }}>品类：</span>
                      {item.productCategory}
                    </p>
                  )}
                  {item.estimatedQty && (
                    <p>
                      <span style={{ color: "#888" }}>数量：</span>
                      {item.estimatedQty}
                    </p>
                  )}
                  <p style={{ marginTop: 8, lineHeight: 1.6 }}>
                    <span style={{ color: "#888" }}>留言：</span>
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
      {ok ? (
        <CheckCircle2 size={18} style={{ color: "#22c55e", flexShrink: 0 }} />
      ) : (
        <AlertCircle size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
      )}
      <span style={{ color: ok ? "#C5C6C9" : "#fca5a5" }}>{label}</span>
    </div>
  );
}
