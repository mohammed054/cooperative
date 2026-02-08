import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { caseStudies } from '../data/siteData'
import ScribbleButton from '../components/ScribbleButton'

const Work = () => {
  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Work"
        title="Selected projects across the UAE."
        description="A snapshot of recent productions delivered with tight timelines, composed crews, and high-touch execution."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {caseStudies.map(study => (
            <Link
              key={study.slug}
              to={`/work/${study.slug}`}
              className="group overflow-hidden rounded-3xl border border-border bg-surface-3 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,17,17,0.12)]"
            >
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">
                  {study.location}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-ink">
                  {study.title}
                </h2>
                <p className="mt-3 text-sm text-ink-muted">{study.summary}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-ink">
                  View case study
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface-3 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-ink font-serif">
            Planning an event with tight timing?
          </h2>
          <p className="mt-4 text-base text-ink-muted">
            Share your scope and we will respond with a clear plan, timeline,
            and assigned producer.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ScribbleButton to="/contact" className="btn-primary text-sm">
              Start a project
            </ScribbleButton>
            <ScribbleButton to="/projects" className="btn-secondary text-sm">
              View the gallery
            </ScribbleButton>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Work
