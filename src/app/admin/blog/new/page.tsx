"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <AdminLayout>
      <BlogPostForm />
    </AdminLayout>
  );
}
