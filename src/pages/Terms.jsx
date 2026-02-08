import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'

const Terms = () => {
  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Terms"
        title="Terms of service"
        description="These terms outline the basic engagement expectations for production services and rentals."
      />

      <section className="bg-surface py-16 sm:py-20">
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
      </section>

      <section className="bg-surface-3 py-12">
        <div className="mx-auto max-w-4xl px-4 text-sm text-ink-muted sm:px-6 lg:px-8">
          Questions about these terms?{' '}
          <Link to="/contact" className="font-semibold text-ink">
            Contact us
          </Link>
          .
        </div>
      </section>
    </div>
  )
}

export default Terms
