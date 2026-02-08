import React from 'react'

const TrustBar = () => {
  const items = [
    { title: 'UAE coverage', desc: 'On‑site teams across all major emirates' },
    {
      title: 'End‑to‑end delivery',
      desc: 'Planning, rentals, setup, and show control',
    },
    { title: 'Curated inventory', desc: 'AV, staging, lighting, seating' },
    {
      title: 'Accountable producers',
      desc: 'Single point of contact throughout',
    },
  ]

  return (
    <section className="border-y border-border bg-surface-3">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle mb-3">
              Trusted production partner
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-ink font-serif">
              Built for teams who need calm, reliable execution.
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {items.map(item => (
              <div key={item.title} className="min-w-0">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustBar
