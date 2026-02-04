import PageIntro from '../components/PageIntro';
import { engagementModels } from '../data/siteData';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Engagement models"
        title="Clear scopes, flexible engagement."
        description="We tailor every proposal to the event, but our engagement models keep expectations clear and approvals fast."
      >
        <Link to="/contact" className="btn-primary text-sm">
          Request a proposal
        </Link>
      </PageIntro>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {engagementModels.map((model) => (
              <div key={model.title} className="rounded-3xl border border-border bg-surface-3 p-6">
                <h2 className="text-xl font-semibold text-ink">{model.title}</h2>
                <p className="mt-3 text-sm text-ink-muted">{model.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {model.details.map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-border bg-surface-2 p-6 text-sm text-ink-muted">
            <p className="text-ink">Need a custom scope?</p>
            <p className="mt-2">
              We build proposals around your event size, venue constraints, and show complexity. Share your dates and we will respond within 24 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
