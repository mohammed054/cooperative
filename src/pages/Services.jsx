import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro';
import { services } from '../data/siteData';
import ScribbleButton from '../components/ScribbleButton';

const Services = () => {
  const highlights = [
    'Single accountable producer for every project',
    'Lean crews scaled to your show requirements',
    'Clear scopes, transparent timelines, and calm execution',
  ];

  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Services"
        title="Production partners for events that cannot miss."
        description="From full event production to highly technical shows, we build the right team for the scope and stay accountable through show-close."
      >
        <div className="flex flex-wrap gap-3">
          <ScribbleButton to="/contact" className="btn-primary text-sm">
            Request a proposal
          </ScribbleButton>
          <ScribbleButton to="/work" className="btn-secondary text-sm">
            View recent work
          </ScribbleButton>
        </div>
      </PageIntro>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="group rounded-3xl border border-border bg-surface-3 p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">{service.title}</p>
                <h2 className="mt-4 text-xl font-semibold text-ink">{service.summary}</h2>
                <p className="mt-3 text-sm text-ink-muted">{service.description}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-ink">
                  Learn more
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-3 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <p className="eyebrow">What clients get</p>
            <h2 className="mt-4 text-3xl font-semibold text-ink font-serif">
              An experienced team with clear ownership.
            </h2>
            <p className="mt-4 text-base text-ink-muted sm:text-lg">
              We stay close to the details so your stakeholders do not have to. That means fewer surprises, faster approvals, and a show that feels composed.
            </p>
          </div>
          <ul className="space-y-4 rounded-3xl border border-border bg-surface-2 p-6 text-sm text-ink">
            {highlights.map((item) => (
                <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Services;
