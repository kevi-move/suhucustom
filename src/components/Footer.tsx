import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
              Suhu<span className="text-amber-600">Custom</span>
            </Link>
            <p className="mt-2 text-sm text-slate-600">
              Premium custom apparel & wholesale manufacturing—powering brands and retailers worldwide.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Services</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/services/t-shirts" className="text-sm text-slate-600 hover:text-amber-600">T-shirts</Link></li>
              <li><Link href="/services/hoodies-sweatshirts" className="text-sm text-slate-600 hover:text-amber-600">Hoodies & Sweatshirts</Link></li>
              <li><Link href="/services/activewear-athleisure" className="text-sm text-slate-600 hover:text-amber-600">Activewear</Link></li>
              <li><Link href="/quality" className="text-sm text-slate-600 hover:text-amber-600">Quality & Process</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about-us" className="text-sm text-slate-600 hover:text-amber-600">About Us</Link></li>
              <li><Link href="/company/case-studies" className="text-sm text-slate-600 hover:text-amber-600">Case Studies</Link></li>
              <li><Link href="/contact-us" className="text-sm text-slate-600 hover:text-amber-600">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy-policy" className="text-sm text-slate-600 hover:text-amber-600">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="text-sm text-slate-600 hover:text-amber-600">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          © {currentYear} Suhu Custom. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
