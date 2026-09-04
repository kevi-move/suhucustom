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
    typeof initialContent.autoHtml === "string" && initialContent.autoHtml.trim()
      ? initialContent.autoHtml
      : undefined;

  // Only visual-v2 is trusted as full-page HTML. Older snapshots may be scrambled;
  // those are still passed as imageHtml so uploaded photos keep working.
  const pageHtml =
    initialContent.mode === SERVICE_VISUAL_MODE ? autoHtml : undefined;

  return (
    <VisualPageEditor
      pageSlug={pageSlug}
      modeEnabled={modeEnabled}
      initialHtml={pageHtml}
      imageHtml={autoHtml}
    >
      {children}
    </VisualPageEditor>
  );
}
