export default function CaseStudies() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Case Studies</h1>
      <p className="mt-4 text-lg text-slate-600">
        Explore success stories from our clients across different industries.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900">Fitness Brand Launch</h3>
          <p className="mt-2 text-slate-600">How we helped a new activewear brand scale from concept to 10,000+ units.</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900">Corporate Uniform Program</h3>
          <p className="mt-2 text-slate-600">Uniform customization for a 500-employee retail chain.</p>
        </div>
      </div>
    </div>
  );
}
