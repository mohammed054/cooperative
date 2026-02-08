import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const FinalCta = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
  }

  return (
    <section
      id="get-started"
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-ink py-16 lg:py-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Main Content */}
        <motion.div className="text-center mb-10 lg:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold text-white mb-4 lg:mb-8 leading-tight font-serif"
          >
            Let’s Build Your Next Event
            <br />
            <span className="text-white/70">On time, on brand, on budget</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 mb-8 lg:mb-16 max-w-4xl mx-auto leading-relaxed"
          >
            Share your timeline, venue, and priorities. We will respond with a
            clear plan and the right team within 24 hours.
          </motion.p>
        </motion.div>

        {/* CTA Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-surface-2 rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl max-w-3xl mx-auto border border-border"
        >
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-ink mb-6 lg:mb-8 text-center font-serif">
            Request a Proposal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-ink font-medium mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-surface-3 text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-all duration-200"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-ink font-medium mb-2"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-surface-3 text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-all duration-200"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-ink font-medium mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-surface-3 text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-all duration-200"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-ink font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-surface-3 text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-all duration-200"
                  placeholder="+971 XX XXX XXXX"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="service"
                className="block text-ink font-medium mb-2"
              >
                Service Interest *
              </label>
              <select
                id="service"
                name="service"
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-surface-3 text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a service</option>
                <option value="event-production">Event production</option>
                <option value="technical-production">
                  Technical production
                </option>
                <option value="staging-scenic">Staging & scenic</option>
                <option value="furniture-rentals">Furniture & rentals</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-ink font-medium mb-2"
              >
                How can we help you? *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-surface-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell us about your event scope, venue, and goals."
              ></textarea>
            </div>

            <div className="flex items-center justify-center">
              <motion.button
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-strong transition-all duration-200 text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Request
              </motion.button>
            </div>
          </form>

          <p className="text-center text-ink-muted text-sm mt-6">
            * We respond within 24 hours. Your information is secure and
            confidential.
          </p>
        </motion.div>

        {/* Alternative Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 lg:mt-16 text-center"
        >
          <p className="text-white/70 text-base lg:text-lg mb-6 lg:mb-8">
            Or reach out directly
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8">
            <motion.a
              href="tel:+97142345678"
              className="flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +971 4 234 5678
            </motion.a>

            <motion.a
              href="mailto:hello@ghaimuae.com"
              className="flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              hello@ghaimuae.com
            </motion.a>

            <motion.button
              onClick={() => scrollToSection('hero')}
              className="flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              Back to top
            </motion.button>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 lg:mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-white/70">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Available for urgent requirements</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCta
