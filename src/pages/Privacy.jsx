import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import SceneSignalBand from '../components/SceneSignalBand'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Privacy = () => {
  return (
    <CinematicPage>
      <PageIntro
        eyebrow="Privacy"
        title="Privacy policy"
        description="We collect only the information needed to respond to your inquiry and deliver event services."
        bridge="warm"
      />

      <SceneSignalBand
        eyebrow="Policy signal"
        title="Minimal collection. Clear use. Responsible handling."
        description="Our privacy approach is deliberately simple and operationally strict."
      />

      <CinematicScene rhythm="medium" bridge="neutral">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-sm text-ink-muted sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">
              Information we collect
            </h2>
            <p className="mt-3">
              Contact details, event requirements, and any files you share for
              planning purposes.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">How we use it</h2>
            <p className="mt-3">
              To prepare proposals, coordinate production services, and
              communicate about your event.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-3 p-6">
            <h2 className="text-sm font-semibold text-ink">Contact</h2>
            <p className="mt-3">
              For questions about your data, email hello@ghaimuae.com.
            </p>
          </div>
        </div>
      </CinematicScene>

      <CinematicScene rhythm="quiet" bridge="soft">
        <div className="mx-auto max-w-4xl px-4 text-sm text-ink-muted sm:px-6 lg:px-8">
          Need anything clarified?{' '}
          <Link to="/contact" className="font-semibold text-ink">
            Get in touch
          </Link>
          .
        </div>
      </CinematicScene>
    </CinematicPage>
  )
}

export default Privacy
