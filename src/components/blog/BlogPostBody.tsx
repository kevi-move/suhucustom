import { sanitizeBlogHtml } from "@/lib/sanitizeHtml";

export default function BlogPostBody({ html }: { html: string }) {
  const safe = sanitizeBlogHtml(html);
  if (!safe) {
    return <p className="text-slate-500">No content available.</p>;
  }

  return (
    <div
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
