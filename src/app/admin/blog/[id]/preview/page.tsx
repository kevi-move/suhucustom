"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import BlogPostPagePreview, {
  type BlogPostPreviewData,
} from "@/components/blog/BlogPostPagePreview";
import { fetchPostByIdAdmin } from "@/lib/blogAdminApi";
import { fetchAllCategoriesAdmin } from "@/lib/categoryAdminApi";
import { fetchAllAuthorsAdmin } from "@/lib/authorAdminApi";
import { extractBlogExtrasFromContent } from "@/lib/blogExtras";
import type { BlogPost } from "@/types/blog";

interface AdminBlogPreviewPageProps {
  params: Promise<{ id: string }>;
}

function buildPreviewData(
  post: BlogPost,
  categoryName?: string,
  authorName?: string
): BlogPostPreviewData {
  const { extras, content } = extractBlogExtrasFromContent(post.content);

  return {
    title: post.title,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    contentHtml: content,
    aiSummary: extras.aiSummary,
    keyPoints: extras.keyPoints,
    faqs: extras.faqs,
    categoryName,
    authorName,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
  };
}

export default function AdminBlogPreviewPage({ params }: AdminBlogPreviewPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [previewData, setPreviewData] = useState<BlogPostPreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [loadedPost, categories, authors] = await Promise.all([
          fetchPostByIdAdmin(id),
          fetchAllCategoriesAdmin(),
          fetchAllAuthorsAdmin(),
        ]);

        if (!loadedPost) {
          router.push("/admin/blog");
          return;
        }

        const categoryName = loadedPost.categoryId
          ? categories.find((item) => item.id === loadedPost.categoryId)?.name
          : undefined;
        const authorName = loadedPost.authorRef
          ? authors.find((item) => item.id === loadedPost.authorRef)?.name
          : undefined;

        setPost(loadedPost);
        setPreviewData(buildPreviewData(loadedPost, categoryName, authorName));
      } catch (error) {
        console.error("Error loading preview:", error);
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111] text-slate-300">
        Loading preview...
      </div>
    );
  }

  if (!post || !previewData) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-white/10 bg-[#111] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
            title="Back to blog list"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-sm font-semibold text-white">页面预览</p>
            <p className="text-xs text-slate-400">{post.title}</p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              post.status === "published"
                ? "bg-green-500/15 text-green-400"
                : "bg-yellow-500/15 text-yellow-400"
            }`}
          >
            {post.status === "published" ? "Published" : "Draft"}
          </span>
        </div>

        <Link
          href={`/admin/blog/${post.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D09947] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
        >
          <Edit className="h-4 w-4" />
          返回编辑
        </Link>
      </div>

      <BlogPostPagePreview data={previewData} showBackLink />
    </div>
  );
}
