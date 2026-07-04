"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  CMS_PAGE_SLUGS,
  PAGE_CONTENT_DEFAULTS,
  type EditablePageSlug,
} from "@/lib/pageContentDefaults";
import { getFrontendHomeUrl, getFrontendPageUrl } from "@/lib/frontendPreview";
import { Save, RefreshCw, ExternalLink } from "lucide-react";

interface PageContentForm {
  pageSlug: EditablePageSlug;
  pageName: string;
  content: Record<string, unknown>;
  isSaving: boolean;
  isDirty: boolean;
}

const PAGE_LABELS: Record<EditablePageSlug, string> = {
  "/": "\u9996\u9875",
  "/services": "\u670d\u52a1\u9875",
  "/about-us": "\u5173\u4e8e\u6211\u4eec (About Us)",
  "/contact-us": "Contact Us",
  "/blog": "Blog \u805a\u5408\u9875",
};

const DEFAULTS = PAGE_CONTENT_DEFAULTS;

const SAVE_BTN_BG = "#D09947";

export default function AdminContentPage() {
  const [forms, setForms] = useState<PageContentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveAllStatus, setSaveAllStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle"
  );

  const pageSlugs = useMemo(() => CMS_PAGE_SLUGS, []);

  useEffect(() => {
    void loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const entries = await Promise.all(
        pageSlugs.map(async (slug) => {
          const res = await fetch(`/api/cms/content?pageSlug=${encodeURIComponent(slug)}`);
          const data = await res.json();
          const dbContent = (data?.content || {}) as Record<string, unknown>;
          const merged = {
            ...(DEFAULTS[slug] || {}),
            ...dbContent,
          };
          return {
            pageSlug: slug,
            pageName: PAGE_LABELS[slug],
            content: merged,
            isSaving: false,
            isDirty: false,
          } as PageContentForm;
        })
      );
      setForms(entries);
    } catch (error) {
      console.error("Error loading page content:", error);
      alert("\u52a0\u8f7d\u9875\u9762\u5185\u5bb9\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u91cd\u8bd5\u3002");
    } finally {
      setLoading(false);
    }
  };

  const updateContentField = (index: number, path: string, value: string) => {
    setForms((prev) =>
      prev.map((form, i) => {
        if (i !== index) return form;

        const nextContent = structuredClone(form.content);
        const parts = path.split(".");
        let current = nextContent as Record<string, unknown>;
        for (let p = 0; p < parts.length - 1; p++) {
          const key = parts[p];
          const node = current[key];
          if (!node || typeof node !== "object") {
            current[key] = {};
          }
          current = current[key] as Record<string, unknown>;
        }
        current[parts[parts.length - 1]] = value;
        return { ...form, content: nextContent, isDirty: true };
      })
    );
  };

  const saveForm = async (index: number) => {
    const form = forms[index];
    setForms((prev) => prev.map((f, i) => (i === index ? { ...f, isSaving: true } : f)));

    try {
      const res = await fetch("/api/cms/content", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug: form.pageSlug,
          content: form.content,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "\u4fdd\u5b58\u5931\u8d25");

      setForms((prev) =>
        prev.map((f, i) => (i === index ? { ...f, isSaving: false, isDirty: false } : f))
      );
    } catch (error) {
      console.error("Error saving page content:", error);
      alert(error instanceof Error ? error.message : "\u4fdd\u5b58\u5931\u8d25");
      setForms((prev) => prev.map((f, i) => (i === index ? { ...f, isSaving: false } : f)));
    }
  };

  const saveAll = async () => {
    setSaveAllStatus("saving");
    try {
      const dirtyIndexes = forms
        .map((f, i) => ({ f, i }))
        .filter(({ f }) => f.isDirty)
        .map(({ i }) => i);

      await Promise.all(dirtyIndexes.map((i) => saveForm(i)));
      setSaveAllStatus("success");
      setTimeout(() => setSaveAllStatus("idle"), 1600);
    } catch {
      setSaveAllStatus("error");
      setTimeout(() => setSaveAllStatus("idle"), 2000);
    }
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  };

  const renderHomeForm = (form: PageContentForm, index: number) => {
    const hero = (form.content.hero || {}) as Record<string, string>;
    const cta = (form.content.cta || {}) as Record<string, string>;
    return (
      <>
        <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "10px" }}>
          {"\u9996\u9875"} Hero
        </h3>
        <Field
          label={"\u7709\u6807 (Eyebrow)"}
          value={hero.eyebrow || ""}
          onChange={(v) => updateContentField(index, "hero.eyebrow", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6807\u9898"}
          value={hero.title || ""}
          onChange={(v) => updateContentField(index, "hero.title", v)}
          style={inputStyle}
        />
        <Field
          label={"\u526f\u6807\u9898"}
          value={hero.subtitle || ""}
          onChange={(v) => updateContentField(index, "hero.subtitle", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label="Hero \u56fe\u7247 URL"
          value={hero.heroImage || ""}
          onChange={(v) => updateContentField(index, "hero.heroImage", v)}
          style={inputStyle}
        />
        <Field
          label={"\u4e3b\u6309\u94ae\u6587\u6848"}
          value={hero.primaryCtaText || ""}
          onChange={(v) => updateContentField(index, "hero.primaryCtaText", v)}
          style={inputStyle}
        />
        <Field
          label={"\u4e3b\u6309\u94ae\u94fe\u63a5"}
          value={hero.primaryCtaHref || ""}
          onChange={(v) => updateContentField(index, "hero.primaryCtaHref", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6b21\u6309\u94ae\u6587\u6848"}
          value={hero.secondaryCtaText || ""}
          onChange={(v) => updateContentField(index, "hero.secondaryCtaText", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6b21\u6309\u94ae\u94fe\u63a5"}
          value={hero.secondaryCtaHref || ""}
          onChange={(v) => updateContentField(index, "hero.secondaryCtaHref", v)}
          style={inputStyle}
        />

        <h3 style={{ color: "#fff", fontSize: "16px", margin: "24px 0 10px" }}>
          {"\u9996\u9875\u5e95\u90e8"} CTA
        </h3>
        <Field
          label="CTA \u6807\u9898"
          value={cta.title || ""}
          onChange={(v) => updateContentField(index, "cta.title", v)}
          style={inputStyle}
        />
        <Field
          label="CTA \u526f\u6807\u9898"
          value={cta.subtitle || ""}
          onChange={(v) => updateContentField(index, "cta.subtitle", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label="CTA \u80cc\u666f\u56fe URL"
          value={cta.backgroundImage || ""}
          onChange={(v) => updateContentField(index, "cta.backgroundImage", v)}
          style={inputStyle}
        />
        <Field
          label="CTA \u4e3b\u6309\u94ae\u6587\u6848"
          value={cta.primaryCtaText || ""}
          onChange={(v) => updateContentField(index, "cta.primaryCtaText", v)}
          style={inputStyle}
        />
        <Field
          label="CTA \u4e3b\u6309\u94ae\u94fe\u63a5"
          value={cta.primaryCtaHref || ""}
          onChange={(v) => updateContentField(index, "cta.primaryCtaHref", v)}
          style={inputStyle}
        />
        <Field
          label="CTA \u6b21\u6309\u94ae\u6587\u6848"
          value={cta.secondaryCtaText || ""}
          onChange={(v) => updateContentField(index, "cta.secondaryCtaText", v)}
          style={inputStyle}
        />
        <Field
          label="CTA \u6b21\u6309\u94ae\u94fe\u63a5"
          value={cta.secondaryCtaHref || ""}
          onChange={(v) => updateContentField(index, "cta.secondaryCtaHref", v)}
          style={inputStyle}
        />
      </>
    );
  };

  const renderServicesForm = (form: PageContentForm, index: number) => {
    const hero = (form.content.hero || {}) as Record<string, string>;
    return (
      <>
        <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "10px" }}>
          {"\u670d\u52a1\u9875\u9876\u90e8"}
        </h3>
        <Field
          label={"\u6807\u9898"}
          value={hero.title || ""}
          onChange={(v) => updateContentField(index, "hero.title", v)}
          style={inputStyle}
        />
        <Field
          label={"\u526f\u6807\u9898"}
          value={hero.subtitle || ""}
          onChange={(v) => updateContentField(index, "hero.subtitle", v)}
          style={inputStyle}
          textarea
        />
      </>
    );
  };

  const renderAboutUsForm = (form: PageContentForm, index: number) => {
    const hero = (form.content.hero || {}) as Record<string, string>;
    const story = (form.content.story || {}) as Record<string, string>;
    const humen = (form.content.humen || {}) as Record<string, string>;
    const factory = (form.content.factory || {}) as Record<string, string>;
    const team = (form.content.team || {}) as Record<string, string>;
    const cta = (form.content.cta || {}) as Record<string, string>;

    return (
      <>
        <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "10px" }}>Hero \u9996\u5c4f</h3>
        <Field
          label={"\u5c0f\u6807\u9898 (Eyebrow)"}
          value={hero.eyebrow || ""}
          onChange={(v) => updateContentField(index, "hero.eyebrow", v)}
          style={inputStyle}
        />
        <Field
          label={"\u4e3b\u6807\u9898"}
          value={hero.title || ""}
          onChange={(v) => updateContentField(index, "hero.title", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u526f\u6587\u6848"}
          value={hero.subtitle || ""}
          onChange={(v) => updateContentField(index, "hero.subtitle", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label="Hero \u56fe\u7247 URL"
          value={hero.heroImage || ""}
          onChange={(v) => updateContentField(index, "hero.heroImage", v)}
          style={inputStyle}
        />

        <h3 style={{ color: "#fff", fontSize: "16px", margin: "24px 0 10px" }}>Our Story</h3>
        <Field
          label={"\u533a\u5757\u5c0f\u6807\u9898 (Eyebrow)"}
          value={story.eyebrow || ""}
          onChange={(v) => updateContentField(index, "story.eyebrow", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6bb5\u843d 1"}
          value={story.paragraph1 || ""}
          onChange={(v) => updateContentField(index, "story.paragraph1", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u6bb5\u843d 2"}
          value={story.paragraph2 || ""}
          onChange={(v) => updateContentField(index, "story.paragraph2", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u75db\u70b9\u5217\u8868\uff08\u6bcf\u884c\u4e00\u6761\uff09"}
          value={story.challenges || ""}
          onChange={(v) => updateContentField(index, "story.challenges", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u6bb5\u843d 3"}
          value={story.paragraph3 || ""}
          onChange={(v) => updateContentField(index, "story.paragraph3", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u6bb5\u843d 4"}
          value={story.paragraph4 || ""}
          onChange={(v) => updateContentField(index, "story.paragraph4", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label="Story \u914d\u56fe URL"
          value={story.image || ""}
          onChange={(v) => updateContentField(index, "story.image", v)}
          style={inputStyle}
        />

        <h3 style={{ color: "#fff", fontSize: "16px", margin: "24px 0 10px" }}>Why Humen</h3>
        <Field
          label={"\u533a\u5757\u5c0f\u6807\u9898 (Eyebrow)"}
          value={humen.eyebrow || ""}
          onChange={(v) => updateContentField(index, "humen.eyebrow", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6807\u9898"}
          value={humen.title || ""}
          onChange={(v) => updateContentField(index, "humen.title", v)}
          style={inputStyle}
        />
        <Field
          label={"\u4ecb\u7ecd"}
          value={humen.intro || ""}
          onChange={(v) => updateContentField(index, "humen.intro", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u4f18\u52bf\u5f15\u5bfc\u8bed"}
          value={humen.benefitsIntro || ""}
          onChange={(v) => updateContentField(index, "humen.benefitsIntro", v)}
          style={inputStyle}
        />
        <Field
          label={"\u4f18\u52bf\u5217\u8868\uff08\u6bcf\u884c\u4e00\u6761\uff09"}
          value={humen.benefits || ""}
          onChange={(v) => updateContentField(index, "humen.benefits", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u7ed3\u5c3e\u6bb5\u843d"}
          value={humen.closing || ""}
          onChange={(v) => updateContentField(index, "humen.closing", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label="Humen \u914d\u56fe URL"
          value={humen.image || ""}
          onChange={(v) => updateContentField(index, "humen.image", v)}
          style={inputStyle}
        />

        <h3 style={{ color: "#fff", fontSize: "16px", margin: "24px 0 10px" }}>
          Factory & Production
        </h3>
        <Field
          label={"\u533a\u5757\u5c0f\u6807\u9898 (Eyebrow)"}
          value={factory.eyebrow || ""}
          onChange={(v) => updateContentField(index, "factory.eyebrow", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6807\u9898"}
          value={factory.title || ""}
          onChange={(v) => updateContentField(index, "factory.title", v)}
          style={inputStyle}
        />
        <Field
          label={"\u4ecb\u7ecd"}
          value={factory.intro || ""}
          onChange={(v) => updateContentField(index, "factory.intro", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u80fd\u529b\u5f15\u5bfc\u8bed"}
          value={factory.capabilitiesIntro || ""}
          onChange={(v) => updateContentField(index, "factory.capabilitiesIntro", v)}
          style={inputStyle}
        />
        <Field
          label={"\u80fd\u529b\u5217\u8868\uff08\u6bcf\u884c\u4e00\u6761\uff09"}
          value={factory.capabilities || ""}
          onChange={(v) => updateContentField(index, "factory.capabilities", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u7ed3\u5c3e\u6bb5\u843d"}
          value={factory.closing || ""}
          onChange={(v) => updateContentField(index, "factory.closing", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u5de5\u5382\u914d\u56fe URL"}
          value={factory.image || ""}
          onChange={(v) => updateContentField(index, "factory.image", v)}
          style={inputStyle}
        />

        <h3 style={{ color: "#fff", fontSize: "16px", margin: "24px 0 10px" }}>Team</h3>
        <Field
          label={"\u533a\u5757\u5c0f\u6807\u9898 (Eyebrow)"}
          value={team.eyebrow || ""}
          onChange={(v) => updateContentField(index, "team.eyebrow", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6807\u9898"}
          value={team.title || ""}
          onChange={(v) => updateContentField(index, "team.title", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6bb5\u843d 1"}
          value={team.paragraph1 || ""}
          onChange={(v) => updateContentField(index, "team.paragraph1", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u6bb5\u843d 2"}
          value={team.paragraph2 || ""}
          onChange={(v) => updateContentField(index, "team.paragraph2", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u6bb5\u843d 3"}
          value={team.paragraph3 || ""}
          onChange={(v) => updateContentField(index, "team.paragraph3", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label={"\u56e2\u961f\u914d\u56fe URL"}
          value={team.image || ""}
          onChange={(v) => updateContentField(index, "team.image", v)}
          style={inputStyle}
        />

        <h3 style={{ color: "#fff", fontSize: "16px", margin: "24px 0 10px" }}>
          {"\u5e95\u90e8"} CTA
        </h3>
        <Field
          label={"\u533a\u5757\u5c0f\u6807\u9898 (Eyebrow)"}
          value={cta.eyebrow || ""}
          onChange={(v) => updateContentField(index, "cta.eyebrow", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6807\u9898"}
          value={cta.title || ""}
          onChange={(v) => updateContentField(index, "cta.title", v)}
          style={inputStyle}
        />
        <Field
          label={"\u526f\u6587\u6848"}
          value={cta.subtitle || ""}
          onChange={(v) => updateContentField(index, "cta.subtitle", v)}
          style={inputStyle}
          textarea
        />
        <Field
          label="CTA \u80cc\u666f\u56fe URL"
          value={cta.backgroundImage || ""}
          onChange={(v) => updateContentField(index, "cta.backgroundImage", v)}
          style={inputStyle}
        />
        <Field
          label={"\u4e3b\u6309\u94ae\u6587\u6848"}
          value={cta.primaryCtaText || ""}
          onChange={(v) => updateContentField(index, "cta.primaryCtaText", v)}
          style={inputStyle}
        />
        <Field
          label={"\u4e3b\u6309\u94ae\u94fe\u63a5"}
          value={cta.primaryCtaHref || ""}
          onChange={(v) => updateContentField(index, "cta.primaryCtaHref", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6b21\u6309\u94ae\u6587\u6848"}
          value={cta.secondaryCtaText || ""}
          onChange={(v) => updateContentField(index, "cta.secondaryCtaText", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6b21\u6309\u94ae\u94fe\u63a5"}
          value={cta.secondaryCtaHref || ""}
          onChange={(v) => updateContentField(index, "cta.secondaryCtaHref", v)}
          style={inputStyle}
        />
      </>
    );
  };

  const renderContactForm = (form: PageContentForm, index: number) => {
    const hero = (form.content.hero || {}) as Record<string, string>;
    return (
      <>
        <Field
          label="Eyebrow"
          value={hero.eyebrow || ""}
          onChange={(v) => updateContentField(index, "hero.eyebrow", v)}
          style={inputStyle}
        />
        <Field
          label={"\u6807\u9898"}
          value={hero.title || ""}
          onChange={(v) => updateContentField(index, "hero.title", v)}
          style={inputStyle}
        />
        <Field
          label={"\u526f\u6807\u9898"}
          value={hero.subtitle || ""}
          onChange={(v) => updateContentField(index, "hero.subtitle", v)}
          style={inputStyle}
          textarea
        />
      </>
    );
  };

  const renderPageForm = (form: PageContentForm, index: number) => {
    if (form.pageSlug === "/") return renderHomeForm(form, index);
    if (form.pageSlug === "/services") return renderServicesForm(form, index);
    if (form.pageSlug === "/contact-us") return renderContactForm(form, index);
    return renderAboutUsForm(form, index);
  };

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#fff" }}>
            {"\u9875\u9762\u5185\u5bb9\u7ba1\u7406"}
          </h1>
          <p style={{ color: "#888", marginTop: "6px" }}>
            可编辑：首页、服务页、About Us 文案与图片 URL。保存后请点「预览页面」或刷新前台查看；也可在前台编辑模式直接上传图片。
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => void loadContent()}
            style={{
              padding: "10px 14px",
              background: "#2a2a2a",
              color: "#ddd",
              border: "1px solid #444",
              borderRadius: "8px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={16} /> {"\u5237\u65b0"}
          </button>
          <button
            type="button"
            disabled={saveAllStatus === "saving" || !forms.some((f) => f.isDirty)}
            onClick={() => void saveAll()}
            style={{
              padding: "10px 14px",
              background: SAVE_BTN_BG,
              color: "#111",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Save size={16} />
            {saveAllStatus === "saving" ? "\u4fdd\u5b58\u4e2d..." : "\u5168\u90e8\u4fdd\u5b58"}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#888", padding: "40px 0" }}>{"\u52a0\u8f7d\u4e2d..."}</div>
      ) : (
        forms.map((form, index) => (
          <section
            key={form.pageSlug}
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h2 style={{ fontSize: "20px", color: "#fff", fontWeight: 700 }}>{form.pageName}</h2>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a
                  href={getFrontendPageUrl(form.pageSlug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "8px 12px",
                    background: "#2a2a2a",
                    color: "#D09947",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                  }}
                >
                  <ExternalLink size={14} />
                  预览页面
                </a>
                <button
                type="button"
                onClick={() => void saveForm(index)}
                disabled={form.isSaving || !form.isDirty}
                style={{
                  padding: "8px 12px",
                  background: form.isDirty ? SAVE_BTN_BG : "#333",
                  color: form.isDirty ? "#111" : "#888",
                  border: "none",
                  borderRadius: "8px",
                  cursor: form.isDirty ? "pointer" : "not-allowed",
                }}
              >
                {form.isSaving ? "\u4fdd\u5b58\u4e2d..." : "\u4fdd\u5b58\u6b64\u9875"}
              </button>
              </div>
            </div>
            {renderPageForm(form, index)}
          </section>
        ))
      )}
    </AdminLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  style,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  style: CSSProperties;
  textarea?: boolean;
}) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", marginBottom: "6px", color: "#bbb", fontSize: "13px" }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...style, minHeight: "82px", resize: "vertical" }}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={style} />
      )}
    </div>
  );
}
