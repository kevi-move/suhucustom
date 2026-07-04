"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { AuthorForm } from "@/components/admin/AuthorForm";

export default function NewAuthorPage() {
  return (
    <AdminLayout>
      <AuthorForm />
    </AdminLayout>
  );
}
