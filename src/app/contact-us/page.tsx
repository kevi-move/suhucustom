"use client";

export default function ContactUs() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Contact Us</h1>
      <p className="mt-4 text-lg text-slate-600">
        Fill out the form below and our team will get back to you shortly.
      </p>

      <form className="mt-12 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name *</label>
            <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company</label>
            <input type="text" id="company" name="company" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email *</label>
          <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message *</label>
          <textarea id="message" name="message" rows={5} required className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
        </div>
        <button type="submit" className="w-full rounded-full bg-amber-500 px-6 py-3 font-medium text-white hover:bg-amber-600 sm:w-auto">
          Send Message
        </button>
      </form>
    </div>
  );
}
