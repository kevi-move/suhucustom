import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { getRequestLocale } from "@/lib/i18n/server";
import { getUiStrings } from "@/lib/translations/sync";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  const ui = await getUiStrings(locale);

  return (
    <LocaleProvider locale={locale} ui={ui}>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </LocaleProvider>
  );
}
