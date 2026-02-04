import PageIntro from '../components/PageIntro';

const Contact = () => {
  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Contact"
        title="Tell us about the event."
        description="Share your timeline, venue, and priorities. We will respond with a clear plan and the right team within 24 hours."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <form className="rounded-3xl border border-border bg-surface-3 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-ink">
                Full name
                <input
                  type="text"
                  name="name"
                  className="mt-2 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="Your name"
                  required
                />
              </label>
              <label className="text-sm text-ink">
                Company
                <input
                  type="text"
                  name="company"
                  className="mt-2 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="Company name"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-ink">
                Email
                <input
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="you@company.com"
                  required
                />
              </label>
              <label className="text-sm text-ink">
                Phone
                <input
                  type="tel"
                  name="phone"
                  className="mt-2 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="+971"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm text-ink">
              Event date and location
              <input
                type="text"
                name="date"
                className="mt-2 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="Dates, venue, and city"
                required
              />
            </label>

            <label className="mt-4 block text-sm text-ink">
              Scope of work
              <textarea
                name="scope"
                rows="4"
                className="mt-2 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="Tell us about your event goals and production needs."
                required
              />
            </label>

            <button type="submit" className="btn-primary mt-6 text-sm">
              Send request
            </button>
            <p className="mt-3 text-xs text-ink-subtle">We respond within 24 hours.</p>
          </form>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-surface-3 p-6">
              <p className="text-sm font-semibold text-ink">Contact</p>
              <p className="mt-2 text-sm text-ink-muted">hello@ghaimuae.com</p>
              <p className="text-sm text-ink-muted">+971 4 234 5678</p>
            </div>
            <div className="rounded-3xl border border-border bg-surface-3 p-6">
              <p className="text-sm font-semibold text-ink">Office</p>
              <p className="mt-2 text-sm text-ink-muted">Dubai Design District</p>
              <p className="text-sm text-ink-muted">United Arab Emirates</p>
            </div>
            <div className="rounded-3xl border border-border bg-surface-3 p-6">
              <p className="text-sm font-semibold text-ink">Availability</p>
              <p className="mt-2 text-sm text-ink-muted">Monday-Saturday - 9am-7pm</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
