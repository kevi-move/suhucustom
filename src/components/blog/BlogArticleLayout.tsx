import type { ReactNode } from "react";
import { clsx } from "clsx";

interface BlogArticleLayoutProps {
  leftRail?: ReactNode;
  rightRail?: ReactNode;
  mobileToc: ReactNode;
  mobileSummary: ReactNode;
  children: ReactNode;
  hasLeftRail?: boolean;
  hasRightRail?: boolean;
}

export default function BlogArticleLayout({
  leftRail,
  rightRail,
  mobileToc,
  mobileSummary,
  children,
  hasLeftRail = false,
  hasRightRail = false,
}: BlogArticleLayoutProps) {
  return (
    <div
      className={clsx(
        "blog-article-layout lg:grid lg:items-start lg:gap-8 xl:gap-10",
        hasLeftRail && hasRightRail && "lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,16rem)] xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,18rem)]",
        hasLeftRail && !hasRightRail && "lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]",
        !hasLeftRail && hasRightRail && "lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]",
        !hasLeftRail && !hasRightRail && "lg:grid-cols-1"
      )}
    >
      {leftRail}
      <div className="blog-article-main min-w-0">
        {mobileToc}
        {mobileSummary}
        {children}
      </div>
      {rightRail}
    </div>
  );
}
