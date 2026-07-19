import type { ReactNode } from "react";

interface BlogArticleLayoutProps {
  sidebar: ReactNode;
  mobileToc: ReactNode;
  mobileSummary: ReactNode;
  children: ReactNode;
}

export default function BlogArticleLayout({
  sidebar,
  mobileToc,
  mobileSummary,
  children,
}: BlogArticleLayoutProps) {
  return (
    <div className="blog-article-layout lg:flex lg:items-start lg:gap-10 xl:gap-12">
      {sidebar}
      <div className="blog-article-main min-w-0 flex-1">
        {mobileToc}
        {mobileSummary}
        {children}
      </div>
    </div>
  );
}
