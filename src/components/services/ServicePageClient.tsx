"use client";

import { VisualPageEditor } from "@/components/cms/VisualPageEditor";

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
    typeof initialContent.autoHtml === "string" ? initialContent.autoHtml : undefined;

  return (
    <VisualPageEditor pageSlug={pageSlug} modeEnabled={modeEnabled} initialHtml={autoHtml}>
      {children}
    </VisualPageEditor>
  );
}
