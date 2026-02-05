import { useParams } from 'react-router-dom';
import PageIntro from '../components/PageIntro';
import { caseStudies } from '../data/siteData';
import NotFound from './NotFound';
import ScribbleButton from '../components/ScribbleButton';

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) {
    return <NotFound />;
  }

  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Case study"
        title={study.title}
        description={study.summary}
      >
        <div className="flex flex-wrap gap-3">
          <ScribbleButton to="/contact" className="btn-primary text-sm">
            Discuss your event
          </ScribbleButton>
          <ScribbleButton to="/work" className="btn-secondary text-sm">
            Back to work
          </ScribbleButton>
        </div>
      </PageIntro>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border">
            <img
              src={study.image}
              alt={study.title}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Location</p>
              <p className="mt-2 text-sm text-ink">{study.location}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Services</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {study.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-border bg-surface-3 px-3 py-1 text-xs font-semibold text-ink"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {study.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-surface-3 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-subtle">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-3 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-surface-2 p-6">
            <p className="eyebrow">Challenge</p>
            <p className="mt-3 text-sm text-ink-muted">{study.challenge}</p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-2 p-6">
            <p className="eyebrow">Approach</p>
            <p className="mt-3 text-sm text-ink-muted">{study.approach}</p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-2 p-6">
            <p className="eyebrow">Results</p>
            <ul className="mt-3 space-y-2 text-sm text-ink">
              {study.results.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetail;
