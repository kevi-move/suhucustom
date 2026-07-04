"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { Author } from "@/types/blog";
import { getAuthorById } from "@/lib/authors";

interface EditAuthorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditAuthorPage({ params }: EditAuthorPageProps) {
  const { id } = use(params);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthor = async () => {
      try {
        const data = await getAuthorById(id);
        if (!data) {
          router.push("/admin/authors");
          return;
        }
        setAuthor(data);
      } catch (error) {
        console.error("Error loading author:", error);
        router.push("/admin/authors");
      } finally {
        setLoading(false);
      }
    };

    loadAuthor();
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
          Loading author...
        </div>
      </AdminLayout>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <AdminLayout>
      <AuthorForm author={author} isEditing />
    </AdminLayout>
  );
}
