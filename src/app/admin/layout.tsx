import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Suhu Custom Admin",
    template: "%s | Suhu Custom Admin",
  },
  description: "Content management for Suhu Custom — inquiries, blog, pages, and SEO.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
