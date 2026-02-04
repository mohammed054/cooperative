import { Link, useParams } from 'react-router-dom';
import PageIntro from '../components/PageIntro';
import { caseStudies, services } from '../data/siteData';
import NotFound from './NotFound';

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return <NotFound />;
  }

  const relatedCase = caseStudies.find((study) => study.slug === service.relatedCase);

  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Service"
        title={service.title}
        description={service.description}
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/contact" className="btn-primary text-sm">
            Request a proposal
          </Link>
          <Link to="/services" className="btn-secondary text-sm">
            View all services
          </Link>
        </div>
      </PageIntro>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">What's included</p>
            <ul className="mt-4 space-y-3 text-sm text-ink">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Ideal for</p>
            <ul className="mt-4 space-y-3 text-sm text-ink">
              {service.idealFor.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Delivery standards</p>
            <ul className="mt-4 space-y-3 text-sm text-ink">
              {service.standards.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedCase && (
        <section className="border-t border-border bg-surface-3 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow">Related case study</p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-3xl border border-border">
                <img
                  src={relatedCase.image}
                  alt={relatedCase.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-ink">{relatedCase.title}</h2>
                <p className="mt-4 text-sm text-ink-muted">{relatedCase.summary}</p>
                <Link
                  to={`/work/${relatedCase.slug}`}
                  className="btn-secondary mt-6 inline-flex text-sm"
                >
                  Read the case study
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetail;
