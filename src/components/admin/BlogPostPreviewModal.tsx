"use client";

import { X } from "lucide-react";
import BlogPostPagePreview, {
  type BlogPostPreviewData,
} from "@/components/blog/BlogPostPagePreview";

interface BlogPostPreviewModalProps {
  open: boolean;
  onClose: () => void;
  data: BlogPostPreviewData;
  status: "draft" | "published";
}

export function BlogPostPreviewModal({
  open,
  onClose,
  data,
  status,
}: BlogPostPreviewModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label="Blog post preview"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#111] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">页面预览</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "published"
                ? "bg-green-500/15 text-green-400"
                : "bg-yellow-500/15 text-yellow-400"
            }`}
          >
            {status === "published" ? "Published preview" : "Draft preview"}
          </span>
          <span className="hidden text-xs text-slate-400 sm:inline">
            未保存的修改也会即时显示
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-white">
        <BlogPostPagePreview data={data} />
      </div>
    </div>
  );
}
