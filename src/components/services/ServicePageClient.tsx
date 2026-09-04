"use client";

import { VisualPageEditor } from "@/components/cms/VisualPageEditor";
import { SERVICE_VISUAL_MODE } from "@/lib/serviceVisualMode";

export default function ServicePageClient({
  pageSlug,
  initialContent,
  modeEnabled,
  children,
}: {
  pageSlug: string;
  initialContent: Record<string, unknown>;
  modeEnabled: boolean;
  children: React.ReactNode;
}) {
  const autoHtml =
    initialContent.mode === SERVICE_VISUAL_MODE &&
    typeof initialContent.autoHtml === "string" &&
    initialContent.autoHtml.trim()
      ? initialContent.autoHtml
      : undefined;

  return (
    <VisualPageEditor pageSlug={pageSlug} modeEnabled={modeEnabled} initialHtml={autoHtml}>
      {children}
    </VisualPageEditor>
  );
}
