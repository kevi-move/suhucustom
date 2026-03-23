export default function Quality() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Quality & Production Process</h1>
      <p className="mt-4 text-lg text-slate-600">
        Our commitment to quality ensures every garment meets the highest standards.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Material Sourcing", desc: "We source premium fabrics from trusted suppliers" },
          { title: "Quality Control", desc: "Multiple inspection stages throughout production" },
          { title: "Timely Delivery", desc: "Efficient logistics for on-time shipment" },
        ].map((step) => (
          <div key={step.title} className="rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-2 text-slate-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
