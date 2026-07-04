"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { BlogPost } from "@/types/blog";
import { getPostById } from "@/lib/blog";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(id);
        if (!data) {
          router.push("/admin/blog");
          return;
        }
        setPost(data);
      } catch (error) {
        console.error("Error loading post:", error);
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, router]);

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#888",
          }}
        >
          Loading post...
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <AdminLayout>
      <BlogPostForm post={post} isEditing />
    </AdminLayout>
  );
}
