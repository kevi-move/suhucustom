export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-4 text-slate-600">Last updated: {new Date().toLocaleDateString("en-US")}</p>
      <div className="mt-12 prose prose-slate max-w-none">
        <p>This Privacy Policy describes how Suhu Custom collects, uses, and shares your information when you use our services.</p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly, such as name, email, company details, and order information.</p>
        <h2>How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you, and improve our services.</p>
      </div>
    </div>
  );
}
