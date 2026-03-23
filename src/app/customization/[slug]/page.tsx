import { notFound } from "next/navigation";
import Link from "next/link";
import { customizationItems } from "@/lib/navigation";

type Props = { params: Promise<{ slug: string }> };

function findCustomization(slug: string) {
  return customizationItems.find((i) => i.slug === slug);
}

export async function generateStaticParams() {
  return customizationItems.map((i) => ({ slug: i.slug }));
}

export default async function CustomizationPage({ params }: Props) {
  const { slug } = await params;
  const item = findCustomization(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-slate-500">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span className="mx-2">/</span>
        <span>Customization</span>
        <span className="mx-2">/</span>
        <span>{item.nameEn}</span>
      </nav>

      <h1 className="text-4xl font-bold text-slate-900">{item.nameEn}</h1>
      <p className="mt-2 text-amber-600">{item.nameZh}</p>
      <p className="mt-6 max-w-2xl text-lg text-slate-600">
        Our {item.nameEn.toLowerCase()} services help you create unique, branded products that stand out in the market.
      </p>

      <div className="mt-12">
        <Link href="/contact-us" className="inline-block rounded-full bg-amber-500 px-8 py-3 font-medium text-white hover:bg-amber-600">
          Get Started
        </Link>
      </div>
    </div>
  );
}
