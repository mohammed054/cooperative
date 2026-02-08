import PageIntro from '../components/PageIntro'

const About = () => {
  const values = [
    {
      title: 'Accountability',
      desc: 'One producer owns the timeline from planning through strike.',
    },
    {
      title: 'Precision',
      desc: 'Every cue, cable, and crew role is documented before load-in.',
    },
    {
      title: 'Calm execution',
      desc: 'We keep the room composed so your team can stay client-focused.',
    },
  ]

  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="About"
        title="A production partner built around composure and detail."
        description="Ghaim is a UAE-based event production studio trusted by corporate, government, and hospitality teams. We keep timelines tight, communication clear, and the final experience refined."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="eyebrow">How we work</p>
            <h2 className="mt-4 text-3xl font-semibold text-ink font-serif">
              Small, senior-led teams.
            </h2>
            <p className="mt-4 text-base text-ink-muted">
              We run lean teams with senior oversight at every stage. That means
              faster decisions, cleaner execution, and fewer surprises for your
              stakeholders.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-3 p-6 text-sm text-ink-muted">
            <p className="text-ink">
              Our leadership team has managed large-scale conferences,
              government summits, and VIP hospitality programs across the UAE.
            </p>
            <p className="mt-4">
              We value precise planning, consistent crew communication, and an
              onsite presence that keeps the room calm.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-3 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Principles</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {values.map(value => (
              <div
                key={value.title}
                className="rounded-3xl border border-border bg-surface-2 p-6"
              >
                <h3 className="text-lg font-semibold text-ink">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-ink-muted">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
