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
import { useRouter } from "next/navigation";
import { readCmsPath, writeCmsPath } from "@/lib/cmsPaths";

interface CMSContextType {
  /** 是否处于前台可视化编辑状态（可改文案/上传图片） */
  isEditMode: boolean;
  toggleEditMode: () => void;
  getValue: <T>(path: string, fallback: T) => T;
  getDisplayValue: <T>(path: string, fallback: T) => T;
  setValue: (path: string, value: unknown) => void;
  pendingContent: Record<string, unknown>;
  saveAll: () => Promise<boolean>;
  resetAll: () => void;
  saving: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({
  children,
  initialContent = {},
  displayContent,
  pageSlug,
  modeEnabled,
}: {
  children: ReactNode;
  /** 英文源内容（保存到数据库） */
  initialContent?: Record<string, unknown>;
  /** 当前语言展示内容（非编辑态显示） */
  displayContent?: Record<string, unknown>;
  pageSlug: string;
  /** 已登录管理员 + 后台已开启「前台编辑」 */
  modeEnabled: boolean;
}) {
  const router = useRouter();
  const [liveContent, setLiveContent] = useState<Record<string, unknown> | null>(null);
  const viewContent = liveContent ?? displayContent ?? initialContent;
  const [isEditMode, setIsEditMode] = useState(modeEnabled);
  const [pendingContent, setPendingContent] = useState<Record<string, unknown>>(initialContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPendingContent(initialContent);
    setLiveContent(null);
  }, [initialContent, pageSlug]);

  /** 后台开启前台编辑后，进入页面即进入编辑态 */
  useEffect(() => {
    setIsEditMode(modeEnabled);
  }, [modeEnabled]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  const getValue = useCallback(
    <T,>(path: string, fallback: T): T => readCmsPath<T>(pendingContent, path, fallback),
    [pendingContent]
  );

  const getDisplayValue = useCallback(
    <T,>(path: string, fallback: T): T => readCmsPath<T>(viewContent, path, fallback),
    [viewContent]
  );

  const setValue = useCallback((path: string, value: unknown) => {
    setPendingContent((prev) => writeCmsPath(prev, path, value));
  }, []);

  const saveAll = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms/content", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug,
          content: pendingContent,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data?.error || "保存失败");
      }
      const saved = structuredClone(pendingContent);
      setLiveContent(saved);
      setPendingContent(saved);
      router.refresh();
      alert("已保存到网站");
      return true;
    } catch (e) {
      console.error("CMS save error:", e);
      alert(e instanceof Error ? e.message : "保存失败，请确认已登录后台");
      return false;
    } finally {
      setSaving(false);
    }
  }, [pageSlug, pendingContent, router]);

  const resetAll = useCallback(() => {
    setPendingContent(initialContent);
  }, [initialContent]);

  const contextValue = useMemo(
    () => ({
      isEditMode,
      toggleEditMode,
      getValue,
      getDisplayValue,
      setValue,
      pendingContent,
      saveAll,
      resetAll,
      saving,
    }),
    [isEditMode, toggleEditMode, getValue, getDisplayValue, setValue, pendingContent, saveAll, resetAll, saving]
  );

  return <CMSContext.Provider value={contextValue}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used within CMSProvider");
  return ctx;
}

export function useCMSOptional() {
  return useContext(CMSContext);
}
