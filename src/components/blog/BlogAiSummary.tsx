"use client";

import { useState } from "react";
import { Bot } from "lucide-react";

interface BlogAiSummaryProps {
  aiSummary: string;
  keyPoints: string[];
  variant?: "sidebar" | "inline";
}

export default function BlogAiSummary({
  aiSummary,
  keyPoints,
  variant = "inline",
}: BlogAiSummaryProps) {
  const hasOverview = Boolean(aiSummary.trim());
  const hasKeyPoints = keyPoints.length > 0;
  const [activeTab, setActiveTab] = useState<"overview" | "key-points">(
    hasOverview ? "overview" : "key-points"
  );

  if (!hasOverview && !hasKeyPoints) return null;

  const isSidebar = variant === "sidebar";

  return (
    <section
      className={isSidebar ? "blog-ai-summary-sidebar" : "blog-ai-summary mb-6 lg:hidden"}
      aria-label="AI Summary"
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
        <div className={`border-b border-slate-200 ${isSidebar ? "px-3 py-2.5" : "px-4 py-3"}`}>
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[#9a6b1a]">
              <Bot className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className={`font-semibold text-slate-900 ${isSidebar ? "text-xs" : "text-sm"}`}>
              AI Summary
            </span>
          </span>
        </div>

        <div className={isSidebar ? "px-3 py-3" : "px-4 py-4"}>
          {(hasOverview || hasKeyPoints) && (
            <div className="mb-2 inline-flex rounded-full border border-slate-200 bg-white p-0.5">
              {hasOverview && (
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    activeTab === "overview"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Overview
                </button>
              )}
              {hasKeyPoints && (
                <button
                  type="button"
                  onClick={() => setActiveTab("key-points")}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    activeTab === "key-points"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Key Points
                </button>
              )}
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            {activeTab === "overview" && hasOverview && (
              <p className={`leading-6 text-slate-700 ${isSidebar ? "text-xs" : "text-sm"}`}>
                {aiSummary}
              </p>
            )}

            {activeTab === "key-points" && hasKeyPoints && (
              <ul className="space-y-2">
                {keyPoints.map((point) => (
                  <li
                    key={point}
                    className={`flex gap-2 leading-5 text-slate-700 ${isSidebar ? "text-xs" : "text-sm"}`}
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#D09947]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-2 text-[10px] text-slate-400">AI-generated summary</p>
          </div>
        </div>
      </div>
    </section>
  );
}
