export default function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Terms and Conditions</h1>
      <p className="mt-4 text-slate-600">Last updated: {new Date().toLocaleDateString("en-US")}</p>
      <div className="mt-12 prose prose-slate max-w-none">
        <p>By using Suhu Custom services, you agree to these terms and conditions.</p>
        <h2>Orders & Payment</h2>
        <p>All orders are subject to confirmation. Payment terms will be specified in your quote or order agreement.</p>
        <h2>Quality & Returns</h2>
        <p>We strive for quality. Please review our quality policy for return and warranty information.</p>
      </div>
    </div>
  );
}
