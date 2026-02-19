import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import SceneSignalBand from '../components/SceneSignalBand'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Terms = () => {
  return (
    <CinematicPage>
      <PageIntro
        eyebrow="Terms"
        title="Terms of service"
        description="These terms outline the basic engagement expectations for production services and rentals."
        bridge="warm"
      />

      <SceneSignalBand
        eyebrow="Terms signal"
        title="Clear expectations protect delivery quality."
        description="These terms are designed to keep planning predictable and execution reliable."
      />

      <CinematicScene rhythm="medium" bridge="neutral">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-sm text-ink-muted sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">Project scopes</h2>
            <p className="mt-3">
              All engagements require a signed scope, timeline, and payment
              schedule prior to production.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">Changes</h2>
            <p className="mt-3">
              Scope changes or additional requirements may adjust timelines and
              pricing. We confirm changes in writing.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">Liability</h2>
            <p className="mt-3">
              We operate to industry safety standards and maintain appropriate
              insurance for our services.
            </p>
          </div>
        </div>
      </CinematicScene>

      <CinematicScene rhythm="quiet" bridge="soft">
        <div className="mx-auto max-w-4xl px-4 text-sm text-ink-muted sm:px-6 lg:px-8">
          Questions about these terms?{' '}
          <Link to="/contact" className="font-semibold text-ink">
            Contact us
          </Link>
          .
        </div>
      </CinematicScene>
    </CinematicPage>
  )
}

export default Terms
