import PageIntro from '../components/PageIntro';

const Privacy = () => {
  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Privacy"
        title="Privacy policy"
        description="We collect only the information needed to respond to your inquiry and deliver event services."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-sm text-ink-muted sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">Information we collect</h2>
            <p className="mt-3">Contact details, event requirements, and any files you share for planning purposes.</p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">How we use it</h2>
            <p className="mt-3">To prepare proposals, coordinate production services, and communicate about your event.</p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">Contact</h2>
            <p className="mt-3">For questions about your data, email hello@ghaimuae.com.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
