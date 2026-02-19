import React from 'react'

const PageTransitionFallback = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading page"
    className="relative overflow-hidden bg-gradient-to-b from-[#f8f4ee] via-[#f4efe7] to-[#efe9df]"
  >
    <div className="mx-auto flex min-h-[46vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <div className="h-2 w-24 rounded-full bg-black/[0.08]" />
        <div className="mt-6 h-9 w-[86%] rounded-lg bg-black/[0.07]" />
        <div className="mt-3 h-9 w-[72%] rounded-lg bg-black/[0.06]" />
        <div className="mt-6 h-4 w-[90%] rounded bg-black/[0.05]" />
        <div className="mt-2 h-4 w-[80%] rounded bg-black/[0.05]" />
      </div>
    </div>
  </div>
)

export default PageTransitionFallback
