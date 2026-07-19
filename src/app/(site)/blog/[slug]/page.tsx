import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostArticleView from "@/components/blog/BlogPostArticleView";
import BlogPostCTA from "@/components/blog/BlogPostCTA";
import BlogRelatedPosts from "@/components/blog/BlogRelatedPosts";
import {
  getPublishedPostForPublic,
  getPublishedPostSlugs,
  getPublishedPostsForPublic,
} from "@/lib/blog";
import { getPostImageUrl } from "@/lib/blogUtils";
import { extractBlogExtrasFromContent } from "@/lib/blogExtras";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostForPublic(slug);
  if (!post) return { title: "Article Not Found | Suhu Custom" };

  const title = post.metaTitle?.trim() || `${post.title} | Suhu Custom Blog`;
  const description =
    post.metaDescription?.trim() || post.excerpt || "Read more on the SuhuCustom blog.";

  return {
    title,
    description,
    keywords: [
      "custom apparel manufacturer",
      "clothing factory China",
      "garment manufacturing",
      "Suhu Custom blog",
      ...(post.categoryId ? [] : []),
    ],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.featuredImage ? [{ url: getPostImageUrl(post.featuredImage) }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPublishedPostForPublic(slug),
    getPublishedPostsForPublic(),
  ]);

  if (!post) notFound();

  const authorName = post.author?.name || "SuhuCustom Team";
  const { extras, content: articleContent } = extractBlogExtrasFromContent(post.content);

  const sameCategory = post.categoryId
    ? allPosts.filter((p) => p.categoryId === post.categoryId)
    : allPosts;

  return (
    <>
      <BlogPostArticleView
        data={{
          title: post.title,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          contentHtml: articleContent,
          aiSummary: extras.aiSummary,
          keyPoints: extras.keyPoints,
          faqs: extras.faqs,
          categoryName: post.category?.name,
          authorName,
          publishedAt: post.publishedAt,
          createdAt: post.createdAt,
        }}
        showBackToBlog
      />

      <BlogRelatedPosts posts={sameCategory} currentSlug={post.slug} />
      <BlogPostCTA />
    </>
  );
}
